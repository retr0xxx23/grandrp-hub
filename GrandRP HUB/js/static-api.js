/*
 * GrandRP HUB - static API layer.
 *
 * GitHub Pages can only serve files, so the Node API that used to power the
 * live roster, tactical chat, audit log, photo wall and telemetry is replaced
 * here with a small browser-side implementation.
 *
 * Data is stored in IndexedDB (with a localStorage fallback) and synchronised
 * between tabs with BroadcastChannel. Everything is local to the visitor's
 * browser - there is no shared server.
 */
(function () {
  'use strict';

  var API_PREFIX = '/api/';
  var DB_NAME = 'grandrp-hub-static';
  var DB_VERSION = 1;
  var STORE_NAME = 'collections';
  var CHANNEL_NAME = 'grandrp-hub-live';
  var OFFLINE_AFTER_MS = 60 * 1000;
  var MAX_MESSAGES = 500;
  var MAX_AUDIT_LOGS = 300;
  var MAX_PHOTOS = 200;
  var MAX_TELEMETRY = 100;
  var MAX_IMAGE_LENGTH = 12 * 1024 * 1024;

  var nativeFetch = window.fetch.bind(window);
  var sources = new Set();
  var dbPromise = null;
  var useLocalStorage = typeof indexedDB === 'undefined';
  var channel = null;

  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (error) {
    channel = null;
  }

  window.GRP_STATIC_MODE = true;

  // -------------------------------------------------------------------------
  // Storage
  // -------------------------------------------------------------------------

  function openDatabase() {
    if (useLocalStorage) {
      return Promise.reject(new Error('IndexedDB is not available'));
    }
    if (!dbPromise) {
      dbPromise = new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = function () {
          var db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = function () {
          resolve(request.result);
        };
        request.onerror = function () {
          reject(request.error || new Error('Unable to open IndexedDB'));
        };
        request.onblocked = function () {
          reject(new Error('IndexedDB is blocked'));
        };
      }).catch(function (error) {
        useLocalStorage = true;
        throw error;
      });
    }
    return dbPromise;
  }

  function localStorageKey(name) {
    return 'grp_static_' + name;
  }

  function readFromLocalStorage(name) {
    try {
      var raw = localStorage.getItem(localStorageKey(name));
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeToLocalStorage(name, value) {
    localStorage.setItem(localStorageKey(name), JSON.stringify(value));
  }

  function readCollection(name) {
    if (!useLocalStorage) {
      return openDatabase().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(STORE_NAME, 'readonly');
          var request = tx.objectStore(STORE_NAME).get(name);
          request.onsuccess = function () {
            resolve(Array.isArray(request.result) ? request.result : []);
          };
          request.onerror = function () {
            reject(request.error || new Error('Unable to read data'));
          };
        });
      }).catch(function () {
        useLocalStorage = true;
        return readFromLocalStorage(name);
      });
    }
    return Promise.resolve(readFromLocalStorage(name));
  }

  function writeCollection(name, value) {
    if (!useLocalStorage) {
      return openDatabase().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(STORE_NAME, 'readwrite');
          tx.objectStore(STORE_NAME).put(value, name);
          tx.oncomplete = function () {
            resolve();
          };
          tx.onerror = function () {
            reject(tx.error || new Error('Unable to save data'));
          };
          tx.onabort = function () {
            reject(tx.error || new Error('Unable to save data'));
          };
        });
      }).catch(function () {
        useLocalStorage = true;
        writeToLocalStorage(name, value);
      });
    }
    try {
      writeToLocalStorage(name, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  function makeId(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function clean(value, max) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, max || 4000);
  }

  function jsonResponse(data, status) {
    return new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  function errorResponse(message, status) {
    return jsonResponse({ success: false, error: message }, status || 400);
  }

  function officerFromBody(body) {
    body = body || {};
    return {
      userId: clean(body.userId, 64) || 'anonymous',
      name: clean(body.name, 80) || 'Unknown Officer',
      badgeNo: clean(body.badgeNo, 32) || '000',
      dept: clean(body.dept, 32) || 'FIB'
    };
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  // -------------------------------------------------------------------------
  // Live events (same interface as the old /api/online SSE stream)
  // -------------------------------------------------------------------------

  function deliver(frame) {
    var data = JSON.stringify(frame);
    sources.forEach(function (source) {
      source.deliver(data);
    });
  }

  function broadcast(action, payload) {
    var frame = Object.assign({ action: action }, payload || {});
    deliver(frame);
    if (channel) channel.postMessage(frame);
  }

  function broadcastToOtherTabs(action, payload) {
    if (channel) channel.postMessage(Object.assign({ action: action }, payload || {}));
  }

  if (channel) {
    channel.addEventListener('message', function (event) {
      var frame = event.data;
      if (frame && typeof frame === 'object' && typeof frame.action === 'string') {
        deliver(frame);
      }
    });
  }

  function StaticEventSource(url) {
    this.url = String(url || '');
    this.readyState = StaticEventSource.CONNECTING;
    this.onopen = null;
    this.onerror = null;
    this.onmessage = null;
    this._listeners = new Map();
    sources.add(this);

    var self = this;
    window.setTimeout(function () {
      if (self.readyState === StaticEventSource.CLOSED) return;
      self.readyState = StaticEventSource.OPEN;
      var openEvent = new Event('open');
      self._dispatch(openEvent);
      if (typeof self.onopen === 'function') self.onopen(openEvent);
      if (self.url.indexOf('/api/online') !== -1) {
        rosterSnapshot().then(function (snapshot) {
          if (self.readyState === StaticEventSource.OPEN) {
            self.deliver(JSON.stringify(snapshot));
          }
        });
      }
    }, 0);
  }

  StaticEventSource.CONNECTING = 0;
  StaticEventSource.OPEN = 1;
  StaticEventSource.CLOSED = 2;

  StaticEventSource.prototype.addEventListener = function (type, listener, options) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    if (options && typeof options === 'object' && options.once) {
      this._listeners.get(type).push({ once: true, listener: listener });
    } else {
      this._listeners.get(type).push(listener);
    }
  };

  StaticEventSource.prototype.removeEventListener = function (type, listener) {
    var listeners = this._listeners.get(type);
    if (!listeners) return;
    this._listeners.set(type, listeners.filter(function (item) {
      return item !== listener && item.listener !== listener;
    }));
  };

  StaticEventSource.prototype._dispatch = function (event) {
    var listeners = (this._listeners.get(event.type) || []).slice();
    listeners.forEach(function (item) {
      if (typeof item === 'function') {
        item.call(this, event);
      } else if (item && typeof item.listener === 'function') {
        item.listener.call(this, event);
      }
    }, this);
    this._listeners.set(event.type, (this._listeners.get(event.type) || []).filter(function (item) {
      return !item || !item.once;
    }));
  };

  StaticEventSource.prototype.deliver = function (data) {
    if (this.readyState !== StaticEventSource.OPEN) return;
    var event = new MessageEvent('message', { data: data });
    this._dispatch(event);
    if (typeof this.onmessage === 'function') this.onmessage(event);
  };

  StaticEventSource.prototype.close = function () {
    this.readyState = StaticEventSource.CLOSED;
    sources.delete(this);
  };

  window.EventSource = StaticEventSource;

  // -------------------------------------------------------------------------
  // Data operations
  // -------------------------------------------------------------------------

  function rosterSnapshot() {
    return readCollection('officers').then(function (officers) {
      var cutoff = Date.now() - OFFLINE_AFTER_MS;
      var online = officers.filter(function (officer) {
        return (officer.lastSeen || 0) >= cutoff;
      });
      return {
        count: Math.max(online.length, 1),
        onlineOfficers: online.map(function (officer) {
          return {
            id: officer.id,
            userId: officer.userId || officer.id,
            name: officer.name,
            badgeNo: officer.badgeNo,
            dept: officer.dept,
            lastSeen: officer.lastSeen
          };
        }),
        totalRegistered: officers.length,
        registeredList: officers.map(function (officer) {
          return {
            id: officer.id,
            userId: officer.userId || officer.id,
            name: officer.name,
            badgeNo: officer.badgeNo,
            dept: officer.dept,
            online: (officer.lastSeen || 0) >= cutoff
          };
        })
      };
    });
  }

  function heartbeat(body) {
    var officer = officerFromBody(body);
    return readCollection('officers').then(function (officers) {
      var index = officers.findIndex(function (item) {
        return item.id === officer.userId;
      });
      var existing = index === -1 ? null : officers[index];
      var record = Object.assign({ id: officer.userId }, officer, {
        registeredAt: (existing && existing.registeredAt) || Date.now(),
        lastSeen: Date.now()
      });
      if (index === -1) officers.push(record);
      else officers[index] = record;

      return writeCollection('officers', officers).then(function () {
        return rosterSnapshot();
      }).then(function (snapshot) {
        broadcast('roster', snapshot);
        return jsonResponse({ success: true, officer: record });
      });
    });
  }

  function createChatMessage(body) {
    var text = clean(body.text, 2000);
    if (!text) return Promise.resolve(errorResponse('Message text is required', 400));

    return readCollection('messages').then(function (messages) {
      var message = {
        id: makeId('msg'),
        channel: clean(body.channel, 16) || 'ic',
        author: clean(body.author, 80) || 'Unknown Officer',
        userId: clean(body.userId, 64) || 'anonymous',
        badgeNo: clean(body.badgeNo, 32) || '000',
        dept: clean(body.dept, 32) || 'FIB',
        text: text,
        replyTo: body.replyTo && typeof body.replyTo === 'object' ? {
          id: clean(body.replyTo.id, 64),
          author: clean(body.replyTo.author, 80),
          text: clean(body.replyTo.text, 500)
        } : null,
        timestamp: Date.now()
      };

      messages.push(message);
      if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);

      return writeCollection('messages', messages).then(function () {
        broadcast('new-chat-message', { message: message });
        return jsonResponse({ success: true, message: message });
      });
    });
  }

  function deleteChatMessage(messageId, body) {
    return readCollection('messages').then(function (messages) {
      var index = messages.findIndex(function (message) {
        return message.id === messageId;
      });
      if (index === -1) return errorResponse('Message not found', 404);

      var removed = messages.splice(index, 1)[0];
      return writeCollection('messages', messages).then(function () {
        var by = (body && body.deletedBy) || {};
        var deletedAt = Date.now();
        var auditEntry = {
          id: makeId('audit'),
          type: 'MESSAGE_DELETED',
          message: 'Message #' + messageId + ' was archived by ' + (clean(by.name, 80) || 'Unknown Officer'),
          channel: removed.channel,
          text: removed.text,
          author: removed.author,
          badgeNo: removed.badgeNo,
          dept: removed.dept,
          sentAt: removed.timestamp,
          deletedAt: deletedAt,
          timestamp: deletedAt
        };

        return readCollection('auditLogs').then(function (logs) {
          logs.unshift(auditEntry);
          if (logs.length > MAX_AUDIT_LOGS) logs = logs.slice(0, MAX_AUDIT_LOGS);
          return writeCollection('auditLogs', logs);
        }).then(function () {
          broadcast('delete-chat-message', { messageId: messageId, auditEntry: auditEntry });
          return jsonResponse({ success: true, auditEntry: auditEntry });
        });
      });
    });
  }

  function createPhoto(body) {
    var imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : '';
    if (!imageUrl) return Promise.resolve(errorResponse('Image data is required', 400));
    if (imageUrl.length > MAX_IMAGE_LENGTH) {
      return Promise.resolve(errorResponse('That image is too large. Choose one under 12 MB.', 413));
    }

    return readCollection('photos').then(function (photos) {
      var photo = {
        id: makeId('photo'),
        title: clean(body.title, 120),
        category: clean(body.category, 40) || 'Patrol',
        caption: clean(body.caption, 600),
        imageUrl: imageUrl,
        author: clean(body.author, 80) || 'Unknown Officer',
        userId: clean(body.userId, 64) || 'anonymous',
        badgeNo: clean(body.badgeNo, 32) || '000',
        dept: clean(body.dept, 32) || 'FIB',
        timestamp: Date.now(),
        likes: 0,
        likedBy: [],
        comments: []
      };

      photos.unshift(photo);
      if (photos.length > MAX_PHOTOS) photos = photos.slice(0, MAX_PHOTOS);

      return writeCollection('photos', photos).then(function () {
        broadcast('new-photo', { photo: photo });
        return jsonResponse({ success: true, photo: photo });
      }).catch(function (error) {
        if (error && error.name === 'QuotaExceededError') {
          return errorResponse('Browser storage is full. Delete a few photos and try again.', 507);
        }
        throw error;
      });
    });
  }

  function deletePhoto(photoId, body) {
    return readCollection('photos').then(function (photos) {
      var index = photos.findIndex(function (photo) {
        return photo.id === photoId;
      });
      if (index === -1) return errorResponse('Photo not found', 404);

      var photo = photos[index];
      var requester = clean(body && body.userId, 64);
      if (requester && photo.userId && requester !== photo.userId) {
        return errorResponse('Only the uploader can delete this photo', 403);
      }

      photos.splice(index, 1);
      return writeCollection('photos', photos).then(function () {
        broadcast('delete-photo', { photoId: photoId });
        return jsonResponse({ success: true });
      });
    });
  }

  function likePhoto(photoId, body) {
    var userId = clean(body && body.userId, 64);
    if (!userId) return Promise.resolve(errorResponse('userId is required', 400));

    return readCollection('photos').then(function (photos) {
      var photo = photos.find(function (item) {
        return item.id === photoId;
      });
      if (!photo) return errorResponse('Photo not found', 404);

      var likedBy = asArray(photo.likedBy).slice();
      var index = likedBy.indexOf(userId);
      if (index === -1) likedBy.push(userId);
      else likedBy.splice(index, 1);

      photo.likedBy = likedBy;
      photo.likes = likedBy.length;

      return writeCollection('photos', photos).then(function () {
        broadcast('photo-like', {
          photoId: photo.id,
          likes: photo.likes,
          likedBy: photo.likedBy
        });
        return jsonResponse({ success: true, likes: photo.likes, likedBy: photo.likedBy });
      });
    });
  }

  function addPhotoComment(photoId, body) {
    var text = clean(body.text, 1000);
    if (!text) return Promise.resolve(errorResponse('Comment text is required', 400));

    return readCollection('photos').then(function (photos) {
      var photo = photos.find(function (item) {
        return item.id === photoId;
      });
      if (!photo) return errorResponse('Photo not found', 404);

      var comment = {
        id: makeId('cmt'),
        author: clean(body.author, 80) || 'Unknown Officer',
        userId: clean(body.userId, 64) || 'anonymous',
        badgeNo: clean(body.badgeNo, 32) || '000',
        dept: clean(body.dept, 32) || 'FIB',
        text: text,
        timestamp: Date.now()
      };

      photo.comments = asArray(photo.comments);
      photo.comments.push(comment);

      return writeCollection('photos', photos).then(function () {
        broadcast('new-photo-comment', { photoId: photo.id, comment: comment });
        return jsonResponse({ success: true, comment: comment });
      });
    });
  }

  function logTelemetry(body) {
    var entry = {
      id: makeId('tel'),
      type: clean(body.type, 60) || 'UNKNOWN',
      message: clean(body.message, 2000),
      source: clean(body.source, 500),
      lineno: Number(body.lineno) || 0,
      colno: Number(body.colno) || 0,
      stack: clean(body.stack, 8000),
      officer: body.officer && typeof body.officer === 'object' ? {
        name: clean(body.officer.name, 80),
        dept: clean(body.officer.dept, 32),
        userId: clean(body.officer.userId, 64),
        badgeNo: clean(body.officer.badgeNo, 32)
      } : null,
      timestamp: Date.now()
    };

    return readCollection('telemetry').then(function (entries) {
      entries.unshift(entry);
      if (entries.length > MAX_TELEMETRY) entries = entries.slice(0, MAX_TELEMETRY);
      return writeCollection('telemetry', entries);
    }).then(function () {
      return jsonResponse({ success: true });
    });
  }

  // -------------------------------------------------------------------------
  // Router
  // -------------------------------------------------------------------------

  function handleApi(url, method, body) {
    var parts = url.pathname.slice(API_PREFIX.length).split('/').filter(Boolean);
    var resource = parts[0];
    var rest = parts.slice(1);

    if (resource === 'health' && method === 'GET') {
      return Promise.resolve(jsonResponse({
        success: true,
        service: 'grandrp-hub-static',
        uptime: Math.round(performance.now() / 1000)
      }));
    }

    if (resource === 'online' && method === 'GET') {
      return rosterSnapshot().then(function (snapshot) {
        return jsonResponse(snapshot);
      });
    }

    if (resource === 'officer' && rest[0] === 'heartbeat' && method === 'POST') {
      return heartbeat(body);
    }

    if (resource === 'chat' && rest[0] === 'messages' && method === 'GET') {
      return readCollection('messages').then(function (messages) {
        return jsonResponse({ success: true, messages: messages.slice(-MAX_MESSAGES) });
      });
    }

    if (resource === 'chat' && rest[0] === 'message' && method === 'POST') {
      return createChatMessage(body);
    }

    if (resource === 'chat' && rest[0] === 'message' && rest[1] && method === 'DELETE') {
      return deleteChatMessage(rest[1], body);
    }

    if (resource === 'chat' && rest[0] === 'audit-logs' && method === 'GET') {
      return readCollection('auditLogs').then(function (logs) {
        return jsonResponse({ success: true, logs: logs.slice(0, MAX_AUDIT_LOGS) });
      });
    }

    if (resource === 'broadcast' && rest[0] === 'loading' && method === 'POST') {
      var sender = clean(body.sender, 120) || 'Command Admin';
      var version = clean(body.version, 20);
      broadcastToOtherTabs('trigger-loading', { sender: sender, version: version });
      return Promise.resolve(jsonResponse({ success: true, sender: sender }));
    }

    if (resource === 'photos' && rest.length === 0 && method === 'GET') {
      return readCollection('photos').then(function (photos) {
        photos = photos.slice().sort(function (a, b) {
          return (b.timestamp || 0) - (a.timestamp || 0);
        });
        return jsonResponse({ success: true, photos: photos.slice(0, MAX_PHOTOS) });
      });
    }

    if (resource === 'photos' && rest.length === 0 && method === 'POST') {
      return createPhoto(body);
    }

    if (resource === 'photos' && rest[0] && rest[1] === 'like' && method === 'POST') {
      return likePhoto(rest[0], body);
    }

    if (resource === 'photos' && rest[0] && rest[1] === 'comments' && method === 'GET') {
      return readCollection('photos').then(function (photos) {
        var photo = photos.find(function (item) {
          return item.id === rest[0];
        });
        return jsonResponse({ success: true, comments: (photo && photo.comments) || [] });
      });
    }

    if (resource === 'photos' && rest[0] && rest[1] === 'comments' && method === 'POST') {
      return addPhotoComment(rest[0], body);
    }

    if (resource === 'photos' && rest[0] && rest.length === 1 && method === 'DELETE') {
      return deletePhoto(rest[0], body);
    }

    if (resource === 'telemetry' && rest[0] === 'log' && method === 'POST') {
      return logTelemetry(body);
    }

    return Promise.resolve(errorResponse('Unknown endpoint', 404));
  }

  function readRequestBody(input, init) {
    var body = init && init.body != null ? init.body : null;
    if (typeof body === 'string') {
      try {
        return Promise.resolve(JSON.parse(body));
      } catch (error) {
        return Promise.resolve({});
      }
    }
    if (body && typeof body.entries === 'function') {
      return Promise.resolve(Object.fromEntries(body.entries()));
    }
    if (input instanceof Request && init && init.body == null) {
      return input.clone().json().catch(function () {
        return {};
      });
    }
    return Promise.resolve({});
  }

  window.fetch = function (input, init) {
    var url;
    try {
      if (typeof input === 'string' || input instanceof URL) {
        url = new URL(String(input), window.location.href);
      } else if (input instanceof Request) {
        url = new URL(input.url, window.location.href);
      }
    } catch (error) {
      return nativeFetch(input, init);
    }

    if (!url || url.origin !== window.location.origin || url.pathname.indexOf(API_PREFIX) !== 0) {
      return nativeFetch(input, init);
    }

    var method = ((init && init.method) || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();
    return readRequestBody(input, init).then(function (body) {
      return handleApi(url, method, body);
    }).catch(function (error) {
      console.error('[GrandRP HUB] Local API error:', error);
      return errorResponse(error && error.message ? error.message : 'Local storage error', 500);
    });
  };

  // Warm the database so the first real request is fast.
  readCollection('officers').catch(function () {});
})();

'use strict';

/**
 * GrandRP HUB application server.
 *
 * Serves the static frontend from the repository root and implements every
 * /api/* endpoint the frontend expects, including the server-sent-events
 * stream that powers live officer presence, tactical chat and the photo wall.
 *
 * Run with:  npm start        (PORT, DATA_DIR, MONGODB_URI are honoured)
 */

const path = require('path');
const fs = require('fs');
const express = require('express');
const { createStore } = require('./store');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 3000);
const OFFLINE_AFTER_MS = 60 * 1000;
const MAX_MESSAGES = 500;
const MAX_AUDIT_LOGS = 300;
const MAX_PHOTOS = 200;
const MAX_TELEMETRY = 100;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use(express.json({ limit: '12mb' }));

let store = null;
const storeReady = createStore()
  .then((created) => { store = created; })
  .catch((err) => {
    console.error('[grandrp-hub] failed to initialise storage:', err);
    process.exit(1);
  });

// ---------------------------------------------------------------------------
// Server-sent events hub
// ---------------------------------------------------------------------------

const clients = new Set();

function broadcast(action, payload = {}) {
  const frame = `data: ${JSON.stringify({ action, ...payload })}\n\n`;
  for (const client of clients) {
    try {
      client.write(frame);
    } catch {
      clients.delete(client);
    }
  }
}

async function rosterSnapshot() {
  const officers = await store.list('officers');
  const cutoff = Date.now() - OFFLINE_AFTER_MS;
  const onlineOfficers = officers.filter((o) => (o.lastSeen || 0) >= cutoff);
  const registeredList = officers.map((o) => ({
    id: o.id,
    userId: o.userId || o.id,
    name: o.name,
    badgeNo: o.badgeNo,
    dept: o.dept,
    online: (o.lastSeen || 0) >= cutoff,
  }));
  return {
    count: Math.max(onlineOfficers.length, 1),
    onlineOfficers: onlineOfficers.map((o) => ({
      id: o.id,
      userId: o.userId || o.id,
      name: o.name,
      badgeNo: o.badgeNo,
      dept: o.dept,
      lastSeen: o.lastSeen,
    })),
    totalRegistered: registeredList.length,
    registeredList,
  };
}

async function pushRoster() {
  broadcast('roster', await rosterSnapshot());
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function clean(value, max = 4000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function officerFromBody(body = {}) {
  return {
    userId: clean(body.userId, 64) || 'anonymous',
    name: clean(body.name, 80) || 'Unknown Officer',
    badgeNo: clean(body.badgeNo, 32) || '000',
    dept: clean(body.dept, 32) || 'FIB',
  };
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

const api = express.Router();

api.get('/health', async (_req, res) => {
  res.json({ success: true, service: 'grandrp-hub', uptime: process.uptime() });
});

// Live presence stream ---------------------------------------------------
api.get('/online', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('retry: 3000\n\n');
  res.write(`data: ${JSON.stringify(await rosterSnapshot())}\n\n`);

  clients.add(res);
  req.on('close', () => clients.delete(res));

  const keepAlive = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { /* ignore */ }
  }, 25000);
  req.on('close', () => clearInterval(keepAlive));
});

api.post('/officer/heartbeat', async (req, res) => {
  const officer = officerFromBody(req.body);
  const existing = await store.get('officers', officer.userId);
  const record = {
    id: officer.userId,
    ...officer,
    registeredAt: existing?.registeredAt || Date.now(),
    lastSeen: Date.now(),
  };
  await store.put('officers', record);
  await pushRoster();
  res.json({ success: true, officer: record });
});

// Tactical chat ----------------------------------------------------------
api.get('/chat/messages', async (_req, res) => {
  const messages = await store.list('messages');
  res.json({ success: true, messages: messages.slice(-MAX_MESSAGES) });
});

api.post('/chat/message', async (req, res) => {
  const body = req.body || {};
  const text = clean(body.text, 2000);
  if (!text) return res.status(400).json({ success: false, error: 'Message text is required' });

  const message = {
    id: makeId('msg'),
    channel: clean(body.channel, 16) || 'ic',
    author: clean(body.author, 80) || 'Unknown Officer',
    userId: clean(body.userId, 64) || 'anonymous',
    badgeNo: clean(body.badgeNo, 32) || '000',
    dept: clean(body.dept, 32) || 'FIB',
    text,
    replyTo: body.replyTo && typeof body.replyTo === 'object'
      ? {
          id: clean(body.replyTo.id, 64),
          author: clean(body.replyTo.author, 80),
          text: clean(body.replyTo.text, 500),
        }
      : null,
    timestamp: Date.now(),
  };

  await store.put('messages', message);
  await store.prune('messages', MAX_MESSAGES);
  broadcast('new-chat-message', { message });
  res.json({ success: true, message });
});

api.delete('/chat/message/:id', async (req, res) => {
  const deleted = await store.remove('messages', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Message not found' });

  const by = req.body?.deletedBy || {};
  const auditEntry = {
    id: makeId('audit'),
    type: 'MESSAGE_DELETED',
    message: `Message #${req.params.id} was archived by ${clean(by.name, 80) || 'Unknown Officer'}`,
    author: clean(by.name, 80) || 'Unknown Officer',
    badgeNo: clean(by.badgeNo, 32) || '000',
    dept: clean(by.dept, 32) || 'FIB',
    timestamp: Date.now(),
  };
  await store.put('auditLogs', auditEntry);
  await store.prune('auditLogs', MAX_AUDIT_LOGS);
  broadcast('delete-chat-message', { messageId: req.params.id, auditEntry });
  res.json({ success: true, auditEntry });
});

api.get('/chat/audit-logs', async (_req, res) => {
  const logs = await store.list('auditLogs');
  logs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  res.json({ success: true, logs: logs.slice(0, MAX_AUDIT_LOGS) });
});

// Admin broadcast --------------------------------------------------------
api.post('/broadcast/loading', async (req, res) => {
  const sender = clean(req.body?.sender, 120) || 'Command Admin';
  const version = clean(req.body?.version, 20) || '';
  broadcast('trigger-loading', { sender, version });
  res.json({ success: true, sender });
});

// Photo wall -------------------------------------------------------------
api.get('/photos', async (_req, res) => {
  const photos = await store.list('photos');
  photos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  res.json({ success: true, photos: photos.slice(0, MAX_PHOTOS) });
});

api.post('/photos', async (req, res) => {
  const body = req.body || {};
  const imageUrl = clean(body.imageUrl, 12 * 1024 * 1024);
  if (!imageUrl) return res.status(400).json({ success: false, error: 'Image data is required' });

  const photo = {
    id: makeId('photo'),
    title: clean(body.title, 120),
    category: clean(body.category, 40) || 'Patrol',
    caption: clean(body.caption, 600),
    imageUrl,
    author: clean(body.author, 80) || 'Unknown Officer',
    userId: clean(body.userId, 64) || 'anonymous',
    badgeNo: clean(body.badgeNo, 32) || '000',
    dept: clean(body.dept, 32) || 'FIB',
    timestamp: Date.now(),
    likes: 0,
    likedBy: [],
    comments: [],
  };

  await store.put('photos', photo);
  await store.prune('photos', MAX_PHOTOS);
  broadcast('new-photo', { photo });
  res.json({ success: true, photo });
});

api.delete('/photos/:id', async (req, res) => {
  const photo = await store.get('photos', req.params.id);
  if (!photo) return res.status(404).json({ success: false, error: 'Photo not found' });

  const requester = clean(req.body?.userId, 64);
  if (requester && photo.userId && requester !== photo.userId) {
    return res.status(403).json({ success: false, error: 'Only the uploader can delete this photo' });
  }

  await store.remove('photos', req.params.id);
  broadcast('delete-photo', { photoId: req.params.id });
  res.json({ success: true });
});

api.post('/photos/:id/like', async (req, res) => {
  const photo = await store.get('photos', req.params.id);
  if (!photo) return res.status(404).json({ success: false, error: 'Photo not found' });

  const userId = clean(req.body?.userId, 64);
  if (!userId) return res.status(400).json({ success: false, error: 'userId is required' });

  const likedBy = Array.isArray(photo.likedBy) ? photo.likedBy : [];
  const index = likedBy.indexOf(userId);
  if (index === -1) likedBy.push(userId);
  else likedBy.splice(index, 1);

  photo.likedBy = likedBy;
  photo.likes = likedBy.length;
  await store.put('photos', photo);
  await store.prune('photos', MAX_PHOTOS);

  broadcast('photo-like', { photoId: photo.id, likes: photo.likes, likedBy: photo.likedBy });
  res.json({ success: true, likes: photo.likes, likedBy: photo.likedBy });
});

api.get('/photos/:id/comments', async (req, res) => {
  const photo = await store.get('photos', req.params.id);
  res.json({ success: true, comments: photo?.comments || [] });
});

api.post('/photos/:id/comments', async (req, res) => {
  const photo = await store.get('photos', req.params.id);
  if (!photo) return res.status(404).json({ success: false, error: 'Photo not found' });

  const body = req.body || {};
  const text = clean(body.text, 1000);
  if (!text) return res.status(400).json({ success: false, error: 'Comment text is required' });

  const comment = {
    id: makeId('cmt'),
    author: clean(body.author, 80) || 'Unknown Officer',
    userId: clean(body.userId, 64) || 'anonymous',
    badgeNo: clean(body.badgeNo, 32) || '000',
    dept: clean(body.dept, 32) || 'FIB',
    text,
    timestamp: Date.now(),
  };

  photo.comments = Array.isArray(photo.comments) ? photo.comments : [];
  photo.comments.push(comment);
  await store.put('photos', photo);

  broadcast('new-photo-comment', { photoId: photo.id, comment });
  res.json({ success: true, comment });
});

// Telemetry --------------------------------------------------------------
api.post('/telemetry/log', async (req, res) => {
  const body = req.body || {};
  const entry = {
    id: makeId('tel'),
    type: clean(body.type, 60) || 'UNKNOWN',
    message: clean(body.message, 2000),
    source: clean(body.source, 500),
    lineno: Number(body.lineno) || 0,
    colno: Number(body.colno) || 0,
    stack: clean(body.stack, 8000),
    officer: body.officer && typeof body.officer === 'object'
      ? {
          name: clean(body.officer.name, 80),
          dept: clean(body.officer.dept, 32),
          userId: clean(body.officer.userId, 64),
          badgeNo: clean(body.officer.badgeNo, 32),
        }
      : null,
    timestamp: Date.now(),
  };
  await store.put('telemetry', entry);
  await store.prune('telemetry', MAX_TELEMETRY);
  res.json({ success: true });
});

app.use('/api', api);

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'Unknown endpoint' });
});

// Never expose server-side files or the data store over HTTP.
const BLOCKED_PATHS = [
  '/node_modules', '/data', '/server', '/.git',
  '/package.json', '/package-lock.json', '/Dockerfile',
  '/.gitignore', '/.dockerignore', '/render.yaml',
];
app.use((req, res, next) => {
  const path = req.path;
  if (path.startsWith('/.') || BLOCKED_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
    return res.status(404).end();
  }
  next();
});

// ---------------------------------------------------------------------------
// Legislation documents
// ---------------------------------------------------------------------------

const LEGISLATION_FALLBACK_HOST = process.env.LEGISLATION_FALLBACK_HOST || 'https://grp.trixterpro.in';
const legislationDir = path.join(ROOT, 'Legislation');

app.get('/Legislation/:file', async (req, res) => {
  const safeName = path.basename(req.params.file);
  const localFile = path.join(legislationDir, safeName);
  if (fs.existsSync(localFile)) return res.sendFile(localFile);

  try {
    const upstream = await fetch(`${LEGISLATION_FALLBACK_HOST}/Legislation/${encodeURIComponent(safeName)}`);
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/pdf');
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    res.status(404).json({ success: false, error: 'Legislation document unavailable' });
  }
});

// ---------------------------------------------------------------------------
// Static frontend
// ---------------------------------------------------------------------------

app.use(express.static(ROOT, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    } else if (/\.css$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    } else if (/\.js$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  },
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

setInterval(() => {
  pushRoster().catch(() => {});
}, 15000);

let server = null;

storeReady.then(() => {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[grandrp-hub] listening on http://0.0.0.0:${PORT}`);
    console.log(`[grandrp-hub] serving frontend from ${ROOT}`);
  });
});

const shutdown = () => {
  console.log('\n[grandrp-hub] shutting down');
  for (const client of clients) {
    try { client.end(); } catch { /* ignore */ }
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

'use strict';

/**
 * Storage layer for the GrandRP HUB API.
 *
 * Two drivers are available:
 *   - "file"   (default) persists to <DATA_DIR>/store.json. Works whenever the
 *               host gives the process a writable volume.
 *   - "mongo"  used when MONGODB_URI is set. MongoDB Atlas' free M0 tier is
 *               the only genuinely free persistent store that does not need a
 *               paid disk, so it is the recommended target for cloud deploys.
 *
 * Both drivers expose the same interface so the routes never care which one
 * is active:
 *   list(collection)  -> array of documents
 *   get(collection,id)-> document | null
 *   put(collection,doc)-> upsert, returns the stored document
 *   remove(collection,id) -> boolean
 */

const fs = require('fs');
const path = require('path');

const COLLECTIONS = ['officers', 'messages', 'auditLogs', 'photos', 'telemetry'];

const EMPTY_STATE = {
  officers: {},
  messages: [],
  auditLogs: [],
  photos: [],
  telemetry: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

class FileStore {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, 'store.json');
    this.state = clone(EMPTY_STATE);
    this._writeTimer = null;
    this._writing = false;
  }

  async init() {
    try {
      fs.mkdirSync(this.dir, { recursive: true });
    } catch (err) {
      console.warn('[store] data dir not writable, running in-memory only:', err.message);
      this.file = null;
      return;
    }

    try {
      if (fs.existsSync(this.file)) {
        const raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        this.state = Object.assign(clone(EMPTY_STATE), raw);
        for (const key of COLLECTIONS) {
          if (!this.state[key]) this.state[key] = clone(EMPTY_STATE[key]);
        }
        console.log('[store] loaded state from', this.file);
      } else {
        console.log('[store] starting with empty state at', this.file);
        await this.flush();
      }
    } catch (err) {
      console.error('[store] could not read state file, starting fresh:', err.message);
      this.state = clone(EMPTY_STATE);
    }
  }

  async list(collection) {
    const value = this.state[collection];
    return Array.isArray(value) ? value : Object.values(value || {});
  }

  async get(collection, id) {
    if (collection === 'officers') return this.state.officers[id] || null;
    const list = await this.list(collection);
    return list.find((doc) => doc.id === id) || null;
  }

  async put(collection, doc) {
    if (collection === 'officers') {
      this.state.officers[doc.id] = doc;
    } else {
      const list = this.state[collection];
      const index = list.findIndex((entry) => entry.id === doc.id);
      if (index === -1) list.push(doc);
      else list[index] = doc;
    }
    this.schedule();
    return doc;
  }

  async remove(collection, id) {
    if (collection === 'officers') {
      if (!this.state.officers[id]) return false;
      delete this.state.officers[id];
    } else {
      const list = this.state[collection];
      const index = list.findIndex((entry) => entry.id === id);
      if (index === -1) return false;
      list.splice(index, 1);
    }
    this.schedule();
    return true;
  }

  schedule() {
    if (!this.file || this._writeTimer) return;
    this._writeTimer = setTimeout(() => {
      this._writeTimer = null;
      this.flush();
    }, 400);
  }

  async flush() {
    if (!this.file || this._writing) return;
    this._writing = true;
    const tmp = `${this.file}.tmp`;
    try {
      fs.writeFileSync(tmp, JSON.stringify(this.state, null, 2));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      console.error('[store] write failed:', err.message);
      try { fs.unlinkSync(tmp); } catch { /* ignore */ }
    } finally {
      this._writing = false;
    }
  }
}

class MongoStore {
  constructor(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  async init() {
    const { MongoClient } = require('mongodb');
    this.client = new MongoClient(this.uri, { serverSelectionTimeoutMS: 10000 });
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log('[store] connected to MongoDB db', this.dbName);
  }

  col(collection) {
    return this.db.collection(collection);
  }

  async list(collection) {
    return this.col(collection).find({}).toArray();
  }

  async get(collection, id) {
    return this.col(collection).findOne({ id });
  }

  async put(collection, doc) {
    await this.col(collection).updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
    return doc;
  }

  async remove(collection, id) {
    const result = await this.col(collection).deleteOne({ id });
    return result.deletedCount > 0;
  }

  async close() {
    if (this.client) await this.client.close();
  }
}

async function createStore() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const store = new MongoStore(uri, process.env.MONGODB_DB || 'grandrp_hub');
    await store.init();
    return store;
  }

  const dir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
  const store = new FileStore(dir);
  await store.init();
  return store;
}

module.exports = { createStore, COLLECTIONS };

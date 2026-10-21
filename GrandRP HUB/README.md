# GrandRP HUB

Tactical command reference, penal codes, arrest calculator and department utilities
for San Andreas law enforcement. The frontend is plain HTML/CSS/JS (ES modules), and
`server/` implements the `/api/*` endpoints the UI talks to (tactical chat, photo
wall, live officer roster, audit logs, telemetry).

## Run locally

```bash
npm install
npm start          # http://localhost:3000
```

`npm run preview` starts the older static-only preview server on port 8080.

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Port the server listens on |
| `DATA_DIR` | `./data` | Folder for the JSON store (file driver) |
| `MONGODB_URI` | _unset_ | MongoDB connection string. When set, storage moves to MongoDB instead of the JSON file |
| `MONGODB_DB` | `grandrp_hub` | Database name used with `MONGODB_URI` |
| `LEGISLATION_FALLBACK_HOST` | `https://grp.trixterpro.in` | Where `/Legislation/*` is proxied from when the PDF is not bundled locally |

## Hosting for free

The app is a single Node process that serves both the frontend and the API, so any
host that can run Node works. The two practical free options are:

### Option A - Render.com (frontend + API + realtime)

Keeps the chat, photo wall and live roster working.

1. Push this folder to a GitHub repository.
2. Render -> **New -> Blueprint** -> pick the repository.
3. Render reads `render.yaml`. Set the root directory to the folder that holds
   `package.json` if it is not the repository root.
4. Deploy. You get `https://<service>.onrender.com`.

The free plan sleeps after 15 minutes of inactivity, so the first request after an
idle period takes roughly a minute to wake the service. Add a free MongoDB Atlas
cluster and set `MONGODB_URI` to keep chat and photos across restarts (the free
plan's disk is ephemeral and is wiped on every redeploy).

### Option B - Cloudflare Pages / Netlify (static only)

Instant, unlimited bandwidth, no sleep. The reference content (penal codes,
calculators, protocols, legislation, themes) works exactly the same. Realtime
features have no backend to talk to, so the UI quietly keeps working without them.

- **Cloudflare Pages**: *Create a project -> Connect to Git -> Build command
  `none`* -> *Root directory* = the folder that holds `index.html`.
- **Netlify**: *Add new site -> Import an existing project* -> *Base directory* =
  the folder that holds `index.html` -> *Publish directory* = the same folder ->
  *Build command* = leave empty.

`_headers` and `_redirects` are picked up automatically by both.

### Own domain

Point a `CNAME` at the host and add the domain in the host's dashboard. For
Cloudflare, keep the proxy (orange cloud) enabled so TLS is terminated for free.

## Notes

- Routing is hash based (`#/penalties`), so no server-side rewrite rules are needed.
- `manifest.json` uses relative `start_url`/`scope`, so the app also installs as a
  PWA from a sub-path deployment such as `https://user.github.io/GrandRP-HUB/`.
- The legislation PDFs are not bundled (the largest is ~128 MB). Put them in a
  `Legislation/` folder next to `index.html` to serve them locally, otherwise the
  bundled server proxies them from `LEGISLATION_FALLBACK_HOST`.
- `window.GRP_LEGISLATION_BASE` in `index.html` controls where the PDFs are loaded
  from.

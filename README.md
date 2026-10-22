# GrandRP HUB

Tactical command reference, penal codes, arrest calculator, department utilities
and legislation viewer for San Andreas law enforcement.

The site is plain HTML, CSS and JavaScript - no build step and no server
required. It is ready to deploy to GitHub Pages.

## Project layout

| Path | Purpose |
| --- | --- |
| `GrandRP HUB/` | The website (this is what gets published) |
| `.github/workflows/pages.yml` | GitHub Actions workflow that deploys the site |
| `DEPLOY.md` | Step-by-step GitHub Pages setup |

## Preview locally

Open `GrandRP HUB/preview.bat`, or run:

```powershell
node "GrandRP HUB/tools/preview-server.js" "GrandRP HUB" 8080
```

Then open <http://localhost:8080/>. ES modules do not load from `file://`, so
use the preview server instead of double-clicking `index.html`.

## Static mode

The old Node API has been replaced by `GrandRP HUB/js/static-api.js`. The live
roster, tactical chat, audit log and photo wall are stored in the visitor's
browser (IndexedDB, with a localStorage fallback) and synchronised across open
tabs. No data is sent anywhere, and each visitor has their own local data.

If you later want shared chat/photos between different visitors, you will need
to run a small backend. The frontend is otherwise fully self-contained.

## Deploy

See [DEPLOY.md](DEPLOY.md) for the GitHub Pages steps.

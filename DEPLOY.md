# Deployment runbook

Two deployments are set up in this repository:

| | What it is | URL | Realtime features |
| --- | --- | --- | --- |
| GitHub Pages | Static build of `GrandRP HUB/` | `https://naniroronoa.github.io/grandrp-hub/` | No |
| Render | The whole Node app (frontend + API) | `https://grandrp-hub.onrender.com` | Yes |

Both are free. The GitHub Pages build is already live; the Render service still
needs the two account steps below.

---

## Step 1 - MongoDB Atlas (free M0 cluster, 512 MB)

This is where chat messages, photos and the officer roster are stored.

1. Sign up at <https://www.mongodb.com/atlas/register> and create a free account.
2. **Create a cluster** -> choose the free **M0** tier -> pick any AWS region ->
   leave everything else at the default -> *Create Deployment*.
3. **Database Access** -> *Add New Database User* -> Authentication Method
   *Password* -> pick a username and a generated password -> role
   *Read and write to any database* -> *Add User*.
4. **Network Access** -> *Add IP Address* -> *Allow access from anywhere*
   (`0.0.0.0/0`). Render runs on shared IPs, so a single-IP allowlist will not work.
5. **Deployment** -> *Database* -> *Connect* -> **Drivers** -> **Node.js** ->
   copy the connection string. It looks like:

   ```
   mongodb+srv://<username>:<password>@grandrp-hub.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   Replace `<username>` and `<password>` with the values from step 3. If the
   password contains `@ : / ? # [ ] %` then URL-encode those characters, e.g.
   `p@ss` becomes `p%40ss`.

## Step 2 - Render (free web service)

`render.yaml` at the root of this repository is a Render blueprint, so the
service is created from it automatically.

1. Sign in at <https://render.com> with **GitHub** and grant Render access to
   the `grandrp-hub` repository.
2. Dashboard -> **New** -> **Blueprint** -> select `naniroronoa/grandrp-hub`.
3. Render shows the values it needs. When it asks for `MONGODB_URI`, paste the
   connection string from step 1.
4. *Apply*. The first build takes a couple of minutes.
5. When it finishes you get `https://grandrp-hub.onrender.com`. Check
   `https://grandrp-hub.onrender.com/api/health` - it should return
   `{"success":true,...}`.

### What the free plan means
- The service sleeps after 15 minutes without traffic. The first request after
  that wakes it and can take about a minute. An open browser tab on the site
  keeps it awake, because the live roster uses a persistent SSE connection.
- The free plan has no persistent disk, which is why `MONGODB_URI` matters.
  Without it the app still runs, but chat and photos reset on every redeploy.

1. Render -> your service -> **Settings** -> **Custom Domains** -> add the
   hostname you want, for example `hub.trixterpro.in`.
2. Render shows a DNS record to create. In Cloudflare add a **CNAME** for that
   hostname pointing at the Render target Render gives you.
3. Set the Cloudflare proxy to **DNS only** (grey cloud) so Render can verify
   the domain, then turn the proxy back on once Render shows the domain as
   verified.
4. In the app, change `window.GRP_LEGISLATION_BASE` in `GrandRP HUB/index.html`
   if you want the legislation PDFs served from your own host instead of
   `grp.trixterpro.in`.

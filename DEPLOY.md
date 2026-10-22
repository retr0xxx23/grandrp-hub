# Deploy GrandRP HUB to GitHub Pages (free)

GitHub Pages serves the files exactly as they are, so there is no build command
and no server to pay for. The included workflow publishes the `GrandRP HUB`
folder on every push.

## 1. Push the project to GitHub

The repository must be public if you are using a free GitHub account (GitHub
Pages for private repositories needs a paid plan).

Create an empty public repository on GitHub, then from this folder run:

```powershell
git add .
git commit -m "Prepare GrandRP HUB for GitHub Pages"
git branch -M master
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin master
```

If the repository already has a remote, only `git add`, `git commit` and
`git push` are needed.

## 2. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for *Deploy static site to GitHub Pages* to
   finish (it starts automatically after the push).
5. The deployment URL is shown on the workflow run and in **Settings -> Pages**.

It will look like:

```
https://<your-username>.github.io/<your-repo>/
```

That URL is the website. Share it with anyone; no install is required.

## 3. Future updates

Edit the files, commit and push to `master`. The workflow republishes the site
automatically. You can also run it manually from **Actions -> Deploy static site
to GitHub Pages -> Run workflow**.

## Notes

- The site uses hash routing (`#/penal-codes`, `#/photos`, ...), so it works from
  a project sub-path without any server rewrite rules.
- `manifest.json` uses a relative `start_url` and `scope`, so the app can be
  installed as a PWA from the GitHub Pages URL.
- The live roster, chat, audit log and photo wall are stored in each visitor's
  browser. They are not shared between users because GitHub Pages cannot run a
  backend. Open tabs on the same browser stay in sync.
- The legislation PDFs are linked from the existing `grp.trixterpro.in` host.
  If you want to host them yourself, put them in a `Legislation/` folder and
  update the URLs in `GrandRP HUB/js/app.js`.
- Optional custom domain: add it in **Settings -> Pages -> Custom domain**. The
  setting is saved by GitHub and used by later Actions deployments.

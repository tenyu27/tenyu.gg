# tenyu.gg

Linktree-style landing page plus short-link redirects, built with Vite + React +
TypeScript and hosted entirely on GitHub Pages — no server.

## Editing links and redirects

Everything lives in one file: [`data/links.json`](data/links.json).

```jsonc
{
  "slug": "twitch",              // makes tenyu.gg/twitch redirect here
  "label": "Twitch",             // button text
  "url": "https://www.twitch.tv/tenyu27",
  "icon": "/icons/twitch.svg",   // file in public/icons (only for buttons)
  "accent": "#9146ff",           // hover glow / icon tint
  "featured": true               // show a button on the landing page
}
```

- **Add a redirect only** — add an entry with just `slug`, `label` and `url`.
- **Add a landing-page button** — also set `featured: true`, drop the icon file
  into `public/icons/`, and point `icon` at it. Buttons render in file order.
- **Remove either** — delete the entry.
- **Alias a slug** — add a second entry with the same `url` and a different
  `slug` (`x` and `twitter` both point at the same profile).

Commit and push; the deploy workflow rebuilds. No code changes needed.

## How the redirects work without a server

The old Node app looked each slug up in `urls.json` and called `res.redirect()`.
GitHub Pages only serves static files, so [`plugins/redirects.ts`](plugins/redirects.ts)
does the same job at build time: every slug is emitted as a tiny
`dist/<slug>/index.html` that bounces to the target via `<meta http-equiv="refresh">`
(works with JS disabled) plus `location.replace()` (faster, and keeps the stub
out of the back button).

GitHub Pages resolves `/twitch` to `/twitch/index.html` on its own. Vite's dev
and preview servers don't — their SPA fallback would answer with the landing
page — so the plugin also installs a middleware that 302s the same slugs
locally, keeping all three environments in agreement.

`dist/404.html` catches anything else. It retries the slug case-insensitively
(so `/Twitch` still works) and otherwise sends the visitor home, matching the
old `res.status(404).redirect('/')`.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + emit dist/
npm run preview    # serve dist/ exactly as it will be deployed
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and publishes `dist/` to GitHub Pages.

One-time setup:

1. Repository **Settings → Pages → Source: GitHub Actions**.
2. Point the `tenyu.gg` DNS at GitHub Pages — four `A` records for the apex
   (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`),
   or an `ALIAS`/`ANAME` to `<user>.github.io` if the DNS host supports it.
3. `public/CNAME` already contains `tenyu.gg`, so the custom domain survives
   every deploy. Enable **Enforce HTTPS** once the certificate is issued.

## Not carried over

The old server had a `/repos` endpoint that fetched a list of Dalamud plugin
repository JSON files and merged them. It needs a server to fetch cross-origin,
so it isn't part of this build. If it's still wanted, the same merge can run in
the deploy workflow and be committed as a static `dist/repos.json`.

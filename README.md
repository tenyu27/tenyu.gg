# tenyu.gg

Landing page and short links. Vite + React + TypeScript on GitHub Pages.

## Editing links

Everything lives in [`data/links.json`](data/links.json).

```jsonc
{
  "slug": "twitch",              // makes tenyu.gg/twitch redirect here
  "label": "Twitch",             // button text
  "url": "https://www.twitch.tv/tenyu27",
  "icon": "/icons/twitch.svg",   // file in public/icons, buttons only
  "accent": "#9146ff",           // hover glow and icon tint
  "featured": true               // show a button on the landing page
}
```

For a redirect with no button, use just `slug`, `label` and `url`. For a button,
also set `featured: true`, put the icon in `public/icons/`, and point `icon` at
it. Buttons render in file order. To alias a slug, add a second entry with the
same `url`.

Commit and push and the site rebuilds. No code changes needed.

Each slug is built into `dist/<slug>/index.html`, a small page that bounces to
the target (see [`plugins/redirects.ts`](plugins/redirects.ts)). Anything else
hits `404.html`, which retries the slug in lowercase and otherwise sends you
home.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then emit dist/
npm run preview    # serve dist/ as it will be deployed
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and publishes `dist/` to GitHub Pages.

Setup, once:

1. Settings > Pages > Source: GitHub Actions.
2. Point `tenyu.gg` DNS at GitHub Pages. Four apex `A` records
   (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`),
   or an `ALIAS`/`ANAME` to `<user>.github.io`.
3. `public/CNAME` holds the domain so it survives each deploy. Turn on Enforce
   HTTPS once the certificate is issued.

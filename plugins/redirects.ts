import type { Connect, Plugin } from 'vite';
import links from '../data/links.json' with { type: 'json' };

/**
 * The Node server used to look a slug up in urls.json and `res.redirect(...)`.
 * GitHub Pages serves static files only, so instead we emit one tiny HTML file
 * per slug at build time: `/twitch` -> `dist/twitch/index.html`, which bounces
 * to the real URL via <meta http-equiv="refresh"> plus location.replace().
 *
 * The meta refresh fires with JS disabled; location.replace() fires sooner and
 * keeps the bounce page out of the back-button history.
 */

export type LinkEntry = {
  slug: string;
  label: string;
  url: string;
  icon?: string;
  accent?: string;
  featured?: boolean;
};

export const redirectMap: Record<string, string> = Object.fromEntries(
  (links.links as LinkEntry[]).map((link) => [link.slug.toLowerCase(), link.url]),
);

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function redirectPage(url: string, label: string): string {
  const safeUrl = escapeHtml(url);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Redirecting to ${escapeHtml(label)}…</title>
<link rel="canonical" href="${safeUrl}">
<meta http-equiv="refresh" content="0; url=${safeUrl}">
<script>location.replace(${JSON.stringify(url)});</script>
<style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#0b0b0c;color:#8b8b93;font:16px/1.5 system-ui,sans-serif}</style>
</head>
<body><p>Redirecting to <a href="${safeUrl}" style="color:#ff5c33">${safeUrl}</a>…</p></body>
</html>
`;
}

/** Fallback for any path GitHub Pages can't resolve — mirrors the old 404 -> `/`. */
function notFoundPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Not found</title>
<script>
// Slugs are matched case-insensitively here so /Twitch works like /twitch.
var map = ${JSON.stringify(redirectMap)};
var slug = decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g, '')).toLowerCase();
location.replace(map[slug] || '/');
</script>
<meta http-equiv="refresh" content="0; url=/">
<style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#0b0b0c;color:#8b8b93;font:16px/1.5 system-ui,sans-serif}</style>
</head>
<body><p>Not found. <a href="/" style="color:#ff5c33">go home</a>.</p></body>
</html>
`;
}

/**
 * Bounces a bare slug straight to its target. GitHub Pages resolves `/twitch`
 * to `/twitch/index.html` on its own, but Vite's dev and preview servers answer
 * extensionless paths with the SPA fallback instead — this keeps all three in
 * agreement. Unknown paths fall through, so real assets are still served.
 */
const redirectMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
  const slug = decodeURIComponent(pathname.replace(/^\/+|\/+$/g, '')).toLowerCase();
  const target = redirectMap[slug];
  if (!target) return next();
  res.statusCode = 302;
  res.setHeader('Location', target);
  res.end();
};

export function redirectsPlugin(): Plugin {
  return {
    name: 'tenyu-redirects',

    configureServer(server) {
      server.middlewares.use(redirectMiddleware);
    },

    configurePreviewServer(server) {
      server.middlewares.use(redirectMiddleware);
    },

    generateBundle() {
      for (const link of links.links as LinkEntry[]) {
        this.emitFile({
          type: 'asset',
          fileName: `${link.slug}/index.html`,
          source: redirectPage(link.url, link.label),
        });
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: notFoundPage() });
    },
  };
}

/**
 * Build-time static prerender (SSG).
 *
 * Runs AFTER `vite build` (client bundle → dist/) and `vite build --ssr` (server
 * bundle → dist-ssr/). For each clean URL it renders the app to static markup +
 * collects the react-helmet-async head (title, meta description, canonical,
 * OG/Twitter, and the application/ld+json scripts — BusinessJsonLd on Home &
 * Contact, an Event block per event on Events), then injects the head into
 * <head> and the markup into #root of the client template, writing
 * dist/<route>/index.html (dist/index.html for "/").
 *
 * This satisfies PRD §7: non-JS crawlers and social/OG scrapers now see the real
 * per-page head + JSON-LD in the STATIC HTML, while the SPA still hydrates at
 * runtime (src/main.tsx). No new runtime/dev dependency — uses only the SSR
 * bundle Vite already produced (react-dom/server + StaticRouter), run by plain
 * Node ESM. (Authored in JS, not TS, so Node 20 can execute it with no extra
 * TypeScript runner; the source it bundles is fully typechecked by tsc.)
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, '..');
const distDir = join(projectRoot, 'dist');
const ssrEntry = join(projectRoot, 'dist-ssr', 'entry-server.js');

// The clean URLs from the sitemap (PRD §7). "/" → dist/index.html; the rest
// → dist/<route>/index.html so the clean URLs resolve to static HTML.
const routes = ['/', '/events', '/results', '/about', '/sponsors', '/register', '/contact'];

function outputPathFor(route) {
  if (route === '/') {
    return join(distDir, 'index.html');
  }
  return join(distDir, route.replace(/^\//, ''), 'index.html');
}

async function main() {
  const template = await readFile(join(distDir, 'index.html'), 'utf-8');

  const { render } = await import(pathToFileURL(ssrEntry).href);
  const base = '/smokin-guns-productions';
  for (const route of routes) {
    const location = route === '/' ? `${base}/` : `${base}${route}`;
    const { html, head } = render(location);

    // Drop the template's static <title> so helmet's per-route <title> is the
    // only one, then inject the collected head before </head>.
    const headedTemplate = template.replace(/<title>[\s\S]*?<\/title>/, '');
    const withHead = headedTemplate.replace('</head>', `    ${head}\n  </head>`);
    const withBody = withHead.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    const outPath = outputPathFor(route);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, withBody, 'utf-8');
    console.log(`prerendered ${route} → ${outPath.replace(projectRoot + '/', '')}`);
  }
  await copyFile(join(distDir, 'index.html'), join(distDir, '404.html'));
  console.log('wrote 404.html fallback');
}

main().catch((error) => {
  console.error('[prerender] failed:', error);
  process.exit(1);
});

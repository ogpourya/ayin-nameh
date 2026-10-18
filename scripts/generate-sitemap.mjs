// Generates static/sitemap.xml for the deployed site. Runs before vite build.
import { writeFileSync } from 'node:fs';
import { CARTEX } from '../src/lib/data/cartex.ts';
import { SIGN_TYPES } from '../src/lib/data/signs.ts';

const ORIGIN = 'https://ogpourya.github.io';
const BASE = '/ayin-nameh';
const today = new Date().toISOString().slice(0, 10);

const entries = [
  { path: '/', priority: '1.0' },
  { path: '/concepts', priority: '0.7' },
  { path: '/lines', priority: '0.7' },
  ...CARTEX.map((_, i) => ({ path: `/quiz/${i + 1}`, priority: '0.9' })),
  ...CARTEX.map((_, i) => ({ path: `/pdf/${i + 1}`, priority: '0.8' })),
  ...SIGN_TYPES.filter((type) => type.kind === 'grid').map((type) => ({
    path: `/signs/${type.id}`,
    priority: '0.7'
  }))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${ORIGIN}${BASE}${entry.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(new URL('../static/sitemap.xml', import.meta.url), xml);
console.log(`sitemap: ${entries.length} urls`);

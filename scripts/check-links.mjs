// Checks that every internal link in the published site (public/) leads
// somewhere: each href and src in the HTML, and each url() in the CSS, must
// name a file that exists, and each #anchor an id on the page it points to.
// Links to other sites, mailto: and tel: are left alone. App routes the
// platform serves on tenwise.app (/login, /logout) are allowed by name.
// Usage: node scripts/check-links.mjs   (exit 1 if anything is broken)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve('public');
const APP_ROUTES = new Set(['/login', '/logout']);

const files = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : [path];
});

const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

function targetsIn(file, text) {
  if (file.endsWith('.html')) return [...text.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
  if (file.endsWith('.css')) return [...text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);
  return [];
}

const external = (url) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url) || url.startsWith('data:');

function problemWith(file, url) {
  if (!url || external(url) || APP_ROUTES.has(url.split(/[?#]/)[0])) return null;
  const [pathPart, anchor] = url.split('#');
  const path = pathPart.split('?')[0];
  let target = path === '' ? file : path.startsWith('/') ? join(ROOT, path) : resolve(dirname(file), path);
  if (path.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
  if (!existsSync(target)) return `missing file ${relative(ROOT, target)}`;
  if (anchor && target.endsWith('.html') && !idsOf(readFileSync(target, 'utf8')).has(anchor)) return `no id="${anchor}" in ${relative(ROOT, target)}`;
  return null;
}

const broken = [];
for (const file of files(ROOT)) {
  const text = readFileSync(file, 'utf8');
  for (const url of targetsIn(file, text)) {
    const problem = problemWith(file, url);
    if (problem) broken.push(`${relative(ROOT, file)}: "${url}": ${problem}`);
  }
}
if (broken.length) {
  console.error(`${broken.length} broken link(s):\n${broken.map((b) => `  ${b}`).join('\n')}`);
  process.exit(1);
}
console.log('All internal links resolve.');

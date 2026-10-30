// Fills the parts every page shares from one place in site/: the header and
// footer (site/header.html, site/footer.html) and the plans and prices
// (site/plans.json). Each page marks where they go:
//
//   <!-- site:header -->…<!-- /site:header -->
//   <!-- site:footer -->…<!-- /site:footer -->
//   <!-- site:plans ref="site-pricing" -->…<!-- /site:plans -->
//
// and this script rewrites what's between the markers. The pages stay plain
// HTML, committed as written, so publishing needs no build.
//
// Usage: node scripts/site.mjs           rewrite the pages
//        node scripts/site.mjs --check   exit 1 if a page is out of step
//
// Prices: while plans.json says "published": false, every price shows as
// "Price to be announced", whatever the numbers say.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve('public');
const SITE = resolve('site');
const check = process.argv.includes('--check');

const read = (name) => readFileSync(join(SITE, name), 'utf8').trim();
const plans = JSON.parse(read('plans.json'));

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const files = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : [path];
});

// The page's own address, as the header's links write it: public/pricing/index.html → /pricing/.
const addressOf = (file) => `/${relative(ROOT, file).replace(/index\.html$/, '')}`;

function header(file) {
  const here = addressOf(file);
  return read('header.html').replace(/<a href="([^"]+)"/g, (tag, href) => (href === here ? `<a href="${href}" aria-current="page"` : tag));
}

const money = (amount) => `${plans.currency}${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;

function price(plan) {
  if (!plans.published) {
    return `<p class="price"><span>Price to be announced</span></p>
          <p class="price-note">Set before launch</p>`;
  }
  const perMonthYearly = plan.annual / 12;
  return `<p class="price"><span class="price-monthly">${money(plan.monthly)}<small> /month</small></span><span class="price-annual">${money(perMonthYearly)}<small> /month</small></span></p>
          <p class="price-note"><span class="price-monthly">Billed monthly</span><span class="price-annual">${money(plan.annual)} billed yearly</span></p>`;
}

function planCard(plan, ref) {
  const badge = plan.badge ? `\n          <span class="badge">${esc(plan.badge)}</span>` : '';
  const features = plan.features.map((feature, index) => {
    const all = plan.includes && index === 0 ? ' class="plus-all"' : '';
    return `            <li${all}>${esc(feature)}</li>`;
  }).join('\n');
  return `        <article class="plan${plan.featured ? ' featured' : ''}" id="plan-${esc(plan.id)}">${badge}
          <h3>${esc(plan.name)}</h3>
          <p class="for">${esc(plan.for)}</p>
          ${price(plan)}
          <ul>
${features}
          </ul>
          <a class="btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}" href="/login?ref=${esc(ref)}-${esc(plan.id)}">Start your ${plans.trialDays}-day free trial</a>
        </article>`;
}

function plansBlock(ref) {
  const features = plans.plans.map((plan) => ({ ...plan, features: plan.includes ? [plan.includes, ...plan.features] : plan.features }));
  const switcher = plans.published && plans.plans.some((plan) => plan.annual)
    ? `      <div class="center"><div class="billing-switch" role="group" aria-label="Billing period">
        <button type="button" data-period="monthly" aria-pressed="false">Monthly</button>
        <button type="button" data-period="annual" aria-pressed="true">Yearly · ${esc(plans.annualNote)}</button>
      </div></div>\n`
    : '';
  return `${switcher}      <div class="plans">
${features.map((plan) => planCard(plan, ref)).join('\n')}
      </div>`;
}

const attribute = (attrs, name) => (attrs.match(new RegExp(`${name}="([^"]*)"`)) ?? [])[1];

function fill(file, html) {
  return html.replace(/(<!-- site:(header|footer|plans)([^>]*?)-->)[\s\S]*?(<!-- \/site:\2 -->)/g, (match, open, part, attrs, close) => {
    const body = part === 'header' ? header(file)
      : part === 'footer' ? read('footer.html')
        : plansBlock(attribute(attrs, 'ref') ?? 'site');
    return `${open}\n${body}\n${close}`;
  });
}

let stale = 0;
for (const file of files(ROOT).filter((path) => path.endsWith('.html'))) {
  const before = readFileSync(file, 'utf8');
  const after = fill(file, before);
  if (after === before) continue;
  if (check) {
    stale += 1;
    console.error(`out of step: ${relative(process.cwd(), file)} (run node scripts/site.mjs)`);
  } else {
    writeFileSync(file, after);
    console.log(`updated ${relative(process.cwd(), file)}`);
  }
}
if (stale) process.exit(1);

/* Project detail sheets (bottom sheet opened from Featured Projects).
   Template: cover, title, client, year, industry, platform, links, overview, problem/goal,
   what I did, one variable section, keywords, flows.
   NOTE: content below is placeholder copy until Mina sends the real details per project. */

const PHONE = { w: 170, h: 368 };   // expanded phone screen (display px)
const WEB = { w: 320, h: 200 };     // expanded website section (16:10)

const DETAILS = {
  d360: {
    title: 'D360 Bank: banking made simple for Saudi Arabia',
    client: 'D360 Bank', year: '2025', industry: 'Fintech · Digital banking', platform: 'Marketing website (EN / AR)',
    links: [{ type: 'web', href: 'https://minaeliaa.github.io/d360-bank/', text: 'View website' }],
    overview: 'D360 is a Shariah-compliant digital bank in Saudi Arabia. The marketing website introduces the bank, its cards and the app, and moves visitors to open an account in a few minutes.',
    problem: ['Explain a new digital bank clearly to first-time visitors.', 'Show every card and what it is for in one glance.', 'Drive app downloads from every section of the page.'],
    did: ['UX strategy', 'Information architecture', 'UI design', 'Responsive web design', 'Arabic RTL layout', 'Front-end build'],
    extra: { title: 'Results', stats: [['100', 'Lighthouse performance'], ['2 min', 'to open an account'], ['EN / AR', 'full RTL support']] },
    keywords: ['Simple', 'Trustworthy', 'Shariah-compliant', 'Fast', 'Colourful'],
    flows: [
      { name: 'Home page', kind: 'web', imgs: ['f-d360-1', 'f-d360-2', 'f-d360-3', 'f-d360-4'] },
      { name: 'Cards & sign-up', kind: 'web', imgs: ['f-d360-5', 'f-d360-6', 'f-d360-2'] },
    ],
  },
  axispay: {
    cover: 'pc-axispay',
    title: 'AxisPay: a rewards ecosystem that keeps salary users coming back',
    client: 'AxisPay', year: '2026', industry: 'Fintech · Digital wallet', platform: 'Mobile application (iOS & Android)',
    links: [{ type: 'web', href: 'https://www.behance.net/gallery/256471965/Axis-Pay-UIUX-Redesign-Fintech-Mobile-app', text: 'View case study on Behance' }],
    overview: 'A UI/UX redesign of the AxisPay salary wallet, built around a retention-focused rewards ecosystem. Everyday payments earn points that users redeem for bills, cashback and partner vouchers, turning a pay-day tool into a daily habit.',
    problem: [
      'Missing reasons to stay: AxisPay felt like a basic tool, not an exciting financial app.',
      'Users logged in only to transfer or withdraw their salary, then left right away.',
      'No emotional connection, hidden features and no daily habits.',
      'Goal: turn passive users into daily active users with clear reward goals.',
      'Make everyday actions like paying bills fun, without hurting the company’s profits or letting users game the rewards.',
    ],
    did: ['Understanding the challenge', 'Product & community research', 'User insights', 'Competitive analysis', 'Feature exploration', 'Sitemap & UX logic', 'Design system', 'UI revamp', 'Prototype', 'Presentation'],
    extra: { title: 'Research insights', stats: [['60–70%', 'of users only receive their salary in AxisPay, then stop using it after payday'], ['4', 'pain points: functional-only experience, inconsistent UI, zero rewards visibility, no gamification'], ['3', 'competitors analysed: Telda, Klivvr and Lucky']] },
    keywords: ['Retention', 'Gamified rewards', 'Daily habits', 'Digital trust', 'Glassmorphism'],
    flows: [
      { name: 'Home & points', kind: 'phone', imgs: ['p-axispay-1', 'p-axispay-2', 'p-axispay-3'] },
      { name: 'Redeem points', kind: 'phone', imgs: ['p-axispay-2', 'p-axispay-3', 'p-axispay-1'] },
    ],
  },
  wish: {
    title: 'Wish: a social wishlist for gifting friends',
    client: 'Wish', year: '2024', industry: 'Social · E-commerce', platform: 'Mobile application (iOS & Android)',
    links: [{ type: 'appstore', href: 'https://www.apple.com/app-store/' }, { type: 'play', href: 'https://play.google.com/store' }],
    overview: 'Wish lets people share what they really want and lets friends reserve and gift it, with badges that reward generous givers.',
    problem: ['Make wishlists fun to browse and share.', 'Stop two friends buying the same gift.', 'Reward people who give.'],
    did: ['Product strategy', 'User research', 'User flows', 'UI design', 'Gamification design'],
    extra: { title: 'Gamification', items: ['Badges for granted wishes', 'Progress towards the next badge', 'Leaderboard of top givers'] },
    keywords: ['Playful', 'Social', 'Generous', 'Friendly'],
    flows: [
      { name: 'Onboarding', kind: 'phone', imgs: ['p-wish-1', 'p-wish-2', 'p-wish-3'] },
      { name: 'Grant a wish', kind: 'phone', imgs: ['p-wish-2', 'p-wish-3', 'p-wish-1'] },
    ],
  },
  eyas: {
    title: 'Eyas: managing requests in one Arabic-first app',
    client: 'Eyas', year: '2024', industry: 'Consultation · Services', platform: 'Mobile application (iOS & Android)',
    links: [{ type: 'appstore', href: 'https://www.apple.com/app-store/' }, { type: 'play', href: 'https://play.google.com/store' }],
    overview: 'Eyas helps clients submit and follow their requests, see offers and pay from one Arabic-first app.',
    problem: ['Show the status of every request at a glance.', 'Make offers easy to compare and accept.', 'Keep payments and wallet history in one place.'],
    did: ['UX audit', 'Arabic RTL design', 'UI design', 'Design system', 'Developer handoff'],
    extra: { title: 'Highlights', items: ['Status timeline for every request', 'Wallet with clear balance and history', 'Fully right-to-left components'] },
    keywords: ['Arabic-first', 'Clear', 'Reliable', 'Organised'],
    flows: [
      { name: 'Requests', kind: 'phone', imgs: ['p-eyas-1', 'p-eyas-2', 'p-eyas-3'] },
      { name: 'Wallet', kind: 'phone', imgs: ['p-eyas-3', 'p-eyas-1', 'p-eyas-2'] },
    ],
  },
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const icoApple = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.8zM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>';
const icoPlay = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.1.9.4 1.2l9.1-9.4L4 2.6zm10.4 7.9L5.6 1.7l10.9 6.3-2.1 2.5zm0 3l2.1 2.5-10.9 6.3 8.8-8.8zm4.3-4.3 2.6 1.5c.8.5.8 1.6 0 2.1l-2.6 1.5-2.4-2.6 2.4-2.5z"/></svg>';
const icoWeb = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 13 13 7M8 7h5v5"/></svg>';
const linkBtn = l => {
  if (l.type === 'appstore') return `<a class="pd-btn" href="${l.href}" target="_blank" rel="noopener">${icoApple}<span><small>Download on the</small>App Store</span></a>`;
  if (l.type === 'play') return `<a class="pd-btn" href="${l.href}" target="_blank" rel="noopener">${icoPlay}<span><small>Get it on</small>Google Play</span></a>`;
  return `<a class="pd-btn web" href="${l.href}" target="_blank" rel="noopener">${esc(l.text || 'View website')}${icoWeb}</a>`;
};

function renderDetail(key, p, pic, cover) {
  const d = DETAILS[key]; if (!d) return '';
  const id = `project-${key}`;
  const meta = [['Client', d.client], ['Year', d.year], ['Industry', d.industry], ['Platform', d.platform]]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  const extra = d.extra.stats
    ? `<ul class="pd-stats">${d.extra.stats.map(([n, l]) => `<li><b>${esc(n)}</b><span>${esc(l)}</span></li>`).join('')}</ul>`
    : `<ul class="pd-list">${d.extra.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const flows = d.flows.map((f, fi) => {
    const sz = f.kind === 'web' ? WEB : PHONE;
    const shots = f.imgs.map((n, i) => `<span class="fs" style="--i:${i}">${pic(n, { alt: `${f.name}, screen ${i + 1}`, w: sz.w, h: sz.h, sizes: `${sz.w}px` })}</span>`).join('');
    return `<div class="flow ${f.kind}" style="--n:${f.imgs.length}"><h4 id="${id}-f${fi}">${esc(f.name)}<span>${f.imgs.length} screens</span></h4><div class="flow-stage" role="button" tabindex="0" aria-expanded="false" aria-labelledby="${id}-f${fi}" aria-describedby="${id}-hint"><div class="flow-track">${shots}</div></div></div>`;
  }).join('');
  return `<article class="pd" id="${id}" aria-labelledby="${id}-t" hidden>
${d.cover ? `<div class="pd-cover img">${pic(d.cover, { alt: `${p.name} cover`, w: 1072, h: 804, sizes: '(max-width: 1119px) calc(100vw - 48px), 1072px' })}</div>` : `<div class="pd-cover ${p.k === 1 ? 'web' : 'app'}">${cover}</div>`}
<header class="pd-head"><p class="pd-kicker">${esc(p.name)} <span class="status s-${p.s}">${p.statusText}</span></p><h2 class="pd-title" id="${id}-t">${esc(d.title)}</h2></header>
<dl class="pd-meta">${meta}</dl>
${d.links.length ? `<div class="pd-links">${d.links.map(linkBtn).join('')}</div>` : ''}
<section class="pd-sec"><h3>Overview</h3><p>${esc(d.overview)}</p></section>
<section class="pd-sec"><h3>Problem / Goal</h3><ul class="pd-list">${d.problem.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
<section class="pd-sec"><h3>What I did</h3><ul class="pd-chips">${d.did.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
<section class="pd-sec"><h3>${esc(d.extra.title)}</h3>${extra}</section>
<section class="pd-sec"><h3>Keywords</h3><ul class="pd-chips soft">${d.keywords.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
<section class="pd-sec pd-flows"><h3>Flows</h3><p class="pd-hint" id="${id}-hint">Tap a flow to spread its screens, tap again to stack them.</p>${flows}</section>
</article>`;
}

module.exports = { DETAILS, renderDetail };

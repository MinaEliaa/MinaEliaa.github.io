/* Project detail sheets (bottom sheet opened from Featured Projects).
   Template: cover, title, client, year, industry, platform, links, overview, problem/goal,
   what I did, one variable section, keywords, flows.
   NOTE: content below is placeholder copy until Mina sends the real details per project. */

const PHONE = { w: 170, h: 368 };   // expanded phone screen (display px)
const WEB = { w: 320, h: 200 };     // expanded website section (16:10)

const DETAILS = {
  d360: {
    cover: 'pc-d360', coverPos: '50% 30%',
    title: 'D360 Bank: turning a slogan-led website into a clear path to the app',
    client: 'D360 Bank', year: '2026', industry: 'Digital banking · Riyadh, Saudi Arabia', platform: 'Marketing website (English & Arabic)',
    links: [
      { type: 'web', href: 'https://minaeliaa.github.io/d360-bank/', text: 'View website' },
      { type: 'web', href: 'https://www.behance.net/gallery/258090105/D360-Bank-Website-Conversion-Rate-UX-Audit-Redesign', text: 'View case study on Behance' },
    ],
    overview: 'D360 Bank is a Saudi digital bank that lets people open an account in 2 minutes, then pay, save and send money abroad, all fully Shariah-compliant. This conversion-rate UX audit and redesign turns the website into a simple, trustworthy route to the app: real stats, genuine trust signals and one clear next step.',
    mission: 'Making the D360 website a simple, trustworthy route to the app: real stats, genuine trust signals, and one clear next step.',
    problem: [
      'The products are solid, but the website buries them under slogans.',
      'The new site should focus on one clear action.',
      'It should include genuine trust signals.',
      'It should showcase every product upfront.',
    ],
    did: ['UX audit', 'First-time visitor journey', 'Conversion-rate analysis', 'Problems & solutions mapping', 'Information architecture', 'UI redesign', 'Arabic RTL & English', 'Responsive web', 'Front-end build'],
    sections: [
      { type: 'journey', title: 'First-time visitor', heading: 'Ten steps from a TikTok ad to closing the tab.',
        persona: ['29', 'Saudi professional · Android · came from a TikTok ad about cheap transfers'],
        steps: [
          ['A cookie banner blurs the whole page.', 'Mildly annoying'],
          ['“TRAVELERS BEST BANK” doesn’t match the ad, and the button is half cut off.', ''],
          ['“+3,000,000 million customers.”', 'First crack in trust'],
          ['A long empty scroll, and the logo is gone. The page looks broken.', 'Biggest exit risk', true],
          ['“Best exchange rate?” but no actual rate.', 'Wants to compare elsewhere'],
          ['“Learn More” switches the page to Arabic.', 'Second exit risk', true],
          ['The transfers page shows no rate; countries are hidden in an FAQ.', ''],
          ['“Transfer now” jumps straight to Google Play.', 'Feels pushy'],
          ['The financing calculator shows zeros.', 'Looks broken'],
          ['The Customer Protection link is broken.', 'Leaves', true],
        ],
        exits: ['The empty scrolling section on mobile', '“Learn More” switches them to Arabic', 'No actual exchange rate to be found', 'The broken Customer Protection link'],
        note: 'The products are strong, but the site gives visitors no clear way to download the app.' },
      { type: 'pairs', title: 'Problems & solutions', heading: 'Turning a slogan-led website into a clear path to the app.',
        pairs: [
          ['The only sign-up button, “Start your journey”, shows a bare QR code on desktop and jumps straight to Google Play on Android.', 'One clear “Get the App” button, repeated through the page, with App Store and Google Play badges.'],
          ['Every claim, like “best rate” or “no hidden fees”, is a slogan with no numbers behind it.', 'Benefits with real numbers: 2 minutes, 100% Shariah, SAR 0 fees, 4.49% APR and up to 3% profit.'],
          ['Trust breaks early: the customer count literally reads 3 trillion, and SAMA regulation is buried in the footer.', 'Trust up front: a 4.8 rating from 41.5K reviews and 3M+ customers right next to the app.'],
          ['The homepage sells travel only, while financing, savings and Musaned never appear.', 'Every product shown up front: cards, transfers, financing, Sanabil savings and Musaned, each in its own tile.'],
          ['The three homepage “Learn More” links send English visitors to the Arabic site.', 'Language stays consistent: one EN / العربية switch in the header, and every section exists in both languages.'],
          ['On mobile the button is cut off, followed by about 1,500px of near-empty scrolling, and the logo disappears.', 'A compact mobile hero: headline, button and cards fit the first screen, and every scroll shows real content.'],
        ] },
      { type: 'cards', title: 'Our approach', heading: 'Five ideas shaped the new website.',
        cards: [
          ['Numbers, not slogans', 'Every benefit is a real figure: 2 minutes, SAR 0 fees, 4.49% APR, up to 3% profit. Visitors can compare D360 in seconds.'],
          ['Arabic first', 'Built right to left from the start, with a full English version and a one-tap language switch.'],
          ['Personal and playful', 'A card colour picker and the Pink Card campaign (for Saudi women) make the bank feel made for you.'],
          ['One clear action', 'A single “Get the App” button, repeated through the page, with App Store and Google Play badges right under it.'],
          ['Trust where you decide', 'The 4.8 rating, 41.5K reviews and 3M+ customers sit right next to the button, not buried in the footer.'],
        ] },
    ],
    keywords: ['UI/UX', 'UI design', 'UX audit', 'Web design', 'Landing page', 'Website redesign', 'Conversion optimization', 'Fintech', 'Digital banking', 'Bank', 'Credit card', 'D360 Bank', 'mada', 'stc bank', 'Barq', 'Revolut', 'Arabic', 'Saudi Arabia', 'KSA', 'Mobile design', 'Mobile app', 'Motion graphics', 'UI animation', 'Figma'],
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
    sitemap: { note: 'How the rewards ecosystem branches out from the Home screen: weekly challenges, points redemption and limited-time rewards.',
      tree: ['Home', [
        ['Weekly Challenges'],
        ['My Points', [['Redeem Points', [
          ['Bills', [['My Bills', [['Payment']]], ['Add New Bill']]],
          ['Cashback', [['Enter Amount']]],
          ['Axis Vouchers', [['Partners', [['Select Voucher']]]]],
        ]]]],
        ['Rewards', [['Limited Gifts', [['Gift Details']]]]],
      ]] },
    flows: [
      { name: 'Redeem points', kind: 'phone', imgs: ['fa-home', 'fa-mypoints', 'fa-redeem'] },
      { name: 'Rewards', kind: 'phone', imgs: ['fa-rewards', 'fa-gift'] },
      { name: 'Cashback', kind: 'phone', imgs: ['fa-cashback', 'fa-cashback-amount'] },
      { name: 'Axis Vouchers', kind: 'phone', imgs: ['fa-vouchers', 'fa-voucher-select'] },
      { name: 'Bills', kind: 'phone', imgs: ['fa-bills', 'fa-bills-pay'] },
    ],
  },
  wish: {
    title: 'Wish: connect, share and save your dream wishes with friends',
    client: 'Wish mobile app · Algorithma, KSA', year: '2026', industry: 'Social networking', platform: 'Mobile application (iOS & Android)',
    links: [{ type: 'web', href: 'https://www.behance.net/gallery/248422193/Wish-Social-Wishlist-concept-mobile-application', text: 'View case study on Behance' }],
    overview: 'Wish is the first-of-its-kind social wishlist platform in Saudi Arabia: a mobile app that redefines how people share desires and celebrate each other’s preferences. Its mission is to create a meaningful experience that transforms how people express care, support and celebration through gifting, fostering deeper relationships and removing the stress of choosing the perfect gift.',
    mission: 'Built for emotionally connected users who enjoy expressing care through giving: young adults and professionals, close-knit friend groups, socially active users who gift for birthdays, Eid and anniversaries, and digital-first people looking for seamless, meaningful gifting.',
    problem: [
      'Most people only tell friends what they want in conversation (60%), so gifts are a guess.',
      'Half of gift givers ask directly, and 30% guess based on interests, which often means duplicate or unwanted presents.',
      'Goal: blend social interaction with personalised wish sharing, so users can create public or private wishlists, post updates and engage with their circles.',
      'Let friends reserve a wish and earn achievement badges, so there is no more guessing, no more duplicate presents, and gifting becomes intentional, emotional and fun.',
    ],
    did: ['User interviews', 'Competitive analysis', 'Sitemap & user flows', 'UI screens', 'Design system', 'Prototype', 'Developer handover'],
    extra: { title: 'Research questionnaires', stats: [['60%', 'tell friends what they want directly in conversation'], ['50%', 'choose a gift by asking the friend directly; 30% guess from interests'], ['40%', 'gift friends on birthdays only; 30% on holidays and birthdays']] },
    sections: [
      { type: 'userflow', title: 'User flow', heading: 'Register and onboarding.', rows: [
        ['Install app', [['Guest Mode home page', [['Modal bottom sheet', [['Continue with Email'], ['Google'], ['Apple']]]]]]],
        ['Continue with Email', [['Enter OTP code', [['Enter your password', [['?First time', [['Complete profile (onboarding)', [['Home page']], 'Yes'], ['Home page', null, 'No']]]]]]]]],
        ['Continue with Apple', [['?First time', [['Complete profile (onboarding)', [['Home page']], 'Yes'], ['Home page', null, 'No']]]]],
        ['Continue with Google', [['?First time', [['Complete profile (onboarding)', [['Home page']], 'Yes'], ['Home page', null, 'No']]]]],
      ] },
    ],
    keywords: ['Social media', 'UI/UX', 'UI design', 'User interface', 'Mobile app', 'Design system', 'Information architecture', 'Ecommerce', 'Instagram', 'Bento', 'Figma'],
    flows: [
      { name: 'Onboarding', kind: 'phone', imgs: ['fw-onb-1', 'fw-onb-2', 'fw-onb-3'] },
      { name: 'Create a post', kind: 'phone', imgs: ['fw-post-1', 'fw-post-2', 'fw-post-3'] },
      { name: 'Comments & replies', kind: 'phone', imgs: ['fw-comments-1', 'fw-comments-2', 'fw-comments-3'] },
      { name: 'Profile & interests', kind: 'phone', imgs: ['fw-profile-1', 'fw-profile-2', 'fw-profile-3'] },
      { name: 'Suggest a wish', kind: 'phone', imgs: ['fw-suggest-1', 'fw-suggest-2', 'fw-suggest-3', 'fw-suggest-4'] },
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

const icoIdeas = ['<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>', '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>', '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.8-2.4L5 15.5a1.5 1.5 0 0 1 2.3-1.9L9 15"/>', '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'];
function renderSection(s) {
  const head = `<h3>${esc(s.title)}</h3>`;
  if (s.type === 'journey') {
    const n = s.steps.length;
    const steps = s.steps.map(([txt, mood, exit], i) => `<li class="jr-step${exit ? ' exit' : ''}" style="--h:${Math.round(140 - (140 * i) / (n - 1))}"><span class="jr-num">${String(i + 1).padStart(2, '0')}${exit ? '<em>Exit</em>' : ''}</span><p>${esc(txt)}</p>${mood ? `<span class="jr-mood">${esc(mood)}</span>` : ''}</li>`).join('');
    const exits = s.exits.map((x, i) => `<li style="--i:${i}"><span>Exit ${i + 1}</span>${esc(x)}</li>`).join('');
    return `<section class="pd-sec pd-wide">${head}<div class="pd-block"><p class="pd-lead">${esc(s.heading)}</p><p class="jr-persona"><b>${esc(s.persona[0])}</b>${esc(s.persona[1])}</p><ol class="jr-steps">${steps}</ol><div class="jr-mood-bar" aria-hidden="true"><span>Curious</span><i></i><span>Gone</span></div><ol class="jr-exits">${exits}</ol><p class="pd-note">${esc(s.note)}</p></div></section>`;
  }
  if (s.type === 'userflow') {
    const uf = ([label, kids, tag]) => { const dec = label.startsWith('?'); const txt = dec ? label.slice(1) + '?' : label; return `<li>${tag ? `<span class="uf-tag ${tag === 'Yes' ? 'y' : 'n'}">${esc(tag)}</span>` : ''}<span class="sm-n${dec ? ' dec' : ''}${kids ? '' : ' leaf'}">${esc(txt)}</span>${kids ? `<ul>${kids.map(uf).join('')}</ul>` : ''}</li>`; };
    const rows = s.rows.map((r, i) => `<li class="uf-row"><span class="uf-num">${String(i + 1).padStart(2, '0')}</span><div class="sm-wrap uf-wrap" tabindex="0" role="region" aria-label="User flow ${i + 1}"><ul class="sm">${uf(r)}</ul></div></li>`).join('');
    return `<section class="pd-sec pd-wide">${head}<div class="pd-block"><p class="pd-lead">${esc(s.heading)}</p><ol class="uf">${rows}</ol></div></section>`;
  }
  if (s.type === 'pairs') {
    const rows = s.pairs.map(([pr, so], i) => `<li><div class="ps-p"><span>${String(i + 1).padStart(2, '0')} Problem</span><p>${esc(pr)}</p></div><div class="ps-s"><span>${String(i + 1).padStart(2, '0')} Solution</span><p>${esc(so)}</p></div></li>`).join('');
    return `<section class="pd-sec pd-wide">${head}<div class="pd-block"><p class="pd-lead">${esc(s.heading)}</p><ol class="pairs">${rows}</ol></div></section>`;
  }
  if (s.type === 'cards') {
    const cards = s.cards.map(([h, txt], i) => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icoIdeas[i % icoIdeas.length]}</svg><h4>${esc(h)}</h4><p>${esc(txt)}</p></li>`).join('');
    return `<section class="pd-sec pd-wide">${head}<div class="pd-block"><p class="pd-lead">${esc(s.heading)}</p><ul class="idea-cards">${cards}</ul></div></section>`;
  }
  return '';
}

function renderDetail(key, p, pic, cover) {
  const d = DETAILS[key]; if (!d) return '';
  const id = `project-${key}`;
  const meta = [['Client', d.client], ['Year', d.year], ['Industry', d.industry], ['Platform', d.platform]]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  const extra = !d.extra ? '' : `<div class="pd-extra">${d.extra.stats ? `<ul class="pd-stats">${d.extra.stats.map(([n, l]) => `<li><b>${esc(n)}</b><span>${esc(l)}</span></li>`).join('')}</ul>` : ''}${d.extra.items ? `<ul class="pd-list">${d.extra.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
  const node = ([label, kids], depth) => `<li>${depth === 0 && d.sitemap.rootImg ? `<span class="sm-phone">${pic(d.sitemap.rootImg, { alt: `${label} screen`, w: 120, h: 260, sizes: '120px' })}<span class="sm-n root">${esc(label)}</span></span>` : `<span class="sm-n${depth === 0 ? ' root' : ''}${kids ? '' : ' leaf'}">${esc(label)}</span>`}${kids ? `<ul>${kids.map(k => node(k, depth + 1)).join('')}</ul>` : ''}</li>`;
  const sitemap = d.sitemap ? `<section class="pd-sec pd-map"><h3>Sitemap</h3><p class="pd-hint">${esc(d.sitemap.note)}</p><div class="sm-wrap" tabindex="0" role="region" aria-label="${esc(p.name)} sitemap"><ul class="sm">${node(d.sitemap.tree, 0)}</ul></div></section>` : '';
  const flows = (d.flows || []).map((f, fi) => {
    const sz = f.kind === 'web' ? WEB : PHONE;
    const shots = f.imgs.map((n, i) => `<span class="fs" style="--i:${i}">${pic(n, { alt: `${f.name}, screen ${i + 1}`, w: sz.w, h: sz.h, sizes: `${sz.w}px` })}</span>`).join('');
    return `<div class="flow ${f.kind}" style="--n:${f.imgs.length}"><h4 id="${id}-f${fi}">${esc(f.name)}<span>${f.imgs.length} screens</span></h4><div class="flow-stage" role="button" tabindex="0" aria-expanded="false" aria-labelledby="${id}-f${fi}" aria-describedby="${id}-hint"><div class="flow-track">${shots}</div></div></div>`;
  }).join('');
  return `<article class="pd" id="${id}" aria-labelledby="${id}-t" hidden>
${d.cover ? `<div class="pd-cover img"${d.coverPos ? ` style="--op:${d.coverPos}"` : ''}>${pic(d.cover, { alt: `${p.name} cover`, w: 1072, h: 804, sizes: '(max-width: 1119px) calc(100vw - 48px), 1072px' })}</div>` : `<div class="pd-cover ${p.k === 1 ? 'web' : 'app'}">${cover}</div>`}
<header class="pd-head"><p class="pd-kicker">${esc(p.name)} <span class="status s-${p.s}">${p.statusText}</span></p><h2 class="pd-title" id="${id}-t">${esc(d.title)}</h2></header>
<dl class="pd-meta">${meta}</dl>
${d.links.length ? `<div class="pd-links">${d.links.map(linkBtn).join('')}</div>` : ''}
<section class="pd-sec"><h3>Overview</h3><div class="pd-txt"><p>${esc(d.overview)}</p>${d.mission ? `<p class="pd-mission"><b>Mission</b>${esc(d.mission)}</p>` : ''}</div></section>
<section class="pd-sec"><h3>Problem / Goal</h3><ul class="pd-list">${d.problem.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
<section class="pd-sec"><h3>What I did</h3><ul class="pd-chips">${d.did.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
${d.extra ? `<section class="pd-sec"><h3>${esc(d.extra.title)}</h3>${extra}</section>` : ''}${(d.sections || []).map(renderSection).join('')}
<section class="pd-sec"><h3>Keywords</h3><ul class="pd-chips soft">${d.keywords.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
${sitemap}
${d.website ? `<section class="pd-sec pd-wide"><h3>Website</h3><div class="pd-block"><p class="pd-hint">${esc(d.website.name)}. Scroll inside the frame to see the whole page.</p><div class="web-frame"><div class="web-bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(d.website.url)}</span></div><div class="web-scroll" tabindex="0" role="region" aria-label="${esc(p.name)} landing page, scrollable">${pic(d.website.img, { alt: `${p.name} landing page, full length`, w: 1000, h: 7136, sizes: '(max-width: 1119px) calc(100vw - 32px), 1000px' })}</div></div></div></section>` : !(d.flows || []).length ? '' : `<section class="pd-sec pd-flows"><h3>Flows</h3><p class="pd-hint" id="${id}-hint">Tap a flow to spread its screens, tap again to stack them.</p>${flows}</section>`}
</article>`;
}

module.exports = { DETAILS, renderDetail };

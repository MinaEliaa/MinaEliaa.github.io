(() => {
  const d = document, root = d.documentElement;
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  if (rm.matches) root.classList.add('rm');

  /* ---------- Navbar: full row at top; after 180px a pill that is expanded by default.
     Left arrow collapses it to logo + right arrow; right arrow expands it again. ---------- */
  const nav = d.querySelector('.nav'), arrow = nav && nav.querySelector('.nav-arrow');
  if (nav && arrow) {
    let collapsed = false;
    const sync = () => { const open = nav.classList.contains('compact') && !collapsed; nav.classList.toggle('open', open); arrow.setAttribute('aria-expanded', String(open)); arrow.setAttribute('aria-label', open ? 'Collapse menu' : 'Expand menu'); };
    const onScroll = () => { const c = scrollY > 180; if (c !== nav.classList.contains('compact')) { nav.classList.toggle('compact', c); if (!c) collapsed = false; sync(); } };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    arrow.addEventListener('click', () => { collapsed = !collapsed; sync(); });
  }
  /* ---------- Mobile menu (<810px): hamburger opens a sheet with LinkedIn, Behance, Start Project ---------- */
  const burger = nav && nav.querySelector('.burger'), sheet = d.getElementById('nav-sheet');
  if (burger && sheet) {
    const links = () => [...sheet.querySelectorAll('a')];
    const setMenu = (o, focus) => {
      nav.classList.toggle('menu', o); burger.setAttribute('aria-expanded', String(o)); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      links().forEach(a => o ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1'));
      if (focus) (o ? links()[0] : burger).focus();
    };
    setMenu(false);
    burger.addEventListener('click', () => setMenu(!nav.classList.contains('menu')));
    links().forEach(a => a.addEventListener('click', () => setMenu(false)));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('menu')) setMenu(false, true); });
    d.addEventListener('pointerdown', e => { if (nav.classList.contains('menu') && !nav.contains(e.target)) setMenu(false); });
    matchMedia('(min-width: 810px)').addEventListener('change', e => e.matches && setMenu(false));
  }

  /* ---------- Scroll reveal (fade up once on entering viewport) ---------- */
  const rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0 });
    rv.forEach(el => io.observe(el));
    // tickers only run while visible (as on the original)
    const tio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('inview', e.isIntersecting)));
    d.querySelectorAll('.tool-in').forEach(el => tio.observe(el));
  } else { rv.forEach(el => el.classList.add('in')); d.querySelectorAll('.tool-in').forEach(el => el.classList.add('inview')); }

  /* ---------- Pause animations button (WCAG 2.2.2) ---------- */
  d.querySelectorAll('.pause-btn').forEach(b => b.addEventListener('click', () => {
    const p = root.classList.toggle('paused');
    d.querySelectorAll('.pause-btn').forEach(x => { x.setAttribute('aria-pressed', String(p)); x.textContent = p ? 'Play animations' : 'Pause animations'; });
  }));

  /* ---------- Scroll-linked word reveal ---------- */
  const heads = [...d.querySelectorAll('.reveal-h')].map(h => ({ h, w: [...h.querySelectorAll('.w')] }));
  if (heads.length && !rm.matches) {
    let ticking = false;
    const ease = t => t * t * (3 - 2 * t);
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      heads.forEach(({ h, w }) => {
        const top = h.getBoundingClientRect().top;
        if (top > vh * 1.2 || top < -h.offsetHeight - vh) return;
        const s = (vh * 0.8 - top) / vh, n = w.length - 1 || 1;
        w.forEach((el, i) => {
          const start = 0.02 + (i / n) * 0.47;
          const t = Math.min(1, Math.max(0, (s - start) / 0.33));
          el.style.opacity = (0.1 + 0.9 * ease(t)).toFixed(3);
        });
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- Glass card tilt ---------- */
  const glass = d.querySelector('.glass');
  if (glass && !rm.matches) {
    const inner = glass.querySelector('.glass-in');
    glass.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = glass.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      inner.style.transform = `scale(1.05) rotateX(${((0.5 - y) * 15.5).toFixed(2)}deg) rotateY(${((x - 0.5) * 15).toFixed(2)}deg)`;
      glass.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      glass.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    glass.addEventListener('pointerleave', () => { inner.style.transform = ''; });
  }

  /* ---------- Website plan: page dropdown + no-code toggle ---------- */
  const card = d.querySelector('[data-plan]');
  if (card) {
    const prices = { 'Landing Page': ['$350', '$550'], '4–6 Pages': ['$600', '$1.2k'], 'More than 6 Pages': ['$800', '+$1.6k'] };
    const priceEl = card.querySelector('.price'), unitEl = card.querySelector('.dd-label');
    const btn = card.querySelector('.dd-btn'), menu = card.querySelector('.dd-menu'), sw = card.querySelector('.switch');
    const opts = [...menu.querySelectorAll('button')];
    let sel = 'Landing Page', noCode = false, shown = '$350', raf = 0;
    const plus = (txt, s) => s === 'More than 6 Pages' && /\d+/.test(txt) && parseInt(txt.match(/\d+/)[0], 10) >= 800 && !txt.trim().startsWith('+') ? '+' + txt : txt;
    const live = card.querySelector('#price-live');
    const render = () => {
      const target = prices[sel][noCode ? 1 : 0];
      if (live) live.textContent = `Price ${plus(target, sel)}${noCode ? ' with no-code development' : ''}`;
      cancelAnimationFrame(raf);
      const a = shown.match(/\d+/), b = target.match(/\d+/);
      if (rm.matches || !a || !b || a[0] === b[0]) { shown = target; priceEl.textContent = plus(target, sel); return; }
      const from = parseInt(a[0], 10), delta = parseInt(b[0], 10) - from, t0 = performance.now();
      const step = now => {
        const t = Math.min((now - t0) / 500, 1), e = t * (2 - t);
        shown = target.replace(/\d+/, String(Math.round(from + delta * e)));
        priceEl.textContent = plus(shown, sel);
        if (t < 1) raf = requestAnimationFrame(step); else shown = target;
      };
      raf = requestAnimationFrame(step);
    };
    const setOpen = o => { menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); if (o) (opts.find(x => x.getAttribute('aria-checked') === 'true') || opts[0]).focus(); };
    btn.addEventListener('click', () => setOpen(menu.hidden));
    opts.forEach(o => o.addEventListener('click', () => {
      sel = o.dataset.v; opts.forEach(x => x.setAttribute('aria-checked', String(x === o)));
      unitEl.textContent = o.textContent; btn.setAttribute('aria-label', 'Website size: ' + o.textContent); setOpen(false); btn.focus(); render();
    }));
    menu.addEventListener('keydown', e => {
      const i = opts.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
      if (e.key === 'Escape') { setOpen(false); btn.focus(); }
    });
    d.addEventListener('mousedown', e => { if (!menu.hidden && !card.querySelector('.dd').contains(e.target)) setOpen(false); });
    d.addEventListener('focusin', e => { if (!menu.hidden && !card.querySelector('.dd').contains(e.target)) setOpen(false); });
    sw.addEventListener('click', () => { noCode = !noCode; sw.setAttribute('aria-checked', String(noCode)); render(); });
  }

  /* ---------- Case studies rail (desktop/tablet): buttons scroll one card; disabled at the ends ---------- */
  const rail = d.getElementById('cases-rail');
  if (rail) {
    const prevB = d.querySelector('.rail-btn.prev'), nextB = d.querySelector('.rail-btn.next');
    const step = () => { const c = rail.querySelector('.case'); return c ? c.getBoundingClientRect().width + 24 : rail.clientWidth; };
    const upd = () => { const max = rail.scrollWidth - rail.clientWidth - 2; prevB.disabled = rail.scrollLeft <= 2; nextB.disabled = rail.scrollLeft >= max; };
    prevB.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: rm.matches ? 'auto' : 'smooth' }));
    nextB.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: rm.matches ? 'auto' : 'smooth' }));
    let t = 0; rail.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(upd); }, { passive: true });
    addEventListener('resize', upd, { passive: true }); upd();
    // Mouse drag to scroll (touch already swipes natively); snapping resumes on release
    let sx = 0, sl = 0, down = false, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0 || getComputedStyle(rail).overflowX === 'visible') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (!moved && Math.abs(dx) > 4) { moved = true; rail.classList.add('dragging'); } if (moved) { rail.scrollLeft = sl - dx; e.preventDefault(); } });
    const end = () => { if (!down) return; down = false; if (moved) { const x = rail.scrollLeft; rail.classList.remove('dragging'); rail.scrollLeft = x; rail.scrollBy({ left: 0, behavior: rm.matches ? 'auto' : 'smooth' }); } };
    addEventListener('pointerup', end); addEventListener('pointercancel', end);
    rail.addEventListener('dragstart', e => e.preventDefault());
  }

  /* ---------- FAQ accordion ---------- */
  d.querySelectorAll('.qa-q').forEach(q => q.addEventListener('click', () => {
    const open = q.getAttribute('aria-expanded') !== 'true';
    const box = q.closest('.qa-in'), ans = d.getElementById(q.getAttribute('aria-controls'));
    const from = box.offsetHeight;
    q.setAttribute('aria-expanded', String(open));
    ans.hidden = !open;
    if (!rm.matches && box.animate) box.animate([{ height: from + 'px' }, { height: box.offsetHeight + 'px' }], { duration: 200, easing: 'ease-out' });
  }));
})();

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
  const rv = d.querySelectorAll('.rv, .chx');
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

  /* ---------- FAQ accordion ---------- */
  d.querySelectorAll('.qa-q').forEach(q => q.addEventListener('click', () => {
    const open = q.getAttribute('aria-expanded') !== 'true';
    const box = q.closest('.qa-in'), ans = d.getElementById(q.getAttribute('aria-controls'));
    const from = box.offsetHeight;
    q.setAttribute('aria-expanded', String(open));
    ans.hidden = !open;
    if (!rm.matches && box.animate) box.animate([{ height: from + 'px' }, { height: box.offsetHeight + 'px' }], { duration: 200, easing: 'ease-out' });
  }));
  /* ---------- Hero story cards: drag anywhere + Instagram-style story viewer ---------- */
  const hero = d.querySelector('.hero'), cards = [...d.querySelectorAll('.story')], sv = d.getElementById('sv');
  if (hero && cards.length && sv) {
    const LIST = [];
    const SETS = {};
    cards.forEach(c => { let items = []; try { items = JSON.parse(c.dataset.items); } catch (e) {}
      SETS[c.dataset.k] = { title: c.dataset.title, audio: c.dataset.audio, cover: c.dataset.cover, count: items.length };
      items.forEach((it, j) => LIST.push({ k: c.dataset.k, n: j + 1, id: it.id, label: it.label || '', flag: it.flag || '', title: c.dataset.title })); });
    const FLAGS = {
      fi: '<rect width="18" height="12" fill="#fff"/><path d="M0 4.5h18v3H0zM5 0h3v12H5z" fill="#002f6c"/>',
      es: '<rect width="18" height="12" fill="#aa151b"/><rect y="3" width="18" height="6" fill="#f1bf00"/>',
      ps: '<rect width="18" height="4" fill="#000"/><rect y="4" width="18" height="4" fill="#fff"/><rect y="8" width="18" height="4" fill="#007a3d"/><path d="M0 0l7 6-7 6z" fill="#ce1126"/>',
    };

    /* muted preview loops: only after load, only on screen, never with reduced motion / data saver */
    const previews = cards.map(c => c.querySelector('video'));
    const canPreview = () => !rm.matches && !root.classList.contains('paused') && sv.hidden;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!rm.matches && !saveData && 'IntersectionObserver' in window) {
      const vis = new Set();
      const start = () => {
        const io = new IntersectionObserver(es => es.forEach(e => {
          const v = e.target.querySelector('video');
          if (e.isIntersecting) {
            vis.add(v);
            if (!v.src) { v.src = v.dataset.src; v.addEventListener('playing', () => v.classList.add('on'), { once: true }); }
            if (canPreview()) v.play().catch(() => {});
          } else { vis.delete(v); v.pause(); }
        }));
        cards.forEach(c => io.observe(c));
      };
      // start on first interaction (keeps the load quiet), with a late fallback
      let started = false; const evs = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart', 'wheel'];
      const kick = () => { if (started) return; started = true; evs.forEach(n => removeEventListener(n, kick)); start(); };
      evs.forEach(n => addEventListener(n, kick, { passive: true, once: true }));
      const late = () => setTimeout(kick, 7000);
      if (d.readyState === 'complete') late(); else addEventListener('load', late, { once: true });
      previews.forEach(v => v.addEventListener('timeupdate', () => { if (v.duration) v.parentNode.querySelector('.bars i').style.setProperty('--p', (v.currentTime / v.duration).toFixed(3)); }));
      cards.resume = () => vis.forEach(v => canPreview() && v.play().catch(() => {}));
      d.querySelectorAll('.pause-btn').forEach(b => b.addEventListener('click', () => root.classList.contains('paused') ? previews.forEach(v => v.pause()) : cards.resume()));
    }

    /* drag: mouse/pen drag at once; touch drags after a short press so the page still scrolls */
    cards.forEach(c => {
      let ox = 0, oy = 0, bx = 0, by = 0, sx = 0, sy = 0, down = false, moved = false, armT = 0, armed = false;
      const clamp = (nx, ny) => {
        const hr = hero.getBoundingClientRect(), r = c.getBoundingClientRect(), L = r.left - ox, T = r.top - oy;
        return [Math.min(Math.max(nx, hr.left + 8 - L), hr.right - 8 - r.width - L), Math.min(Math.max(ny, hr.top + 88 - T), hr.bottom - 8 - r.height - T)];
      };
      const moveTo = (nx, ny) => { [ox, oy] = clamp(nx, ny); c.style.translate = `${ox}px ${oy}px`; };
      const begin = (x, y) => { down = true; moved = false; sx = x; sy = y; bx = ox; by = oy; };
      const drag = (x, y) => { if (!moved && Math.hypot(x - sx, y - sy) > 6) { moved = true; c.classList.add('dragging'); } if (moved) moveTo(bx + x - sx, by + y - sy); };
      const finish = () => { down = false; armed = false; c.classList.remove('dragging'); };
      c.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' || e.button) return; begin(e.clientX, e.clientY); c.setPointerCapture(e.pointerId); });
      c.addEventListener('pointermove', e => { if (down && e.pointerType !== 'touch') drag(e.clientX, e.clientY); });
      c.addEventListener('pointerup', e => { if (e.pointerType !== 'touch') finish(); });
      c.addEventListener('lostpointercapture', e => { if (e.pointerType !== 'touch' && down) finish(); });
      c.addEventListener('touchstart', e => {
        if (e.touches.length > 1) return;
        const t = e.touches[0]; begin(t.clientX, t.clientY);
        armT = setTimeout(() => { armed = true; moved = true; c.classList.add('dragging'); if (navigator.vibrate) navigator.vibrate(8); }, 220);
      }, { passive: true });
      c.addEventListener('touchmove', e => {
        const t = e.touches[0];
        if (armed) { e.preventDefault(); moveTo(bx + t.clientX - sx, by + t.clientY - sy); }
        else if (Math.hypot(t.clientX - sx, t.clientY - sy) > 8) { clearTimeout(armT); down = false; moved = true; }
      }, { passive: false });
      const tEnd = () => { clearTimeout(armT); if (armed) finish(); else down = false; };
      c.addEventListener('touchend', tEnd); c.addEventListener('touchcancel', tEnd);
      c.addEventListener('contextmenu', e => e.preventDefault());
      c.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; return; } open(LIST.findIndex(s => s.k === c.dataset.k), c); });
      c.addEventListener('keydown', e => {
        const m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!m) return; e.preventDefault(); const s = e.shiftKey ? 48 : 16; moveTo(ox + m[0] * s, oy + m[1] * s);
      });
    });

    /* viewer */
    const card = d.getElementById('sv-card'), media = d.getElementById('sv-media');
    const titleEl = d.getElementById('sv-title'), soundBtn = d.getElementById('sv-sound'), barsEl = d.getElementById('sv-bars');
    let bars = [], barsK = '', audio = null, audioSrc = '', soundOff = false;
    const avEl = d.getElementById('sv-av'), intro = d.getElementById('sv-intro'), introImg = intro.querySelector('img'), introName = intro.querySelector('b');
    const placeEl = d.getElementById('sv-place'), live = d.getElementById('sv-live'), pauseBtn = d.getElementById('sv-pause'), closeBtn = d.getElementById('sv-close');
    const prevBtn = sv.querySelector('.sv-arrow.prev');
    const vids = {};
    let cur = 0, userPaused = false, held = false, raf = 0, hideT = 0;
    const idOf = i => LIST[i].id;
    const getVid = i => {
      const id = idOf(i);
      if (!vids[id]) {
        const v = d.createElement('video');
        v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto'; v.disablePictureInPicture = true;
        v.setAttribute('aria-hidden', 'true'); v.poster = `img/story-${id}-480.webp`; v.src = `media/story-${id}.mp4`;
        v.addEventListener('ended', () => { if (idOf(cur) === id) go(1); });
        media.appendChild(v); vids[id] = v;
      }
      return vids[id];
    };
    const syncAudio = () => {
      // each highlight has its own soundtrack; it loops until you move to the other highlight or close
      const s = LIST[cur], src = s && SETS[s.k].audio, want = !sv.hidden && !!src;
      if (audio && audioSrc !== src) { audio.pause(); audio = null; audioSrc = ''; }
      if (want && !audio) { audio = new Audio(src); audioSrc = src; audio.loop = true; audio.preload = 'auto'; audio.addEventListener('ended', () => { audio.currentTime = 0; if (!sv.hidden) audio.play().catch(() => {}); }); }
      if (!audio) return;
      audio.muted = soundOff;
      (want && !userPaused && !held) ? audio.play().catch(() => {}) : audio.pause();
    };
    const sync = () => {
      const v = vids[idOf(cur)]; if (!v) return;
      (userPaused || held) ? v.pause() : v.play().catch(() => {});
      syncAudio();
      pauseBtn.setAttribute('aria-pressed', String(userPaused)); pauseBtn.setAttribute('aria-label', userPaused ? 'Play story' : 'Pause story');
    };
    const show = i => {
      cur = i; const s = LIST[i];
      Object.values(vids).forEach(v => { v.classList.remove('cur'); v.pause(); });
      const v = getVid(i); try { v.currentTime = 0; } catch (e) {}
      v.classList.add('cur'); sync();
      if (LIST[i + 1]) getVid(i + 1);
      if (barsK !== s.k) {
        barsK = s.k; barsEl.innerHTML = '<i></i>'.repeat(SETS[s.k].count); bars = [...barsEl.children];
        const src = `img/story-${SETS[s.k].cover}-240.webp`; avEl.src = src;
        // Instagram-highlight intro: cover + name over a soft overlay, then fade away
        introImg.src = src; introName.textContent = s.title;
        intro.classList.remove('on'); void intro.offsetWidth; if (!rm.matches) intro.classList.add('on');
      }
      titleEl.textContent = s.title;
      placeEl.innerHTML = s.label ? `<span>${s.label}</span>${FLAGS[s.flag] ? `<svg class="flag" viewBox="0 0 18 12" aria-hidden="true" focusable="false">${FLAGS[s.flag]}</svg>` : ''}` : '';
      soundBtn.hidden = !SETS[s.k].audio;
      bars.forEach((b, j) => b.style.setProperty('--p', j < s.n - 1 ? 1 : 0));
      live.textContent = `${s.title}${s.label ? ', ' + s.label : ''}, story ${s.n} of ${SETS[s.k].count}`;
      prevBtn.disabled = i === 0;
    };
    const tick = () => {
      const v = vids[idOf(cur)];
      if (v && v.duration) bars[LIST[cur].n - 1].style.setProperty('--p', Math.min(1, v.currentTime / v.duration).toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    const go = dir => { const n = cur + dir; if (n >= LIST.length) close(); else if (n < 0) { const v = vids[idOf(cur)]; v.currentTime = 0; sync(); } else show(n); };
    let lastFocus = null;
    const open = (i, from) => {
      clearTimeout(hideT); lastFocus = from; userPaused = false; held = false;
      previews.forEach(v => v.pause());
      sv.hidden = false; root.classList.add('sv-lock'); show(i);
      requestAnimationFrame(() => sv.classList.add('open'));
      cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); closeBtn.focus();
    };
    const close = () => {
      sv.classList.remove('open', 'held', 'swiping'); cancelAnimationFrame(raf);
      Object.values(vids).forEach(v => v.pause()); if (audio) { audio.pause(); audio = null; audioSrc = ''; } barsK = ''; root.classList.remove('sv-lock');
      hideT = setTimeout(() => { sv.hidden = true; cards.resume && cards.resume(); }, rm.matches ? 0 : 250);
      if (lastFocus) lastFocus.focus();
    };

    // tap right = next, tap left = previous, press and hold = pause, swipe down = close (touch)
    let pd = null, holdT = 0;
    const setHeld = h => { held = h; sv.classList.toggle('held', h); sync(); };
    card.addEventListener('pointerdown', e => {
      if (e.button || e.target.closest('button')) return;
      pd = { x: e.clientX, y: e.clientY, swipe: false, touch: e.pointerType === 'touch' };
      if (!sv.contains(d.activeElement) || d.activeElement === d.body) card.focus({ preventScroll: true });
      card.setPointerCapture(e.pointerId);
      holdT = setTimeout(() => setHeld(true), 200);
    });
    card.addEventListener('pointermove', e => {
      if (!pd) return; const dx = e.clientX - pd.x, dy = e.clientY - pd.y;
      if (!pd.swipe && pd.touch && dy > 12 && dy > Math.abs(dx)) { pd.swipe = true; clearTimeout(holdT); sv.classList.add('swiping'); held = true; sync(); }
      if (pd.swipe) { const y = Math.max(0, dy); card.style.setProperty('--dy', y + 'px'); card.style.setProperty('--sc', (1 - Math.min(y / 2000, .1)).toFixed(3)); }
    });
    const up = e => {
      if (!pd) return; clearTimeout(holdT); const p = pd; pd = null;
      if (p.swipe) {
        sv.classList.remove('swiping'); card.style.removeProperty('--dy'); card.style.removeProperty('--sc'); held = false;
        if (e.clientY - p.y > 110) close(); else sync(); return;
      }
      if (held) { setHeld(false); return; }
      if (e.type === 'pointercancel') return;
      const r = card.getBoundingClientRect(); go(e.clientX - r.left < r.width * .3 ? -1 : 1);
    };
    card.addEventListener('pointerup', up); card.addEventListener('pointercancel', up);
    card.addEventListener('contextmenu', e => e.preventDefault());
    sv.querySelectorAll('.sv-arrow').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
    pauseBtn.addEventListener('click', () => { userPaused = !userPaused; sync(); });
    soundBtn.addEventListener('click', () => { soundOff = !soundOff; soundBtn.setAttribute('aria-pressed', String(soundOff)); soundBtn.setAttribute('aria-label', soundOff ? 'Play music' : 'Mute music'); syncAudio(); });
    closeBtn.addEventListener('click', close);
    sv.addEventListener('click', e => { if (e.target === sv) close(); });
    d.addEventListener('keydown', e => {
      if (sv.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); userPaused = !userPaused; sync(); }
      else if (e.key === 'Tab') {
        const f = [...sv.querySelectorAll('button')].filter(b => !b.disabled && b.offsetParent !== null);
        const i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    d.addEventListener('visibilitychange', () => { if (!sv.hidden) { held = d.hidden; sync(); } });
  }
  /* ---------- Featured Projects: bottom sheet with project details + stacked flows ---------- */
  const ps = d.getElementById('ps');
  if (ps) {
    const panel = d.getElementById('ps-panel'), scroller = d.getElementById('ps-scroll'), closeX = d.getElementById('ps-close');
    let current = null, opener = null, hideTimer = 0;
    const show = (key, from) => {
      const art = d.getElementById('project-' + key); if (!art) return;
      clearTimeout(hideTimer); opener = from || d.activeElement;
      ps.querySelectorAll('.pd').forEach(a => { a.hidden = a !== art; });
      current = key; ps.setAttribute('aria-labelledby', art.getAttribute('aria-labelledby')); ps.removeAttribute('aria-label');
      ps.hidden = false; root.classList.add('sv-lock'); scroller.scrollTop = 0;
      requestAnimationFrame(() => requestAnimationFrame(() => ps.classList.add('open')));
      closeX.focus({ preventScroll: true });
      if (location.hash !== '#project-' + key) history.replaceState(null, '', '#project-' + key);
    };
    const hide = () => {
      if (ps.hidden) return;
      ps.classList.remove('open', 'drag'); panel.style.removeProperty('--dy'); root.classList.remove('sv-lock');
      hideTimer = setTimeout(() => { ps.hidden = true; }, rm.matches ? 0 : 450);
      if (location.hash.startsWith('#project-')) history.replaceState(null, '', location.pathname + location.search);
      if (opener && opener.focus) opener.focus({ preventScroll: true });
      current = null;
    };
    d.querySelectorAll('.proj-card').forEach(a => a.addEventListener('click', e => { e.preventDefault(); show(a.getAttribute('href').slice(9), a); }));
    closeX.addEventListener('click', hide);
    ps.addEventListener('click', e => { if (e.target === ps) hide(); });
    d.addEventListener('keydown', e => {
      if (ps.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
      if (e.key === 'Tab') {
        const art = d.getElementById('project-' + current);
        const f = [closeX, ...art.querySelectorAll('a[href], [tabindex="0"]')].filter(el => el.offsetParent !== null);
        const i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    const fromHash = () => { const m = location.hash.match(/^#project-([a-z0-9-]+)$/); if (m && d.getElementById('project-' + m[1])) show(m[1]); };
    addEventListener('hashchange', fromHash); fromHash();

    // phones: drag the grab bar down to dismiss
    const grab = ps.querySelector('.ps-grab'); let g = null;
    grab.addEventListener('pointerdown', e => { g = { y: e.clientY }; grab.setPointerCapture(e.pointerId); ps.classList.add('drag'); });
    grab.addEventListener('pointermove', e => { if (g) panel.style.setProperty('--dy', Math.max(0, e.clientY - g.y) + 'px'); });
    const gEnd = e => { if (!g) return; const dy = e.clientY - g.y; g = null; ps.classList.remove('drag'); if (dy > 120) hide(); else panel.style.removeProperty('--dy'); };
    grab.addEventListener('pointerup', gEnd); grab.addEventListener('pointercancel', gEnd);

    // flows: tap to spread the stacked screens side by side, tap again to stack them
    ps.querySelectorAll('.flow-stage').forEach(st => {
      const toggle = () => {
        const open = st.getAttribute('aria-expanded') !== 'true';
        if (!open) st.scrollTo({ left: 0, behavior: rm.matches ? 'auto' : 'smooth' });
        st.setAttribute('aria-expanded', String(open));
      };
      st.addEventListener('click', toggle);
      st.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
  }
})();

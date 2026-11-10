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

  /* ---------- Aurora beam (WebGL): a green aurora pillar that lands in a horizon arc above the screens.
     Starts after load, follows the pointer, pauses off-screen / hidden tab / Pause button,
     skipped for reduced motion and on machines without a GPU (static CSS beam stays). ---------- */
  const sky = d.querySelector('.sky'), cv = sky && sky.querySelector('.sky-fx'), scr = d.getElementById('screens-1');
  const setArc = () => { if (sky && scr) sky.style.setProperty('--arc', (scr.offsetTop + 28) + 'px'); };
  setArc(); addEventListener('resize', setArc, { passive: true });
  if (cv && !rm.matches) {
    const FS = `precision mediump float;
uniform vec2 R;uniform float T;uniform vec2 P;uniform float H;uniform float A;varying vec2 v;
float hs(float n){return fract(sin(n)*43758.5453);}
float ns(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(hs(i),hs(i+1.),f);}
void main(){
float r=R.x/R.y;vec2 q=vec2((v.x-.5)*r,v.y);vec2 m=vec2((P.x-.5)*r,P.y);
float top=1.-A;float h=clamp((v.y-A)/top,0.,1.);
float lean=(m.x)*H*.55;
float cx=lean*pow(h,1.3)+.025*sin(T*.9+h*5.)*h+.015*sin(T*.5);
float dx=q.x-cx;
float hw=mix(.34,.016,pow(h,.45))*clamp(r*1.1,.4,1.);
float shape=exp(-dx*dx/(hw*hw));
float u=dx/hw;
float rays=.55*ns(u*9.+T*.6+h*1.5)+.45*ns(u*23.-T*.8);
rays=.25+1.25*pow(rays,2.2);
float fold=.75+.25*sin(u*3.+h*7.-T*1.1);
float vfade=smoothstep(1.,.25,h)*smoothstep(-.02,.06,v.y-A);
float core=exp(-dx*dx/(.0035*.0035))*smoothstep(.15,1.,h)*.55;
float pm=length(vec2(q.x-m.x,(v.y-m.y)*.7));
float near=H*exp(-pm*pm*9.);
float beam=(shape*rays*fold*vfade*1.25+core)*(1.+1.1*near+.35*H);
float ay=A-.10*(q.x-cx*.4)*(q.x-cx*.4);
float dy=v.y-ay;
float wide=exp(-pow((q.x-cx*.4)/.62,2.));
float line=exp(-dy*dy/(.0045*.0045))*wide;
float halo=exp(-abs(dy)/.09)*wide*.55*(dy>0.?1.:.6)+exp(-abs(dy)/.22)*wide*.18;
float mx=exp(-pow((q.x-m.x)/.25,2.))*H;
float arc=(line*1.1+halo)*(1.+1.4*mx)*(.85+.15*sin(T*1.3+q.x*4.));
vec3 mint=vec3(.49,.953,.714),green=vec3(.02,.886,.45),deep=vec3(.01,.6,.33),teal=vec3(.05,.5,.55);
vec3 bc=mix(green,mint,clamp(core*2.+near*.5+(1.-h)*.25,0.,1.));bc=mix(teal,bc,clamp(shape*1.6,0.,1.));
vec3 ac=mix(deep,mint,clamp(line*1.2+mx*.4,0.,1.));
vec3 col=bc*beam+ac*arc;
col*=mix(.55,1.,clamp((r-.4)*1.5,0.,1.));
gl_FragColor=vec4(1.-exp(-col*1.4),1.);}`;
    const start = () => {
      const gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' });
      if (!gl) return;
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (!/[?&]fx=1/.test(location.search) && /swiftshader|llvmpipe|software|basic render/i.test(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '')) { const l = gl.getExtension('WEBGL_lose_context'); l && l.loseContext(); return; }
      const sh = (k, s) => { const o = gl.createShader(k); gl.shaderSource(o, s); gl.compileShader(o); return o; };
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}'));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = n => gl.getUniformLocation(pr, n), uR = U('R'), uT = U('T'), uP = U('P'), uH = U('H'), uA = U('A');
      const size = () => { const k = Math.min(1, 1400 / Math.max(1, cv.clientWidth)), w = Math.round(cv.clientWidth * k), h = Math.round(cv.clientHeight * k); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); } };
      const tp = { x: .5, y: .6 }, cp = { x: .5, y: .6 }; let th = 0, ch = 0, tt = 0;
      const move = e => { const b = sky.getBoundingClientRect(); tp.x = (e.clientX - b.left) / b.width; tp.y = 1 - (e.clientY - b.top) / b.height; th = 1; if (e.pointerType !== 'mouse') { clearTimeout(tt); tt = setTimeout(() => { th = 0; }, 1400); } };
      sky.addEventListener('pointermove', move, { passive: true });
      sky.addEventListener('pointerdown', move, { passive: true });
      sky.addEventListener('pointerleave', () => { th = 0; }, { passive: true });
      let vis = true, raf = 0, t0 = performance.now(), last = 0, first = true;
      const frame = now => {
        raf = 0; if (!vis || d.hidden || root.classList.contains('paused')) return;
        raf = requestAnimationFrame(frame);
        if (now - last < 30) return; last = now;
        size();
        cp.x += (tp.x - cp.x) * .06; cp.y += (tp.y - cp.y) * .06; ch += (th - ch) * .05;
        const arc = sky.clientHeight ? 1 - parseFloat(getComputedStyle(sky).getPropertyValue('--arc')) / sky.clientHeight : .45;
        gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (now - t0) / 1000);
        gl.uniform2f(uP, cp.x, cp.y); gl.uniform1f(uH, ch); gl.uniform1f(uA, arc);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (first) { first = false; cv.classList.add('on'); }
      };
      const go = () => { if (!raf && vis && !d.hidden) raf = requestAnimationFrame(frame); };
      new IntersectionObserver(es => { vis = es[0].isIntersecting; go(); }).observe(sky);
      d.addEventListener('visibilitychange', go);
      d.querySelectorAll('.pause-btn').forEach(x => x.addEventListener('click', go));
      cv.addEventListener('webglcontextlost', e => { e.preventDefault(); vis = false; });
      go();
    };
    const later = () => (window.requestIdleCallback || setTimeout)(start, { timeout: 2000 });
    if (d.readyState === 'complete') later(); else addEventListener('load', later, { once: true });
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

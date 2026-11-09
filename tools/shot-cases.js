const p=require('puppeteer-core');(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const w of [1440,1000,390]){const pg=await b.newPage();await pg.setViewport({width:w,height:900});await pg.goto('http://localhost:8081/',{waitUntil:'networkidle0'});
await pg.evaluate(()=>{document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.getElementById('case-studies').scrollIntoView()});
await pg.evaluate(()=>Promise.all([...document.querySelectorAll('#case-studies img')].map(i=>{i.loading='eager';return i.decode().catch(()=>0)})));
const r=await pg.evaluate(()=>{const s=document.getElementById('case-studies');const cs=getComputedStyle(s);const cols=getComputedStyle(s.querySelector('.case-grid')).gridTemplateColumns;return {h:s.offsetHeight,pad:parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom),cols,tools:document.querySelector('.tools').offsetHeight,btn:document.querySelectorAll('.rail-btn').length,ovf:document.documentElement.scrollWidth}});
console.log(w,JSON.stringify(r));const el=await pg.$('#case-studies');await el.screenshot({path:`/tmp/claude-0/-home-claude/971ee09d-bc15-5d04-b952-6202658d2556/scratchpad/cases-${w}.png`});}
await b.close()})();

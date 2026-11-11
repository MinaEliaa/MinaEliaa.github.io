const p=require('puppeteer-core');const S='/tmp/claude-0/-home-claude/971ee09d-bc15-5d04-b952-6202658d2556/scratchpad/';
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.setViewport({width:1440,height:900});
await pg.goto('http://localhost:8090/',{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,2500));await pg.screenshot({path:S+'st3-hero.png'});
await (await pg.$('.story.a')).click();await new Promise(r=>setTimeout(r,500));await pg.screenshot({path:S+'st3-intro.png'});
await new Promise(r=>setTimeout(r,1800));
const st=()=>pg.evaluate(()=>({title:document.getElementById('sv-title').textContent,av:document.getElementById('sv-av').getAttribute('src'),introOn:getComputedStyle(document.getElementById('sv-intro')).visibility}));
const r={a:await st()};await pg.screenshot({path:S+'st3-after.png'});
for(let i=0;i<3;i++){await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,400));}
r.b=await st();await new Promise(r=>setTimeout(r,300));await pg.screenshot({path:S+'st3-mem.png'});
console.log(JSON.stringify(r),errs);await b.close()})();

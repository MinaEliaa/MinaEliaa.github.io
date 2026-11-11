const p=require('puppeteer-core');const S='/tmp/claude-0/-home-claude/971ee09d-bc15-5d04-b952-6202658d2556/scratchpad/';
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.setViewport({width:1440,height:900});
await pg.goto('http://localhost:8090/',{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,2500));await pg.screenshot({path:S+'st4-hero.png'});
await (await pg.$('.story.b')).click();await new Promise(r=>setTimeout(r,2200));
const out=[];for(let i=0;i<5;i++){out.push(await pg.evaluate(()=>document.getElementById('sv-live').textContent+' | '+document.querySelector('#sv-media video.cur').src.split('/').pop()+' | bars '+document.querySelectorAll('#sv-bars i').length));await pg.screenshot({path:S+`st4-m${i+1}.png`});await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,600));}
console.log(out.join('\n'),errs);await b.close()})();

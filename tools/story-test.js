const p=require('puppeteer-core');const S='/tmp/claude-0/-home-claude/971ee09d-bc15-5d04-b952-6202658d2556/scratchpad/';
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
for (const [w,h] of [[1440,900],[1150,800],[390,844]]) {
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await pg.setViewport({width:w,height:h,hasTouch:w<500,isMobile:w<500});
await pg.goto('http://localhost:8090/',{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,3000));
await pg.screenshot({path:S+`site-${w}.png`});
const bb=await (await pg.$('.story.a')).boundingBox();
const r={};console.log("loaded",w);
if(w>500){ // mouse drag
 await pg.mouse.move(bb.x+bb.width/2,bb.y+150);await pg.mouse.down();for(let i=1;i<=10;i++){await pg.mouse.move(bb.x+bb.width/2+i*20,bb.y+150+i*5);await new Promise(r=>setTimeout(r,16));}await pg.mouse.up();
 await new Promise(r=>setTimeout(r,300));
 r.afterDrag=await pg.evaluate(()=>({tr:document.querySelector('.story.a').style.translate,svHidden:document.getElementById('sv').hidden}));
}
// open via click
await (await pg.$('.story.b')).click();await new Promise(r=>setTimeout(r,1200));
r.open=await pg.evaluate(()=>({hidden:document.getElementById('sv').hidden,place:document.getElementById('sv-place').textContent,live:document.getElementById('sv-live').textContent,focus:document.activeElement.id,cur:document.querySelector('#sv-media video.cur').src.split('/').pop(),playing:!document.querySelector('#sv-media video.cur').paused}));
await pg.screenshot({path:S+`site-${w}-viewer.png`});
const cb=await (await pg.$('#sv-card')).boundingBox();
// tap right -> next
await pg.mouse.click(cb.x+cb.width*.8,cb.y+cb.height/2);await new Promise(r=>setTimeout(r,500));
r.next=await pg.evaluate(()=>document.getElementById('sv-live').textContent);
// tap left -> prev
await pg.mouse.click(cb.x+cb.width*.1,cb.y+cb.height/2);await new Promise(r=>setTimeout(r,500));
r.prev=await pg.evaluate(()=>document.getElementById('sv-live').textContent);
// hold -> pause
await pg.mouse.move(cb.x+cb.width*.6,cb.y+cb.height/2);await pg.mouse.down();await new Promise(r=>setTimeout(r,600));
r.holdPaused=await pg.evaluate(()=>document.querySelector('#sv-media video.cur').paused && document.getElementById('sv').classList.contains('held'));
await pg.mouse.up();await new Promise(r=>setTimeout(r,300));
r.afterHold=await pg.evaluate(()=>({paused:document.querySelector('#sv-media video.cur').paused,live:document.getElementById('sv-live').textContent}));
// keys: right twice → crosses to card a story 2? (b1 -> b2 -> end closes)
await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,300));
r.key1=await pg.evaluate(()=>document.getElementById('sv-live').textContent);
await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,500));
r.endClosed=await pg.evaluate(()=>document.getElementById('sv').hidden);
// open a, go to a2 then next → b1 (cross-card)
await (await pg.$('.story.a')).click();await new Promise(r=>setTimeout(r,600));
await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,300));
r.cross=await pg.evaluate(()=>document.getElementById('sv-live').textContent);
await pg.keyboard.press('ArrowLeft');await new Promise(r=>setTimeout(r,300));
r.crossBack=await pg.evaluate(()=>document.getElementById('sv-live').textContent);
await pg.keyboard.press('Escape');await new Promise(r=>setTimeout(r,500));
r.esc=await pg.evaluate(()=>({hidden:document.getElementById('sv').hidden,focus:document.activeElement.className}));
console.log(w,JSON.stringify(r),errs);await pg.close();}
await b.close()})();

const p=require('puppeteer-core');(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage();await pg.setViewport({width:1440,height:900});
await pg.evaluateOnNewDocument(()=>{const AC=window.AudioContext;window.__ctx=[];window.__src=[];window.AudioContext=function(){const c=new AC();__ctx.push(c);const cb=c.createBufferSource.bind(c);c.createBufferSource=()=>{const n=cb();__src.push(n);return n;};return c;};});
await pg.goto('http://localhost:8090/',{waitUntil:'networkidle0'});
const st=()=>pg.evaluate(()=>({ctx:__ctx.map(c=>c.state+' t='+c.currentTime.toFixed(1)),nodes:__src.map(n=>(n.buffer&&n.buffer.duration.toFixed(1))+' loop='+n.loop),live:document.getElementById('sv-live').textContent}));
await (await pg.$('.story.a')).click();await new Promise(r=>setTimeout(r,3000));console.log('places',JSON.stringify(await st()));
await (await pg.$('#sv-pause')).click();await new Promise(r=>setTimeout(r,800));console.log('paused',JSON.stringify(await st()));
await (await pg.$('#sv-pause')).click();await new Promise(r=>setTimeout(r,800));
for(let i=0;i<3;i++){await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,300));}
await new Promise(r=>setTimeout(r,2500));console.log('memories',JSON.stringify(await st()));
await pg.keyboard.press('Escape');await new Promise(r=>setTimeout(r,800));console.log('closed',JSON.stringify(await st()));
await b.close()})();

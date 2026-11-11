const p=require('puppeteer-core');(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage();await pg.setViewport({width:1440,height:900});
await pg.evaluateOnNewDocument(()=>{const A=window.Audio;window.__au=[];window.Audio=function(s){const a=new A(s);__au.push(a);['ended','pause','play','emptied','error'].forEach(n=>a.addEventListener(n,()=>(window.__ev=window.__ev||[]).push(n+'@'+a.currentTime.toFixed(1))));return a;};});
await pg.goto('https://minaeliaa.github.io/?nc='+Date.now(),{waitUntil:'networkidle0'});
await (await pg.$('.story.a')).click();
for(let t=0;t<11;t++){await new Promise(r=>setTimeout(r,10000));console.log((t+1)*10+'s',JSON.stringify(await pg.evaluate(()=>({au:__au.map(a=>[a.src.split('/').pop(),a.paused,+a.currentTime.toFixed(1),a.loop]),ev:(window.__ev||[]).slice(-4),live:document.getElementById('sv-live').textContent,hidden:document.getElementById('sv').hidden}))));}
await b.close()})();

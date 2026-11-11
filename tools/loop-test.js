const p=require('puppeteer-core');(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage();await pg.setViewport({width:1440,height:900});await pg.goto('http://localhost:8090/',{waitUntil:'networkidle0'});
await pg.evaluate(()=>{const A=window.Audio;window.__au=[];window.Audio=function(s){const a=new A(s);__au.push(a);return a;};});
await (await pg.$('.story.a')).click();await new Promise(r=>setTimeout(r,1500));
await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');await new Promise(r=>setTimeout(r,800));
console.log('on last:',await pg.evaluate(()=>document.getElementById('sv-live').textContent));
await pg.evaluate(()=>{const v=document.querySelector('#sv-media video.cur');v.currentTime=v.duration-0.3;});await new Promise(r=>setTimeout(r,2000));
console.log('after end:',await pg.evaluate(()=>[document.getElementById('sv-live').textContent,document.getElementById('sv').hidden,__au.length,__au[0].paused]));await b.close()})();

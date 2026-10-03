import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),extension=path.join(root,'dist/claude-china');
await fs.mkdir('evidence',{recursive:true});
const ctx=await chromium.launchPersistentContext(path.join(root,'.test-profile'),{headless:true,channel:'chromium',viewport:{width:400,height:600},locale:'en-US',timezoneId:'America/Los_Angeles',args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
const report={at:new Date().toISOString(),browser:ctx.browser()?.version(),checks:[],errors:[]};
const check=(name)=>{report.checks.push(name);console.log('PASS',name)};
try{
 const manager=await ctx.newPage();await manager.goto('chrome://extensions');
 const extensions=await manager.evaluate(()=>document.querySelector('extensions-manager').extensions_);
 const installed=extensions.find(e=>e.name.startsWith('Claude China'));
 assert.ok(installed,'unpacked production extension was loaded');report.extensionId=installed.id;check('Production Manifest V3 extension actually installed in Chromium');
 const url=`chrome-extension://${installed.id}/popup.html`;
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.evaluate(()=>chrome.storage.local.clear());await page.reload();
 let externalRequests=0;page.on('request',r=>{if(r.url().startsWith('https://'))externalRequests++});
 assert.ok(await page.locator('#intro h1').isVisible());assert.equal(await page.locator('#rtc').isChecked(),false);assert.equal(externalRequests,0);assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
 await page.waitForFunction(()=>document.querySelector('.home-character')?.complete);assert.equal(await page.locator('.home-character').evaluate(i=>i.naturalWidth>0),true);assert.equal(await page.locator('.ring-value').innerText(),'—');
 assert.equal(await page.locator('#brand-name').innerText(),'Claude China');
 assert.equal(await page.locator('.observation-card').getAttribute('data-motion'),'idle');
 assert.ok((await page.locator('.home-character').getAttribute('src')).endsWith('observer-idle.png'));
 assert.equal(await page.locator('.mascot').evaluate(e=>getComputedStyle(e).animationIterationCount),'2');
 await page.screenshot({path:'evidence/first-run-zh-light.png'});await page.locator('#en').click();check('First run is Chinese-first and local only; original artwork loads; ring is a state, not a score; WebRTC defaults off');
 await page.screenshot({path:'evidence/first-run-en-light.png'});
 const dimensions=await page.evaluate(()=>({width:document.body.getBoundingClientRect().width,height:document.body.getBoundingClientRect().height,overflow:document.body.scrollWidth>document.body.clientWidth}));assert.deepEqual(dimensions,{width:400,height:600,overflow:false});check('Actual document is 400 × 600, with a dedicated scroll area');
 async function axe(name){const result=await new AxeBuilder({page}).analyze();assert.deepEqual(result.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)})),[],name);check(`Accessibility automated audit: ${name}`)}
 await axe('first run');
 const good={success:true,ip:'8.8.8.8',country_code:'US',asn:15169,organization_name:'Example Network',timezone:'America/Los_Angeles'};
 let response=good,mode='ok';
 await page.route('https://get.geojs.io/**',async route=>{if(mode==='abort')return route.abort('failed');if(mode==='delayed')await new Promise(resolve=>setTimeout(resolve,2000));if(mode==='timeout') {await new Promise(resolve=>setTimeout(resolve,9000));return route.abort().catch(()=>{});}return route.fulfill({status:mode==='429'?429:200,contentType:'application/json',body:JSON.stringify(response)})});
 await page.addInitScript(()=>{
   window.__rtcMode='match';
   window.RTCPeerConnection=class {
     createDataChannel(){}async createOffer(){return {type:'offer',sdp:''}}close(){window.__rtcClosed=(window.__rtcClosed||0)+1}
     async setLocalDescription(){
       const mode=window.__rtcMode;
       if(mode==='timeout')return;
       if(mode!=='none')for(const address of mode==='mixed'?['8.8.8.8','2001:4860::1']:mode==='different'?['1.1.1.1']:['8.8.8.8'])this.onicecandidate?.({candidate:{address,type:'srflx'}});
       this.onicecandidate?.({candidate:{address:'abc.local',type:'host'}});
       this.onicecandidate?.({candidate:null});
     }
   };
 });
 await page.reload();
 mode='delayed';await page.locator('#check').click();
 assert.equal(await page.locator('#intro .observation-card').getAttribute('data-motion'),'checking');
 await page.waitForFunction(()=>document.querySelector('#intro .home-character')?.complete);
 const transform=await page.locator('#intro .ring-arc').evaluate(e=>getComputedStyle(e).transform);
 await page.waitForTimeout(100);
 assert.notEqual(await page.locator('#intro .ring-arc').evaluate(e=>getComputedStyle(e).transform),transform);
 await page.screenshot({path:'evidence/checking-en-light.png'});
 check('Loading mascot and indeterminate ring animate during the actual pending request');
 await axe('loading observation');
 await page.locator('#results').waitFor({state:'visible'});mode='ok';
 assert.ok((await page.locator('#results h1').innerText()).includes('Selected observations complete'));
 assert.equal(await page.locator('#results .observation-card').getAttribute('data-motion'),'done');
 assert.equal(await page.locator('#results .ring-value').innerText(),'✓');
 assert.ok((await page.locator('#results .home-character').getAttribute('src')).endsWith('observer-done.png'));
 check('Completed check acknowledges observations without a risk score');
 assert.equal(await page.evaluate(()=>window.__rtcClosed||0),0);check('WebRTC opt-out is not a failed check and creates no peer connection');
 await page.locator('#check:not([disabled])').waitFor();
 if(!await page.locator('#options').evaluate(e=>e.open))await page.locator('#options-title').click();
 await page.locator('#rtc').check();
 await page.locator('#check').click();await page.locator('#results').waitFor({state:'visible'});
 assert.ok((await page.locator('#results').innerText()).includes('Timezone identifiers agree'));
 assert.ok((await page.locator('#results').innerText()).includes('No conflicting public WebRTC candidate detected'));check('Same timezone + same public candidate produces only completed-comparison agreement');
 const storage=await page.evaluate(()=>chrome.storage.local.get(null));assert.ok(!JSON.stringify(storage).includes('8.8.8.8'));assert.ok(!JSON.stringify(storage).includes('abc.local'));check('Persistence audit: no IP, candidate address, or mDNS hostname saved');
 await page.locator('#check:not([disabled])').waitFor();await page.screenshot({path:'evidence/result-en-light.png'});await axe('completed light result');
 await page.locator('#content').evaluate(e=>{e.scrollTop=[...e.querySelectorAll('.card')].find(c=>c.querySelector('h2')?.textContent==='Network').offsetTop-e.offsetTop});
 await page.screenshot({path:'evidence/network-browser-en-light.png'});await page.locator('#content').evaluate(e=>e.scrollTop=0);
 await page.locator('#zh').click();await page.locator('#content').evaluate(e=>{e.scrollTop=[...e.querySelectorAll('.card')].find(c=>c.querySelector('h2')?.textContent==='网络').offsetTop-e.offsetTop});await page.screenshot({path:'evidence/network-browser-zh-light.png'});await page.locator('#en').click();await page.locator('#content').evaluate(e=>e.scrollTop=0);
 async function run(){await page.locator('#check:not([disabled])').waitFor();await page.locator('#check').click();await page.locator('#results').waitFor({state:'visible'});}
 response={...good,country_code:'JP',asn:2516,organization_name:'Example Japan',timezone:'Asia/Tokyo'};await page.evaluate(()=>window.__rtcMode='different');await run();
 let text=await page.locator('#results').innerText();assert.ok(text.includes('2 environment differences detected'));assert.ok(text.includes('details changed'));check('Second manual check reports timezone, public-candidate and saved-field changes');
 await page.locator('#check:not([disabled])').waitFor();await page.locator('#content').evaluate(e=>e.scrollTop=e.scrollHeight);assert.ok(await page.locator('#options-title').isVisible());await page.screenshot({path:'evidence/history-en-light.png'});
 await page.locator('#content').evaluate(e=>{e.scrollTop=[...e.querySelectorAll('.card')].find(c=>c.querySelector('h2')?.textContent==='Claude Availability').offsetTop-e.offsetTop});
 await page.screenshot({path:'evidence/availability-history-en-light.png'});check('Scroll reaches history and check options; footer remains visible');
 await page.locator('#zh').click();await page.locator('#content').evaluate(e=>{e.scrollTop=[...e.querySelectorAll('.card')].find(c=>c.querySelector('h2')?.textContent==='Claude 地区信息').offsetTop-e.offsetTop});await page.screenshot({path:'evidence/availability-history-zh-light.png'});await page.locator('#en').click();
 await page.locator('#content').evaluate(e=>e.scrollTop=0);await page.locator('#zh').click();assert.ok((await page.locator('#results').innerText()).includes('发现 2 项环境差异'));await page.screenshot({path:'evidence/result-zh-light.png'});await axe('Chinese light result');check('Chinese interface works');
 await page.locator('#theme').click();await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.screenshot({path:'evidence/result-zh-dark.png'});await axe('Chinese dark result');check('Manual dark theme works');
 await page.locator('#en').click();await page.evaluate(()=>window.__rtcMode='none');await run();text=await page.locator('#results').innerText();assert.ok(text.includes('WebRTC comparison inconclusive'));assert.ok(!text.includes('No conflicting public WebRTC candidate detected'));check('No public candidate is inconclusive, never agreement');
 await page.evaluate(()=>window.__rtcMode='mixed');await run();assert.ok((await page.locator('#results').innerText()).includes('WebRTC comparison inconclusive'));check('Dual-family candidates remain inconclusive when HTTP observed only IPv4');
 mode='abort';await run();text=await page.locator('#results').innerText();assert.ok(text.includes('Network query unavailable'));assert.ok(text.includes('Timezone comparison unavailable'));assert.ok(text.includes('Unable to determine'));await page.screenshot({path:'evidence/network-failure-en-dark.png'});check('Network failure leaves region, timezone and HTTP comparisons unavailable/inconclusive');
 assert.equal(await page.locator('#results .observation-card').getAttribute('data-motion'),'unknown');assert.equal(await page.locator('#results .ring-value').innerText(),'?');
 mode='timeout';await run();assert.ok((await page.locator('#results').innerText()).includes('The observation timed out'));check('Real 8-second fetch deadline produces timeout UI');
 mode='ok';response=good;await page.evaluate(()=>window.__rtcMode='timeout');await run();assert.ok((await page.locator('#results').innerText()).includes('WebRTC comparison inconclusive'));check('Real 6.5-second ICE timeout cannot become a success');
 // Verify cancellation leaves the prior stored summary.
 const before=await page.evaluate(()=>chrome.storage.local.get('snapshot'));await page.locator('#check:not([disabled])').waitFor();await page.locator('#check').click();await page.locator('#cancel').click();await page.locator('#cancel').waitFor({state:'hidden'});assert.deepEqual(await page.evaluate(()=>chrome.storage.local.get('snapshot')),before);check('Cancellation cleans up and keeps the previous saved summary');
 await page.locator('#content').evaluate(e=>e.scrollTop=e.scrollHeight);if(!await page.locator('#options').evaluate(e=>e.open))await page.locator('#options-title').click();await page.locator('#clear').click();assert.deepEqual(await page.evaluate(()=>chrome.storage.local.get(null)),{});check('Clear local data deletes history and preferences');
 await page.reload();await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await axe('system dark first run, reduced motion');await page.screenshot({path:'evidence/first-run-zh-dark.png'});
 assert.ok(await page.locator('.observation-card').evaluate(e=>[e,...e.querySelectorAll('.mascot,.ring-arc,.sleep-mark')].every(n=>getComputedStyle(n).animationName==='none')));
 mode='delayed';await page.locator('#check').click();assert.equal(await page.locator('#intro .ring-arc').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.locator('#intro .mascot').evaluate(e=>getComputedStyle(e).animationName),'none');await page.locator('#cancel').click();await page.locator('#cancel').waitFor({state:'hidden'});mode='ok';
 check('Reduced motion disables both idle and active animation; cancel returns to idle');
 const policy=await ctx.newPage();await policy.goto(url.replace('popup.html','privacy.html'));
 assert.equal(await policy.locator('a[href="mailto:jackmac2077@gmail.com"]').count(),2);
 assert.equal(await page.locator('#support-link').getAttribute('href'),'mailto:jackmac2077@gmail.com');
 for(const colorScheme of ['light','dark']) {await policy.emulateMedia({colorScheme});assert.deepEqual((await new AxeBuilder({page:policy}).analyze()).violations.map(v=>v.id),[]);}
 await policy.close();check('Packaged bilingual privacy page: semantic language markup and light/dark accessibility audits');
 assert.deepEqual(errors,[]);check('No uncaught UI errors');report.externalRequests=externalRequests;report.pass=true;
 await manager.close();await page.close();
} catch(error){report.pass=false;report.errors.push(error.stack);throw error}
finally{await fs.writeFile('evidence/browser-tests.json',JSON.stringify(report,null,2)+'\n');await ctx.close()}

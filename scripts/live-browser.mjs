import {chromium} from 'playwright';
import path from 'node:path';
const extension=path.resolve('dist/claude-china');
// A native action popup can bypass Playwright context routing/init scripts.
// Enforce offline HTTP at the browser transport level, not just the fixture layer.
const ctx=await chromium.launchPersistentContext(path.resolve(process.argv[2] || '.test-profile-native-offline'),{headless:false,channel:'chromium',locale:'en-US',viewport:null,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`,'--proxy-server=http://127.0.0.1:9','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost']});
// Fixtures cover ordinary extension tabs. Native action popup requests may fail
// instead; they cannot use the real supplier through the offline proxy above.
await ctx.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.origin==='https://get.geojs.io') {
  await new Promise(resolve=>setTimeout(resolve,2000));
  return route.fulfill({contentType:'application/json',body:JSON.stringify({ip:'8.8.8.8',country_code:'US',asn:15169,organization_name:'Illustrative network',timezone:'America/Los_Angeles'})});
 }
 if(url.protocol==='http:'||url.protocol==='https:')return route.abort('blockedbyclient');
 return route.continue();
});
await ctx.addInitScript(()=>{window.RTCPeerConnection=class {constructor(){throw new Error('STUN disabled in local native review');}};});
const page=ctx.pages()[0];await page.goto('chrome://extensions');
const data=await page.evaluate(()=>document.querySelector('extensions-manager').extensions_);
const installed=data.find(e=>e.name.startsWith('Claude China'));
console.log(JSON.stringify({version:ctx.browser()?.version(),extensionId:installed?.id,mode:'offline native review; loopback proxy and DNS guard; do not enable WebRTC'}));
if(!installed)throw Error('Not installed');
await page.evaluate(()=>chrome.developerPrivate.updateExtensionConfiguration({extensionId:document.querySelector('extensions-manager').extensions_.find(e=>e.name.startsWith('Claude China')).id,pinnedToToolbar:true}));
await page.goto('about:blank');
await new Promise(resolve=>ctx.on('close',resolve));

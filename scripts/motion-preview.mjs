// Record the actual packaged popup. Network data is illustrative, not a live route.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
const extension=path.resolve('dist/claude-china');
const context=await chromium.launchPersistentContext(path.resolve('.test-profile-motion'),{headless:true,channel:'chromium',viewport:{width:400,height:600},locale:'zh-CN',timezoneId:'Asia/Shanghai',args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
try {
 const manager=await context.newPage();await manager.goto('chrome://extensions');
 const id=await manager.evaluate(()=>document.querySelector('extensions-manager').extensions_.find(e=>e.name.startsWith('Claude China')).id);
 const clean=await context.newPage();await clean.goto(`chrome-extension://${id}/popup.html`);await clean.evaluate(()=>chrome.storage.local.clear());await clean.close();await manager.close();
 const page=await context.newPage();
 await page.route('https://get.geojs.io/**',async route=>{await new Promise(resolve=>setTimeout(resolve,2800));await route.fulfill({contentType:'application/json',body:JSON.stringify({ip:'8.8.8.8',country_code:'US',asn:15169,organization_name:'Illustrative network',timezone:'Asia/Shanghai'})});});
 await page.goto(`chrome-extension://${id}/popup.html`);
 const framesDirectory=await fs.mkdtemp(path.join(os.tmpdir(),'claude-china-motion-')); 
 let frame=0;
 const frames=async count=>{for(let i=0;i<count;i++){await page.screenshot({path:path.join(framesDirectory,`${String(frame++).padStart(3,'0')}.png`)});await page.waitForTimeout(70);}};
 await frames(20);await page.locator('#check').click();await frames(32);await page.locator('#results').waitFor({state:'visible'});await frames(20);
 execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','8','-i',path.join(framesDirectory,'%03d.png'),'-filter_complex','[0:v]split[x][z];[x]palettegen=max_colors=128[p];[z][p]paletteuse=dither=sierra2_4a','-loop','0','evidence/motion-preview.gif']);
 await fs.rm(framesDirectory,{recursive:true});
 console.log(JSON.stringify({frames:frame,width:400,height:600,networkData:'illustrative',source:'production popup'}));await page.close();
} finally {await context.close();}

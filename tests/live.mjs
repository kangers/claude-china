// Real external services; never store the returned raw IP or candidate addresses.
import {chromium} from 'playwright';
import {createSocket} from 'node:dgram';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const extension=path.resolve('dist/claude-china');const ctx=await chromium.launchPersistentContext(path.resolve('.test-profile-services'),{headless:true,channel:'chromium',viewport:{width:400,height:600},args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
const report={at:new Date().toISOString(),browser:ctx.browser()?.version(),note:'Live default service results are redacted. Loopback STUN is controlled protocol evidence, not external public-path evidence.'};
const server=createSocket('udp4');
try {
 const manager=await ctx.newPage();await manager.goto('chrome://extensions');const id=await manager.evaluate(()=>document.querySelector('extensions-manager').extensions_.find(e=>e.name.startsWith('Claude China')).id);
 const page=await ctx.newPage();await page.goto(`chrome-extension://${id}/popup.html`);
 report.live=await page.evaluate(async()=>{
  const {queryNetwork,observeRTC,browserObservation}=await import('./lib/diagnostics.js');const {compareRTC,compareTimezone}=await import('./lib/compare.js');
  const [network,rtc]=await Promise.all([queryNetwork(),observeRTC({enabled:true})]);const b=browserObservation();
  return {network:{status:network.status,reason:network.reason,family:network.family,country:network.country,asn:network.asn,timezone:network.timezone},browserTimezone:b.timezone,timezoneComparison:compareTimezone(network.timezone,b.timezone),rtc:{status:rtc.status,reason:rtc.reason,publicCount:rtc.candidates.length,families:rtc.candidates.map(c=>c.family)},rtcComparison:compareRTC(network,rtc).state};
 });
 assert.equal(report.live.network.status,'complete','Live HTTPS lookup must actually work');console.log('Live HTTPS lookup succeeded; raw IP redacted.');
 // A real UDP STUN binding response with a deliberately controlled XOR-MAPPED-ADDRESS.
 // This exercises Chrome's actual ICE candidate event API and our production parser/cleanup.
 let bindings=0;
 server.on('message',(request,remote)=>{
  if(request.length<20 || request.readUInt16BE(0)!==1 || request.readUInt32BE(4)!==0x2112a442)return;
  bindings++;const response=Buffer.alloc(32);response.writeUInt16BE(0x0101,0);response.writeUInt16BE(12,2);request.copy(response,4,4,20);
  response.writeUInt16BE(0x0020,20);response.writeUInt16BE(8,22);response[25]=1;response.writeUInt16BE(remote.port^0x2112,26);
  response.writeUInt32BE((0x08080808^0x2112a442)>>>0,28);server.send(response,remote.port,remote.address);
 });
 await new Promise(resolve=>server.bind(0,'127.0.0.1',resolve));const port=server.address().port;
 report.controlledStun=await page.evaluate(async port=>{
  const {observeRTC}=await import('./lib/diagnostics.js');const {compareRTC}=await import('./lib/compare.js');const Native=RTCPeerConnection;
  class LocalSTUN extends Native {constructor(options){super({...options,iceServers:[{urls:`stun:127.0.0.1:${port}`} ]})}}
  const result=await observeRTC({enabled:true,PeerConnection:LocalSTUN});
  return {status:result.status,count:result.candidates.length,hasControlledCandidate:result.candidates.some(c=>c.key==='8.8.8.8'),comparison:compareRTC({ip:'8.8.8.8'},result).state};
 },port);
 report.controlledStun.bindings=bindings;assert.ok(report.controlledStun.hasControlledCandidate);assert.equal(report.controlledStun.comparison,report.controlledStun.status==='complete'?'match':'inconclusive');
 console.log('Real Chrome ICE + loopback STUN binding produced the controlled public candidate; comparison passed.');report.pass=true;
} catch(error){report.pass=false;report.error=error.stack;throw error}finally{server.close();await fs.writeFile('evidence/live-services.json',JSON.stringify(report,null,2)+'\n');await ctx.close()}

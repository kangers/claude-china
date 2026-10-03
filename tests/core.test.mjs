import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIP, publicIP, publicCandidate } from '../extension/lib/ip.js';
import { compareTimezone, compareRTC, compactSnapshot, compareSnapshots, availability } from '../extension/lib/compare.js';
import { normalizeNetwork, queryNetwork, observeRTC } from '../extension/lib/diagnostics.js';
import { validSnapshot } from '../extension/lib/storage.js';
import { messages } from '../extension/lib/i18n.js';
import { regionPolicy } from '../extension/data/regions.js';
const c = (address,type='srflx')=>publicCandidate({address,type});
const rtc = (addresses,status='complete')=>({status,candidates:addresses.map(a=>c(a)).filter(Boolean)});
const now = new Date('2026-10-02T10:00:00Z');
const network = normalizeNetwork({success:true,ip:'8.8.8.8',country_code:'US',asn:15169,organization_name:'Google',timezone:'America/Los_Angeles'});
function result(){ return {at:now.toISOString(),network,browser:{timezone:'Asia/Shanghai',offset:480,language:'zh-CN',languages:['zh-CN','en'],locale:'zh-CN',browser:'Chromium 154',platform:'macOS'},rtc:rtc(['8.8.8.8']),rtcComparison:{state:'match'}}; }
test('strict parsing and IPv6 equality including IPv4-mapped addresses',()=>{
 assert.equal(parseIP('2001:4860:4860::8888').key,parseIP('2001:4860:4860:0:0:0:0:8888').key);
 assert.equal(parseIP('::ffff:8.8.8.8').key,'8.8.8.8');
 for(const x of ['08.8.8.8','256.1.1.1',':::',':1','1::2::3','2001:zz::1','1:2:3:4:5:6:7:8:9','fe80::1%en0','host.local','8.8.8.8/24',''])assert.equal(parseIP(x),null,x);
});
test('special-use addresses are never evidence of public conflict',()=>{
 for(const x of ['0.0.0.0','10.1.1.1','127.0.0.1','100.64.0.1','100.127.255.254','169.254.10.2','172.31.1.1','192.168.1.1','192.0.2.1','192.0.0.1','198.18.0.1','198.51.100.1','203.0.113.2','224.0.0.1','255.255.255.255','::1','fc00::1','fe80::1','ff02::1','2001:db8::1','2001:0:1234::1','2002:1234::1','3fff::1','64:ff9b::808:808']) assert.equal(publicIP(x),null,x);
 for(const x of ['8.8.8.8','1.1.1.1','100.128.0.1','2001:4860:4860::8888','2606:4700:4700::1111'])assert.ok(publicIP(x),x);
 assert.equal(c('8.8.8.8','relay'),null);assert.equal(c('abcd.local','host'),null);
});
test('timezone aliases agree; different zones with equal offsets do not',()=>{
 assert.equal(compareTimezone('Asia/Calcutta','Asia/Kolkata'),'match'); assert.equal(compareTimezone('US/Pacific','America/Los_Angeles'),'match');
 assert.equal(compareTimezone('Etc/UTC','UTC'),'match');assert.equal(compareTimezone('Europe/Paris','Europe/Berlin'),'different');
 assert.equal(compareTimezone('america/los_angeles','America/Los_Angeles'),'match');assert.equal(compareTimezone('Europe/Kyiv','Europe/Kiev'),'match');
 assert.equal(compareTimezone(null,'UTC'),'unavailable');assert.equal(compareTimezone('invalid','UTC'),'unavailable');
});
test('WebRTC outcomes are evidence-sensitive',()=>{
 assert.equal(compareRTC(network,rtc(['8.8.8.8'])).state,'match');
 assert.equal(compareRTC(network,rtc(['1.1.1.1'])).state,'different');
 for(const r of [rtc([]),rtc(['2001:4860::1']),rtc(['8.8.8.8','2001:4860::1']),rtc(['8.8.8.8'],'timeout')])assert.equal(compareRTC(network,r).state,'inconclusive');
 assert.equal(compareRTC({},rtc(['8.8.8.8'])).state,'inconclusive');assert.equal(compareRTC(network,rtc([],'unavailable')).state,'unavailable');
 assert.equal(compareRTC(network,rtc([],'skipped')).state,'skipped');assert.equal(compareRTC(network,rtc(['1.1.1.1'],'timeout')).state,'different');
 assert.equal(compareRTC({ip:'2001:4860:4860::8888'},rtc(['2001:4860:4860:0:0:0:0:8888'])).state,'match');
});
test('Claude.ai snapshot mapping, freshness, and subnational exceptions',()=>{
 assert.equal(regionPolicy.codes.length,185);assert.equal(new Set(regionPolicy.codes).size,185);
 for(const code of ['US','TW','JP','DE','AL','PS'])assert.equal(availability(code,now),'listed');
 for(const code of ['CN','HK','MO','RU','IR','KP'])assert.equal(availability(code,now),'notListed');
 assert.equal(availability('UA',now),'qualified');assert.equal(availability(null,now),'unknown');assert.equal(availability('ZZ',now),'unknown');
 assert.equal(availability('US',new Date('2027-02-01')),'stale');
});
test('history contains no raw addresses or hashes and records actual field changes',()=>{
 const a=compactSnapshot(result());const b=structuredClone(a);b.network.country='JP';b.network.asn=2516;
 assert.equal(JSON.stringify(a).includes('8.8.8.8'),false);assert.equal(compareSnapshots(a,b).changes.length,2);
 assert.equal(compareSnapshots(a,a).changes.length,0);assert.equal(compareSnapshots(null,a),null);
 b.network.timezone=null;assert.ok(compareSnapshots(a,b).unknown.includes('network.timezone'));
 b.rtc.status='timeout';b.rtc.publicCount=0;assert.ok(!compareSnapshots(a,b).changes.some(x=>x.key==='rtc.publicCount'));
 assert.ok(validSnapshot(a,now.getTime()));assert.equal(validSnapshot({...a,ip:'8.8.8.8'},now.getTime()),false);
 assert.equal(validSnapshot(a,now.getTime()+31*86400000),false);
 for (const [group,key,value] of [['network','country',42],['network','asn','15169'],['browser','offset','480'],['rtc','families',[4]],['rtc','publicCount',-1],['network','organization','bad\u0000text']]) {
   const corrupt=structuredClone(a);corrupt[group][key]=value;assert.equal(validSnapshot(corrupt,now.getTime()),false,`${group}.${key}`);
 }
 const corrupt=structuredClone(a);corrupt.rtc.status='timeout';assert.equal(validSnapshot(corrupt,now.getTime()),false,'an unfinished observation cannot be stored as a match');
});
test('network adapter handles malformed/partial/rate limit responses and omits credentials',async()=>{
 assert.throws(()=>normalizeNetwork({success:false}));assert.throws(()=>normalizeNetwork({success:true,ip:'192.168.1.1'}));
 const partial=normalizeNetwork({success:true,ip:'1.1.1.1'});assert.equal(partial.country,null);
 let options;
 const r=await queryNetwork({fetcher:async(url,o)=>{options=o;return new Response(JSON.stringify({success:true,ip:'1.1.1.1'}));}});
 assert.equal(r.status,'complete');assert.equal(options.credentials,'omit');assert.equal(options.redirect,'error');assert.equal(options.referrerPolicy,'no-referrer');
 assert.equal((await queryNetwork({fetcher:async()=>new Response('',{status:429})})).reason,'rateLimit');
 assert.equal((await queryNetwork({fetcher:async()=>new Response('oops')})).reason,'invalid');
 assert.equal((await queryNetwork({fetcher:async()=>{throw Error('fetch failure')}})).reason,'offline');
 assert.equal((await queryNetwork({timeout:5,fetcher:(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('aborted'))))})).reason,'timeout');
});
test('WebRTC cleans up on complete, timeout, cancellation and errors',async()=>{
 let closes=0;
 class Fake {createDataChannel(){} async createOffer(){return {}} async setLocalDescription(){this.onicecandidate({candidate:{address:'8.8.8.8',type:'srflx'}});this.onicecandidate({candidate:null})} close(){closes++}}
 assert.equal((await observeRTC({enabled:true,PeerConnection:Fake})).status,'complete');assert.equal(closes,1);
 class Hung extends Fake { async setLocalDescription(){} }
 assert.equal((await observeRTC({enabled:true,timeout:5,PeerConnection:Hung})).status,'timeout');assert.equal(closes,2);
 const controller=new AbortController();const p=observeRTC({enabled:true,signal:controller.signal,PeerConnection:Hung});controller.abort();assert.equal((await p).reason,'cancelled');assert.equal(closes,3);
 assert.equal((await observeRTC({enabled:false,PeerConnection:Fake})).status,'skipped');assert.equal(closes,3);
});
test('translations have identical key sets',()=>assert.deepEqual(Object.keys(messages.zh).sort(),Object.keys(messages.en).sort()));

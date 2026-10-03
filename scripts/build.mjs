import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');
const md = await fs.readFile('PRIVACY_POLICY.md','utf8');
const inline = s => escape(s).replace(/\[([^\]]+)\]\(((?:https:\/\/|mailto:)[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
let contentLanguage='en';
const body=md.trim().split('\n\n').map(s => {
  if(s.startsWith('## ')) contentLanguage=s.includes('English')?'en':'zh-CN';
  return s.startsWith('# ') ? `<h1>${inline(s.slice(2))}</h1>` : s.startsWith('## ') ? `<h2 lang="${contentLanguage}" id="${contentLanguage==='en'?'english':'chinese'}">${inline(s.slice(3))}</h2>` : `<p lang="${contentLanguage}">${inline(s)}</p>`;
}).join('\n');
await fs.writeFile('extension/privacy.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Claude China · Privacy</title><link rel="stylesheet" href="privacy.css"></head><body><nav aria-label="Policy language"><a href="#english">English</a><a href="#chinese" lang="zh-CN">简体中文</a></nav><main>${body}</main></body></html>`);
// Keep the public policy identical to the packaged policy for GitHub Pages.
for (const destination of ['publish/privacy','docs/privacy']) {
  await fs.mkdir(destination,{recursive:true});
  await fs.copyFile('extension/privacy.html',`${destination}/index.html`);
  await fs.copyFile('extension/privacy.css',`${destination}/privacy.css`);
}
const manifest=JSON.parse(await fs.readFile('extension/manifest.json','utf8'));
if(manifest.manifest_version!==3 || JSON.stringify(manifest.permissions)!=='["storage"]' || JSON.stringify(manifest.host_permissions)!=='["https://get.geojs.io/*"]') throw Error('Unexpected permissions');
for(const key of ['background','content_scripts','web_accessible_resources','externally_connectable']) if(manifest[key]) throw Error('Unexpected capability: '+key);
const files=await fs.readdir('extension',{recursive:true});
for(const file of files.filter(f=>f.endsWith('.js'))) execFileSync(process.execPath,['--check',path.join('extension',file)]);
for(const locale of ['en','zh_CN']) { const data=JSON.parse(await fs.readFile(`extension/_locales/${locale}/messages.json`)); if(data.extensionDescription.message.length>132) throw Error('Description too long'); }
await fs.rm('dist/claude-china',{recursive:true,force:true});await fs.mkdir('dist',{recursive:true});await fs.cp('extension','dist/claude-china',{recursive:true});
await fs.rm('dist/claude-china-1.0.0-rc3.zip',{force:true});
execFileSync('/usr/bin/zip',['-q','-r','../claude-china-1.0.0-rc3.zip','.'],{cwd:'dist/claude-china'});
const zip=await fs.readFile('dist/claude-china-1.0.0-rc3.zip');await fs.writeFile('dist/SHA256SUMS',`${createHash('sha256').update(zip).digest('hex')}  claude-china-1.0.0-rc3.zip\n`);
console.log(`Production MV3 package: ${zip.length} bytes. No runtime dependencies.`);

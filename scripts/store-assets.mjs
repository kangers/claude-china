import fs from 'node:fs/promises';
import sharp from 'sharp';
const escaped=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const configs=[
 {name:'01-overview-zh',shot:'first-run-zh-light.png',eyebrow:'面向中文用户 · 只读环境检查',title:['使用 Claude 前，','先看清当前环境。'],body:['网络、浏览器，逐项解释。','只在你主动检查时运行。','默认中文，支持 English。'],foot:'真实扩展界面 · 无后台监控'},
 {name:'02-network-browser-zh',shot:'network-browser-zh-light.png',eyebrow:'两个视角，一起看',title:['网络呈现了什么？','浏览器报告了什么？'],body:['公网 IP、地区与网络组织。','时区、语言与浏览器设置。','差异是观察，不是账号风险。'],foot:'真实扩展界面 · 网络数据为示例'},
 {name:'03-history-availability-zh',shot:'availability-history-zh-light.png',eyebrow:'比较 · 解释 · 官方来源',title:['这次有什么变化？','看清每一项细节。'],body:['与上一次主动检查比较。','对照 Claude.ai 官方地区名单。','不保存原始 IP，不做风险评分。'],foot:'真实扩展界面 · 网络数据为示例'},
 {name:'01-overview-en',shot:'first-run-en-light.png',eyebrow:'DETECT · COMPARE · EXPLAIN',title:['Your environment.','A clearer picture.'],body:['Network observations.','Browser settings.','Plain-language explanations.'],foot:'Actual extension UI · Manual checks only'},
 {name:'02-network-browser-en',shot:'network-browser-en-light.png',eyebrow:'TWO PERSPECTIVES',title:['See what your network','and browser report.'],body:['Public IP, region & ASN.','Timezone, language & locale.','Processed locally where possible.'],foot:'Actual extension UI · Illustrative network data'},
 {name:'03-history-availability-en',shot:'availability-history-en-light.png',eyebrow:'COMPARE WITH YOUR LAST CHECK',title:['What changed?','Know the details.'],body:['One previous summary, kept locally.','A dated official Claude.ai region reference.','No account-risk scores.'],foot:'Actual extension UI · Illustrative network data'},
 {name:'04-differences-zh',shot:'result-zh-dark.png',eyebrow:'检测 · 比较 · 解释',title:['看清环境差异，','理解每一项观察。'],body:['网络与浏览器，两个视角。','差异可解释，未知不当作通过。','中文 / English · 浅色 / 深色'],foot:'真实扩展界面 · 网络数据为示例'}
];
for(const config of configs){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#fbf7f0"/><stop offset="1" stop-color="#f2e3d4"/></linearGradient></defs><rect width="1280" height="800" fill="url(#bg)"/><circle cx="1120" cy="200" r="370" fill="none" stroke="#e5d5c3"/><circle cx="1060" cy="210" r="260" fill="none" stroke="#e5d5c3"/><g font-family="Arial, Helvetica, PingFang SC, sans-serif" fill="#302b26"><text x="72" y="98" font-size="28" font-weight="700">Claude China</text><text x="72" y="206" fill="#b65337" font-size="14" font-weight="700" letter-spacing="2">${escaped(config.eyebrow)}</text>${config.title.map((line,i)=>`<text x="72" y="${288+i*62}" font-size="48" font-weight="700" letter-spacing="-1.4">${escaped(line)}</text>`).join('')}${config.body.map((line,i)=>`<text x="74" y="${442+i*40}" font-size="21" fill="#526777">${escaped(line)}</text>`).join('')}<text x="74" y="730" font-size="14" fill="#526777">${escaped(config.foot)}</text></g><rect x="782" y="96" width="400" height="600" rx="12" fill="#ddcbbc"/></svg>`;
 await fs.writeFile(`assets/store/${config.name}.svg`,svg);
 await sharp(Buffer.from(svg)).composite([{input:await fs.readFile(`evidence/${config.shot}`),left:774,top:88}]).removeAlpha().png().toFile(`assets/store/${config.name}.png`);
}
console.log('Seven full-bleed 1280×800 localized store screenshots generated from production UI captures.');

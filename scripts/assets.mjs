import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('extension/images',{recursive:true});
await sharp('assets/artwork/observer-source-v2.png').resize({width:320,withoutEnlargement:true}).png({compressionLevel:9}).toFile('extension/images/observer.png');
for (const state of ['idle','done']) await sharp(`assets/artwork/observer-${state}-source.png`).resize({width:320,withoutEnlargement:true}).png({compressionLevel:9}).toFile(`extension/images/observer-${state}.png`);
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect x="16" y="16" width="96" height="96" rx="24" fill="#b65337"/><g fill="none" stroke-width="6"><circle cx="54" cy="58" r="23" stroke="#ffffff"/><circle cx="73" cy="69" r="23" stroke="#eed1b5"/></g><path d="M49 71a23 23 0 0 0 29-29" fill="none" stroke="#fff" stroke-width="6"/><circle cx="64" cy="63" r="5" fill="#fff"/></svg>`;
await fs.writeFile('extension/icons/mark.svg',mark);
await fs.writeFile('assets/store/icon-source.svg',mark);
// The illustrated avatar is used at every extension icon size. The SVG mark
// remains available as the original vector artwork, not the production icon.
for(const size of [16,32,48,128]) await sharp('assets/artwork/avatar-source.png').resize(size,size).png().toFile(`extension/icons/icon-${size}.png`);
await fs.copyFile('extension/icons/icon-128.png','assets/store/store-icon-128.png');
for(const [name,width,height] of [['promo-small',440,280],['promo-marquee',1400,560]]) {
 const scale=height/280, cx=width/2, cy=height/2;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="#763b2b"/><stop offset="1" stop-color="#b65337"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#b)"/><g transform="translate(${cx} ${cy}) scale(${scale})"><g fill="none" stroke="#edd2b9" stroke-opacity=".35"><ellipse rx="166" ry="65" transform="rotate(-18)"/><ellipse rx="166" ry="65" transform="rotate(18)"/><circle r="106"/></g><rect x="-51" y="-51" width="102" height="102" rx="26" fill="#b65337" stroke="#ebc6ab"/><g fill="none" stroke-width="6"><circle cx="-10" cy="-7" r="24" stroke="#fff"/><circle cx="11" cy="7" r="24" stroke="#eed1b5"/></g><circle r="5" fill="#fff"/><circle cx="-132" cy="-39" r="9" fill="#f9ecdc"/><circle cx="126" cy="41" r="9" fill="#a8e1d4"/></g></svg>`;
 await fs.writeFile(`assets/store/${name}.svg`,svg); await sharp(Buffer.from(svg)).removeAlpha().png().toFile(`assets/store/${name}.png`);
}
console.log('Mascot avatar icons and store PNGs generated.');

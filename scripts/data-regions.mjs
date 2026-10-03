import fs from 'node:fs';
const source=JSON.parse(fs.readFileSync('docs/claude-regions-source.json'));
const codes=JSON.parse(fs.readFileSync('docs/iso3166-codes.json'));
const norm=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll(' and ',' & ');
const dn=new Intl.DisplayNames('en',{type:'region'});const names=new Map(codes.map(c=>[norm(dn.of(c)),c]));
const aliases={'Congo, Democratic Republic of (DRC)':'CD','Congo (Brazzaville)':'CG',"Côte d'Ivoire":'CI','Czechia (Czech Republic)':'CZ','Micronesia':'FM','Palestine':'PS','Türkiye (Turkey)':'TR','Vatican City':'VA','São Tomé and Príncipe':'ST','United States of America':'US','Ukraine (except Crimea, Donetsk, Kherson, Luhansk, and Zaporizhzhia regions)':'UA','Cabo Verde':'CV','Saint Kitts and Nevis':'KN','Saint Lucia':'LC','Saint Vincent and the Grenadines':'VC'};
const regions=source.names.map(n=>{const c=aliases[n]||names.get(norm(n));if(!c)throw Error(n);return c});
fs.writeFileSync('extension/data/regions.js',`// Claude.ai list only; reviewed mapping. Not API eligibility.\nexport const regionPolicy = ${JSON.stringify({source:source.source,verified:source.verified,codes:regions,isoCodes:codes,exceptions:{UA:['Crimea','Donetsk','Kherson','Luhansk','Zaporizhzhia']}},null,2)};\n`);
console.log(regions.length,'Claude.ai regions',new Set(regions).size);

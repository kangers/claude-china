const MAX_AGE = 30 * 86400000;
const recordWithKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === keys.length && Object.keys(value).every(key => keys.includes(key));
const text = (value, max = 300) => typeof value === 'string' && value.length <= max && !/[\u0000-\u001f\u007f]/.test(value);
const nullable = (value, check) => value === null || check(value);
export function validSnapshot(s, now = Date.now()) {
  if (!recordWithKeys(s, ['schema','at','network','browser','rtc']) || s.schema !== 1 || !text(s.at, 40) || !Number.isFinite(Date.parse(s.at)) || now - Date.parse(s.at) > MAX_AGE || Date.parse(s.at) > now + 60000) return false;
  const expected = { network:['status','country','asn','organization','timezone'], browser:['timezone','offset','language','languages','locale','browser','platform'], rtc:['status','publicCount','families','comparison'] };
  if (!Object.entries(expected).every(([group, keys]) => recordWithKeys(s[group], keys))) return false;
  const {network:n, browser:b, rtc:r} = s;
  return ['complete','unavailable'].includes(n.status)
    && nullable(n.country, v => typeof v === 'string' && /^[A-Z]{2}$/.test(v))
    && nullable(n.asn, v => Number.isInteger(v) && v > 0 && v <= 4294967295)
    && nullable(n.organization, v => text(v,120)) && nullable(n.timezone, v => text(v,100))
    && nullable(b.timezone, v => text(v,100)) && Number.isInteger(b.offset) && Math.abs(b.offset) <= 840
    && ['language','languages','locale','browser','platform'].every(key => text(b[key]))
    && ['complete','unavailable','timeout','skipped'].includes(r.status)
    && Number.isInteger(r.publicCount) && r.publicCount >= 0
    && typeof r.families === 'string' && /^(?:4|6|4, 6)?$/.test(r.families)
    && ['match','different','inconclusive','unavailable','skipped'].includes(r.comparison)
    && (r.publicCount === 0 ? r.families === '' : r.families !== '')
    && (r.comparison !== 'match' || r.status === 'complete' && r.publicCount > 0);
}
export async function loadLocal() {
  const stored = await chrome.storage.local.get(['preferences','snapshot']);
  const p = stored.preferences || {};
  const preferences = { lang: ['en','zh'].includes(p.lang) ? p.lang : 'zh', theme: ['system','light','dark'].includes(p.theme) ? p.theme : 'system', rtc: p.rtc === true };
  const snapshot = validSnapshot(stored.snapshot) ? stored.snapshot : null;
  if (stored.snapshot && !snapshot) await chrome.storage.local.remove('snapshot');
  return { preferences, snapshot };
}
export async function savePreferences(preferences) { await chrome.storage.local.set({ preferences: { lang:preferences.lang, theme:preferences.theme, rtc:preferences.rtc } }); }
export async function saveSnapshot(snapshot) { if (!validSnapshot(snapshot)) throw new Error('Invalid snapshot'); await chrome.storage.local.set({ snapshot }); }
export async function clearLocal() { await chrome.storage.local.clear(); }

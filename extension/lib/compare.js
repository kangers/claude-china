import { publicIP } from './ip.js';
import { timezoneLinks } from '../data/timezone-links.js';
import { regionPolicy } from '../data/regions.js';
export function canonicalZone(zone) {
  if (typeof zone !== 'string' || !zone || zone.length > 100) return null;
  // Intl also normalizes accepted case variants before the bundled tzdb aliases.
  try { zone = new Intl.DateTimeFormat('en', { timeZone: zone }).resolvedOptions().timeZone; } catch { return null; }
  const visited = new Set();
  while (timezoneLinks[zone] && !visited.has(zone)) { visited.add(zone); zone = timezoneLinks[zone]; }
  return zone;
}
export function offsetIn(zone, date = new Date()) {
  try { return new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'longOffset' }).formatToParts(date).find(p => p.type === 'timeZoneName').value.replace('GMT', 'UTC'); }
  catch { return null; }
}
export function compareTimezone(network, browser) {
  const a = canonicalZone(network), b = canonicalZone(browser);
  return !a || !b ? 'unavailable' : a === b ? 'match' : 'different';
}
export function compareRTC(network, rtc) {
  if (rtc.status === 'skipped') return { state: 'skipped', unpaired: 0 };
  if (rtc.status === 'unavailable') return { state: 'unavailable', unpaired: 0 };
  const http = publicIP(network?.ip);
  if (!http || !rtc.candidates.length) return { state: 'inconclusive', unpaired: 0 };
  const comparable = rtc.candidates.filter(c => c.family === http.family);
  const unpaired = rtc.candidates.length - comparable.length;
  if (comparable.some(c => c.key !== http.key)) return { state: 'different', unpaired };
  if (!comparable.length || unpaired || rtc.status !== 'complete') return { state: 'inconclusive', unpaired };
  return { state: 'match', unpaired: 0 };
}
export function availability(country, now = new Date()) {
  const age = now.getTime() - Date.parse(regionPolicy.verified + 'T00:00:00Z');
  // Policy snapshot cannot silently become an evergreen claim.
  if (age > 90 * 86400000 || age < -86400000) return 'stale';
  if (!regionPolicy.isoCodes.includes(country)) return 'unknown';
  if (country === 'UA') return 'qualified'; // Subnational exceptions cannot be resolved by country GeoIP.
  return regionPolicy.codes.includes(country) ? 'listed' : 'notListed';
}
export function compactSnapshot(result) {
  return {
    schema: 1, at: result.at,
    network: { status: result.network.status, country: result.network.country ?? null, asn: result.network.asn ?? null,
      organization: result.network.organization ?? null, timezone: canonicalZone(result.network.timezone) },
    browser: { timezone: canonicalZone(result.browser.timezone), offset: result.browser.offset, language: result.browser.language,
      languages: result.browser.languages.join(', '), locale: result.browser.locale, browser: result.browser.browser, platform: result.browser.platform },
    rtc: { status: result.rtc.status, publicCount: result.rtc.candidates.length,
      families: [...new Set(result.rtc.candidates.map(c => c.family))].sort().join(', '), comparison: result.rtcComparison.state }
  };
}
export function compareSnapshots(previous, current) {
  if (!previous) return null;
  const changes = [], unknown = [];
  for (const [group, fields] of Object.entries({ network: ['status','country','asn','organization','timezone'], browser: ['timezone','offset','language','languages','locale','browser','platform'], rtc: ['status','publicCount','families','comparison'] })) {
    for (const field of fields) {
      const before = previous[group]?.[field], after = current[group]?.[field];
      const key = `${group}.${field}`;
      // Non-runs and failed runs don't establish that candidate counts disappeared.
      if (group === 'rtc' && field !== 'status' && (previous.rtc.status !== 'complete' || current.rtc.status !== 'complete')) { unknown.push(key); continue; }
      if (before == null || after == null) { unknown.push(key); continue; }
      if (before !== after) changes.push({ key, before, after });
    }
  }
  return { changes, unknown, at: previous.at };
}

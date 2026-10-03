import { publicIP, publicCandidate } from './ip.js';
export const NETWORK_URL = 'https://get.geojs.io/v1/ip/geo.json';
export const STUN_URL = 'stun:stun.cloudflare.com:3478';
export function browserObservation() {
  const intl = Intl.DateTimeFormat().resolvedOptions();
  const brands = navigator.userAgentData?.brands.filter(b => !/not.?a.?brand/i.test(b.brand));
  const brand = brands?.find(b => b.brand !== 'Chromium') || brands?.[0];
  return { timezone: intl.timeZone || null, offset: -new Date().getTimezoneOffset(), language: navigator.language || '',
    languages: [...navigator.languages], locale: intl.locale, browser: brand ? `${brand.brand} ${brand.version}` : 'Chromium-compatible',
    platform: navigator.userAgentData?.platform || navigator.platform || 'Unknown' };
}
const textField = (value, max = 120) => typeof value === 'string' && value.length <= max && !/[\u0000-\u001f\u007f]/.test(value) ? value : null;
export function normalizeNetwork(data) {
  if (!data || Array.isArray(data) || !publicIP(data.ip)) throw new Error('invalid');
  return { status: 'complete', ip: data.ip, family: publicIP(data.ip).family,
    country: /^[A-Z]{2}$/.test(data.country_code) ? data.country_code : null,
    asn: Number.isInteger(data.asn) && data.asn > 0 && data.asn <= 4294967295 ? data.asn : null,
    organization: textField(data.organization_name), timezone: textField(data.timezone, 100) };
}
export async function queryNetwork({ signal, timeout = 8000, fetcher = fetch } = {}) {
  const controller = new AbortController();
  const cancel = () => controller.abort(); signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) controller.abort();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeout);
  try {
    const res = await fetcher(NETWORK_URL, { signal: controller.signal, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', redirect: 'error' });
    if (res.status === 429) return { status: 'unavailable', reason: 'rateLimit' };
    if (!res.ok) return { status: 'unavailable', reason: 'serviceError' };
    const body = await res.text();
    if (body.length > 16384) throw new Error('invalid');
    return normalizeNetwork(JSON.parse(body));
  } catch (error) {
    return { status: 'unavailable', reason: timedOut ? 'timeout' : signal?.aborted ? 'cancelled' : error.message === 'invalid' || error instanceof SyntaxError ? 'invalid' : 'offline' };
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); }
}
export async function observeRTC({ enabled = false, signal, timeout = 6500, PeerConnection = globalThis.RTCPeerConnection } = {}) {
  if (!enabled) return { status: 'skipped', candidates: [], reason: 'skipped' };
  if (!PeerConnection) return { status: 'unavailable', candidates: [], reason: 'unsupported' };
  return new Promise(resolve => {
    let pc, timer, done = false; const candidates = new Map(); let ignored = 0;
    const finish = (status, reason) => {
      if (done) return; done = true; clearTimeout(timer); signal?.removeEventListener('abort', cancel);
      if (pc) { pc.onicecandidate = null; pc.onicegatheringstatechange = null; pc.close(); }
      resolve({ status, reason, candidates: [...candidates.values()], ignored });
    };
    const cancel = () => finish('unavailable', 'cancelled');
    if (signal?.aborted) { cancel(); return; }
    signal?.addEventListener('abort', cancel, { once: true });
    try {
      pc = new PeerConnection({ iceServers: [{ urls: STUN_URL }], iceCandidatePoolSize: 0 });
      pc.onicecandidate = ({ candidate }) => {
        if (!candidate) { finish('complete', 'gathered'); return; }
        const observed = publicCandidate(candidate);
        if (observed) candidates.set(observed.key, observed); else ignored++;
      };
      pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === 'complete') finish('complete', 'gathered'); };
      timer = setTimeout(() => finish('timeout', 'timeout'), timeout);
      pc.createDataChannel('claude-china-observation');
      pc.createOffer().then(offer => { if (!done) return pc.setLocalDescription(offer); }).catch(() => finish('unavailable', 'rtcError'));
    } catch { finish('unavailable', 'rtcError'); }
  });
}

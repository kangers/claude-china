import { translator } from './lib/i18n.js';
import { browserObservation, queryNetwork, observeRTC } from './lib/diagnostics.js';
import { compareTimezone, compareRTC, compactSnapshot, compareSnapshots, availability } from './lib/compare.js';
import { loadLocal, savePreferences, saveSnapshot, clearLocal } from './lib/storage.js';
import { regionPolicy } from './data/regions.js';
const $ = id => document.getElementById(id);
let preferences = { lang: 'zh', theme: 'system', rtc: false };
let baseline = null, result = null, history = null, storageError = false, running = false, controller, cooldownUntil = 0;
let t = translator(preferences.lang);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = value => escape(value ?? t('unavailable'));
const message = (key, args) => e(t(key,args));
const dateLabel = at => new Intl.DateTimeFormat(preferences.lang === 'zh' ? 'zh-CN' : 'en', { dateStyle:'medium', timeStyle:'short' }).format(new Date(at));
const countryLabel = code => { if (!code) return t('unknown'); try { return `${new Intl.DisplayNames(preferences.lang === 'zh' ? 'zh-CN' : 'en',{type:'region'}).of(code)} · ${code}`; } catch { return code; } };
const offsetLabel = minutes => `UTC${minutes < 0 ? '−' : '+'}${String(Math.floor(Math.abs(minutes)/60)).padStart(2,'0')}:${String(Math.abs(minutes)%60).padStart(2,'0')}`;
function row(key, value, mono = false) { return `<div class="row"><dt>${message(key)}</dt><dd${mono ? ' class="mono"' : ''}>${e(value)}</dd></div>`; }
function stateLine(state, key, args) { return `<p class="state-line" data-state="${state}"><span class="state-dot" aria-hidden="true"></span><span>${message(key,args)}</span></p>`; }
function card(title, index, body) { return `<section class="card"><div class="card-head"><h2>${message(title)}</h2><span class="section-index" aria-hidden="true">${index}</span></div><div class="card-body">${body}</div></section>`; }
function announce(text) { $('announcement').textContent = text; }
// Ring values describe observations; the active arc is indeterminate, never a score.
function observationStage(state, value, label, status, badges = false) {
  const image = state === 'idle' ? 'observer-idle.png' : state === 'done' || state === 'different' ? 'observer-done.png' : 'observer.png';
  return `<section class="home-card observation-card" data-motion="${state}"><div class="home-stage"><div class="mascot" aria-hidden="true"><img class="home-character" src="images/${image}" width="150" height="180" alt="">${state === 'idle' ? '<span class="sleep-mark">z</span><span class="sleep-mark second">z</span>' : ''}</div><div class="home-observation"><div class="observation-ring" aria-hidden="true"><svg class="ring-art" viewBox="0 0 120 120"><circle class="ring-track" cx="60" cy="60" r="52"/><circle class="ring-arc" cx="60" cy="60" r="52"/></svg><span class="ring-value">${e(value)}</span><span class="ring-label">${message(label)}</span></div><p class="home-status">${message(status)}</p></div></div>${badges ? `<div class="home-badges"><span>${message('homeReadOnly')}</span><span>${message('homeLocal')}</span><span>${message('homeNoAccount')}</span></div>` : ''}</section>`;
}
function render() {
  t = translator(preferences.lang); document.documentElement.lang = preferences.lang === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.theme = preferences.theme;
  $('brand-name').textContent = t('brandName'); $('tagline').textContent = t('tagline'); $('language-switch').setAttribute('aria-label',t('language'));
  for (const lang of ['en','zh']) $(lang).setAttribute('aria-pressed',String(preferences.lang === lang));
  $('theme').setAttribute('aria-label',`${t('theme')}: ${t(preferences.theme)}`); $('theme').title = `${t('theme')}: ${t(preferences.theme)}`;
  $('options-title').textContent = t('options'); $('network-consent').textContent = t('networkConsent'); $('rtc-label').textContent = t('rtcOption'); $('rtc-consent').textContent = t('rtcConsent'); $('rtc').checked = preferences.rtc;
  $('rtc').disabled = running; $('clear').disabled = running;
  $('privacy-link').textContent = t('privacy'); $('support-link').textContent = t('support'); $('clear').textContent = t('clear');
  $('storage-warning').hidden = !storageError; $('storage-warning').textContent = t('historyUnavailable');
  $('check').textContent = Date.now() < cooldownUntil ? t('wait',{n:Math.max(1,Math.ceil((cooldownUntil-Date.now())/1000))}) : t(result ? 'again' : 'check');
  $('check-disclosure').textContent = t('networkBrief') + (preferences.rtc ? ' ' + t('rtcBrief') : ''); $('check').disabled = running || Date.now() < cooldownUntil;
  $('check').hidden = running; $('cancel').hidden = !running; $('cancel').textContent = t('cancel');
  $('footer-note').textContent = t(running ? 'keepOpen' : 'footer');
  $('intro').hidden = Boolean(result) && !running; $('results').hidden = !result || running;
  if (running) {
    $('intro').innerHTML = `<div class="welcome"><p class="eyebrow">${message('ready')}</p><h1>${message('checking')}</h1><p class="lede">${message('keepOpen')}</p></div>${observationStage('checking','…','homeRing','motionChecking')}`; return;
  }
  if (!result) {
    const b = browserObservation();
    $('intro').innerHTML = `<div class="welcome"><p class="eyebrow">${message('ready')}</p><h1>${message('welcome')}</h1><p class="lede">${message('intro')}</p></div>${observationStage('idle','—','homeRing','homeStatus',true)}<div class="local-preview"><span>${message('liveBrowser')}</span><strong>${e(b.timezone)} · ${e(offsetLabel(b.offset))}</strong><p>${message('noRequest')}</p></div>${baseline ? `<p class="last-at">${message('lastAt',{date:dateLabel(baseline.at)})}</p>` : ''}<section class="home-signals"><h2>${message('homeSignals')}</h2><div><span class="signal-icon" aria-hidden="true">◎</span><p><strong>${message('network')}</strong><span>${message('homeNetwork')}</span></p></div><div><span class="signal-icon" aria-hidden="true">◷</span><p><strong>${message('browser')}</strong><span>${message('homeBrowser')}</span></p></div><div><span class="signal-icon" aria-hidden="true">⇄</span><p><strong>${message('comparison')}</strong><span>${message('homeCompare')}</span></p></div></section>`;
    return;
  }
  const n = result.network, b = result.browser, rtc = result.rtc, rc = result.rtcComparison;
  const differences = Number(result.timezoneComparison === 'different') + Number(rc.state === 'different');
  const incomplete = result.timezoneComparison === 'unavailable' || ['inconclusive','unavailable'].includes(rc.state);
  const summaryKey = differences ? differences === 1 ? 'difference' : 'differences' : incomplete ? 'partial' : rc.state === 'skipped' ? 'selectedComplete' : 'noDifference';
  const visualState = incomplete ? 'unknown' : differences ? 'different' : 'done';
  let html = `<section class="summary-card" data-state="${differences ? 'different' : 'neutral'}"><p class="eyebrow">${message('observed')} · ${e(new Intl.DateTimeFormat(preferences.lang === 'zh' ? 'zh-CN' : 'en',{hour:'2-digit',minute:'2-digit'}).format(new Date(result.at)))}</p><h1>${message(summaryKey,{n:differences})}</h1><p>${message('summaryNote')}</p></section>${observationStage(visualState,differences ? differences : incomplete ? '?' : '✓',differences ? 'motionDifferences' : incomplete ? 'homeRing' : 'motionSelected',incomplete ? 'motionUnknown' : 'motionComplete')}`;
  html += card('comparison','01',`<div class="comparison-item"><p class="comparison-title">${message('zoneTitle')}</p>${stateLine(result.timezoneComparison, {match:'matchZone',different:'differentZone',unavailable:'unavailableZone'}[result.timezoneComparison])}<details><summary>${message('explain')}</summary><p>${e(n.timezone)} ↔ ${e(b.timezone)}</p><p>${message('zoneExplain')}</p><p>${message('zoneAlias')}</p></details></div><div class="comparison-item"><p class="comparison-title">${message('rtcTitle')}</p>${stateLine(rc.state,{match:'rtcMatch',different:'rtcDifferent',inconclusive:'rtcInconclusive',unavailable:'rtcUnavailable',skipped:'rtcSkipped'}[rc.state])}<details><summary>${message('explain')}</summary>${rtc.status === 'skipped' ? `<p>${message('rtcConsent')}</p>` : `<p>${message('rtcCount',{n:rtc.candidates.length})}</p>`}${rc.unpaired ? `<p>${message('rtcMixed')}</p>` : ''}${!rtc.candidates.length && rtc.status !== 'skipped' ? `<p>${message('rtcNone')}</p>` : ''}${rtc.status === 'timeout' ? `<p>${message('rtcIncomplete')}</p>` : ''}${rtc.status === 'unavailable' ? `<p>${message(rtc.reason)}</p>` : ''}<p>${message('rtcExplain')}</p><p>${message('rtcLimits')}</p>${rtc.candidates.length ? `<p>${message('rtcAddresses')}</p><ul>${rtc.candidates.map(c=>`<li class="mono">${e(c.address)} · IPv${c.family}</li>`).join('')}</ul>` : ''}</details></div>`);
  html += card('network','02', n.status === 'complete' ? `<p class="hint">${message('networkHint')}</p><dl class="rows">${row('publicIp',`${n.ip} · IPv${n.family}`,true)}${row('country',countryLabel(n.country))}${row('asn',n.asn ? `AS${n.asn} · ${n.organization || t('unknown')}` : n.organization)}${row('networkTimezone',n.timezone,true)}</dl><details><summary>${message('more')}</summary><p>${message('zoneExplain')}</p><p>${message('rtcLimits')}</p><p>${message('attribution')} <a href="https://www.maxmind.com" target="_blank" rel="noopener noreferrer">MaxMind ↗</a></p></details>` : `${stateLine('unavailable','noNetwork')}<p class="hint">${message(n.reason)}</p>`);
  html += card('browser','03', `<p class="hint">${message('browserHint')}</p><dl class="rows">${row('browserTimezone',b.timezone,true)}${row('utcOffset',offsetLabel(b.offset),true)}${row('languageLabel',b.language,true)}</dl><details><summary>${message('more')}</summary><dl class="rows">${row('languages',b.languages.join(', '),true)}${row('intlLocale',b.locale,true)}${row('browserPlatform',`${b.browser} · ${b.platform}`)}</dl></details>`);
  const listed = availability(n.country);
  html += card('availability','04', `<p class="comparison-title">${message('country')}: ${e(n.status === 'complete' ? countryLabel(n.country) : t('unavailable'))}</p>${stateLine(listed,listed === 'unknown' ? 'unknown' : listed)}<p class="hint">${message(listed === 'qualified' ? 'availabilityQualified' : listed === 'stale' ? 'availabilityStale' : 'availabilityNote')}</p><div class="source-line"><a href="${regionPolicy.source}" target="_blank" rel="noopener noreferrer">${message('source')}</a><span>${message('verified',{date:regionPolicy.verified})}</span></div><p class="independent">${message('independent')}</p>`);
  let changeBody = !history ? `<p class="hint">${message('firstHistory')}</p>` : `${stateLine('neutral',history.changes.length ? history.changes.length === 1 ? 'changeCountOne' : 'changeCount' : 'sameHistory',{n:history.changes.length})}<p class="hint">${message('historyAt',{date:dateLabel(history.at)})}</p>${history.changes.length ? `<ul class="changes-list">${history.changes.map(c=>`<li><span class="change-label">${message(c.key)}</span><div class="change-values"><span><span class="sr-only">${message('before')}: </span>${e(formatChange(c.key,c.before))}</span><span class="arrow" aria-hidden="true">→</span><span><span class="sr-only">${message('after')}: </span>${e(formatChange(c.key,c.after))}</span></div></li>`).join('')}</ul>` : ''}${history.unknown.length ? `<p class="hint">${message('historyPartial',{n:history.unknown.length})}</p>` : ''}`;
  changeBody += `<details><summary>${message('more')}</summary><p>${message('historyNote')}</p><p>${message('changeHint')}</p></details>`;
  html += card('changes','05',changeBody); $('results').innerHTML = html;
}
function formatChange(key, value) {
  if (key === 'network.country') return countryLabel(value);
  if (key === 'network.asn') return `AS${value}`;
  if (key === 'browser.offset') return offsetLabel(value);
  if (key.endsWith('.status')) return t({complete:'complete',timeout:'timeout',unavailable:'unavailable',skipped:'skipped'}[value] || 'unknown');
  if (key === 'rtc.comparison') return t({match:'rtcMatch',different:'rtcDifferent',inconclusive:'rtcInconclusive',unavailable:'rtcUnavailable',skipped:'rtcSkipped'}[value] || 'unknown');
  return value === '' ? t('noValue') : value;
}
async function persistPreferences() { try { await savePreferences(preferences); } catch { storageError = true; render(); announce(t('storageFailure')); } }
$('check').addEventListener('click',async () => {
  if (running || Date.now() < cooldownUntil) return;
  running = true; controller = new AbortController(); const runController = controller;
  const b = browserObservation(); const rtcEnabled = preferences.rtc;
  render(); $('content').scrollTop = 0; $('cancel').focus(); announce(t('checking'));
  const [network, rtc] = await Promise.all([queryNetwork({signal:runController.signal}),observeRTC({enabled:rtcEnabled,signal:runController.signal})]);
  if (runController.signal.aborted) { running = false; render(); announce(t('cancelled')); $('check').focus(); return; }
  result = { at:new Date().toISOString(),browser:b,network,rtc,timezoneComparison:compareTimezone(network.timezone,b.timezone),rtcComparison:compareRTC(network,rtc) };
  const summary = compactSnapshot(result); history = compareSnapshots(baseline,summary);
  try { await saveSnapshot(summary); baseline = summary; } catch { storageError = true; }
  running = false; cooldownUntil = Date.now() + (network.reason === 'rateLimit' ? 60000 : 5000);
  render(); $('content').scrollTop = 0; announce(t('checkComplete'));
  const cooldownTimer = setInterval(() => {
    if (!running) { const remaining = Math.ceil((cooldownUntil-Date.now())/1000); $('check').disabled = remaining > 0; $('check').textContent = remaining > 0 ? t('wait',{n:remaining}) : t(result ? 'again' : 'check'); }
    if (Date.now() >= cooldownUntil) clearInterval(cooldownTimer);
  },1000);
});
$('cancel').addEventListener('click',() => controller?.abort());
for (const lang of ['en','zh']) $(lang).addEventListener('click',async () => { preferences.lang = lang; render(); await persistPreferences(); });
$('theme').addEventListener('click',async () => { const themes = ['system','light','dark']; preferences.theme = themes[(themes.indexOf(preferences.theme)+1)%3]; render(); await persistPreferences(); });
$('rtc').addEventListener('change',async event => { preferences.rtc = event.target.checked; $('check-disclosure').textContent = t('networkBrief') + (preferences.rtc ? ' ' + t('rtcBrief') : ''); await persistPreferences(); });
$('clear').addEventListener('click',async () => {
  try { await clearLocal(); baseline = null; history = null; result = null; storageError = false; preferences.rtc = false; cooldownUntil = 0; render(); announce(t('cleared')); }
  catch { storageError = true; render(); }
});
window.addEventListener('pagehide',() => controller?.abort());
try { const saved = await loadLocal(); preferences = saved.preferences; baseline = saved.snapshot; } catch { storageError = true; }
if (!baseline) $('options').open = true;
render();

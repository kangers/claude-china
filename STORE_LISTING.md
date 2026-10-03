# Chrome Web Store listing · RC2

Prepared 2026-10-02. Use the current Developer Dashboard fields at submission. Category suggestion: Tools. Default language: 简体中文; additional locale: English. Primary audience: Chinese-speaking Claude users seeking factual browser/network observations. Do not claim trademark clearance or a successful Store review.

## Product name / Title

Default Chinese title: **Claude China — 独立环境诊断**

English localization: **Claude China — Independent Environment Check**

The user-selected product name is Claude China. This extension is independent and is not produced, authorized or endorsed by Anthropic. The name includes a third-party brand; independence labels do not establish trademark permission or guarantee Store acceptance. Do not use Anthropic/Claude logos, “official,” “partner,” protection promises, banned-account language or keyword stuffing. Conduct the publisher's final name/trademark check before public release.

## Short Description

Understand your network and browser environment, compare manual checks, and consult Claude’s official region list.

中文：了解网络与浏览器环境，比较主动检查之间的变化，并对照 Claude 官方地区名单。

## Long Description — English

Claude China gives you a clear, read-only view of your network and browser environment, with explanations you can inspect.

Check on demand to see the public IP visible to one HTTPS endpoint, estimated country/region, network organization and ASN, and network timezone. See your browser's reported timezone, UTC offset, language, Intl locale, and browser/platform information alongside it.

Compare network and browser timezone identifiers. Optionally observe public WebRTC ICE candidates and compare candidates of the same IP family to the HTTP-visible IP. A missing result, timeout, or IPv4/IPv6 ambiguity is shown as unavailable or inconclusive. A difference is an observation, not an account-risk score.

Claude China keeps one small local summary so your next manual check can show changes in region, network organization, timezone, browser settings, and WebRTC observation status/count/families. It does not save raw IPs or candidate addresses, so address changes across checks are not tracked. The summary expires after 30 days and is deleted on the next open. Clear local data at any time.

Claude Availability compares the detected network country to a dated, bundled copy of Anthropic's public Claude.ai region list. The official source, verification date, and regional exceptions are shown. This does not confirm account eligibility or predict restrictions. Claude China is not affiliated with Anthropic.

Privacy is visible before you check. A check sends your IP and standard request metadata directly to GeoJS (get.geojs.io) for the network lookup. Optional WebRTC observation contacts Cloudflare STUN, which sees the source IP of that route. These providers apply their own privacy policies. No account, analytics, advertising, background monitoring, website-content access, cookies or browsing-history access. Browser observations and comparisons are processed locally. Third-party services may be unavailable or rate limited; there is no automatic retry.

A locally packaged mascot moves from waiting to observing to completed/inconclusive states. The active ring is indeterminate; result values describe observed differences, never a risk score. Reduced-motion preferences disable animation. Chinese by default, with an English switch. Light, dark, and system themes. Keyboard-friendly controls and expandable explanations. No settings modification, protection guarantees, or circumvention tools.

## Long Description — 中文

Claude China 是独立工具，提供清晰、只读的网络与浏览器环境观察，并解释每项比较结论。

主动检查后，查看本次 HTTPS 接口看到的公网 IP、估计的国家/地区、网络组织和 ASN，以及网络时区。同时了解浏览器报告的时区、UTC 偏移、语言、Intl locale 和浏览器/平台信息。

比较网络与浏览器时区标识；可选收集公开 WebRTC ICE candidate，与相同 IP 协议族的 HTTP IP 比较。缺失结果、超时和 IPv4/IPv6 歧义会显示为不可用或无法判断。差异是观察结果，不是账号风险评分。

扩展仅在本地保存一份小型摘要，以便下一次主动检查比较地区、网络、时区、浏览器设置和 WebRTC 观察状态/数量/协议族。不会保存原始 IP 或 candidate 地址，因此不跟踪地址本身的跨次变化。摘要 30 天后失效，下次打开时删除，也可随时清除。

Claude 地区信息将检测到的网络国家/地区与 Anthropic 公开的 Claude.ai 名单快照对照，显示官方来源、核验日期和地区例外。不判断账号资格，不预测限制。Claude China 与 Anthropic 无关联。

点击前可看到隐私说明。检查直接向 GeoJS（get.geojs.io）发送来源 IP 和标准请求元数据；可选 WebRTC 连接 Cloudflare STUN，对方能看到该路径的来源 IP。第三方适用各自隐私政策。无账号、广告、分析追踪或后台监控；不读取网页内容、Cookie 或浏览历史。浏览器观察和比较在本地处理。第三方服务可能不可用或限流，不自动重试。

原创人物跟随待检查、观察中、已完成/无法判断状态变化；圆环不显示模拟进度或风险分，支持系统减少动态效果。默认中文，支持 English 切换、浅色 / 深色 / 跟随系统、键盘操作和可展开解释。不修改环境，不提供保护保证或限制绕过工具。

## Support / privacy contact

**jackmac2077@gmail.com** — enter this as the Store support email. The in-extension link opens `mailto:jackmac2077@gmail.com` without a prefilled diagnostic report or automatic send. The same contact is in the bilingual policy. The publisher display/legal identity remains a separate Dashboard item.

## Single Purpose

Provide user-initiated, read-only network and browser environment diagnostics, explain observable differences, and compare with one previous local check. The dated Claude.ai country-list reference contextualizes the detected network region within this same diagnostic purpose.

## Permission Justification

| Permission | Copy-ready justification |
| --- | --- |
| storage | Store interface preferences and one compact previous manual-check summary locally to show changes on the next check. No raw IP/candidate address storage or Chrome sync. |
| https://get.geojs.io/* | Make a user-triggered HTTPS network diagnostic request directly to get.geojs.io for the viewer's own source IP, estimated region, ASN/organization and timezone. No content script, website content access, arbitrary IP lookup or background requests. |

The host permission warning may mention read/change access to get.geojs.io. Code only performs a read-only JSON fetch. Match patterns cannot narrow network access to a query-string-specific endpoint. STUN is WebRTC transport; no extra browser permission, media permission or “privacy” API is requested.

## Privacy Practices recommendations

Disclose actual transmission, including direct third-party calls. **Do not check “no user data collected”** solely because the publisher has no server. Conservatively declare **Location** for IP-derived coarse country/timezone and **Personally identifiable information** where the Dashboard includes IP addresses/online identifiers. Current forms may describe these categories differently; map the real data flow and use the explanation field. Standard HTTPS request metadata may convey browser/platform/language; the full locally read browser observation is not sent as an application payload.

- Location: coarse IP-derived country/timezone, not GPS or precise geolocation.
- Identifiers: the request source IP received by GeoJS and, if chosen, Cloudflare STUN. Not retained in extension storage.
- No health, financial/payment, authentication, personal communications, website content, browsing history or user-activity tracking.
- No sale, unrelated use/transfer, advertising use or credit/lending use. Certify the Dashboard's three Limited Use statements only after reviewing the final submitted package.
- Privacy Policy URL: publish the supplied bilingual policy on a publisher-controlled public HTTPS page without a login, then enter that URL. Use jackmac2077@gmail.com as the support/privacy contact and confirm the actual publisher identity. Do not supply a `chrome-extension://` or local filesystem URL.
- Remote code: **No.** All executable code and styles are packaged. Remote JSON contains observation data only; the official region snapshot and IANA links are bundled. No remote feature-flag logic, SDK, iframe, eval or dynamic code compilation.

## Reviewer Notes — copy-ready

No account or special setup is needed. Open the action popup, read the disclosure adjacent to Check, and run a manual check. Opening the popup does not make external requests. Network observation uses https://get.geojs.io/; third-party failure/rate limits are intentionally shown as unavailable, not a passed diagnostic. If the endpoint is blocked, local browser data remains available after the check.

Expand Check options & privacy and enable WebRTC only if you wish to test it. This contacts stun.cloudflare.com:3478 and gathers candidates without camera/microphone access or a remote peer. No public candidate and mixed IP-family observations are inconclusive; the tool does not identify a “real IP.”

Run a second manual check after the brief cooldown to inspect previous-check comparison. Only one local compact summary is stored; raw IP and candidate addresses are not persisted. Address changes themselves are not tracked. Clear local data removes preferences and the summary. Switch EN/中文 and the theme button to inspect both localizations and themes. Content scrolls inside a 400×600 popup.

The Claude Availability card is only a dated reference to the public Claude.ai region list, with official source and regional exceptions. No Anthropic interaction, cookie/account access, predictions, settings changes, or service-limit circumvention exists. Claude China is an independent diagnostic extension, not an official China service or Anthropic product. The mascot acknowledges completed observations; it does not claim safe account access.

All code is included and human-readable in the package. Only storage and one specific HTTPS host permission are declared. There is no service worker, content script, background check, analytics, paid feature, or remote hosted code. Store screenshots display the actual UI with illustrative network data clearly labeled.

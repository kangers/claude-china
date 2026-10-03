# Engineering notes

## Scope and lifecycle

The action opens a 400×600 CSS px popup. There is no service worker, content script, alarm, offscreen document or web-accessible resource. All work is driven by one explicit click. The popup runs an HTTPS query and, when chosen, one local ICE gathering operation concurrently. HTTP deadline is 8 seconds; ICE deadline is 6.5 seconds. Abort cancels both. A new data channel has no remote description or peer. Candidate handlers and timers are removed, and RTCPeerConnection is closed on every terminal path.

A five-second UI cooldown limits repeated clicks; HTTP 429 uses a 60-second cooldown with an explicit retry-later explanation. No retry is scheduled. Closing the popup does not continue networking. Results are not recovered from a background cache, so reopening shows a local browser preview, previous check timestamp, and a manual-check action.

## Data contract

The sole HTTPS destination is the constant NETWORK_URL. The GeoJS response is immediately reduced to necessary fields; approximate coordinates/city and unrelated fields are discarded. A valid response object and public IP are required; missing country/ASN/timezone remain null. Text is bounded and rendered with escaping. An oversized/malformed/error result is unavailable. Credentials are omitted; cache is disabled; redirects fail; referrer is omitted. CSP permits only local scripts/styles/assets and that HTTPS destination. STUN is a native WebRTC transport rather than a fetch URL; it needs no host permission. It remains explicitly disclosed.

## Comparison and public IP rules

- IANA tzdb 2026e Link chains canonicalize aliases. Invalid/unsupported timezone names cannot establish agreement or difference. Different zone identifiers stay different even if offsets happen to agree now. GeoIP timezone is an estimate and not a device clock or account-enforcement signal.
- IPv4 requires strict dotted decimal. RFC1918, CGNAT, loopback, link-local, multicast, documentation, benchmarking and other ambiguous special ranges are rejected.
- IPv6 is normalized to eight 16-bit groups. IPv4-mapped literals normalize to IPv4. Only conservative 2000::/3 global unicast is accepted, excluding documentation, transition and selected special-use ranges. NAT64, Teredo and 6to4 are excluded from direct conflict evidence. This is deliberately conservative, not an exhaustive routing oracle.
- Use candidate.address and candidate.type from Chrome RTCIceCandidate. Ignore mDNS, private addresses, relatedAddress and relay candidates. A public host candidate is eligible; a relay IP belongs to TURN and is not evidence of the client's alternate public path.
- Same-family different candidate → observed difference, even if gathering subsequently times out. No candidate, failed HTTP, unfinished matching gathering, or unmatched families → inconclusive. Match requires complete gathering and every retained candidate matching the HTTP observation with no unmatched family.
- Multiple interfaces, endpoint routing, browser/enterprise policies and permissions may alter observations. An extension-origin observation is not guaranteed to match an arbitrary website-origin observation. No browser privacy setting is read or changed, and no “real IP” is inferred.

## Storage

`chrome.storage.local`, keys `preferences` and `snapshot`. No sync, identifier, raw address, address hash, SDP or raw API payload. `compactSnapshot` is the only producer of stored diagnostic state. Null fields are explicitly non-comparable. RTC counts/families/comparison are compared only across completed gathering observations. Candidate IP changes cannot be detected from the saved summary; this is disclosed.

A 30-day logical expiration is checked on open; physical deletion waits for the next open. Reject future/corrupt/schema-incompatible summaries rather than fabricate a baseline. A new complete attempt (possibly partial results) replaces the baseline. A canceled attempt does not.

## Accessibility

Native buttons, language aria-pressed states, checkbox label, semantic heading/definition lists and details, visible keyboard focus, live status announcements and reduced-motion preference. Fixed header/footer surround one scroll region. Textual states accompany colored dots. Axe audits cover English/Chinese and light/dark; native popup and scrolling were also manually inspected. Automated checks do not establish full screen-reader certification.

## Release boundaries

No production test hooks. Browser fixtures replace fetch/RTCPeerConnection only from Playwright. Store screenshots use marked illustrative data and actual production UI. Dev-only dependencies never ship. A static copy build validates permissions and JS syntax and produces a ZIP with manifest at root. Store approval, public policy hosting, publisher identity and current provider terms review are external release gates.

Claude China uses three locally bundled decorative mascot poses. A short idle greeting ends within about 4.2 seconds; the active arc is indeterminate while the real request is pending. Result visuals are derived from the same comparison states as the explanation cards: a difference count, completed-selected-check mark, or unknown mark. Incomplete evidence never selects the completion pose. CSS respects prefers-reduced-motion; no animation library or remote media is loaded.

Native action-popup targets may bypass Playwright context routing and init scripts. Ordinary extension-tab fixture tests do not prove that a native-popup fixture is isolated. The native review launcher therefore now uses a browser-level loopback HTTP proxy and DNS guard; WebRTC must remain off in this offline launcher. The guard was source-checked but not triggered again in this turn. The unintended RC2 native request and corrected evidence attribution are recorded in evidence/MANUAL_ACCEPTANCE.md.

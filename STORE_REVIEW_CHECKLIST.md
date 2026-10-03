# Chrome Web Store review checklist

Reviewed 2026-10-02 against the final RC. `[x]` means inspected in code/artifact or verified; `[ ]` requires publisher/Store action. See FINAL_AUDIT.md and evidence reports.

- [x] Manifest V3; working extension functionality, not an external-page launcher.
- [x] Single purpose: on-demand read-only environment observation, explanation and previous-check comparison.
- [x] Only `storage` + `https://get.geojs.io/*`; no other privileges or all-sites patterns.
- [x] No service worker, content scripts, injected page access, history/cookies/Claude data access.
- [x] No account-risk/protection scoring or access guarantees; no settings changes or bypass features.
- [x] Claude.ai list is correctly separated from API list; 185 ISO mappings checked, Ukraine exceptions explicit.
- [x] Bundled region verification date and 90-day stale guard; no remote policy logic.
- [x] HTTPS source and optional Cloudflare STUN disclosed before Check and in full policy/listing.
- [x] Browser fields processed locally; no raw IP, SDP, candidate IP or IP hash saved.
- [x] One local summary; 30-day logical expiry/deletion-on-next-open wording matches code.
- [x] Clear-local-data and cancel behavior tested; no background checks or auto retry.
- [x] Unknown/timeout/unavailable/inconclusive are distinct from observed agreement.
- [x] Conservative IPv4/IPv6/special-use/relay/mDNS candidate handling.
- [x] IANA timezone alias handling; offset equality alone is not zone equality.
- [x] GeoJS terms/privacy/docs reviewed; no credentials or database redistribution.
- [x] All executable code packaged and readable; no eval, remote code, JSONP, SDK, remote CSS/fonts.
- [x] UI and production ZIP reflect the final GeoJS destination, not the initial candidate.
- [x] Accurate bilingual listing, permission rationale, reviewer notes and privacy recommendations supplied.
- [x] User-selected Claude China name consistently identifies an independent diagnostic tool; no official China-service claim. Local state animation has no risk score or simulated percent.
- [x] Original brand/icons; no Anthropic/Claude official assets or endorsement claims.
- [x] Required icon, small promo and full-size screenshots; screenshots label illustrative data.
- [x] Production package installs; representative user paths and light/dark/English/Chinese checked.
- [x] Native 400×600 popup, internal scroll and disclosure visibility verified.
- [x] Support/privacy contact jackmac2077@gmail.com is present in policy, popup and Store materials; no automatic support transmission.
- [ ] Publish supplied policy at a public HTTPS URL under publisher control and enter it in the Dashboard.
- [ ] Verify current Dashboard data-category wording; declare IP/coarse location handling rather than “no collection.”
- [ ] Verify developer account, 2-step verification, registration/payment if needed, and support field.
- [ ] Recheck policies/provider terms/list snapshot on submission date; confirm third-party brand-use conditions and perform name/trademark screening.
- [ ] Submit ZIP through publisher account and respond to review; no approval guarantee claimed.

# Release checklist · 1.0.0 RC3

## Engineering exit criteria

- [x] Human-readable ES module source and static MV3 production package.
- [x] Final one-host permission and strict local-code CSP verified.
- [x] Key IP/IPv6/timezone/history/policy decision logic tests pass.
- [x] Production extension installs in Chrome for Testing.
- [x] First run and explicit privacy disclosure; no request on open.
- [x] RC1 online GeoJS lookup in the real extension; real STUN behavior separately observed. RC2 automated animation tests use local fixtures. A native popup request unintentionally bypassed the fixture layer and contacted GeoJS; it is disclosed in MANUAL_ACCEPTANCE.md and is not an approved live rerun.
- [x] Actual Chrome ICE with controlled loopback STUN yields a public candidate event.
- [x] Completed matching/conflicting candidates; no candidate; HTTP failure; HTTP/ICE deadlines; mixed-family ambiguity.
- [x] Matching/different timezone, aliases, policy stale/unknown/Ukraine exceptions.
- [x] Second check, field changes, cancel retention, clear local data and persistence redaction.
- [x] Local waiting/observing/completed/inconclusive mascot states, bounded idle motion and reduced-motion handling.
- [x] English/Chinese; manual and system light/dark; reduced motion; axe audits.
- [x] Actual action popup and scrolling manually inspected on macOS.
- [x] README, policy, research, listing, review checklist, architecture and data-maintenance notes.
- [x] Original PNG/SVG icons, required promo tile, optional marquee and seven localized 1280×800 screenshots.
- [x] Dev dependency audit: no known vulnerabilities at final build; no runtime dependencies included.
- [x] Final five-perspective audit and source/package/asset consistency check.

## Publisher actions before submission

The RC3 package is uploaded as a draft. Submission has not occurred. Current operational evidence is in `publish/README.md`; historical RC2 browser evidence covers unchanged diagnostic code, not a new RC3 browser run.

- [x] Support/privacy email jackmac2077@gmail.com included consistently in policy, packaged page, popup and listing. Support mail links do not automatically send diagnostic data.
- [x] User selected an existing registered publisher in the native Dashboard. No legal identity inferred or changed.
- [x] User authorized public Store publishing and source upload to GitHub owner kangers (updated user instruction).
- [x] RC3 ZIP and localized listing/screenshots/promotional assets uploaded and saved; Package page confirms `1.0.0 RC3`.
- [x] Current privacy categories, minimum permissions, No Remote Code, Single Purpose and reviewer notes saved.
- [ ] Confirm verified contact status in Dashboard. User reports verification completed 2026-10-03; direct Dashboard confirmation is pending browser access.
- [ ] Create the public repository in the selected GitHub account and upload audited source. Public kangers/claude-china repository created; source upload pending.
- [ ] Deploy bilingual policy to public HTTPS without sign-in, verify actual contents, enter Store Privacy URL and save.
- [ ] Replace old Store icon if the user confirms its irreversible removal; new local/package artwork is complete.
- [ ] Confirm Claude China brand-use/name clearance; independence wording does not grant trademark rights.
- [ ] Recheck official policies, supplier terms and Claude.ai list on actual submission day. Update source verification dates only after real re-verification.
- [ ] Submit for review and confirm actual Dashboard review status. Public release remains subject to Google's review.

## Reproducible validation

```sh
npm ci
npx playwright install chromium
npm run assets
npm run check
node tests/live.mjs
npm run store-assets
npm audit
```

Review `evidence/browser-tests.json` and `evidence/live-services.json`. The live-service report is not a guaranteed future uptime result. Browser fixtures are deterministic edge-case tests, not claims of different real routing configurations. Confirm SHA256SUMS after any rebuild. Checks on other desktop OSes/minimum Chrome and full assistive-tech review are recommended before widening support claims; no current claim of their certification.

## Operation after release

- Review official Claude.ai policy and release a new bundled snapshot before 90 days. Stale UI is intentional if no update occurs.
- Monitor supplier announcements as a publisher maintenance responsibility; the extension itself never monitors users.
- On supplier availability/terms change, update or suspend affected feature with accurate disclosures; do not silently add endpoints, keys or background calls.
- Fix incorrect country data through provider channels. Do not present IP metadata as physical/user identity evidence.

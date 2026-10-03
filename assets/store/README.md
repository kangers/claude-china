# Store assets · delivery plan

All graphics are original Claude China artwork. No Anthropic/Claude logo, copied character, external photo or proprietary font is embedded. The Chinese-first home follows the user-supplied reference’s warm editorial card structure with original illustration and factual status text. PNGs are final deliverables; SVG/script sources allow edits. System sans-serif fonts are used when rendering locally.

| Asset | Dimensions | Use |
| --- | --- | --- |
| store-icon-128.png | 128×128 | Chrome Web Store icon; original cute observer avatar on ivory background |
| promo-small.png | 440×280 | Required small promotional tile |
| promo-marquee.png | 1400×560 | Optional marquee promotional tile |
| 01-overview-zh.png | 1280×800 | Default Chinese first-run home |
| 02-network-browser-zh.png | 1280×800 | Chinese network/browser observations |
| 03-history-availability-zh.png | 1280×800 | Chinese official reference and history |
| 01-overview-en.png | 1280×800 | First-run purpose and manual-check privacy |
| 02-network-browser-en.png | 1280×800 | Actual network/browser information hierarchy |
| 03-history-availability-en.png | 1280×800 | Official region reference and previous-check comparison |
| 04-differences-zh.png | 1280×800 | Chinese dark UI with explained environment differences |

The seven localized screenshot files are full-bleed images. The right side is the actual 400×600 production UI captured in `tests/browser.mjs`, at its natural CSS size, composed into the Store's 1280×800 format. The left side explains the displayed feature. Network data in result screenshots is controlled illustrative data, explicitly labeled; no user's actual address appears in these assets. The first-run browser timezone preview is also from the controlled test environment.

Brand: a friendly curly-haired observer avatar, with original overlapping observation lenses retained on promotional tiles. Warm coral/ivory, neutral ink, generous spacing, and amber observations avoid fear-based account-protection messaging. The promotional tiles sell clarity, not access guarantees.

Regenerate from the project root:

```sh
npm run assets
npm run build
npm run test:browser
npm run store-assets
```

`scripts/assets.mjs` generates icon and promotional PNG/SVG files. `scripts/store-assets.mjs` generates the screenshot PNGs and background SVGs from production evidence; those SVGs are background/layout sources, not substitutes for the final composited PNGs. Runtime icons also exist at 16/32/48/128px in `extension/icons/`.

Before uploading, check the current Store image guidance linked in RESEARCH.md. For the default Chinese listing, use 01-overview-zh, 02-network-browser-zh, 03-history-availability-zh, then 04-differences-zh. For the English localization, use the three `*-en.png` screenshots in numeric order. Do not upload all seven into one locale; the current Store accepts at most five screenshots per locale. The supplied bilingual titles/descriptions are in STORE_LISTING.md. Screenshots show the local waiting/observing/result character states; animated playback exists in the extension, while Store screenshots remain static PNGs. No asset claims official affiliation or review approval. Support/privacy contact is jackmac2077@gmail.com. Publisher identity, public policy hosting and professional name clearance remain publisher steps.

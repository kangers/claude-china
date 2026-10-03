# Bundled reference maintenance

No remote runtime update exists. Changes require review and a new Store package.

## Claude.ai

Source: https://www.anthropic.com/supported-countries . Preserve the Claude.ai section only, excluding the Commercial API and site footer. `docs/claude-regions-source.json` contains the 185 names verified on 2026-10-02. `extension/data/regions.js` holds reviewed ISO 3166-1 mappings, recognized ISO codes and Ukraine exceptions. Names are policy wording, not UI branding.

Fetch the official page, extract its Claude.ai list, compare old/new names and exception wording, and review the mapping. If names/eligibility scopes change, modify the decision logic and tests too. Never merely advance `verified`. `scripts/data-regions.mjs` regenerates mappings from the retained names and `docs/iso3166-codes.json`; inspect any missing mapping and the diff. Tests intentionally assert the currently reviewed list count, known present/absent entries, freshness and Ukraine behavior.

## IANA aliases

Source: https://data.iana.org/time-zones/releases/tzdata2026e.tar.gz . The bundled generated Link map comes from backward, etcetera and the region files, excluding backzone. The alias relation treats tzdb-equivalent post-1970 zones as equivalent for this current-environment diagnostic; it is not a timezone-history calculator.

Download a new official tarball, record its version and checksum, extract its `Link TARGET ALIAS` records from the same files, produce `extension/data/timezone-links.js`, and retain the public-domain LICENSE. Review alias changes and run timezone tests in current Chrome. `docs/iso3166-codes.json` originates from tzdb iso3166.tab. Current UTC offset shown is the browser's own report; no bundled DST calculator is added.

Old or unsupported browser ICU data may fail to recognize a valid new IANA zone. The result must remain unavailable; do not fall back to country-wide offsets.

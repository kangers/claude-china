# Claude China · publication status

Updated 2026-10-03. The user authorized Chrome Web Store publishing and uploading source to their GitHub open-source account. No public release is claimed.

## Chrome Web Store

- The user's selected registered publisher was confirmed in the native browser. Login identifiers are omitted from this public source document.
- Draft item created successfully: `iiflbjmffalbheleopgcnkbdboobmajm`.
- Dashboard: https://chrome.google.com/u/1/webstore/devconsole/b927713d-de87-4a48-9929-0858d5285e70/iiflbjmffalbheleopgcnkbdboobmajm/edit
- RC2 uploaded successfully; RC3 replacement uploaded successfully. Package page visibly confirmed `1.0.0 RC3` and “not published.”
- Chinese/English descriptions, Tools category, four Chinese and three English localized screenshots, small promotional tile and marquee uploaded and saved.
- Single Purpose, storage/GeoJS justification and No Remote Code filled and saved.
- Current Dashboard explicitly places IP addresses under Location; selected Location only, not unrelated PII. Three factual Limited Use certifications selected and saved.
- No login required; reviewer test instructions saved in the 500-character field.
- New avatar is generated and packaged in RC3. Dashboard requires irreversible removal of the old uploaded icon; awaiting action-time user confirmation. Local old SVG is retained.
- Publisher contact verification email sent to jackmac2077@gmail.com. Google confirmed the link expires in 1 hour; user must complete verification.
- Distribution inspected: Free, Public, all regions. No monetization or private testing selected.
- Dashboard validation reported missing/unverified contact email and missing privacy policy URL. Not submitted for review; not published. Public HTTPS policy URL and contact verification are still required.

## Current package

- `dist/claude-china-1.0.0-rc3.zip`, 593546 bytes.
- SHA256: `3f49332b91f5a2a95e544d603c2cfa33cee187e714e3d24159e6b77ef011b52c`.
- `dist/claude-china` is the current Load unpacked build.
- RC3 changes the avatar icons and version_name only; diagnostic code is unchanged from RC2. Build and 9 core groups pass. RC2's 28 browser checks are historical evidence for unchanged functional code, not a newly run RC3 browser test.

## GitHub

The user changed the publishing owner to **kangers** on 2026-10-03. The native GitHub page created the public repository successfully: https://github.com/kangers/claude-china (initial commit `93d05bfbbe8563bb15790a90ae427d0f512ce6fd`). Source upload and Pages deployment are in progress, not yet claimed complete.

The connector remains authenticated as a different account and reports no push permission on this repository. Upload uses the authorized browser session; no collaborators or credentials are added. Local GitHub CLI remains unauthenticated.

Static bilingual policy source is in `docs/privacy`; build synchronizes it with the packaged policy. Enable Pages from `main` and `/docs`, verify the actual public `/privacy/` URL, and then enter it in the Store. Support/privacy contact: jackmac2077@gmail.com.

Source license: MIT in `LICENSE`, without rights to third-party marks. Claude China is an independent tool, not an official China service or Anthropic product; name/trademark clearance is not established.

## Current blockers

1. The user reports publisher email verification completed on 2026-10-03. Dashboard confirmation is pending: the Store blocks tab scripting, and automatic approval rejected reading the current Chrome window because it had previously shown unrelated Gmail. The user was asked to foreground the Store settings page and authorize reading that publishing window. No Dashboard verification success is yet claimed.
2. Public policy URL is not yet deployed. Repository creation succeeded; source upload and Pages deployment are pending.
3. Optional Store icon replacement awaits action-time confirmation because the old-icon removal dialog states that deletion cannot be undone. Local old artwork remains available.

An upload-ready source export is at `/private/tmp/claude-china-github-source`, with a source archive at `/private/tmp/claude-china-source-rc3.zip`. It excludes `.git`, dependency folders, browser profiles and generated dist binaries. A known secret-pattern scan passed; this is not an exhaustive security guarantee.

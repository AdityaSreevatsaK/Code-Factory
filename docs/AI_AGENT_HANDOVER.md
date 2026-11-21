# AI agent handover | Code Factory

> Start with `/AGENTS.md` and `docs/PROJECT_STATUS.md`. This document preserves the product history, technical decisions and lessons that are easy to lose between sessions. It is not a substitute for inspecting the live repository and Git state.

## Project identity and history

- Canonical repository: https://github.com/AdityaSreevatsaK/Code-Factory
- Owner/account showcase: `AdityaSreevatsaK`
- Original home: https://github.com/AdityaSreevatsaK/GitHub-Activity-Studio
- Original branch: `concept/code-factory`
- Original draft PR #5: https://github.com/AdityaSreevatsaK/GitHub-Activity-Studio/pull/5, closed as superseded without merging
- Source migration baseline: `fa69aad0e994d82924685d6e7291dde34f7505ae`
- Standalone migration: 18 November 2026. The source project was inspected, 25 concept files were reviewed, 14 SVGs and fixtures were migrated, and the retired Python prototype was isolated under `legacy/`. This repository has its own clean Git history; the source branch remains the historical reference.

The original project vision was a visually distinctive, contribution-calendar-powered miniature factory. The first concept placed an attractive factory below the calendar without a real relationship to activity. That was rejected. The defining revision made the selected calendar week drive seven daily lanes: actual events determine the machine, day, repository, cargo and counts. Idle days stay idle. This source lineage is the central product invariant.

The design evolved around two genuinely different visual directions, **Isometric Foundry** and **Pixel Works**, each with dark/light palettes. GitHub profile images must be static SVGs; animation is an optional local-browser enhancement. The browser preview provides interactive week exploration and an event ledger. A synthetic fixture remains separate from real public snapshots.

## Product and technical decisions

1. The calendar is 53 Sunday-start weeks by seven days. The selected week drives seven workshop lanes.
2. Renderer input is a normalised v1 JSON snapshot, not raw API responses.
3. Renderer code is deterministic, browser-safe and dependency-free. Node filesystem/network work stays in CLI modules.
4. Repository identity is canonical `owner/name`; timestamps and week assignment are UTC.
5. Five event kinds are understood by the renderer: `commit`, `pr_opened`, `pr_merged`, `issue_opened`, `release`. The built-in collector currently fetches only commits, PRs and issues.
6. Same-repository/same-stage/day records group into a machine. The artwork displays at most two groups per day and discloses overflow; all valid events remain in the data model.
7. The output is an observed public activity visualisation, not GitHub's official contribution graph. A PR open and merge are separate observed records; a blank day is not proof of zero contributions.
8. Still SVGs are the GitHub-compatible deliverable. Do not promise GitHub README rendering of SMIL/browser animation.
9. Original procedural SVG geometry is preferred. Do not copy game sprites, proprietary fonts or branded artwork.
10. No automatic profile edits, cloud hosting requirement, private data collection or release publication.

## Architecture and stack

- **Node.js 20+**, ECMAScript modules, Node built-in test runner and no third-party runtime dependencies.
- **Python 3.11+ standard library** for legacy prototype tests and SVG/XML integrity checks.
- **Browser:** vanilla HTML/CSS/ES modules, local HTTP server, no framework or authenticated browser API.
- **Data:** GitHub REST public search for authored PRs/issues and public owned default-branch commits. Snapshot schema v1 stores event IDs, repository full names, UTC timestamps, event kinds, counts, coverage and provenance.
- **Assets:** deterministic standalone SVGs, 1200 × 430, isometric/pixel, dark/light, still/optional browser animation.
- **CI:** GitHub Actions on Ubuntu and Windows, Node 20 and Python 3.11, read-only and offline.
- **Refresh:** approved six-hour workflow on `master`, using the built-in token for public-only collection and committing one JSON snapshot plus four live stills after verification.
- **Packaging:** `package.json` is `private: true`, `UNLICENSED`; there is no source licence or stable release.

The current tree, exact commands and branch state are in `docs/PROJECT_STATUS.md`. Do not copy old file maps or package scripts without checking `package.json` and the current tree.

## Public-data discrepancy and audit

The frozen historical snapshot captured on 17 November 2026 contains **1,219 observed event/stage records across 26 repositories**. The first scheduled refresh on 18 November contained **894 records across 32 repositories**. Exact event-ID reconciliation found 457 historical IDs absent from the refreshed snapshot and 132 new IDs.

**455 of the 457 missing records** were associated with `AdityaSreevatsaK/Taiyous-Personal-Library`: 373 commits, 43 PR openings, 38 merges and one issue. The repository was absent from the first refresh's public-owned repository listing, although GitHub identified it as public during the later audit. The exact cause of the earlier omission is not proven. The other two missing records were PR-opening events. This was a repository-discovery/visibility-timing problem, not evidence that the source events had been deleted.

The review branch adds a safeguard: previous public repository names are only candidate hints; each missing repository is rechecked through anonymous GitHub metadata, and it is scanned only when current ownership and public visibility are confirmed. Private, missing or ambiguous candidates are excluded. Public API failures abort the refresh. The historical baseline is never copied into new activity. An offline ID audit helps explain differences. These changes do not make the public collector complete or authoritative.

The current default-branch snapshot is newer than the PR branch snapshot. See `docs/PROJECT_STATUS.md` for the exact generated timestamps and counts. Never compare counts without considering snapshot windows, event IDs and coverage metadata.

## Known limitations

- Public search and default-branch commit scans are incomplete by design. Feature branches, some upstream/organisation contributions and all private activity are outside scope.
- GitHub Search has a 1,000-result cap per query. Incomplete pagination or API failures must not produce a partial publication.
- The collector does not currently fetch GitHub release events, even though the renderer schema can display a release record supplied by another source.
- Public visibility can change; historical public fixtures and Git history need privacy review before a broad release.
- A generated Markdown snippet needs publicly hosted SVGs to work in a profile README. The tool does not host images or edit profiles.
- No visual browser screenshot/regression suite has been added yet. CI validates code, XML, deterministic SVG bytes and platform behaviour, not human visual quality.
- No source licence, package publication, stable version, GitHub Pages deployment or profile integration has been approved.

## Failures, challenges and lessons learnt

- **Disconnected factory concept:** visually attractive but not source-driven. Replaced with selected-week-to-seven-lanes model. Never regress to decorative, fabricated machinery.
- **Public repository discovery gap:** one omitted repository accounted for 455 missing historical events. A successful API response is not proof that repository discovery was complete. Reconcile IDs and verify omitted repositories independently.
- **Heatmap saturation:** an absolute threshold made 11 and 100 units look alike. The review branch calibrates intensity logarithmically against observed peak units and ranks the two visible machine groups by actual units.
- **SVG finish integration:** an initial isometric SVG markup matcher failed to decorate the isometric machines. The matcher was made tolerant of whitespace/attribute variation and the exports were regenerated. Always test both art directions, not only pixel output.
- **SVG size budget:** detailed machinery exceeded the old 150 KB limit. The test budget was raised to 180 KB while retaining a hard bound.
- **Windows command handling:** relying on shell wildcard expansion for Node tests was unreliable on Windows. Keep test file paths explicit in `package.json`; use the same `npm test` entry point from PowerShell.
- **Branch drift:** the six scheduled refresh commits after the PR's merge base changed only the live JSON snapshot and four live SVGs. The feature branch therefore has a stale live capture. Before merging, bring it up to date and regenerate live assets with the feature renderer, then re-run all verification.
- **Documentation drift:** historical handover notes and green Actions runs can become stale. Re-check current branch, code, tests, workflows and run SHA before every substantial task.

## Working commands

```powershell
node --version
python --version
npm test
python -m unittest discover -s tests -v
npm run verify:exports
npm run verify:live
.\verify.ps1
python -m http.server 8000
```

The browser preview is `http://localhost:8000/preview.html`. Use a separate output folder when rendering a user snapshot. On the review branch, also inspect `npm run audit:coverage`, `npm run create` and the manual any-user workflow; those features are not on `master` until PR #1 merges.

## Current workstreams and ownership gates

- **Default branch:** scheduled public showcase and baseline renderer/collector are active.
- **PR #1:** data-coverage safeguards, adaptive intensity, richer stage machinery, any-username bundle, manual workflow and local snapshot preview are under review, not shipped.
- **Before merge:** synchronise the live snapshot/assets, run current CI, inspect desktop/mobile visuals, and review historical fixture plus Git history for privacy.
- **Next:** accessibility and visual regression evidence, high-density readability, robust error UX and contributor onboarding.
- **Deferred:** GitHub profile integration, GIF generation and first stable release until data and visual work are substantially improved.
- **Owner approval required:** source licence, release/tag/packaging, profile edits, visibility changes, history rewriting or publishing destinations.

Keep this handover concise and update it when an implementation decision or milestone changes. For the live status, update `docs/PROJECT_STATUS.md` rather than adding another dated status paragraph here.

## Fresh-agent instruction

> First inspect the current checkout, worktree, branches, recent Git history, default branch, open PRs and Actions checks. Read `AGENTS.md`, `docs/PROJECT_STATUS.md` and the relevant technical docs. Build an evidence-backed implemented/partial/planned/deprecated/unverified matrix from code, tests and workflows. Preserve user changes. Work only on Code Factory, preserve public-only provenance and deterministic exports, run the real tests, update the status/docs, and report exact remaining gaps. Never assume a prior summary or unmerged PR is the current default-branch implementation.

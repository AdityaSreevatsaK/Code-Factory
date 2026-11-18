# Migration record | GitHub Activity Studio to Code Factory

## Source and destination

- Original concept: `AdityaSreevatsaK/GitHub-Activity-Studio`, branch `concept/code-factory`
- Historical development PR: https://github.com/AdityaSreevatsaK/GitHub-Activity-Studio/pull/5
- Source baseline commit: `fa69aad0e994d82924685d6e7291dde34f7505ae`
- Standalone destination: https://github.com/AdityaSreevatsaK/Code-Factory
- Migration performed: **18 November 2026**
- Reason: Code Factory has its own engine, assets, collector, UI and tests and is intended to evolve as an independent project. Other Activity Studio experiments must remain untouched.

## Migrated source material

All **25** concept files from `concepts/code-factory/` were inspected. Source content was carried into the standalone repository, with path changes and separation of the retired renderer. The shared synthetic fixture from `shared/fixtures/demo-activity.json` was copied into `fixtures/demo-activity.json`. The original shared v1 data contract informed `docs/DATA_CONTRACT.md`, which now belongs to Code Factory.

| Original path prefix | New location | Intent |
| --- | --- | --- |
| `concepts/code-factory/calendar-factory.mjs` | `calendar-factory.mjs` | Current authoritative renderer |
| `concepts/code-factory/refresh-public-activity.mjs` | `refresh-public-activity.mjs` | Public collector, now supports generic username CLI |
| `concepts/code-factory/preview.html` | `preview.html` | Browser preview, now loads fixtures from local root |
| `concepts/code-factory/exports/` | `exports/` | All **14** committed SVG images, transferred with identical Git blob hashes |
| `concepts/code-factory/fixtures/` | `fixtures/` | Dated account snapshot, only public observed events |
| `concepts/code-factory/tests/` | `tests/` | Node and Python regression tests |
| `concepts/code-factory/factory.py` | `legacy/factory.py` | Original pre-calendar artwork, explicitly retired |
| `concepts/code-factory/verify.ps1` | `verify.ps1` | Windows tool; paths adjusted to standalone root |
| `shared/fixtures/demo-activity.json` | `fixtures/demo-activity.json` | Exact source demo fixture carried over |
| Original concept README | New root `README.md` | Re-authored for public standalone audience; account preview retained first |

The original source branch and PR are historical references and should not be used for ongoing Code Factory feature work after successful migration. This migration does **not** require merging into GitHub Activity Studio's `master` or editing its other concepts.

## New standalone infrastructure

Added `AGENTS.md`, `docs/AI_AGENT_HANDOVER.md`, architecture, design, contract, development, migration, security, contributor guidance, metadata proposal, roadmap and changelog, plus `package.json`, offline GitHub Actions CI, Git attributes/ignore, cross-platform asset validation and an optional metadata-update script.

## Data and accuracy

The synthetic fixture is unchanged. The public account snapshot remains the dated, previously observed **1,219-record** capture, not an authoritative GitHub contribution count. No private data or GitHub tokens were migrated. The personal artwork remains static for README rendering and the optional animated variants remain local-browser resources.

## Validation checkpoints

- Verify the source and destination SVG asset hashes match where no artwork changes were intended.
- Run native `npm test` and Python `unittest` after updating relative paths.
- Verify all 14 SVGs reproduce from their known inputs.
- Exercise the interactive preview and generic collector on a real browser/Windows installation.
- Inspect new repository CI and default branch.
- Only after successful handover, mark the old draft PR as superseded. Avoid deleting source code or erasing original provenance without approval.

**Source history note:** This is a clean standalone repository history with an explicit trace to the original SHA/PR. Git commit ancestry was not automatically transplanted across repositories. The source branch preserves the earlier development history.

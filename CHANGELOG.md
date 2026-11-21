# Changelog

All significant Code Factory milestones are documented here. No release version or Git tag has been published.

## Under review | Draft PR #1, public coverage, visual overhaul and reusable account bundles

Implemented on `feat/public-coverage-and-factory-density`, not merged to `master`:

- Anonymous public-visibility rechecks for omitted previously observed repositories and offline event-ID coverage reconciliation.
- Logarithmic activity scale, daily load indicators, busiest-machine selection and stage-specific original machinery.
- Active-day-only conveyors, moving gears/belts and reduced-motion-aware browser animation; all 18 SVGs regenerated.
- Any-username bundle CLI with four static SVGs, public JSON and README Markdown; manual forkable workflow with temporary artefact output.
- Local JSON import and static SVG download in the browser preview.
- Expanded cross-platform tests and current CI evidence. See `docs/PROJECT_STATUS.md` for the latest branch freshness and checks.

## Unreleased | Public coverage and factory intensity, 18 November 2026

- Audited the 1,219-to-894 public activity capture discrepancy: 457 older event IDs absent, 132 newer records, 455 missing from one omitted owned public-repository listing.
- Added anonymous current-public metadata rechecks for previously observed repositories and fail-closed collection behaviour; never copy old events merely to inflate new totals.
- Added reproducible offline source-coverage comparison and collector security tests.
- Recalibrated yearly heatmap intensity logarithmically, added source-backed five-segment daily load indicators and prioritised the busiest observed groups on dense days.
- Regenerated all 18 historical and live SVG exports for deterministic GitHub profile previews.
- Kept unrelated concepts, private data and live GitHub profile untouched. Development remains in a review branch pending CI and visual checks.

## Unreleased | Standalone repository migration, 18 November 2026

- Migrated the calendar-driven Code Factory renderer and interactive browser preview out of GitHub Activity Studio.
- Preserved 14 original SVG images, a synthetic demo contract fixture and a dated real public GitHub account snapshot.
- Added a generic public GitHub username CLI for future snapshot refreshes.
- Kept the historical Python pre-calendar renderer separate in `legacy/`.
- Added comprehensive `AGENTS.md`, AI handover, architecture, design, data contract, development, migration and contributor/security documentation.
- Added zero-dependency Node scripts, deterministic SVG asset verification, Windows PowerShell helper, and GitHub Actions CI on Windows and Linux.
- Maintained truthful public-event semantics; no official-contribution totals, private data, live profile edits, release tags or licence selection.
- Verified the migration in GitHub Actions on both Ubuntu and Windows; closed the superseded Activity Studio draft PR without merging or deleting the source branch.

### Earlier concept history

Original implementation was developed on `AdityaSreevatsaK/GitHub-Activity-Studio` branch `concept/code-factory`, draft PR #5. The decisive design revision linked the selected calendar week directly to source-backed daily workshop machines, signal lines and cargo rather than drawing an unrelated factory below a calendar.

# Changelog

All significant Code Factory milestones are documented here. No release version or Git tag has been published.

## Under review | Draft PR #1, public coverage and visual/reuse improvements

The following work is implemented on `feat/public-coverage-and-factory-density` but is **not part of `master`** until PR #1 is merged:

- Anonymous public-visibility rechecks for previously observed repositories and offline event-ID coverage audit.
- Logarithmic activity intensity, daily load indicators, busiest-machine selection and richer source-backed stage machinery.
- Active-day-only conveyors, moving gears/belts and reduced-motion-aware browser motion; all 18 SVGs regenerated.
- One-command public username bundle, manual forkable workflow, local JSON preview import and static SVG download.
- Expanded Node/Python regression tests and Windows/Ubuntu verification.

See [project status](docs/PROJECT_STATUS.md) for the branch's freshness, CI evidence and merge prerequisites.

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

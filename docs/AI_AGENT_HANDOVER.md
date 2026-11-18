# AI agent handover | standalone Code Factory

> Read `/AGENTS.md` first. This document is for handovers between autonomous coding sessions. It records the project's real history, interfaces, constraints and next work so new agents do not restart obsolete ideas or make false assumptions.

## Identity and provenance

- **Canonical repository:** https://github.com/AdityaSreevatsaK/Code-Factory
- **Origin:** https://github.com/AdityaSreevatsaK/GitHub-Activity-Studio
- **Origin development branch:** `concept/code-factory`
- **Origin draft PR, closed as superseded without merging:** https://github.com/AdityaSreevatsaK/GitHub-Activity-Studio/pull/5
- **Source migration baseline SHA:** `fa69aad0e994d82924685d6e7291dde34f7505ae`
- **Migration date:** 18 November 2026
- **Primary owner/account showcase:** `AdityaSreevatsaK`
- **Product description:** source-backed public GitHub activity rendered as a contribution-calendar-powered miniature factory, isometric and pixel styles, dark/light, still/optional browser animation, and offline tests.
- **Operating system target:** Windows + PowerShell, no WSL dependency; CI additionally covers Linux.
- **Runtime:** Node 20+, Python 3.11+ for legacy/export integrity tests. Node built-ins only, no npm install and no paid API.

## What failed in the original concept

The first prototype put attractive miniature machines below a calendar but did not actually connect the machines to daily activity. The user explicitly rejected that. The corrected design is **calendar-first**: the highlighted column expands into seven daily workshop lanes. A source event runs its corresponding factory stage on its corresponding day; inactive days do not animate or manufacture. The calendar and factory share one normalised data model. Do **not** revert to an unrelated factory beneath the heatmap.

The second priority was showing the user's **real public account** rather than an invented demo. A public-only GitHub snapshot and four account-specific SVGs were committed; demo art remains separate. Neither is GitHub's official contributions count.

## Current repository layout and exact calls

`calendar-factory.mjs` exports:
- `validSnapshot(input)`: strict normalisation, validation, dedup, UTC ordering.
- `calendarModel(input)`: 53 Sunday-start week columns, 7 days per week, UTC snapshot-bound event aggregation.
- `selectedModel(input, weekIndex?)`: chooses week 0..52 or recent active default; exposes `week`, `weekIndex`, `activeRepos`, `stages`.
- `dayMachines(day)`: group same repository/event kind on a day and preserve record IDs/total units.
- `render(input,{layout,theme,animated,selectedWeek})`: deterministic 1200x430 standalone SVG.
- `TYPES`: event-stage mapping and colours.

CLI `node calendar-factory.mjs [snapshot.json] [output-dir] [--week-index N]` generates eight base layout/theme/motion variants. Default input is `fixtures/demo-activity.json`; default output is `exports/` (do not run against committed assets accidentally when testing a changed renderer).

`refresh-public-activity.mjs` exports `collect`, `assertDate`, `sourceRepo`; CLI takes `--username`, `--since`, `--output`. The collector only calls GitHub's public search and public owned default-branch commit endpoints. Optional `GITHUB_TOKEN` affects rate limits, not which data may be committed. Fails closed on incomplete API data.

`preview.html` is a module-powered standalone local web page, **not** a GitHub Pages deployment. It defaults to the dated account fixture, with a switch to demo, clickable/keyboard week selection, a seven-day event ledger, theme, style, zoom and motion controls. It never calls GitHub live.

`exports/`: 8 standard demo variants; 2 demo historical static scenes, selected weeks 48 and 45; 4 personal account stills, selected week 51. Read `scripts/verify-exports.mjs` for the canonical filename and input selection matrix. The static SVGs are deliberately usable as Markdown image embeds on GitHub.

`legacy/factory.py` is the original pre-calendar art. It is **not** authoritative and cannot overwrite the current export directory by default. Keep isolated or remove only after an explicit documented decision.

## Public data truth and caveats

The dated `fixtures/adityasreevatsak-public-activity.json` snapshot was gathered from GitHub REST public search and authored commits on public owned default branches. At collection it contained **1,219 observed records/stages across 26 repositories**, including **499 commits, 332 PR opens, 273 PR merges, 115 issue opens**. The account previews highlight the complete week of 8–14 November 2026, containing **652 observed events**.

These are **not GitHub's official contribution totals**. PR opening/merging count separately, feature branches and some upstream contributions are missing, and GitHub search may omit other activity. The demo is sparse and **synthetic**. A blank public grid square means no observed input, not proven zero activity. Do not secretly supplement, estimate or adjust counts to make the artwork appear busier.

The public snapshot is not a recurring job. Refreshing later changes the source timestamp and possibly the appropriate selected week. Review the new snapshot, update frozen README statistics, and regenerate all relevant images with explicit provenance.

## Core engineering decisions

1. Deterministic SVG, original procedural geometry, zero external fonts/images or trackers.
2. 53 by 7 calendar; 1200 by 430 landscape artwork.
3. Isometric Foundry vs Pixel Works, light/dark palettes, distinct geometry and floors.
4. Five source-supported event stage machines. Releases only when release events exist.
5. Day lanes capped to two distinct machines, with explicit overflow disclosure. All events contribute to the calendar cells even when machines are visually abbreviated.
6. Machines, signal lines and static/animated parcels share source event identities; a PR-merge crate does not claim deployment.
7. Label escape, XML-safe characters and bounded inputs; per-repository `full_name` identity.
8. Browser keyboard navigation, reduced-motion preference, optional zoom and local HTTP server.
9. Still SVG for GitHub README; do not claim GitHub renders embedded SMIL animation.
10. Reproducible assets verified against exact deterministic render output.

## Commands for a fresh agent session

```powershell
git clone https://github.com/AdityaSreevatsaK/Code-Factory.git
cd Code-Factory
git status --short
node --version
python --version
npm test
python -m unittest discover -s tests -v
npm run verify:exports
.\verify.ps1
python -m http.server 8000
```

Preview at `http://localhost:8000/preview.html`. For a generic user, `node refresh-public-activity.mjs --username octocat --output fixtures/octocat-public-activity.json` uses the public GitHub API; note collection may fail on rate limits or pagination, and no private repos may be queried.

## Verification state at migration

Earlier source sessions executed **37 JavaScript regression scenarios in isolated JavaScript harnesses** and byte-compared 14 current SVG assets. This is meaningful but **not a substitute for native Node/Python/Windows/browser validation**. New offline CI and exact output checks have been added to the independent repo. GitHub Actions completed successfully on Ubuntu and Windows for migration commit `777b76b5d8273f2e408afd18548e3404ce58984c` (18 November 2026). Continue checking CI for any new commit rather than assuming subsequent work passes. A known accuracy boundary is that the calendar represents observed event units, not authoritative total contributions.

## Workstream boundaries

- **Allowed:** Code Factory renderer, data adapters, layouts, browser preview, CLI, tests, assets, documentation, build tooling, accessibility, security.
- **Not allowed without explicit approval:** other GitHub Activity Studio concepts; profile README; cloud deployment; private activity collection; changes to GitHub repository visibility, tags, release publication or licence.
- **Avoid:** installing a framework solely for decoration; hardcoding personal usernames in generic rendering paths; adding unsupported GitHub contribution claims; replacing readme stills with unverified animations.
- **Before a PR:** verify all exported SVGs match current renderer, include clear screenshots/descriptions and no credentials.

## Next prioritised backlog

P0: Exercise native Linux and Windows CI after migration; resolve actual issues. Check browser interaction and mobile detail zoom using Chrome/Edge, document screenshots/proof. Verify all README links and the generic `--username` collector.

P1: Improve selected-day legibility under a real dense account (hundreds of records in a week), including an accessible overflow drill-down and trustworthy heatmap legend. Ensure distinct low- versus high-count activity intensity.

P1: Public account onboarding: accept any username safely, make a reproducible refresh and SVG export guide, handle search pagination limits transparently and keep snapshots out of accidental commits.

P2: Accessibility audits, offline screenshot tests, size-performance budgets, output presets for profile README use, optional GIF generation with correct licensing and no animation in the static SVG.

P2: Review licence choice with owner, security documentation, contribution policy, tags, packaging and release automation. Do not publish a first stable release automatically.

## Suggested agent session start prompt

> You are taking ownership of Code Factory in `AdityaSreevatsaK/Code-Factory`. Read `AGENTS.md`, `docs/AI_AGENT_HANDOVER.md`, `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT.md` and the existing tests. Work only on Code Factory. Treat activity lineage and public-data provenance as hard correctness requirements. Run available tests, verify all SVGs, and commit narrow changes. Never modify another concept, private GitHub activity, profile README, release tags, licence or visibility without explicit permission. Start with the highest priority unverified native CI/browser work, then proceed through the scoped backlog.

Keep this document up to date when completing a milestone or changing an interface; it is a durable handover, not a marketing statement.

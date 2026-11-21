# Roadmap and open decisions

Use the status labels below instead of treating a checked box in an old document as proof that a feature shipped. The evidence-backed current state is in [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Completed on the default branch

- Standalone migration from GitHub Activity Studio.
- Calendar-first renderer, two visual layouts, two themes, local interactive preview and 18 deterministic SVG exports.
- Public-only GitHub collector and atomic snapshot generation.
- Approved six-hour public account refresh with scoped writes to one JSON snapshot and four live SVGs.
- Offline Node/Python tests and Ubuntu/Windows CI.

## Under review in draft PR #1

These capabilities are implemented on `feat/public-coverage-and-factory-density`, but are **not shipped on `master`**:

- Anonymous public-visibility rechecks for previously observed repositories omitted from the owned-repository listing.
- Exact event-ID coverage audit and the 1,219-to-894 discrepancy report.
- Logarithmic heatmap intensity, source-backed daily load meters and deterministic high-volume machine prioritisation.
- Stage-specific machinery details, active-only conveyors and reduced-motion-aware motion.
- One-command public username-to-factory bundle, static SVGs, snapshot and Markdown embed.
- Manual forkable workflow producing temporary artefacts without commits or profile edits.
- Browser import of local public snapshots and still-SVG download.

## Merge-readiness work

1. Bring PR #1 up to date with `master`. The branch was six commits behind at the audit checkpoint; those master commits contain refreshed public data and four live SVGs.
2. Regenerate live SVGs with the PR branch renderer from the latest snapshot. Do not reuse stale 18 November exports.
3. Re-run all Node tests, Python tests, historical/live asset checks and both Windows/Ubuntu CI jobs on the current head.
4. Inspect isometric and pixel artwork in desktop and mobile browsers at realistic GitHub README scale.
5. Review historical fixture and Git history for privacy and current public visibility. File deletion alone does not remove Git history.
6. Keep the PR in review until the evidence and owner approval are available. Do not merge it automatically.

## After the data and visual milestone

- Improve high-density day legibility and expose overflow activity accessibly.
- Add offline browser screenshot/visual regression checks and accessibility tests.
- Refine keyboard and screen-reader experience, contrast and responsive layout.
- Improve public-username collection error reporting, rate-limit guidance and reproducibility.
- Improve contributor onboarding and issue/PR templates based on actual external use.

## Deferred and approval-gated

- GitHub profile README integration and automated profile changes.
- Animated GIF generation. GitHub profile embeds should continue to use static SVGs.
- First stable release, tags, package publication or hosted deployment.
- Source licence selection. The repository is public but currently unlicensed; `package.json` is `private: true` and `UNLICENSED`.
- New scheduled accounts, new publication targets, repository visibility changes or Git history rewriting.

## Non-goals

No private repository collection, invented contributions, fake build/deployment events, paid API dependency, mandatory cloud service, or merging unrelated Activity Studio concepts into this repository.

## Definition of done

A milestone is complete only when the code is present on the intended branch, tests cover the behaviour, generated SVGs reproduce, CI passes on the current commit, documentation reflects the actual implementation, privacy and accessibility implications are reviewed, and any approval-gated decision has explicit owner approval.

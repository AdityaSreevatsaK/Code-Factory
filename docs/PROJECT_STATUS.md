# Project status and implementation matrix

> Verified on **21 November 2026** against the GitHub repository tree, default branch, open PR, commit comparison, live snapshot and Actions records. This is a dated checkpoint, not a substitute for the live-state bootstrap in `AGENTS.md`.

## Repository state

| Item | Verified state |
| --- | --- |
| Repository | [AdityaSreevatsaK/Code-Factory](https://github.com/AdityaSreevatsaK/Code-Factory), public |
| Default branch | `master` |
| Latest master commit at audit | `f0fd7be75adce1820c1f0c720e1d49fb865efd66`, scheduled data refresh, 21 Nov 2026 |
| Latest live snapshot | `2026-11-21T07:14:17Z` |
| Live snapshot size | **2,178 observed records** across **41 represented repositories** |
| Last successful refresh | [Run #44879286235](https://github.com/AdityaSreevatsaK/Code-Factory/actions/runs/44879286235) |
| Open development PR | [Draft PR #1](https://github.com/AdityaSreevatsaK/Code-Factory/pull/1), `feat/public-coverage-and-factory-density` |
| Licence/releases | No `LICENSE` file, no selected source licence, no published GitHub release. `package.json` is `private: true` and `UNLICENSED`. |

The live record count is the number of observed event/stage records in that snapshot. It is not GitHub's official contribution total and will change with each refresh.

## Implemented on `master`

- Standalone 53-week Sunday-start calendar with a selected week driving seven source-backed daily factory lanes.
- Isometric and pixel-art layouts, dark/light themes, still and optional local-browser animated SVG variants.
- Five renderer event kinds: commit, PR opened, PR merged, issue opened and release. The built-in collector currently collects commits, PRs and issues only.
- Public-only GitHub REST collector for PRs/issues and authored commits on public owned default branches; normalised v1 snapshots and atomic output.
- Interactive local browser preview, synthetic demo and frozen historical account fixture.
- Four static account SVGs refreshed approximately every six hours by the approved `master` workflow. Refresh publication is limited to the JSON snapshot and four live SVGs.
- Offline Node and Python tests, exact historical/live SVG verification, native PowerShell verifier and Ubuntu/Windows CI.
- Generic use is possible as a two-step process: collect a public user's JSON snapshot, then render that snapshot to a separate directory.

## Implemented on the review branch only

[Draft PR #1](https://github.com/AdityaSreevatsaK/Code-Factory/pull/1) contains the following work. None of it is on `master` until the PR is merged.

- Public coverage recovery: use previous public repository names only as hints, recheck omitted repositories through anonymous metadata, and scan only if current ownership and public visibility are confirmed.
- Offline event-ID coverage audit and a report of the 1,219-to-894 discrepancy.
- Logarithmic yearly activity intensity, daily source-backed load meters and selection of the two highest-volume machine groups on crowded days.
- Five distinct stage-specific machinery details, active-day-only conveyors, animated gears/belts and reduced-motion-aware motion.
- One-command username bundle: four still SVGs, public snapshot and `README-embed.md`; optional offline `--snapshot` input and validated HTTPS asset base URL.
- Manual, forkable GitHub Actions workflow that uploads temporary artefacts only. It does not commit files, host assets or edit a profile.
- Local JSON snapshot import and still-SVG download in the browser preview.

### PR branch freshness

At the start of this audit, PR #1 was **31 commits ahead and 6 behind** `master`. The six commits on `master` since the common base were scheduled refreshes that changed only `data/live-public-activity.json` and the four `exports/live-*-still.svg` files. A further documentation-only audit commit was then added to `master`; re-check the live comparison before merging. The PR branch still carries the earlier snapshot from `2026-11-18T09:34:29Z` with **894 records across 32 repositories**, while `master` carries the newer 21 November capture with 2,178 records across 41 repositories.

Before merge, update the PR branch from the current `master`, preserve its code changes, regenerate the four live SVGs using the PR branch renderer and latest snapshot, then rerun `npm test`, Python tests, both asset verifiers and Windows/Ubuntu CI. Do not copy old live SVGs over the new renderer output.

The pre-documentation PR code head passed [CI run #44331190624](https://github.com/AdityaSreevatsaK/Code-Factory/actions/runs/44331190624) on Ubuntu and Windows: 62 Node tests, 21 Python tests, 14 historical exports and four live exports. Check the current PR head and latest check run before relying on this result.

## Planned, deferred and retired

| Status | Work |
| --- | --- |
| Next | Desktop/mobile visual inspection at real GitHub README scale; dense-day and label legibility; keyboard/screen-reader and contrast review; offline visual screenshot regression. |
| Next | Recheck historical public fixture and Git history for repositories that may no longer be public. Do not rewrite history without explicit approval. |
| Planned | Improve contributor onboarding, issue triage, accessibility evidence, error messages and release documentation. |
| Deferred | Profile README integration, animated GIF output and first stable release. Revisit only after data accuracy and visual quality are accepted. |
| Approval-gated | Licence selection, version/tag strategy, package publication, hosted preview, profile changes, visibility changes and new publication targets. |
| Retired | Original pre-calendar Python artwork is preserved in `legacy/`; it is not the active renderer. Unrelated Activity Studio concepts remain separate. |

## Status maintenance rules

- Re-check the GitHub default branch, branch heads, PR merge state, recent commits and Actions checks before every substantial task.
- Update this file when implementation or review status changes. Record the commit/branch and evidence, not an AI assertion.
- Distinguish the default branch from open PRs. A green check on a PR SHA does not prove that the same code is on `master`.
- Keep current snapshot timestamps and counts here, not duplicated across several handover documents.

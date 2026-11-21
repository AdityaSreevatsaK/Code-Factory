# AGENTS.md | Code Factory agent operating contract

> Required reading: this file, `docs/PROJECT_STATUS.md`, `README.md`, `docs/AI_AGENT_HANDOVER.md`, `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT.md`, `docs/DESIGN_SPEC.md` and `docs/DEVELOPMENT.md`. Read the relevant source and tests before changing code.

## 0. Mandatory live-state bootstrap

**Before every substantial task, establish the state of the checkout. Never begin from an old chat summary, a remembered branch, or a status document alone.**

1. Confirm repository identity and location: `pwd`, `git remote -v`, `git rev-parse --show-toplevel`.
2. Inspect the worktree before touching anything:
   ```sh
   git status --short --branch
   git branch --show-current
   git branch -avv
   git diff --stat
   git diff
   git diff --cached --stat
   git diff --cached
   git ls-files --others --exclude-standard
   ```
   Preserve all existing edits and untracked files. Do not reset, clean, stash, overwrite or discard them unless explicitly authorised.
3. Establish history and branch relationship:
   ```sh
   git log -12 --oneline --decorate --all
   git show -1 --stat --oneline
   git fetch --prune
   git status --short --branch
   git rev-parse HEAD
   git merge-base HEAD origin/master
   git log --oneline --left-right origin/master...HEAD
   ```
   If a remote fetch is unavailable, say so and work from the refs that can be verified.
4. Inspect the actual current default branch, open PRs, PR base/head SHAs, changed files, latest Actions runs and conclusions. A feature branch is not part of `master` until merged. Do not infer merge status from a previous conversation or a green run on another SHA.
5. Inspect the current `package.json`, workflows, relevant source modules, tests, fixtures and generated assets. Verify that every command and claimed capability in the documentation exists in this checkout.
6. Classify each relevant capability as **implemented on this checkout**, **partially implemented**, **planned**, **deprecated/retired**, or **unverified**. Cite the code, tests, workflow or GitHub state that supports the classification. A checkbox or earlier AI statement is not proof.

If no local shell is available, use the GitHub repository API to inspect the default branch, current branch, tree, recent commits, PRs and Actions. Explicitly state that local worktree status and uncommitted changes could not be inspected. Never claim to have run local Git commands or tests that were not run.

**Evidence priority:** current code, tests, workflow definitions and live GitHub branch/PR/check state first; current project docs second; historical conversations and AI summaries as context only. When these disagree, trust verified implementation, correct the docs, and record the decision in `docs/PROJECT_STATUS.md`.

## 1. Mission and ownership

Code Factory turns validated, source-backed GitHub activity into a contribution-style 53-week calendar and seven miniature factory lanes for a selected week. Each machine and parcel must be explained by an actual event, date, repository and event stage. The factory is not a random simulation.

This is a standalone project, migrated from `AdityaSreevatsaK/GitHub-Activity-Studio`, branch `concept/code-factory`, historical draft PR #5. Do not modify that repository or sibling concepts such as Developer World or Open Source Metro as part of Code Factory work.

The owner prefers British English, concise technical communication and accurate claims. Do not name the owner's employer in public project copy. Do not merge PRs, publish packages/releases, create tags, change repository visibility/licensing, or edit the owner's GitHub profile without explicit approval.

## 2. Non-negotiable product and data invariants

1. **Calendar first:** retain 53 Sunday-start week columns and seven weekday rows. The selected week drives the seven daily lanes.
2. **Source lineage:** every visible machine, cargo item, count, tooltip and activity indicator must trace to validated `activity[]` records, including date, repository `full_name`, event `kind` and recorded `count`.
3. **Stage semantics:** commit = parts forge; PR opened = assembly; PR merged = sealing; issue opened = inspection; release = dispatch. A merge is not a deployment. An issue is not automatically a defect. The renderer accepts release records, but the built-in collector currently gathers commits, PRs and issues, not releases.
4. **Honest inactivity:** no observed input means no active machine. It does not prove zero GitHub contributions.
5. **Honest totals:** displayed values are observed event/stage units, not GitHub's official contribution count. PR opening and merging are separate observed stages.
6. **Repository identity:** group by canonical `owner/name`, never short name alone. Repeated same-repository/same-stage/day records may share a station, preserving record count and summed units.
7. **Time:** use UTC timestamps and the snapshot's `generated_at` cutoff. Do not count future or out-of-window events silently.
8. **Determinism:** same input and render options must produce byte-identical SVG. No random IDs, render-time clock reads, external image/font fetches or network calls.
9. **GitHub compatibility:** provide complete still SVGs for README embedding. Optional motion is a local-browser enhancement; do not claim GitHub renders SVG animation. Respect reduced-motion preferences.
10. **Visual identity:** preserve distinct Isometric Foundry and Pixel Works layouts, dark/light themes, readable labels and the 1200 × 430 landscape canvas. Do not sacrifice the calendar-to-factory connection for decoration.

## 3. Privacy, security and data coverage

- Only publicly observable GitHub activity may enter committed snapshots or public examples. Never query private repositories, even if a token could access them.
- The collector searches public PRs/issues and scans authored commits on publicly owned default branches. It does not cover every upstream/organisation contribution or feature branch, and does not collect releases today.
- GitHub search is paginated and has a 1,000-result ceiling per query. Incomplete, malformed, truncated or ambiguous collection must fail closed and preserve the previous good snapshot.
- Treat all JSON, API responses, labels, repository names, IDs, URLs and timestamps as untrusted. Validate schema and bounds, escape XML, reject dangerous controls, and prevent SVG scripting, XSS, path traversal and token leakage.
- `GITHUB_TOKEN` may improve API rate limits only. Never log, persist, commit, upload or embed it. Never put credentials in browser code or generated SVGs.
- The approved six-hour workflow on `master` updates only `data/live-public-activity.json` and four `exports/live-*-still.svg` files after tests and verification. Do not add publication targets or change the schedule without approval.
- `fixtures/adityasreevatsak-public-activity.json` is a frozen historical public snapshot. The scheduled live snapshot is separate. Other usernames' local snapshots are ignored by default; never commit them without provenance and privacy review.
- The first refresh omitted a previously observed public repository. The exact audit is in `docs/DATA_COVERAGE_AUDIT.md`. The current `master` collector does not yet contain the proposed anonymous recovery safeguard; PR #1 adds it. Never silently treat a missing repository as zero activity.
- Repository visibility is public, but there is no `LICENSE` file or reuse licence. `package.json` is private and declares `UNLICENSED`. Do not choose a licence or claim the code is open-source without owner approval.

## 4. Architecture and current file contracts

| Path | Responsibility |
| --- | --- |
| `calendar-factory.mjs` | Browser-safe snapshot validation, 53×7 model, selected-week aggregation, machine grouping, SVG renderer and zero-dependency Node CLI |
| `refresh-public-activity.mjs` | Public GitHub REST collector and atomic snapshot CLI; injectable request function for offline tests |
| `preview.html` | Framework-free local browser preview; loads committed JSON fixtures and renderer module |
| `fixtures/demo-activity.json` | Stable synthetic regression fixture |
| `fixtures/adityasreevatsak-public-activity.json` | Frozen historical public capture |
| `data/live-public-activity.json` | Approved scheduled public account snapshot |
| `exports/` | 14 historical/demo SVGs plus four scheduled live still SVGs |
| `scripts/generate-live.mjs`, `scripts/verify-live.mjs` | Generate and verify four live static SVGs |
| `scripts/verify-exports.mjs` | Byte-for-byte verification of 14 historical exports |
| `verify.ps1` | Native Windows test and all-18-export verifier |
| `legacy/factory.py`, `tests/test_factory.py` | Retained pre-calendar Python prototype and its tests; not the current renderer |
| `tests/` | Node regression/collector tests and Python XML/legacy tests |
| `.github/workflows/ci.yml` | Read-only Ubuntu/Windows CI |
| `.github/workflows/refresh-activity.yml` | Approved six-hour public snapshot refresh and five-file publication |
| `docs/PROJECT_STATUS.md` | Dated status record for default branch, review branches, tests and open gaps |
| `docs/` | Architecture, design, data contract, development, history, security and roadmap |

Check `package.json` and the actual tree before relying on this map. Feature-branch-only files and capabilities are identified in `docs/PROJECT_STATUS.md`; do not describe them as shipped on `master`.

## 5. Authoritative commands on the default branch

Requires Node.js 20+. Python 3.11+ is used for XML integrity and legacy tests. No `npm install` or runtime dependency installation is required.

```powershell
npm test
python -m unittest discover -s tests -v
npm run verify:exports
npm run verify:live
.\verify.ps1
node calendar-factory.mjs
node refresh-public-activity.mjs --username octocat --output output/octocat.json
node calendar-factory.mjs output/octocat.json output/octocat
python -m http.server 8000
```

The preview is at `http://localhost:8000/preview.html`. The first command collects public data; the second renders a supplied snapshot. Keep outputs in a separate ignored directory.

- `npm test`: the Node suites listed explicitly in `package.json`.
- `npm run verify:exports`: 14 frozen historical/demo SVGs.
- `npm run verify:live`: four live SVGs against the committed live snapshot.
- `.\verify.ps1`: Windows native Node/Python tests and comparison of all 18 SVGs. `-Regenerate` intentionally rewrites derived assets; inspect every diff.
- `npm run render:live`: regenerate the four live SVGs from the current committed live snapshot. It does not collect data.

Do not claim a command or test ran unless its actual exit status/result was observed. Report missing runtimes and unverified checks precisely.

## 6. Required change procedure

1. Complete the live-state bootstrap above. Record the exact branch, HEAD SHA, worktree state, default-branch relationship and relevant PR/check status.
2. Define acceptance criteria and identify affected code, tests, docs, fixtures, workflows and derived assets.
3. Make the smallest focused change. Keep rendering pure and browser-safe; isolate filesystem/network work in CLI or workflow code.
4. Add regression tests for source lineage, edge cases, hostile inputs, data coverage and cross-platform behaviour.
5. Run the full relevant tests and exact asset verification. Test Windows and Linux when scripts, paths or CLI behaviour change.
6. Regenerate SVGs only when the source renderer/input/options changed. Never hand-edit generated SVGs to hide a failed verifier.
7. Update `docs/PROJECT_STATUS.md`, `CHANGELOG.md`, `AGENTS.md` and the relevant technical docs when implementation or status changes. Keep history and plans separate from shipped capabilities.
8. Review the complete diff, secrets, public fixture provenance and generated outputs before committing. Use a focused branch and preserve existing user work.
9. Report exact commits, paths, tests, current PR/merge state and remaining unverified work.

## 7. Status and roadmap discipline

Use these meanings consistently:
- **Implemented:** present on the current branch and backed by code/tests/workflow.
- **Partially implemented:** only part of the end-to-end user journey exists.
- **Under review:** implemented on a named unmerged branch/PR, not shipped on the default branch.
- **Planned:** agreed future work without an implementation.
- **Deferred:** intentionally postponed.
- **Deprecated/retired:** retained only for compatibility/history.

Do not mark a PR-only feature as shipped on `master`. Do not mark a task complete because a previous agent said it was done. Refresh `docs/PROJECT_STATUS.md` after meaningful work and verify all status claims against GitHub.

Current priorities and release gates are in `docs/PROJECT_STATUS.md` and `docs/ROADMAP.md`. Desktop/mobile visual review, historical-fixture privacy review and a licence decision remain important. Profile integration, GIF output and the first release are deferred until the data and visual work is accepted.

## 8. Completion checklist

- [ ] Correct repository, branch, HEAD, worktree and PR state inspected
- [ ] Existing user edits preserved
- [ ] Implemented/partial/planned/deferred/retired claims evidence-checked
- [ ] Public-only provenance and stage semantics preserved
- [ ] Tests and all affected SVG exports verified
- [ ] Windows/Linux and accessibility implications reviewed
- [ ] Status, handover, roadmap and technical docs updated where needed
- [ ] No unapproved merge, release, tag, licence, visibility or profile change

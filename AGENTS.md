# AGENTS.md | Code Factory agent operating contract

> **Required reading for every AI coding agent:** this document, `README.md`, `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT.md`, `docs/DESIGN_SPEC.md`, `docs/DEVELOPMENT.md`, and `docs/AI_AGENT_HANDOVER.md`. Inspect relevant source and tests before changing code. This document is the canonical repository-specific guidance.

## 1. Mission and ownership

Code Factory is a **standalone, potentially open-source GitHub activity visualisation**. It transforms a validated, source-backed event snapshot into a recognisable 53-column Sunday-start contribution-style heatmap, with a highlighted week that **physically drives seven miniature factory lanes**. The machine and parcel for a day must be explained by an actual event in that day, repository and event stage.

This repository is **not** GitHub Activity Studio. Never modify its sibling projects (Developer World, Open Source Metro, profile themes or other concepts) as part of Code Factory work. It migrated from `AdityaSreevatsaK/GitHub-Activity-Studio`, `concept/code-factory`, original draft PR #5. The original repo is reference material only. The independent repository is now the source of truth.

Project owner: `AdityaSreevatsaK`. The user prefers British English, clear technical communication, and truthful claims. Do not reference their employer in public documentation. Do not merge, tag a release, publish a package, alter repository visibility, or change the owner's live GitHub profile without explicit permission.

## 2. Non-negotiable product invariants

1. **Calendar-first**: keep 53 week columns and seven weekday rows. No unrelated factory illustration below a disconnected log.
2. **Source lineage**: each visible machine and parcel traces to specific `activity[]` records, date, repository `full_name`, stage `kind` and recorded `count`. Do not invent contribution events, builds, deployments or metrics.
3. **Activity semantics**: commit = parts forge, PR opened = assembly, PR merged = sealing, issue opened = inspection, release = dispatch. A sealed PR is **not** evidence of deployment. A reported issue is not automatically a bug.
4. **Idle truthfully**: no event means no active machine. The visual cell can only mean *no observed record*, never a verified zero official contributions total.
5. **Counting**: observed event/stage units are **not GitHub's official contribution count**. PR opens and merges are separate stages. Display provenance and limitations.
6. **Repository identity**: identify repositories by `owner/name` `full_name`. Collisions between short names cannot merge activities. Multiple records of the same repository/type/day group into one station with accurate units and record count.
7. **Calendar window**: use UTC timestamps. No event after `generated_at` or outside the 53-week window may silently change a displayed count; disclose filtering when needed.
8. **Render deterministically**: same input, layout, theme, selected week and motion flag produce byte-identical SVG. No randomness, clock reads inside rendering, external images or network calls.
9. **GitHub compatibility**: embed still SVGs in READMEs. Browser motion is optional; do not promise GitHub SVG animation. Honour reduced-motion preferences.
10. **Two art directions**: retain distinctive isometric and pixel-art visual grammar, dark and light palettes, 1200 × 430 profile-friendly SVG. New artwork must still resemble the contribution chart.

## 3. Privacy and security boundaries

- Only public account data is permitted in committed fixtures and public examples. The collector is constrained to `is:public` issue/PR search and **explicitly public owned repositories** for commit queries. Do not access private repositories or expose their names, metadata or aggregates.
- Treat all snapshot fields, display labels, event URLs and GitHub API responses as hostile. Validate schema, enforce bounds, prevent XML injection, SVG scripting, XSS, untrusted URL fetches and token exposure.
- `GITHUB_TOKEN` is optional for rate limits. Never print, persist, commit, upload, echo or embed it. Never put a token in browser JavaScript or a static SVG.
- Public GitHub APIs are rate-limited, paginated and incomplete for total contributions. **Fail closed** on partial/ambiguous fetches. Make refresh atomic: preserve the previous known-good snapshot if any request fails. No paid services, cloud infrastructure or network-dependent CI tests.
- The historical account capture in `fixtures/adityasreevatsak-public-activity.json` remains frozen. The separately approved six-hour workflow updates only `data/live-public-activity.json` and the four `exports/live-*-still.svg` images. Never silently overwrite historical fixtures or add new publication targets.
- `fixtures/*-public-activity.json` files for other usernames are ignored by default. Never override `.gitignore` to commit someone's snapshot without reviewing its public provenance.
- Repository visibility is currently public; **no third-party reuse licence has been selected**. Do not add MIT/Apache/GPL or state that the code is licensed without the owner's decision.

## 4. File and interface contracts

| Path | Public interface and purpose |
| --- | --- |
| `calendar-factory.mjs` | Pure `validSnapshot(input)`, `calendarModel(input)`, `selectedModel(input, weekIndex)`, `dayMachines(day)`, `render(input,options)`, `TYPES` exports, plus a zero-dependency Node CLI |
| `refresh-public-activity.mjs` | `collect({request,now,since,login})`, `assertDate`, `sourceRepo`, and public GitHub REST refresh CLI |
| `preview.html` | One-page ES module browser preview; imports renderer without invoking Node-only code. Sources are local `fixtures/` JSON files |
| `fixtures/demo-activity.json` | Isolated stable synthetic scenario, must always be labelled demo |
| `fixtures/adityasreevatsak-public-activity.json` | Dated, incomplete but genuine public showcase data |
| `exports/` | 18 SVGs: fourteen frozen historical/demo images plus four approved scheduled live images |
| `data/live-public-activity.json` | Public-only auto-refreshed account input, separate from frozen fixtures |
| `scripts/generate-live.mjs` and `scripts/verify-live.mjs` | Current-week generation and integrity checks |
| `.github/workflows/refresh-activity.yml` | Approved six-hour schedule, validates and commits five generated files only |
| `tests/test_calendar_factory.mjs` | Node renderer/model regression |
| `tests/test_public_refresh.mjs` | Mocked public GitHub API collector regression, must stay offline |
| `tests/test_calendar_exports.py` | Python XML/asset contract tests |
| `legacy/factory.py`, `tests/test_factory.py` | Original pre-calendar Python prototype, kept isolated for provenance |
| `scripts/verify-exports.mjs` | Cross-platform deterministic regeneration checks |
| `verify.ps1` | Windows native verification, optional explicit `-Regenerate` |
| `docs/` | Architecture, design vocabulary, contract, development, handover, provenance and roadmap |
| `.github/workflows/ci.yml` | Read-only, deterministic Linux/Windows CI |

**Do not break these paths or exports without updating all callers, tests, docs and committed images.** Keep the renderer dependency-free and browser-safe. Place any Node filesystem imports only in CLI code. Keep I/O separated from rendering.

## 5. Authoritative commands

From repository root, on Windows PowerShell or a standard shell:

```text
node --version                           # Node >=20
npm test
python -m unittest discover -s tests -v # Python >=3.11
npm run verify:exports                   # 14 historical/demo images
npm run verify:live                      # 4 auto-refreshed public account images
node calendar-factory.mjs               # Regenerate 8 primary demo SVGs
python -m http.server 8000               # Open http://localhost:8000/preview.html
```

On Windows, `.\verify.ps1` runs the native checks. `.\verify.ps1 -Regenerate` intentionally rewrites all 18 exports, including the two pinned historical demo stills and four account stills. Prefer read-only verification while reviewing; carefully inspect any SVG diff before committing.

**Do not claim a test ran unless it actually ran.** If a particular runtime is unavailable, state exactly which checks were executed in a substitute harness and which remain unverified.

## 6. Change procedure for agents

1. **Inspect** the relevant files, tests and baseline. Define exact acceptance criteria, source boundaries, expected data semantics and affected SVGs.
2. **Implement** only Code Factory functionality. Prefer small, reviewable changes; avoid new frameworks, dependencies, paid services, cloud collectors or unrelated profile changes.
3. **Prove lineage** with a test: changing/adding/removing an event must predictably change the correct cell, day, machine and cargo, and never invent a new station.
4. **Check hostile inputs** (XML controls, directional overrides, malformed repo names, UTC dates, duplicate IDs, overflow, API partial data, rate limits).
5. **Run both Node suites, Python tests and all-asset verification**. Cover Linux and Windows path behaviour when editing CLIs or scripts.
6. **Regenerate derived exports deliberately** if the renderer or fixture changes. Ensure README stills remain current; preserve labelled demo and public-source boundaries.
7. **Update documentation** and the AI handover when interfaces, architecture, data coverage, assets or workflows change.
8. **Report** exact code changes, paths, tests run, known limitations and PR/branch status. Never overclaim success.

When preparing a public-facing change, check copyright, image licensing, dependency and credential hygiene. Procedural factory assets are originally rendered SVG geometry; do not introduce copied game sprites or branded artwork.

## 7. Focused next development priorities

- Verify the migrated root-layout project in native Node and Python, plus Chrome/Edge desktop and mobile.
- Improve readability for high-density days and heatmap intensity while keeping source-backed activity distinct from GitHub official contribution totals.
- Add a generic username/refresh workflow without a site deployment or profile edits; keep collector failures atomic and public only.
- Add automated accessibility/visual regression checks that run offline and do not need paid APIs.
- Discuss licensing, versioning, distribution, and publishing strategy before any stable public release.
- Consider a reusable output preset for GitHub profile embedding. Preview in repo first; never write to someone's profile automatically.

## 8. AI agent completion checklist

- [ ] Scope limited to Code Factory; no modification to Activity Studio or profile
- [ ] Input/output provenance and event-stage semantics remain truthful
- [ ] No private inputs, secrets, untrusted SVG execution or implicit network fetches
- [ ] Demo and real captures visibly differentiated
- [ ] Native tests and all 18 SVG export checks executed or explicitly marked unverified
- [ ] Windows and Linux workflows preserved
- [ ] Architecture, README and handover updated when needed
- [ ] No unapproved merge, release, visibility, profile or licence change

**Next document:** `docs/AI_AGENT_HANDOVER.md` contains a session bootstrap, historical decisions, migration record and a prioritised implementation backlog.

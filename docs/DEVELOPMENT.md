# Development and local verification

## Requirements

- **Node.js 20+**, no third-party Node dependencies. `package.json` defines scripts only.
- **Python 3.11+**, standard library only, for legacy rendering and committed SVG XML checks.
- **Windows PowerShell** is the primary contributor workflow. CI also verifies Windows and Ubuntu.
- Internet access is **not required** for rendering, preview, tests or CI; only the optional public GitHub refresh makes network requests.

## Initial clone

```powershell
git clone https://github.com/AdityaSreevatsaK/Code-Factory.git
cd Code-Factory
node --version
python --version
npm test
python -m unittest discover -s tests -v
npm run verify:exports
```

Do not assume native tests passed merely because the earlier migration's isolated JavaScript harness passed. Always check the current GitHub Actions results and local exit codes. No `npm install` is required.

## Run the preview

```powershell
python -m http.server 8000
```

Visit `http://localhost:8000/preview.html`. Choose the public account or synthetic fixture, select a week, change art style/theme/motion, and inspect the event ledger. ES modules and JSON requests are not guaranteed to work with `file://` direct opening.

## Render a snapshot

```powershell
# Output 8 canonical combinations from demo input to exports/
node calendar-factory.mjs

# Prefer separate output directory while developing
node calendar-factory.mjs fixtures/demo-activity.json output/test
node calendar-factory.mjs fixtures/demo-activity.json output/week48 --week-index 48
```

Layouts: `isometric`, `pixel`. Themes: `dark`, `light`. The generated set includes one still and one optional animated variant per combination. The browser can instead call the exported `render()` function with `selectedWeek`.

The renderer is deterministic; generated output must not include an uncontrolled current timestamp or random ID. Do not overwrite committed exports for a speculative style experiment.

## Refresh an account safely

```powershell
# Public data only, output for the new account is ignored by default
node refresh-public-activity.mjs --username octocat --output fixtures/octocat-public-activity.json

# Render without embedding the new account's capture in committed README
node calendar-factory.mjs fixtures/octocat-public-activity.json output/octocat
```

`GITHUB_TOKEN` can be set locally to improve REST rate limits, but must never be committed. The collector validates public visibility, fails closed on partial search or network failure, and writes atomically. It does not gather GitHub's official contribution calendar or private repository data.

`--since YYYY-MM-DD` overrides the rolling one-year start. GitHub Search caps results at 1,000 per query; the collector must reject overflow rather than silently dropping records. Do not relax these safeguards to make a refresh appear successful.

## Tests

```powershell
npm test
python -m unittest discover -s tests -v
npm run verify:exports
.\verify.ps1
```

`npm test`: Node built-in `node:test` suites for calendar model, deterministic SVG, source lineage, XML safety, accessibility, date boundaries, collector mock requests and public visibility.

`python -m unittest discover`: XML parser checks for committed SVG structure, accessibility metadata and source-backed cargo; separate tests cover preserved legacy Python code.

`npm run verify:exports`: checks all **14** committed SVGs against freshly generated in-memory renderer output, normalises only line endings, verifies size and absence of executable SVG content, and fails on stale art.

`.\verify.ps1`: runs native Node and Python suites and invokes the exporter CLI in temporary directories to compare all 14 files. `-Regenerate` rewrites all derived images intentionally. If a fixture or renderer changes, update the corresponding assets, verify differences and never commit a partially generated gallery.

## CI

The GitHub Actions workflow `.github/workflows/ci.yml` runs on pushes to `master`, pull requests and manual dispatch, on Ubuntu and Windows with Node 20 and Python 3.11. It requests **contents: read** only and does not collect live GitHub data, install npm dependencies, spend on APIs, or require a secret. Do not extend CI into scheduled refresh/publish without approval.

## Suggested development loop

1. Create a focused branch from current `master`.
2. Read `AGENTS.md`, the data contract and the impacted tests.
3. Reproduce the issue with synthetic and dense public fixtures, using small local test snapshots when helpful.
4. Write regression tests. For source mapping, assert exactly which date/repo/stage produces which machine/parcel and units.
5. Implement the smallest fix. Avoid crossing from browser-safe rendering into filesystem/network code.
6. Run all native checks. Regenerate assets if required and compare SVG diffs. Check static markdown images remain useful.
7. Update README and docs if interfaces, output semantics, requirements or public-data counts change.
8. Open a descriptive PR with evidence and unverified limitations. Do not tag a release or edit GitHub profile automatically.

## Troubleshooting

- **ES modules or JSON fetch fail in browser:** start a local HTTP server at repository root; ensure `preview.html` paths reference `fixtures/`.
- **SVGs appear stale:** run `npm run verify:exports`; then regenerate deliberately with `.\verify.ps1 -Regenerate` or `node calendar-factory.mjs` and inspect Git diff.
- **Windows CRLF mismatch:** committed SVGs use LF via `.gitattributes`, and verifiers normalise CRLF/LF only.
- **GitHub API 403/429:** check public API rate limit, optional local token and resume later; **do not** substitute fake data.
- **API 1,000 result cap:** narrow `--since` or implement tested date-window pagination that preserves all events; never truncate silently.
- **Current week shows incomplete activity:** future days after snapshot are explicitly future, not proven inactivity.
- **No generated private user image:** collector rejects private data by design. Do not work around this constraint.
- **Legacy Python renderer overwrites images:** use `legacy/factory.py` with its default `legacy/exports-legacy/`, never `exports/`.

## Review before publication

No release has been approved. Discuss a source licence with the owner before accepting outside code contributions. Review security guidance, source snapshot provenance, public data count labels, accessibility, test coverage and all SVGs. A public repository by itself is not a published package or an authorised integration into anyone's GitHub profile.

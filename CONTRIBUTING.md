# Contributing to Code Factory

Code Factory is a developing experiment. **The repository is public but its source licence has not yet been selected.** External contributions should be discussed with the owner before submitting code. Public visibility is not a grant of reuse rights.

## What belongs here

Work related to the Code Factory renderer, public-only collector, static and animated SVGs, interactive preview, data contract, accessibility, security, reproducible exports, CI and documentation. Work on Developer World, Open Source Metro, the owner's profile README, unrelated games or portfolio sites belongs in separate repositories.

## Before submitting

1. Read `AGENTS.md` and `docs/ARCHITECTURE.md`, `docs/DATA_CONTRACT.md`, `docs/DESIGN_SPEC.md`.
2. Confirm that the issue is reproducible with the synthetic fixture, and ideally with the dense public snapshot.
3. Create a focused branch from `master`; do not overwrite historical fixtures or gallery assets just to make tests pass.
4. Add or update deterministic tests, including event source lineage and hostile-input cases where relevant.
5. Run `npm test`, `python -m unittest discover -s tests -v`, and `npm run verify:exports`. On Windows run `.\verify.ps1`.
6. Regenerate SVGs **only if necessary** and provide before/after screenshots or links when changing visual details.
7. Ensure new fixtures are synthetic or genuinely public with documented provenance. No private repo data, credentials or tokens.
8. Write a PR that states intent, scope, exact test results, visual impacts, coverage caveats and any unverified checks.

## Commit and PR style

Use succinct, descriptive commit messages such as `fix(renderer): preserve zero-activity lanes` or `test(collector): reject incomplete pagination`. A PR should explain the user-visible impact and whether the GitHub-README still remains faithful to the selected calendar week.

Do not call events official GitHub contribution counts. Never infer deployments or CI success from merged pull requests. Avoid introducing dependencies, external image resources or hosted services for tasks the built-in SVG engine already handles.

## Discussion and behavioural expectations

Keep feedback specific, technical and respectful. Prefer evidence and reproducible cases over opinions about colours alone. Avoid personal information, credentials, scraping bypass instructions or third-party copyrighted sprites. For vulnerabilities follow `SECURITY.md`, not a public exploit report.

## Project ownership

The owner decides licence, visibility, release tags, accepted contributions, merges and any change to their live GitHub profile. Agent-initiated work is welcome as scoped code changes but should not silently alter these release/publication decisions.

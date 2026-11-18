# Security policy and public-data boundaries

## Project status

Code Factory is an experimental public repository, not a hosted service and not a stable release. No support or disclosure SLA is promised. Do not post tokens, private repository information, unpublished vulnerability details or personal secrets in public issues.

If GitHub's **Private Vulnerability Reporting** is enabled for this repository, use its private security reporting interface. Otherwise, start by contacting the repository owner through an appropriate private GitHub channel. Never include reproduction credentials in public issue comments.

## Trusted and untrusted components

**Trusted local code:** the Node renderer, public collector, static preview code, test harness and committed synthetic fixture, subject to ordinary code review. **Untrusted input:** all JSON snapshots, GitHub API responses, repo names, event IDs, URLs, dates and API pagination.

Renderer protections:
- Strong v1 schema and UTC timestamp validation.
- Repository identity by owner/name and duplicate-ID conflict detection.
- Bounded event/repository counts, event units and SVG size budgets.
- Rejection of XML-illegal controls, bidi overrides and malformed Unicode.
- Escaped labels in SVG text, attributes, titles and descriptions.
- Standalone SVGs with no external imagery, scripts or `foreignObject`.

Collector protections:
- Restrict search to `is:public`; explicitly filter repositories marked public and owned by the requested login.
- Restrict commit scans to publicly owned default branches.
- Reject incomplete searches, over-limit pages, malformed API results and contradictory event ordering.
- Write to a temporary file, then rename only after successful completion.
- Take `GITHUB_TOKEN` from an environment variable **only**, without logging or storing it.
- CI runs exclusively with committed snapshots and mocked API responses. No API token is required.

## Important known boundaries

The public REST strategy is **not equivalent to GitHub's official contribution calendar**. Do not represent blanks as authenticated zeroes, PR merges as deployments, or observed event units as GitHub's contribution totals.

The browser preview loads local JSON and imports a local ES module. Run it through a local HTTP server. Do not add a direct authenticated GitHub call, persistent cookies, user login or third-party telemetry without a documented threat model and consent.

A GitHub README image is a **static** SVG. Treat animated output as local-browser-only; no executable SVG is intended for README embedding.

## Mandatory checks before accepting public inputs

- Try malicious repo names, event IDs, Unicode controls, malformed timestamps and duplicate events.
- Ensure filenames and the username CLI option reject traversal.
- Confirm private repositories are never queried, even when a token has broad permissions.
- Confirm API errors never overwrite existing known-good snapshots.
- Review `git diff` for accidental `.env`, token values, private file names, shell histories or captured screenshots.
- Check exported SVGs with the cross-platform verifier and XML parser tests.

## Dependencies and releases

There are no npm runtime dependencies; Node and Python standard libraries only. GitHub Actions has read-only permission. No external collector service, scheduled publication, cloud infrastructure or paid API is required.

Source code is currently **unlicensed pending an explicit owner decision**. Do not treat public GitHub repository visibility as permission to redistribute or reuse third-party code; ensure introduced material is appropriately licensed if/when the project itself is licensed.

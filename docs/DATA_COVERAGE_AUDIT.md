# Public activity coverage audit · 18 November 2026

## Scope and evidence

Compared the two **committed public event snapshots** for @AdityaSreevatsaK:

| Capture | Timestamp (UTC) | Observed event/stage records | Represented repositories |
| --- | --- | ---: | ---: |
| Frozen historical example, `fixtures/adityasreevatsak-public-activity.json` | 17 Nov 2026, 08:01:43 | 1,219 | 26 |
| First scheduled refresh, `data/live-public-activity.json` at audit time | 18 Nov 2026, 09:34:29 | 894 | 32 |

**Exact ID reconciliation:** 1,219 historical records minus **457** records absent from the later snapshot plus **132** new records equals **894**. This is an observed-event comparison, **not** official GitHub contribution counts.

### Primary discrepancy

Of the 457 historical records missing from the refreshed snapshot, **455 originated from one publicly named owned repository**, `AdityaSreevatsaK/Taiyous-Personal-Library`:

| Source event | Not present in first refresh |
| --- | ---: |
| Authored commits | 373 |
| Public pull requests opened | 43 |
| Public pull requests merged | 38 |
| Public issues opened | 1 |
| **Total** | **455** |

The other two missing historical records were public PR-opening events previously associated with a different repository. No evidence was found that the 455 missing source events were deleted.

**Evidence for a discovery gap:** the first scheduled refresh recorded a scan of 34 publicly owned repositories, but the repository above was **absent from its scanned-repository list**. During the subsequent audit GitHub reported that repository as **public**. The precise reason it was missing at the earlier collection time is not established. A visibility change, listing timing or public API inconsistency are possible explanations, not verified historical facts.

### Why simply displaying the newer total is misleading

The live image used fewer observed source records, making many active days appear less busy even though the historical snapshot held valid public evidence. A fresh snapshot can legitimately differ when the measurement window advances or repository visibility changes. The renderer must not silently fill missing events with invented values, and the collector must not access private repositories to resolve them.

### Safeguards implemented on the proposed branch

1. The public collector accepts repository hints from the preceding snapshot and an optional frozen historical baseline.
2. If the public-owner repository listing omits a known owned repository, the collector checks its GitHub repository metadata **without credentials**. Only an explicitly public repository owned by the requested username may then be scanned.
3. An unavailable/private repository is excluded from the next snapshot. No private name or historical event is retained in the generated public output. Public API errors fail the refresh before publication.
4. The refresh workflow passes the frozen historical snapshot as a baseline, alongside the prior live snapshot. The baseline is **not** copied into new output; it is merely a list of candidates requiring independent public verification.
5. The review branch adds an offline `npm run audit:coverage` command to reconcile event IDs and highlight omitted repository scans. This script is not present on `master` until PR #1 merges.
6. Automated tests cover an omitted-but-still-public repository, an unavailable/private repository, a public metadata API failure, and deterministic ordering and data lineage.

### Remaining limitations

- Public GitHub REST activity is not GitHub's official contribution graph.
- The collector includes authored commits on publicly owned **default branches**, not every feature branch or third-party upstream commit.
- A PR opening and its later merge are distinct observed event/stage records, while GitHub's contribution rules differ.
- The first historical snapshot and first live snapshot have slightly different one-year start dates; small changes in coverage are expected.
- The fixed historical capture remains separate from the automatically refreshed `data/live-public-activity.json`.
- No previous-public repository may be scanned merely because it appears in a historical fixture. It must pass a fresh, **unauthenticated public-visibility verification**.
- A future capture may still contain fewer records for legitimate reasons. The audit identifies where counts changed; it cannot assert which unobserved events occurred.

Re-run the report on `feat/public-coverage-and-factory-density`:

```powershell
npm run audit:coverage
npm test
npm run verify:exports
npm run verify:live
```

The audit command is not available on the current default branch until PR #1 is merged.

On the proposed branch, expect the four live SVG assets and fourteen historical assets to change due to the separate, intentionally improved adaptive heatmap renderer. Keep the repository changes in a reviewable pull request, without modifying any unrelated GitHub projects or the owner's profile.

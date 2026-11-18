# Repository metadata proposal

**Canonical repository:** https://github.com/AdityaSreevatsaK/Code-Factory

The connected GitHub file and Git-objects tools can edit repository contents, but do not expose GitHub's administrative repository About/description/topics mutation. This proposal and the included optional local PowerShell script allow the owner to apply reviewed metadata with GitHub CLI, without changing any source files or repository visibility.

## Short GitHub About description

> Turn observed public GitHub activity into an interactive contribution-calendar factory. Deterministic SVGs, isometric and pixel art, offline-first.

This is intentionally generic. Code Factory works with a normalised JSON contract and a public-only username collector; the current owner's fixture is an example, not a requirement.

## Suggested topics

`github-profile`, `github-activity`, `github-contributions`, `svg`, `data-visualization`, `pixel-art`, `isometric`, `developer-tools`.

## Longer description for agents, directories and project listings

**Code Factory** is an original, zero-dependency Node.js visualisation project that turns observed public GitHub events into a recognisable 53-week contribution-style heatmap driving a seven-day miniature production factory. Every source-backed commit, opened pull request, merged pull request, issue and release operates an appropriate machine and cargo parcel on its recorded day. The art has two genuine layout styles, Isometric Foundry and Pixel Works, each with light/dark themes and GitHub-compatible static SVG exports. Its standalone browser preview supports week selection, keyboard controls, a source-backed ledger, mobile zoom and optional reduced-motion-aware local animation. A public-only GitHub REST collector produces auditable, dated JSON snapshots for any supported username; the renderer also works completely offline from a stable synthetic fixture. The repository contains detailed architecture and AI-agent operating instructions, source validation/security checks, tests, and Linux/Windows CI. Observed public event counts must not be presented as GitHub's official contribution totals. The project is a prototype with no approved stable release or code licence.

## Optional manual application

```powershell
# First preview the proposed metadata
.\scripts\update-repository-metadata.ps1

# Then, if approved, apply through your authenticated GitHub CLI
.\scripts\update-repository-metadata.ps1 -Apply
```

The script uses `gh repo edit` and requires local GitHub CLI authentication. It does not change repository visibility, branch defaults, releases, code, GitHub profile README or other repositories.

## GitHub tagline and social preview

No external or copyrighted artwork should be used. A profile-style source-backed account image from `exports/account-isometric-dark-still.svg` is a candidate for a future social preview, but GitHub repository social-preview settings are not configured by this migration. Never claim they were set.

# Roadmap and open decisions

Code Factory is an experimental concept with a working renderer, public capture and static SVG gallery. Prioritise correctness, visual legibility and source-data provenance over shipping features quickly.

## Phase 0 | Standalone migration and native verification

- [x] Create the independent repository and root-layout renderer/preview.
- [x] Migrate synthetic and public account snapshots and all 14 SVGs.
- [x] Preserve and isolate the original Python renderer.
- [x] Add comprehensive AI-agent, architectural, development and migration documentation.
- [x] Add no-dependency Node scripts, offline Windows/Linux CI and SVG reproduction checks.
- [x] Observe green GitHub Actions runs on both operating systems (18 November 2026).
- [ ] Verify the native Windows PowerShell helper and browser preview manually.
- [ ] Confirm a generic public username collection and rendering end-to-end.

## Phase 1 | Visual and usability quality

- [ ] Evaluate dark/light pixel/isometric artwork on GitHub desktop and mobile.
- [ ] Improve heatmap distinction between lower and higher observed counts.
- [ ] Improve legibility under high-density activity and narrow mobile displays.
- [ ] Support accessible exploration of hidden events beyond two stages per day.
- [ ] Add visual screenshot regression tests that remain offline and deterministic.
- [ ] Confirm selected-week focus, contrast and reduced-motion behaviour.

## Phase 2 | Public-data and generic user experience

- [ ] Formalise public-only collection semantics, including API search caps and partial data warnings.
- [ ] Add a reproducible, easy username-to-SVG workflow without background paid API calls.
- [ ] Consider a safe local refresh CLI that can generate images without altering checked-in showcase data.
- [ ] Keep private and employer-linked information out of public snapshots.
- [ ] Distinguish public events from GitHub's own contribution totals in all designs and documentation.

## Phase 3 | Public release design

- [ ] Agree an explicit code licence with the owner; **none has been selected**.
- [ ] Review contribution policy, support expectations, security and release cadence.
- [ ] Decide on versioning, changelog and packaging/distribution.
- [ ] Provide a static profile-README embedding guide, with manual opt-in only.
- [ ] Decide whether animated GIF export adds value; never rely on GitHub inline SVG animations.
- [ ] Confirm no copy of protected sprites, fonts or external assets.

## Non-goals

No automatic GitHub profile edits, no private repository collection, no fake contribution counts, no paid LLM APIs, no cloud deployment requirement, no merging into other Activity Studio concepts, and no unapproved publication of a stable release.

## Decisions awaiting owner approval

- Source licence (e.g. MIT or Apache-2.0), which grants reuse rights.
- Public release/tag strategy and repository distribution.
- Any hosted preview, scheduled public refresh, image publication or profile integration.
- Deleting the old concept branch: draft PR #5 has already been closed as superseded, without merging. Retain the original branch until the owner explicitly authorises deletion.

## Definition of done for next milestone

Native CI passes, both art directions remain calendar-linked and readable, all 14 SVGs reproduce, generic username refresh cannot expose private data, and documentation/agent instructions match the actual repository. Any unverified Windows or GitHub UI behaviour must be identified explicitly.

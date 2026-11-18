# Code Factory design specification

## Core concept

**The calendar is the factory's input, not a decoration.** The user must recognise GitHub's contribution-calendar grammar at a glance. They select a week; seven daily lanes emerge below. Each daily event drives its corresponding machine and cargo. No unrelated machines should run, and a zero-input day must remain quiet. This was the explicit redesign decision after the earlier prototype's disconnected machines were rejected.

## Composition and responsive behaviour

- Canonical artwork: **1200 × 430 SVG**, embedded full width in a GitHub README as a still image.
- Upper region: a 53-week, Sunday-to-Saturday heatmap, year/month cues, weekday legend, 53 independently targetable week groups and a clear selection highlight.
- Middle: seven visible, activity-intensity-coloured signal links joining the selected week conceptually to each day's factory lane.
- Lower region: seven adjacent miniature workshops with weekday/day labels, source-backed machinery, event packages, counts, repo labels, and an honest overflow indication.
- Summary/legend: selected time range, recorded event/stage counts, event-type vocabulary and a clear DEMO vs PUBLIC label.
- On narrow screens the browser offers *Readable detail* zoom with horizontal scrolling; do not omit accessible controls or move the art outside the view.
- The browser is interactive; a GitHub README image is not. Always commit a suitable still SVG.

## Two distinctive visual identities

### Isometric Foundry
Miniature industrial production: diamond-shaped platform faces, depth/shadows, metallic machinery, angled conveyors and a factory-floor texture. Keep labels and heatmap orthogonal and readable, even if machinery has perspective.

### Pixel Works
Crisp-edged rectangles, retro-console silhouettes, blocky factory components, pixel-floor tiles and discrete indicators. Do not merely change an isometric drawing's colour palette and call it a new layout. Both styles must use the *same source model* and display the same units.

### Palette
Dark/night shift and light/day shift have distinct background, panel, grid and text contrast. Five event types use a consistent semantic colour across both:
- Commit/parts: teal `#63d9bc`
- PR opened/assembly: blue `#90b6ff`
- PR merged/sealing: amber `#ffc27f`
- Issue opened/inspection: coral `#ff98a7`
- Release/dispatch: violet `#c8adff`

Colour is supplemental: source event type also appears in text/shape and machine tooltip. Activity strength is encoded by a bounded grid scale; zero is explicitly empty rather than fake activity.

## Source mapping examples

- An observed `commit` on Monday in repo `owner/a`, count 4, powers Monday's `owner/a` parts forge with four observed units and a matching cargo parcel.
- A Friday `pr_opened` on `owner/b`, count 1, powers only Friday's assembly machine.
- No observed event on Wednesday means an idle Wednesday lane, irrespective of whether the user's GitHub profile has unobserved private contributions.
- Two commit records for the same repository/day/stage combine in one machine, with the correct record count and summed units.
- More than two distinct machine groups on one day show two representative groups and a truthful overflow count; the heatmap and ledger retain all groups. Do not imply the hidden work did not occur.

The dated real showcase contains significantly denser activity than the synthetic fixture. New design work must be judged against **both**, especially for overlapping labels, low/high intensity discrimination and overflow.

## High-density activity, perceptual scale and machine priority

An absolute colour threshold of ten events made daily counts of 11 and 100 appear identical. Code Factory now calibrates its five active heatmap tiers logarithmically against the **highest observed daily unit count in the visible year**. Exact counts remain available in day tooltips, daily lane labels and source records; colour is deliberately a supplementary signal, never an official contribution score.

Each active workshop shows a slim, five-segment `data-load-level` indicator derived from the same calibrated source count. Empty workshops remain unlit. When activity produces more than two repository-stage groups for a day, the display selects the two groups with the **largest verified unit totals**, breaking ties by record count and stable repository identity. The missing groups are disclosed in an overflow note, with their counts still included in the calendar.

The activity legend states the observed daily unit range and the logarithmic nature of the scale. This is a meaningful visual correction, **not** an invitation to invent extra animation, commits or badges. Validate light and dark, pixel and isometric layouts using both the sparse synthetic fixture and the much denser public account fixture.

## Interactivity and accessibility

- The selected week is represented by one focusable calendar group, with `role="button"` and `aria-pressed` state.
- Keyboard: Enter/Space select; Left/Right move by week; Home/End jump to endpoints.
- HTML controls: source selector, layout, theme, motion, week, zoom, Previous, Next and Replay; each control must actually update the output.
- Keep an accessible day-by-day event ledger as a nonvisual explanation of why a lane runs.
- Every standalone SVG needs a meaningful `<title>` and `<desc>`. Machine and cargo titles should retain source identity and counts.
- Honour `prefers-reduced-motion`. The **still** image must fully communicate the factory without animation.
- Animated parcels must be tied to recorded events and fade at loop boundaries, not teleport visibly.

## Accuracy and integrity indicators

Source selection must be conspicuous. `source:"demo"` outputs visibly say `SYNTHETIC DEMO`; `source:"github"` says `PUBLIC GITHUB SNAPSHOT` and may display `@login`. Personal showcase data is public but incomplete. No machine, count, label, tooltip or summary may imply official GitHub contributions, CI builds, deployments, or repository ownership without a verified source event.

All source names are untrusted and must be escaped. All committed SVGs must reproduce byte-for-byte using the exact fixture, selected week and options.

## What not to build

Do not develop Developer World, Open Source Metro, snake, alternate profile sections or portfolio designs here. Do not replace the calendar with abstract squiggles or a random simulation. Do not introduce copyrighted game sprites, proprietary fonts, third-party image requests or browser-tracking code. Do not ship a live profile edit, network-dependent animated README or a claimed release without explicit approval.

## Review rubric

1. Recognisable GitHub-style calendar.
2. Visually obvious link from selected column to seven day lanes.
3. Source-proof machine stages and cargo; truthful idle/overflow handling.
4. Strong differentiation between isometric and pixel directions.
5. Legible text, clear relative activity intensity, usable mobile view.
6. Static GitHub compatibility and native keyboard/accessibility.
7. Complete deterministic SVG tests, including hostile input and dense-account cases.

A pretty image that fails point 2 or 3 is **not** a successful Code Factory design.

# Data contract v1

Code Factory accepts a **normalised snapshot**, not raw GitHub REST responses. The same schema serves both source-backed public captures and stable synthetic tests. Field names and meaning are versioned; an incompatible change requires a new `schema_version`.

## Example

```json
{
  "schema_version": "1",
  "source": "github",
  "generated_at": "2026-11-17T08:01:00Z",
  "user": {
    "login": "example-user",
    "url": "https://github.com/example-user"
  },
  "repositories": [
    {
      "full_name": "example-user/example-repo",
      "name": "example-repo",
      "url": "https://github.com/example-user/example-repo"
    }
  ],
  "activity": [
    {
      "id": "commit:example-user/example-repo:abc123",
      "kind": "commit",
      "repo_full_name": "example-user/example-repo",
      "occurred_at": "2026-11-10T12:00:00Z",
      "url": "https://github.com/example-user/example-repo/commit/abc123",
      "count": 1
    }
  ]
}
```

This example is illustrative; it is **not** a GitHub official contributions record. The fully committed synthetic fixture uses `source: "demo"` and includes sample data; the dated account fixture uses `source: "github"` and real observed events.

## Required and optional fields

| Key | Rule |
| --- | --- |
| `schema_version` | Exact string `"1"` |
| `source` | Exact `"demo"` or `"github"`. Renderer labels this distinction visibly |
| `generated_at` | ISO 8601 UTC with `Z`, seconds and optional 1 to 3 fractional digits |
| `user` | Optional object. Valid GitHub `login` must be 1..39 valid username characters when present. `url` is descriptive metadata |
| `repositories` | Array of unique repository objects, at most 5,000 |
| `repositories[].full_name` | Canonical `owner/name`, unique, non-empty, up to 240 chars. Never group by short name alone |
| `repositories[].name` | Optional display name, defaults to segment after slash |
| `activity` | Array of at most 10,000 event records, referencing known repository `full_name` |
| `activity[].id` | Unique logical source ID (up to 240 chars). Identical duplicate records deduplicate, conflicting IDs raise an error |
| `activity[].kind` | One of `commit`, `pr_opened`, `pr_merged`, `issue_opened`, `release` |
| `activity[].occurred_at` | Strict UTC timestamp, like `generated_at` |
| `activity[].count` | Safe integer 1..100,000; activity **units** from source, not universally GitHub contributions |
| `activity[].repo_full_name` | Must exist in `repositories`; do not infer ownership |
| `activity[].url` | Source provenance URL, optional to the renderer but required by the public collector's own output |
| `coverage`, `provenance` | Optional source notes; recommended for incomplete GitHub captures. No tokens or private metadata |

## Event and UI semantics

- `commit`: parts forge. An observed commit is **not** a claim that GitHub credited a contribution.
- `pr_opened`: assembly arm. PR creation is not a merge.
- `pr_merged`: sealing press. Merge does **not** imply deployment or release.
- `issue_opened`: inspection lens. Issue creation does not prove a defect.
- `release`: dispatch crane. Only actual recorded release events may trigger it. The current built-in GitHub collector does not harvest releases; this kind is available to snapshots produced by another explicitly documented source.

A day may contain several records; `dayMachines` combines identical repository + kind combinations into one station, totalling their recorded units. It draws no more than two distinct stations per day; the remainder is disclosed in the artwork and complete in the data model.

## Time and filtering

Week 0 begins on a Sunday approximately 52 weeks before the snapshot-generated current Sunday. Week 52 includes the snapshot's calendar week and may be incomplete. Events before the 53-week window or **after** the exact `generated_at` instant do not count. They are tracked as outside the visible snapshot window. Event timestamps and sorting are UTC, not browser local time; this guarantees reproducibility across India, the UK, the US and CI machines.

## Validation and trust

`validSnapshot` rejects invalid sources, dates, types, counts, unknown repository references, conflicting duplicate IDs, XML-illegal control characters, malformed or unpaired Unicode and dangerous directional overrides. Rendered text is XML escaped. Keep validation in the renderer even if a collector already validates its upstream API responses.

Do not store an access token in `user`, `provenance`, `coverage`, `repositories` or `activity`. Never interpret a public source as evidence of zero private contributions.

## Source fixture rules

- `fixtures/demo-activity.json`: stable synthetic regression fixture. Do not silently change dates or counts, since tests and pinned gallery weeks depend on them.
- `fixtures/adityasreevatsak-public-activity.json`: frozen historical **public** snapshot, unchanged by automation.
- `data/live-public-activity.json`: approved six-hour refreshed **public** account snapshot used for four `exports/live-*-still.svg` images.
- Other usernames' locally collected snapshots remain ignored by default. Never collect private activity.
- The collector must keep `coverage` and `provenance` truthful. If GitHub pagination is incomplete, fail without writing anything.

See `docs/ARCHITECTURE.md` for model derivation and `docs/DEVELOPMENT.md` for regeneration instructions.

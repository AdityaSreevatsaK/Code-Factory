# Run locally with GitHub CLI after reviewing repository About metadata.
# Uses the caller's GitHub CLI session. Does not modify code or visibility.
param(
    [string]$Repository = "AdityaSreevatsaK/Code-Factory",
    [switch]$Apply
)
$description = "Turn observed public GitHub activity into an interactive contribution-calendar factory. Deterministic SVGs, isometric and pixel art, offline-first."
$topics = "github-profile,github-activity,github-contributions,svg,data-visualization,pixel-art,isometric,developer-tools"
if (-not $Apply) {
    Write-Host "Preview metadata for $Repository"
    Write-Host "Description: $description"
    Write-Host "Topics: $topics"
    Write-Host "Re-run with -Apply to update repository metadata using gh."
    exit 0
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw "GitHub CLI 'gh' is required." }
& gh repo edit $Repository --description $description --add-topic $topics
if ($LASTEXITCODE -ne 0) { throw "GitHub CLI repo metadata update failed." }

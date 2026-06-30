$prompt = $env:CLAUDE_USER_PROMPT
if (-not $prompt) {
  exit 0
}

$prompt = $prompt.ToLowerInvariant()
$suggestions = New-Object System.Collections.Generic.List[string]

if ($prompt -match 'commit|staged|push') {
  $suggestions.Add('/commit-kr - create a Korean commit message')
}

if ($prompt -match 'pr|pull request') {
  $suggestions.Add('/create-pr - create a PR title and body draft')
}

if ($prompt -match 'refactor|cleanup|dedupe|simplify') {
  $suggestions.Add('/refactor - analyze refactoring candidates')
}

if ($prompt -match 'test|vitest|tdd|coverage') {
  $suggestions.Add('/gen-test - generate tests')
}

if ($prompt -match 'swagger|openapi|api generate|api client|api scaffold|admin api') {
  $suggestions.Add('/scaffold-api - generate API functions and Query hooks')
}

if ($prompt -match 'figma|design|screen|layout|component') {
  $suggestions.Add('/figma-to-component - implement a Figma-based component')
}

if ($prompt -match 'review') {
  $suggestions.Add('/code-review - review changed code')
}

if ($suggestions.Count -gt 0) {
  Write-Output 'Suggested local skills:'
  foreach ($suggestion in $suggestions) {
    Write-Output "  $suggestion"
  }
}

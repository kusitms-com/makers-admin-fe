$toolInput = $env:TOOL_INPUT
if (-not $toolInput) {
  exit 0
}

try {
  $json = $toolInput | ConvertFrom-Json
  $filePath = $json.file_path
} catch {
  exit 0
}

if ($filePath -and ($filePath.EndsWith('.ts') -or $filePath.EndsWith('.tsx'))) {
  pnpm exec eslint --quiet "$filePath" 2>&1 | Select-Object -Last 5
}

$inputText = $env:CLAUDE_TOOL_INPUT
if (-not $inputText) {
  exit 0
}

$filePath = ''
$content = $inputText

try {
  $parsed = $inputText | ConvertFrom-Json
  if ($parsed.file_path) { $filePath = $parsed.file_path }
  if ($parsed.new_string) { $content = $parsed.new_string }
  elseif ($parsed.content) { $content = $parsed.content }
} catch { }

$isCodeFile = $filePath -match '\.(ts|tsx|js|jsx)$'

if ($isCodeFile -and ($content -match 'console\.log')) {
  Write-Error 'Avoid console.log. Use the project logging/debugging approach instead.'
  exit 1
}

if ($isCodeFile -and ($content -match ':\s*any([^A-Za-z]|$)|<any>|as any')) {
  Write-Error 'Avoid explicit any. Use a specific type or unknown.'
  exit 1
}

if ($content -match '(^|\s)(npm|yarn)\s') {
  Write-Error 'Use pnpm in this project.'
  exit 1
}

if ($filePath -match 'tailwind\.config\.') {
  Write-Error 'This is a Tailwind CSS v4 project. Do not create tailwind.config unless explicitly requested.'
  exit 1
}

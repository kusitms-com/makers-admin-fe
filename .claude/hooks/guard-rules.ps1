$inputText = $env:CLAUDE_TOOL_INPUT
if (-not $inputText) {
  $inputText = ""
}

if ($inputText -match 'console\.log') {
  Write-Error 'Avoid console.log. Use the project logging/debugging approach instead.'
  exit 1
}

if ($inputText -match ':\s*any([^A-Za-z]|$)|<any>|as any') {
  Write-Error 'Avoid explicit any. Use a specific type or unknown.'
  exit 1
}

if ($inputText -match '(^|\s)(npm|yarn)\s') {
  Write-Error 'Use pnpm in this project.'
  exit 1
}

if ($inputText -match 'tailwind\.config\.') {
  Write-Error 'This is a Tailwind CSS v4 project. Do not create tailwind.config unless explicitly requested.'
  exit 1
}

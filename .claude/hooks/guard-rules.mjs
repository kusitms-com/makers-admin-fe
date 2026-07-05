const inputText = process.env.CLAUDE_TOOL_INPUT

if (!inputText) {
  process.exit(0)
}

let filePath = ''
let content = inputText

try {
  const parsed = JSON.parse(inputText)
  if (parsed.file_path) {
    filePath = parsed.file_path
  }
  if (parsed.new_string) {
    content = parsed.new_string
  } else if (parsed.content) {
    content = parsed.content
  } else if (parsed.command) {
    content = parsed.command
  }
} catch {
  // inputText가 JSON이 아니면 원본 텍스트를 그대로 검사한다.
}

const isCodeFile = /\.(ts|tsx|js|jsx)$/.test(filePath)

if (isCodeFile && content.includes('console.log')) {
  console.error('Avoid console.log. Use the project logging/debugging approach instead.')
  process.exit(1)
}

if (isCodeFile && /:\s*any([^A-Za-z]|$)|<any>|as any/.test(content)) {
  console.error('Avoid explicit any. Use a specific type or unknown.')
  process.exit(1)
}

if (/(^|\s)(npm|yarn|npx)\s/.test(content)) {
  console.error('Use pnpm (or pnpm exec/pnpm dlx) in this project.')
  process.exit(1)
}

if (/tailwind\.config\./.test(filePath)) {
  console.error('This is a Tailwind CSS v4 project. Do not create tailwind.config unless explicitly requested.')
  process.exit(1)
}

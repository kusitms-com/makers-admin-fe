import { readFileSync } from 'node:fs'

let payload

try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const toolInput = payload.tool_input ?? {}
const filePath = toolInput.file_path ?? ''
const content = toolInput.new_string ?? toolInput.content ?? toolInput.command ?? ''

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

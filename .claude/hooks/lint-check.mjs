import { execSync } from 'node:child_process'

const toolInput = process.env.TOOL_INPUT

if (!toolInput) {
  process.exit(0)
}

let filePath = ''

try {
  const json = JSON.parse(toolInput)
  filePath = json.file_path ?? ''
} catch {
  process.exit(0)
}

if (filePath && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))) {
  try {
    const output = execSync(`pnpm exec eslint --quiet "${filePath}"`, { encoding: 'utf8' })
    console.log(output.trimEnd().split('\n').slice(-5).join('\n'))
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`
    console.log(output.trimEnd().split('\n').slice(-5).join('\n'))
  }
}

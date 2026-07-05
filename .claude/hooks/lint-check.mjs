import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

let payload

try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const filePath = payload.tool_input?.file_path ?? ''

if (filePath && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))) {
  try {
    const output = execFileSync('pnpm', ['exec', 'eslint', '--quiet', filePath], {
      encoding: 'utf8',
      timeout: 30_000,
    })
    console.log(output.trimEnd().split('\n').slice(-5).join('\n'))
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`
    console.log(output.trimEnd().split('\n').slice(-5).join('\n'))
  }
}

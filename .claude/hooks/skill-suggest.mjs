const prompt = process.env.CLAUDE_USER_PROMPT

if (!prompt) {
  process.exit(0)
}

const lowerPrompt = prompt.toLowerCase()
const suggestions = []

const rules = [
  [/commit|staged|push/, '/commit-kr - create a Korean commit message'],
  [/\bpr\b|pull request/, '/create-pr - create a PR title and body draft'],
  [/refactor|cleanup|dedupe|simplify/, '/refactor - analyze refactoring candidates'],
  [/test|vitest|tdd|coverage/, '/gen-test - generate tests'],
  [
    /swagger|openapi|api generate|api client|api scaffold|admin api/,
    '/scaffold-api - generate API functions and Query hooks',
  ],
  [/figma|design|screen|layout|component/, '/figma-to-component - implement a Figma-based component'],
  [/review/, '/code-review - review changed code'],
]

for (const [pattern, suggestion] of rules) {
  if (pattern.test(lowerPrompt)) {
    suggestions.push(suggestion)
  }
}

if (suggestions.length > 0) {
  console.log('Suggested local skills:')
  for (const suggestion of suggestions) {
    console.log(`  ${suggestion}`)
  }
}

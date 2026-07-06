export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
    'scope-empty': [2, 'always'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
  },
}

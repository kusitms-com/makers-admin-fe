## kusitms-admin Codex Instructions

이 파일은 Codex용 최소 라우터입니다. 프로젝트의 메인 지침은 `CLAUDE.md`이고, 상세 로딩 기준은 `.claude/manifest.md`가 관리합니다.

### Required Reading

- `CLAUDE.md`
- `.claude/manifest.md`

### Codex Rules

- 사용자가 다르게 요청하지 않으면 한국어로 사고하고 응답합니다.
- 코드 변경 전에는 `.claude/manifest.md`의 Tier 1/Tier 2 로딩 기준을 따릅니다.
- `/create-pr`, `/scaffold-api` 같은 skill 요청은 `.codex/skills/{skill}/SKILL.md`를 진입점으로 사용하고, 해당 proxy가 가리키는 `.claude/skills/{skill}/SKILL.md`를 원본 지침으로 따릅니다.
- 기존 사용자 변경을 보존하고 관련 없는 작업을 되돌리지 않습니다.
- `pnpm`만 사용하고 `npm`/`yarn`은 사용하지 않습니다.
- Swagger/API 작업은 `.claude/references/api` 기준으로 확인한 뒤 진행합니다.
- 검증 결과와 검증하지 못한 항목을 최종 보고에 명시합니다.

한글이 터미널에서 깨져 보이면 파일 의도, 주변 코드, 기존 프로젝트 패턴을 기준으로 판단합니다.

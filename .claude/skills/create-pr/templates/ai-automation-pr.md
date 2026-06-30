# AI/자동화 PR 작성 예시

AI 활용/자동화 변경이 포함된 PR은 아래 관점을 본문에 반영합니다.

- 진입점: Claude/Codex가 처음 읽는 파일과 라우팅 방식
- 로딩 기준: 항상 읽는 문서와 작업별로 읽는 reference/rule
- 실행 표면: skill, hook, script가 어떤 작업을 자동화하는지
- 생성물 관리: 직접 수정하면 안 되는 파일과 재생성 명령
- 리뷰 영향: reviewer가 실제로 확인해야 하는 자동화 결과

```markdown
## 📌 주요 변경사항

- AI 작업 지침과 실행 표면 정비
- GitHub 협업 자동화와 CI 검증 흐름 구성
- 생성 파일 관리와 개발 검증 설정 추가

## 📝작업 내용

- AI 작업 흐름 정리: `CLAUDE.md`와 `AGENTS.md`를 진입점으로 두고, `.claude/manifest.md`에서 작업 종류별 rules/reference 로딩 기준을 관리하도록 구성
- AI 실행 표면 추가: Claude skill 원본과 Codex proxy skill을 분리해 `/create-pr`, `/scaffold-api`, `/figma-to-component` 같은 반복 작업을 프로젝트 규칙에 맞게 실행하도록 구성
- 자동 검증 흐름 구성: CI에서 타입/포맷/생성물/lint/test/build 결과를 확인하고, PR 댓글로 reviewer가 확인할 상태를 요약하도록 구성
- 검증: `pnpm format:check`, `pnpm type-check`, `pnpm lint` 통과
```

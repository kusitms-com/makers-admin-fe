---
name: code-review
description: 변경된 코드를 프로젝트 규칙 기준으로 읽기 전용 리뷰하고, 실제 위험이 있는 finding만 보고합니다.
user-invocable: true
argument-hint: [file-or-ref]
allowed-tools: Bash, Read, Grep, Glob
---

# code-review

코드를 수정하지 않고 리뷰 리포트만 출력합니다. 스타일 취향이 아니라 버그, 회귀, 유지보수 위험, 누락된 검증을 우선합니다.

## 읽을 문서

1. `CLAUDE.md`
2. `.claude/rules/code-quality.md`
3. `.claude/rules/architecture.md`
4. `.claude/rules/data-fetching.md`
5. `.claude/rules/testing.md`
6. `.claude/rules/verification.md`

## Workflow

### 1단계: 리뷰 범위 확인

인자가 없으면 현재 worktree의 staged + unstaged diff를 리뷰합니다.

```bash
git diff --name-only
git diff --staged --name-only
git diff
git diff --staged
```

인자가 파일이면 해당 파일과 관련 diff를 리뷰합니다.
인자가 ref/branch면 `git diff <ref>...HEAD` 또는 사용자가 준 범위를 확인합니다.

### 2단계: 관련 규칙 로드

변경 파일과 관련된 규칙만 읽습니다. 읽지 않은 규칙을 근거로 단정하지 않습니다.

### 3단계: finding 작성

실제 위험이 있는 항목만 심각도순으로 출력합니다.

## Review Focus

- 실제 동작 버그 또는 회귀 가능성
- 서버 상태를 TanStack Query가 아닌 방식으로 다루는 문제
- endpoint/request/response shape 추측
- `any`, 불명확한 null/undefined 처리
- 접근성 결함
- 과도한 추상화 또는 요청 범위 밖 변경
- 테스트/검증 누락

## Severity

| 등급 | 기준 |
| --- | --- |
| Critical | 보안 취약점, 데이터 손실, 주요 플로우 중단 |
| Major | 실제 버그 가능성, 타입 안정성 문제, 접근성 주요 결함 |
| Minor | 유지보수성 저하, 제한적인 UX/성능 문제, 검증 누락 |
| Suggestion | 선택적 개선, 명확성 향상 |

## Output

```markdown
## Findings

### Major

- `src/path/file.tsx:42`
  - 문제: ...
  - 영향: ...
  - 권장: ...

## Verdict

- Request changes | Comment | Approve

## Verification Notes

- 확인한 것: ...
- 확인하지 못한 것: ...
```

- finding이 있으면 `파일:라인`, 문제, 영향, 권장 수정 방향을 포함합니다.
- finding이 없으면 명확히 “발견된 이슈 없음”이라고 말하고 남은 검증 공백만 적습니다.
- 확인하지 못한 내용은 추정이라고 표시합니다.
- 좋은 점 요약은 만들지 않습니다.

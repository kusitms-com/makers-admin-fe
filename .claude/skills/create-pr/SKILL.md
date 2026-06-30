---
name: create-pr
description: 현재 브랜치 변경 내용을 분석해 프로젝트 PR 템플릿 기준으로 제목과 본문 초안을 작성합니다.
user-invocable: true
argument-hint: [--append]
allowed-tools: Bash, Read, Grep, Glob
---

# create-pr

PR 제목과 본문 초안을 만듭니다. 사용자가 명시하지 않으면 PR을 직접 생성하지 않습니다.
본문 형식은 `.github/PULL_REQUEST_TEMPLATE.md`를 우선합니다.

## Workflow

1. `git status --short`로 미커밋 변경을 확인합니다.
2. `git log main..HEAD --oneline`과 `git diff main..HEAD --stat`을 확인합니다.
3. `.github/PULL_REQUEST_TEMPLATE.md`를 읽고 section 이름과 순서를 그대로 사용합니다.
4. 브랜치명에서 이슈 번호가 있으면 추출합니다.
5. 변경 내용을 기능/수정/문서/테스트/설정으로 분류합니다.
6. 아래 템플릿 형태로 채웁니다.

## Template

```markdown
## #️⃣연관된 이슈

- Close #<이슈번호>

## 📝작업 내용

- 

### 스크린샷 (선택)

<!-- UI 변경이 있을 때 첨부 -->

## 💬리뷰 요구사항(선택)

- 검증하지 못한 항목 또는 리뷰어가 확인해야 할 부분이 있으면 작성합니다.
```

## Rules

- 제목은 70자 이내로 작성합니다.
- `.github/PULL_REQUEST_TEMPLATE.md`의 section 이름과 순서를 변경하지 않습니다.
- 이슈 번호는 기본적으로 `Close #<번호>` 형식으로 작성합니다.
- 본문은 리뷰어가 확인해야 할 변경 중심으로 씁니다.
- 별도 `## 검증` section을 만들지 않습니다.
- 검증한 내용은 `📝작업 내용`에 짧게 포함하고, 검증하지 못한 항목은 `💬리뷰 요구사항(선택)`에 숨기지 않고 적습니다.
- AI 출처 문구를 넣지 않습니다.

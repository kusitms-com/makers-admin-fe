# Claude Manifest

이 문서는 AI 코딩 에이전트가 `kusitms-admin`에서 작업하기 전에 어떤 지침을 읽어야 하는지 정의합니다.

## 부트 순서

1. `CLAUDE.md` 또는 `AGENTS.md`에서 프로젝트 개요를 읽습니다.
2. 이 manifest를 읽습니다.
3. 코드 변경 작업에서는 Tier 1 규칙을 로드합니다.
4. Tier 2 규칙과 admin API/domain reference는 작업에 필요한 경우에만 로드합니다.

## Tier 1: 기본 로드

| 파일 | 목적 |
| --- | --- |
| `.claude/rules/code-quality.md` | 코드 품질 원칙 |
| `.claude/rules/project-constraints.md` | 프로젝트 금지/제약 조건 |
| `.claude/rules/workflow.md` | 기본 inspect-edit-verify 작업 흐름 |
| `.claude/rules/verification.md` | 검증 명령 선택 기준 |

Tier 1은 코드 변경, 리뷰, 리팩터링처럼 실제 작업이 시작될 때만 로드합니다. 단순 질문이나 설명 요청에서는 `CLAUDE.md`와 이 manifest만으로 답합니다.

## Tier 2: 필요 시 로드

| 작업 | 로드할 문서 |
| --- | --- |
| 파일 배치, import, 구조 판단 | `.claude/rules/architecture.md` |
| TypeScript, React, 네이밍, 스타일 판단 | `.claude/rules/code-style.md` |
| 재사용 UI 생성 또는 수정 | `.claude/rules/component-guide.md`, `.claude/references/component-patterns.md` |
| 서버 상태, API client, form 작업 | `.claude/rules/data-fetching.md` |
| 테스트 추가 또는 수정 | `.claude/rules/testing.md` |
| SVG 아이콘 또는 barrel index 생성물 작업 | `.claude/rules/generated-workflows.md` |
| 어드민 API 연동 추가 | `.claude/references/api/admin.md`와 관련 admin API/domain 문서 |
| 폼 또는 검증 로직 추가 | `.claude/rules/data-fetching.md`와 관련 domain 문서 |
| PR/커밋 문구 작성 | `.claude/rules/workflow.md`, `.claude/rules/commit-convention.md` |
| 구조, 라이브러리, 규칙 변경 결정 | `.claude/decisions/README.md` |

## Skills

| Skill | 용도 |
| --- | --- |
| `/scaffold-api` | Swagger 기반 API 함수와 TanStack Query hook 생성 |
| `/gen-test` | Vitest + Testing Library 테스트 생성 |
| `/code-review` | 변경 코드 리뷰 |
| `/commit-kr` | 한국어 커밋 메시지 제안 |
| `/create-pr` | PR 제목과 본문 초안 작성 |
| `/figma-to-component` | Figma 디자인을 프로젝트 컴포넌트로 구현 |
| `/refactor` | 동작 변경 없는 리팩터링 후보 분석과 적용 |

## Hooks

Claude Code 환경에서는 `.claude/settings.json`이 아래 hook을 사용합니다.

- `guard-rules.ps1`: `console.log`, 명시적 `any`, `npm`/`yarn`, Tailwind v3 설정 생성을 차단합니다.
- `lint-check.ps1`: TypeScript 파일 수정 후 가능한 경우 `pnpm exec eslint --quiet <file>`을 실행합니다.
- `skill-suggest.ps1`: 사용자 프롬프트 키워드에 맞는 local skill을 제안합니다.

## API Reference

관련 admin 파일만 로드합니다. 엔드포인트가 아직 문서화되지 않았다면 Swagger에서 admin 관련 endpoint만 확인하고 reference를 업데이트한 뒤 구현합니다.

| 영역 | 파일 | 트리거 키워드 |
| --- | --- | --- |
| 어드민 API 개요 | `.claude/references/api/admin.md` | admin, swagger, API client, axios, fetch |
| 어드민 인증 | `.claude/references/api/admin-auth.md` | auth, login, token, session |
| 어드민 멤버 승인 | `.claude/references/api/admin-members.md` | member, pending, approve, reject |
| 어드민 프로젝트 | `.claude/references/api/admin-projects.md` | project, meetup, corporate |
| 어드민 학회원 후기 | `.claude/references/api/admin-reviews.md` | review, member review |
| 어드민 블로그 후기 | `.claude/references/api/admin-blog-reviews.md` | blog review, blog |
| 어드민 학회 소개 | `.claude/references/api/admin-introductions.md` | introduction, intro, banner |

## Domain Reference

| 도메인 | 파일 | 트리거 키워드 |
| --- | --- | --- |
| 멤버 승인 | `.claude/references/domain/members.md` | pending member, approve, reject |
| 프로젝트 관리 | `.claude/references/domain/projects.md` | project, meetup, corporate |
| 학회원 후기 관리 | `.claude/references/domain/reviews.md` | review, member review |
| 블로그 후기 관리 | `.claude/references/domain/blog-reviews.md` | blog review |
| 학회 소개 관리 | `.claude/references/domain/introductions.md` | introduction, intro, banner |

## Decision History

프로젝트 구조, 라이브러리, API 처리 방식, 공통 규칙처럼 나중에 반복 논쟁이 생길 수 있는 결정은 `.claude/decisions/`에 기록합니다.

- 단순 구현, 오타 수정, 일회성 UI 조정은 기록하지 않습니다.
- 새 decision을 만들기 전 `.claude/decisions/README.md`를 먼저 확인합니다.
- 파일명은 `NNN-short-title.md` 형식을 사용합니다.

## 금지 패턴

- 모든 reference 파일을 기본으로 로드하지 않습니다.
- Swagger 전체를 일반 API 기준으로 해석하지 않고, admin 기능에 필요한 endpoint만 사용합니다.
- 엔드포인트 경로, request body, response shape를 추측해서 만들지 않습니다.
- `src/services` 또는 `src/views`를 만들지 않고 기존 구조를 사용합니다.
- 새 UI 라이브러리나 패키지 매니저를 도입하지 않습니다.
- Tailwind v4 프로젝트에 Tailwind v3 설정을 추가하지 않습니다.

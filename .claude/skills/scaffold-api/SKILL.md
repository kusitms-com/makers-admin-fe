---
name: scaffold-api
description: Swagger/OpenAPI를 확인해 `src/api` 요청 함수와 TanStack Query hook 초안을 프로젝트 규칙에 맞게 생성합니다.
user-invocable: true
argument-hint: <swagger-url 또는 endpoint/filter>
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch
---

# scaffold-api

어드민 API 기능을 추가할 때 사용합니다. 추측으로 endpoint path, request body, response shape를 만들지 않습니다.
Swagger는 admin 기능에 필요한 endpoint만 확인하고, 일반 사용자/public API를 관리자 기능에 섞지 않습니다.

## 읽을 문서

1. `CLAUDE.md`
2. `.claude/manifest.md`
3. `.claude/rules/data-fetching.md`
4. `.claude/rules/code-quality.md`
5. `.claude/references/api/admin.md`
6. 작업 도메인에 맞는 `.claude/references/api/admin-*.md`

## Workflow

### 1단계: API 계약 확인

Swagger 또는 `.claude/references/api/admin-*`에서 admin endpoint만 확인합니다.
reference에 없는 endpoint를 쓰는 경우 구현 전에 해당 reference에 아래 항목을 먼저 기록합니다.

- path, method, operationId
- path/query parameter
- request schema와 주요 field
- response schema와 주요 field
- error response 또는 확인 필요 항목

### 2단계: endpoint 선택

필터가 있으면 관련 endpoint만 추립니다. 여러 endpoint가 매칭되면 바로 구현하지 말고 선택지를 표로 정리합니다.

| Method | Path | Operation ID | Domain |
| --- | --- | --- | --- |
| `GET` | `/admin/members/pending` | `getPendingMembers` | `members` |

### 3단계: 도메인과 파일 위치 결정

도메인 이름은 실제 admin reference 기준을 우선합니다.

| Domain | API 파일 | Hook 파일 | Domain reference |
| --- | --- | --- | --- |
| `members` | `src/api/members.ts` | `src/hooks/useMembers.ts` | `.claude/references/domain/members.md` |
| `projects` | `src/api/projects.ts` | `src/hooks/useProjects.ts` | `.claude/references/domain/projects.md` |
| `reviews` | `src/api/reviews.ts` | `src/hooks/useReviews.ts` | `.claude/references/domain/reviews.md` |
| `blog-reviews` | `src/api/blogReviews.ts` | `src/hooks/useBlogReviews.ts` | `.claude/references/domain/blog-reviews.md` |
| `introductions` | `src/api/introductions.ts` | `src/hooks/useIntroductions.ts` | `.claude/references/domain/introductions.md` |

### 4단계: API 함수 작성

`src/api/{domain}.ts`에 raw request 함수와 타입을 둡니다. React, TanStack Query, UI 컴포넌트를 import하지 않습니다.

```ts
export type PendingMember = {
  userId: number;
  id: string;
  name: string;
};

export async function getPendingMembers(): Promise<PendingMember[]> {
  // 실제 client 함수명과 response envelope은 기존 코드 또는 reference를 따른다.
}
```

### 5단계: Query hook 작성

서버 상태가 필요한 경우 `src/hooks/use{Domain}.ts`에 TanStack Query hook을 둡니다.

```ts
export const memberKeys = {
  all: ['admin', 'members'] as const,
  pending: () => [...memberKeys.all, 'pending'] as const,
};
```

| Method | Hook 전략 |
| --- | --- |
| `GET` | `useQuery` |
| `POST`/`PUT`/`PATCH`/`DELETE` | `useMutation` + 관련 query invalidate |

### 6단계: 결과 보고

생성/수정 파일, 사용한 endpoint, invalidate한 query key, 실행한 검증과 남은 공백을 보고합니다.

## File Shape

```text
src/api/
  members.ts
src/hooks/
  useMembers.ts
```

## Rules

- API 함수는 React 컴포넌트를 import하지 않습니다.
- 컴포넌트는 endpoint path를 직접 알면 안 됩니다.
- query key는 `['admin', domain, ...params]` 형태를 우선합니다.
- GET은 `useQuery`, POST/PUT/PATCH/DELETE는 `useMutation`을 사용합니다.
- `any`를 사용하지 않습니다. 모르는 shape는 `unknown`에서 좁힙니다.
- Swagger에 없는 field, enum, status를 UI 편의로 만들지 않습니다.
- `multipart/form-data`는 `FormData` 변환 책임을 API 계층 또는 form submit 경계에 명확히 둡니다.
- `pnpm`만 사용합니다.

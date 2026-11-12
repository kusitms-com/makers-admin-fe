# 멤버 승인 도메인

승인 대기 회원 조회와 승인/반려 화면에는 이 reference를 사용합니다.

## 사용하는 API Reference

- `.claude/references/api/admin-members.md`

## 주요 화면

- 승인 대기 회원 목록
- 수료증/프로필 이미지 확인
- 가입 승인/반려 action

## 주요 위치

```text
src/pages/members/
  # 멤버 승인 화면 구현 시 생성

src/api/members/api.ts
src/api/members/queries.ts  # key 팩토리·queryOptions·조회/mutation 훅
src/api/members/types.ts
```

## 주요 액션

- 회원 목록 조회(승인된 회원만, `status=APPROVED`)
- 승인 대기 목록 조회
- 회원 승인
- 회원 반려 및 계정 삭제

## 구현 규칙

- endpoint path, request, response shape는 API reference를 기준으로 합니다.
- 목록 서버 상태는 TanStack Query로 관리합니다.
- 회원 관리(`/members`) 화면은 승인된 회원만 보여주므로 상태 컬럼/변경 UI가 없습니다.
- 승인 대기(`/members/approval`) 화면은 상태 변경을 화면 로컬 상태로만 모았다가, "저장하기"를 누르면 변경된 항목만 승인/반려 API로 일괄 요청합니다.
- 승인/반려 이후 회원 목록과 승인 대기 목록 query를 모두 invalidate합니다.
- 반려는 계정 삭제 성격이 있으므로 confirmation을 둡니다.

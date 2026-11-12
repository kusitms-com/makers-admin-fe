# 프로젝트 에이전트

프로젝트 에이전트는 구현을 대신하지 않습니다. 메인 세션의 변경을 독립된 관점으로 점검하는 **읽기 전용** 검증 역할입니다. 수정·재검증·최종 결론은 메인 세션이 책임집니다.

## 어디서 부르나

| 호출 위치 | 에이전트 | 범위 |
| --- | --- | --- |
| `/commit-kr`, `/create-pr` | `reviewer` | 리뷰 게이트. `src/` 변경 시에만, Critical·Major만 (`.claude/rules/workflow.md`) |
| `/code-review` | 아래 선택표에 맞는 에이전트들 | 전체 리뷰. Minor·Suggestion까지 |
| 사용자 요청 | 어느 것이든 | 요청 범위 |

## 선택표

| 변경 또는 질문 | 우선 역할 | 필요할 때 함께 |
| --- | --- | --- |
| 전체 diff의 회귀 위험 | `reviewer` | 변경 성격에 맞는 리뷰어 |
| API 함수·쿼리 훅·mutation·에러 처리 | `api-contract-reviewer` | `reviewer` |
| `src/routes.ts`, `src/routes/**`, `src/layout/**`, 오류 경계 | `route-reviewer` | `reviewer` |
| 컴포넌트 UI, 디자인 토큰, 접근성 | `ui-accessibility-reviewer` | `reviewer` |
| 버그 재현과 원인 추적 | `debugger` | `verifier` |
| 완료 전 검증 명령과 증거 확인 | `verifier` | 해당 리뷰어 |

## 실행 계약

1. 메인 세션은 변경 범위(파일 목록), 확인할 결과, 모드(게이트인지 전체 리뷰인지)를 넘깁니다.
2. 에이전트는 자기 지침과 필요한 규칙만 읽고, 작업 트리와 관련 diff를 확인합니다.
3. 파일을 수정하지 않습니다. 코드·명령으로 직접 확인한 내용과 추론을 구분합니다.
4. 결과는 `확인 범위`, `발견 사항`(`파일:줄` 포함), `근거`, `미검증 공백` 순으로 돌려줍니다.

## 판정

- **PASS**: 필요한 근거가 있고 고칠 발견 사항이 없습니다.
- **NEEDS_REVISION**: 근거가 있는 결함이나 규칙 불일치가 있습니다.
- **BLOCKED**: 판정에 필요한 입력(Swagger, 재현 절차, 권한 등)이 없습니다. 근거가 부족하면 PASS라고 쓰지 않습니다.

`/code-review`의 Verdict와는 이렇게 대응합니다: Request changes = `NEEDS_REVISION`, Comment·Approve = `PASS`.

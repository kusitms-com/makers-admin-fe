# 컴포넌트 패턴 Reference

이 문서는 구현이 쌓이면서 업데이트하는 UI 패턴 인덱스입니다. 아직 확정된 구현 패턴이 적으므로, 현재는 생성 기준과 기록 기준을 정의합니다.

## 기본 원칙

- 먼저 `@kusitms.com/ui`를 확인합니다.
- 프로젝트 공통 아이콘은 `@kusitms.com/icons`를 우선합니다.
- 색상, spacing, radius, typography는 `@kusitms.com/tokens` 또는 기존 Tailwind token을 우선합니다.
- 관리자 화면은 table, filter, tab, dialog, drawer, form을 우선합니다.
- loading, empty, error 상태를 분리합니다.
- 페이지 전용 section은 `src/pages/{domain}/` 구현 시 생성하고, 여러 페이지에서 재사용되면 `src/components`로 올립니다.

## 파일 배치

| 성격 | 위치 |
| --- | --- |
| 여러 페이지에서 재사용 | `src/components/{ComponentName}.tsx` |
| 특정 페이지 전용 | `src/pages/{domain}/` |
| API 연결 hook | `src/hooks/use{Domain}.ts` |
| API 함수와 타입 | `src/api/{domain}.ts` |
| 순수 유틸 | `src/lib` |

## 패턴 기록 기준

새로운 공통 UI 패턴을 만들면 이 문서에 아래 형식으로 추가합니다.

```markdown
## Pattern: <이름>

- 위치: `src/components/...`
- 용도: ...
- 사용 시점: ...
- 피해야 할 사용: ...
- 관련 검증: ...
```

## 현재 기록된 패턴

아직 확정된 공통 컴포넌트 패턴은 없습니다. 첫 관리자 화면 구현 후 table/filter/form/dialog 패턴을 이 문서에 추가합니다.

# Decision History

이 폴더는 AI 에이전트와 개발자가 프로젝트의 중요한 결정 맥락을 잃지 않도록 관리하는 기록입니다.

## 기록 대상

아래 중 하나에 해당할 때만 decision 문서를 추가합니다.

- 디렉터리 구조, 레이어 경계, 파일 배치 기준을 바꿀 때
- API client, 상태 관리, form 처리, 테스트 전략 같은 반복 패턴을 정할 때
- 라이브러리를 추가하거나 기존 선택지를 바꿀 때
- 기존 규칙과 다른 예외를 허용할 때
- 나중에 다시 논쟁할 가능성이 높은 trade-off가 있을 때

아래 작업은 기록하지 않습니다.

- 단순 버그 수정
- 오타, 문구, 스타일만 바꾸는 변경
- 기존 규칙을 그대로 따르는 CRUD 구현
- 한 번 쓰고 끝나는 페이지 내부 구현 세부사항

## 파일명

```text
NNN-short-title.md
```

예시:

```text
001-admin-api-reference.md
002-query-key-policy.md
003-page-folder-boundary.md
```

## 작성 형식

새 decision은 `.claude/decisions/template.md`를 복사한 형식으로 작성합니다.

문서는 길게 쓰지 않습니다. 결정 이유, 버린 대안, 이후 수정자가 지켜야 할 점만 남깁니다.

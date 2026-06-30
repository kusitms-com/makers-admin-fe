# 컴포넌트 가이드

## 우선순위

1. 적절한 컴포넌트가 있으면 `@kusitms.com/ui`를 사용합니다.
2. 저장소에 이미 있는 shadcn/ui 패턴을 사용합니다.
3. 접근성 있는 저수준 동작이 필요하면 Base UI primitive를 사용합니다.
4. 프로젝트 라이브러리로 해결되지 않을 때만 커스텀 컴포넌트를 만듭니다.

## 관리자 UI 기본값

- 밀도 있고 스캔하기 쉬운 업무 중심 레이아웃을 우선합니다.
- 마케팅식 카드보다 table, filter, tab, dialog, drawer, form을 우선합니다.
- 반복 아이템 카드는 간결하게 유지하고 장식용 중첩 카드는 피합니다.
- 데이터 기반 화면에는 loading, empty, error 상태를 명확히 둡니다.
- 액션은 영향을 주는 데이터 가까이에 배치합니다.

## 접근성

- 의미 있는 button과 form control을 사용합니다.
- input에는 보이는 label 또는 접근 가능한 label을 둡니다.
- dialog/drawer는 focus management를 처리하는 primitive를 사용합니다.
- 상태 표현을 색상에만 의존하지 않습니다.

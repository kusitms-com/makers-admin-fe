# Toast 컴포넌트가 참조하는 Figma 값 중 일부가 `@kusitms.com/tokens`에 없음

## 무엇이 다른지

Figma "Toast"(node-id 2910-41549) 컴포넌트셋이 참조하는 값 3개가 `@kusitms.com/tokens@0.2.0`에 정확히 대응하는 토큰이 없습니다. 값이 틀린 게 아니라 **해당 의미의 토큰 자체가 패키지에 없는** 상태입니다.

| 용도 | Figma 스펙 | 패키지에 없는 값 | 지금 코드에서 쓴 근사값 |
| --- | --- | --- | --- |
| 배경 블러 레이어 색 | `Semantic/Inverse/Background` = `#1B1C1E` | 동일한 이름/의미의 토큰 없음 | `label-normal`(`#17171a`, 원래는 텍스트용 토큰) |
| 배경 틴트 레이어 색 | `Semantic/Primary/Normal` = `#0066FF` | 동일한 값의 토큰 없음 | `brand-primary`(`#3e5efa`) |
| 메시지 텍스트 스타일 | `Body 2/Normal - Bold` (15px, weight 600, line-height 1.47em, letter-spacing 0.0096em) | 15px 계열 텍스트 스타일 자체가 없음 | `text-label-14sb`(14px, weight 600, line-height 20px, letter-spacing 0.0125em) |

## 어디서 확인했는지

- Figma: `https://www.figma.com/design/hX8cvfEpQrDmky936QCqRd/...?node-id=2910-41549` (Toast 컴포넌트셋), MCP `get_figma_data`로 GLOBAL_VARS 확인
- 패키지: `node_modules/@kusitms.com/tokens/src/index.css`, `themes.css`, `raw-tokens.json`, `tokens.json` 전체를 `grep -ni "inverse"`, `grep -n "0066ff"`, `grep -n -- "--text-.*: 15px"` 등으로 검색 — 어느 파일에도 해당 값/이름의 토큰이 없음을 확인
- 구현: `src/components/common/Toast/Toast.tsx`

## 왜 지금 우리 코드에서 고치면 안 되는지

토큰 패키지에 대응 값이 아예 없어서, 정확히 맞추려면 `#1B1C1E`/`#0066FF`/15px 텍스트 스타일을 하드코딩해야 합니다. 이는 프로젝트 규칙(디자인 토큰 우선, 하드코딩 금지)에 어긋나고, 나중에 패키지에 토큰이 추가되면 우리만 별도로 어긋난 하드코딩 값을 유지하게 됩니다. 현재는 값/의미가 가장 가까운 기존 토큰으로 근사 처리했습니다.

## 언제/누가 해결해야 하는지

`@kusitms.com/tokens` 패키지 관리자에게 아래 3개 토큰 추가를 요청해야 합니다.
- `Semantic/Inverse/Background`(`#1B1C1E`)에 대응하는 배경용 토큰
- `Semantic/Primary/Normal`(`#0066FF`)에 대응하는 색상 토큰(또는 기존 `brand-primary`를 이 값으로 갱신할지 디자인팀 확인)
- `Body 2/Normal - Bold`(15px, weight 600, line-height 1.47em, letter-spacing 0.0096em) 텍스트 스타일

패키지가 업데이트되면 `Toast.tsx`의 `bg-label-normal`, `bg-brand-primary`, `text-label-14sb`를 새 토큰으로 교체합니다.

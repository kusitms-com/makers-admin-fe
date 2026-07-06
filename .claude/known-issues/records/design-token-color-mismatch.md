# @kusitms.com/tokens 색상 값이 Figma와 다름

## 무엇이 다른지

`@kusitms.com/tokens@0.2.0`에 정의된 값이 Figma 스펙과 다른 토큰이 2개 있습니다.

| 토큰 | Figma 스펙 | 패키지 실제 값 |
| --- | --- | --- |
| `status-negative` | `#e52222` | `#ff4242` |
| `fill-destructive` | `#fdf2f2` | `#fffafa` |

나머지 확인한 토큰(`brand-primary`, `brand-tertiary`, `label-*`, `fill-normal`/`alternative`/`primary`/`netural`, `line-neutral`, `fill-transparent-black`)은 전부 일치합니다.

## 어디서 확인했는지

- Figma: `PartnerImageBox`(node-id 1427-10401, "삭제하기" 아이콘) 브라우저 devtools 색상 검사
- 패키지: `node_modules/@kusitms.com/tokens/src/index.css`의 `--status-negative`, `--fill-destructive` 원본 정의

## 왜 지금 우리 코드에서 고치면 안 되는지

컴포넌트는 이미 올바른 토큰 이름(`text-status-negative`, `bg-fill-destructive`)을 쓰고 있습니다. 여기서 색상을 하드코딩하면 프로젝트 규칙(하드코딩 금지) 위반이고, 나중에 패키지가 고쳐지면 우리만 별도로 어긋난 값을 유지하게 됩니다.

## 언제/누가 해결해야 하는지

`@kusitms.com/tokens` 패키지 관리자에게 알려서 패키지 자체 값을 고치고 버전을 올려야 합니다. 패키지가 업데이트되면 별도 코드 수정 없이 자동으로 맞는 색이 적용됩니다.

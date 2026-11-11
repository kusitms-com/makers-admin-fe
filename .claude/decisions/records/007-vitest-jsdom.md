# 007. Vitest 테스트 환경을 happy-dom에서 jsdom으로 바꾼다

## 상태

- Accepted

## 맥락

컴포넌트·훅 테스트를 happy-dom 환경에서 돌리고 있었다. 2026-11-11 팀 선택으로 jsdom으로 바꿨다.

## 결정

`vitest.config.ts`의 `test.environment`를 `jsdom`으로 하고, devDependency를 `happy-dom` 대신 `jsdom`으로 둔다.

## 근거

- jsdom은 Testing Library·Vitest 문서와 예제의 기본 환경이라 참고 자료와 동작이 일치한다.
- trade-off: happy-dom보다 느리고, 일부 브라우저 API는 구현이 없다.

## 대안

- happy-dom 유지: 더 빠르고 `URL.createObjectURL` 등을 구현하지만, 팀이 jsdom을 택했다.

## 영향

- jsdom은 `URL.createObjectURL`/`revokeObjectURL`을 구현하지 않는다. `src/test/setup.ts`에서 `blob:` 주소를 돌려주는 대체 함수를 둔다. 이미지 업로드 미리보기 테스트가 이것에 의존한다.
- 다른 브라우저 API가 없어서 테스트가 실패하면, 테스트마다 따로 막지 말고 `src/test/setup.ts`에 한 번만 채운다.
- 관련 규칙: `CLAUDE.md` 기술 스택, `.claude/rules/testing.md`

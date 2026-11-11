// jsdom은 URL.createObjectURL/revokeObjectURL을 구현하지 않는다. Node 구현이 대신 불리면 jsdom File을 읽지 못해 실패하므로,
// 이미지 미리보기 테스트용으로 blob: 주소를 돌려주는 대체 함수를 둔다. 테스트에서 vi.spyOn으로 감시할 수 있게 일반 함수로 둔다.
let blobUrlCount = 0

URL.createObjectURL = () => {
  blobUrlCount += 1
  return `blob:test/${String(blobUrlCount)}`
}
URL.revokeObjectURL = () => undefined

export interface CurrentCardinalResponse {
  currentCardinal: number
}

// PUT /admin/owner/current-cardinal 응답. 바꾼 기수로 전체 회원의 YB/OB를 다시 계산한 인원 수를 함께 돌려준다.
export interface CurrentCardinalUpdateResponse {
  previousCardinal: number
  currentCardinal: number
  changedToOb: number
  changedToYb: number
}

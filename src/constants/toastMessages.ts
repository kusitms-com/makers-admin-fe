// 관리자 화면 토스트 문구. 화면마다 같은 문구를 다르게 쓰지 않도록 한곳에서 관리한다.
export const TOAST_MESSAGES = {
  created: '등록했습니다.',
  updated: '수정했습니다.',
  deleted: '삭제했습니다.',
  saved: '저장했습니다.',
  createFailed: '등록하지 못했습니다. 다시 시도해주세요.',
  updateFailed: '수정하지 못했습니다. 다시 시도해주세요.',
  deleteFailed: '삭제하지 못했습니다. 다시 시도해주세요.',
  saveFailed: '저장하지 못했습니다. 다시 시도해주세요.',
  approvalCompleted: '승인 처리가 완료됐습니다.',
  approvalPartiallyFailed: '일부 회원 처리에 실패했습니다. 다시 시도해주세요.',
  unsupportedBlogReviewPart: '지원하지 않는 파트의 후기는 수정할 수 없습니다.',
  logoutFailed: '서버 로그아웃을 완료하지 못했습니다.',
} as const

export interface IntroductionItem {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
}

export interface PartnerLogo {
  id: string
  imageUrl?: string
}

// 기수 선택 소스가 생기기 전까지 현재 활동 기수를 고정값으로 둔다.
export const CURRENT_GENERATION = 33

export const INITIAL_ACTIVITIES: IntroductionItem[] = [
  {
    id: '1',
    title: '오리엔테이션',
    description: '큐시즘의 오리엔테이션에서는 기수별 팀원들이 처음 만나',
  },
]

export const INITIAL_TEAMS: IntroductionItem[] = [
  { id: '1', title: '경영총괄팀', description: '' },
  { id: '2', title: '교육기획팀', description: '' },
  { id: '3', title: '대외홍보팀', description: '' },
]

export const INITIAL_PARTNERS: PartnerLogo[] = []

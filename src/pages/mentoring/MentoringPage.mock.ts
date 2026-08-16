import type { StatusChipStatus } from '@components/common/StatusChip'

export interface MentoringSession {
  id: string
  mentor: { name: string; role: string }
  mentee: { name: string; role: string }
  dateRange: string
  title: string
  status: StatusChipStatus
}

interface ParticipantMeta {
  name: string
  role: '멘토' | '멘티'
  generation: number
  part: string
}

export interface MentoringReview {
  id: string
  title: string
  relativeTime: string
  mentor: ParticipantMeta
  mentee: ParticipantMeta
  isRecommended: boolean
  keywords: string[]
  freeReview: string
}

export interface ActiveMentor {
  id: string
  name: string
  generation: number
  part: string
  satisfactionRate: number
}

export const STAT_CARDS = {
  pendingApprovals: 2,
  ongoing: 7,
  completedThisMonth: 13,
}

export const INITIAL_SESSIONS: MentoringSession[] = [
  {
    id: 'mentoring-1',
    mentor: { name: '김도윤', role: '멘토' },
    mentee: { name: '이서준', role: '멘티' },
    dateRange: '2026.06.19 14:00 - 2026.06.19 15:00',
    title: '[워크숍] 디자인 트렌드와 사용자 경험 개선',
    status: 'progress',
  },
  {
    id: 'mentoring-2',
    mentor: { name: '박지훈', role: '멘토' },
    mentee: { name: '최유진', role: '멘티' },
    dateRange: '2026.06.18 10:00 - 2026.06.18 11:00',
    title: '프론트엔드 성능 최적화 실습',
    status: 'progress',
  },
  {
    id: 'mentoring-3',
    mentor: { name: '정하늘', role: '멘토' },
    mentee: { name: '윤지수', role: '멘티' },
    dateRange: '2026.06.15 16:00 - 2026.06.15 17:00',
    title: '포트폴리오 피드백 세션',
    status: 'completed',
  },
  {
    id: 'mentoring-4',
    mentor: { name: '한도윤', role: '멘토' },
    mentee: { name: '서지민', role: '멘티' },
    dateRange: '2026.06.12 13:00 - 2026.06.12 14:00',
    title: '백엔드 아키텍처 설계 리뷰',
    status: 'completed',
  },
  {
    id: 'mentoring-5',
    mentor: { name: '이현진', role: '멘토' },
    mentee: { name: '김서연', role: '멘티' },
    dateRange: '2026.06.24 11:00 - 2026.06.24 12:00',
    title: '기획서 작성 가이드',
    status: 'waiting',
  },
  {
    id: 'mentoring-6',
    mentor: { name: '최민준', role: '멘토' },
    mentee: { name: '박민준', role: '멘티' },
    dateRange: '2026.06.10 15:00 - 2026.06.10 16:00',
    title: '유저 인터뷰 리서치 방법론',
    status: 'completed',
  },
  {
    id: 'mentoring-7',
    mentor: { name: '강서연', role: '멘토' },
    mentee: { name: '조유진', role: '멘티' },
    dateRange: '2026.06.09 09:30 - 2026.06.09 10:30',
    title: '데이터 시각화 라이브러리 비교',
    status: 'completed',
  },
  {
    id: 'mentoring-8',
    mentor: { name: '윤서준', role: '멘토' },
    mentee: { name: '한지민', role: '멘티' },
    dateRange: '2026.06.26 17:00 - 2026.06.26 18:00',
    title: '이력서 첨삭 및 커리어 상담',
    status: 'waiting',
  },
  {
    id: 'mentoring-9',
    mentor: { name: '서지훈', role: '멘토' },
    mentee: { name: '임나연', role: '멘티' },
    dateRange: '2026.06.05 14:00 - 2026.06.05 15:00',
    title: 'API 설계와 문서화 실습',
    status: 'completed',
  },
  {
    id: 'mentoring-10',
    mentor: { name: '조하은', role: '멘토' },
    mentee: { name: '임도현', role: '멘티' },
    dateRange: '2026.06.20 10:00 - 2026.06.20 11:00',
    title: '브랜드 아이덴티티 디자인 실습',
    status: 'progress',
  },
  {
    id: 'mentoring-11',
    mentor: { name: '임수빈', role: '멘토' },
    mentee: { name: '오은우', role: '멘티' },
    dateRange: '2026.06.02 16:00 - 2026.06.02 17:00',
    title: '테스트 자동화 전략 수립',
    status: 'completed',
  },
]

export const INITIAL_REVIEWS: MentoringReview[] = [
  {
    id: 'review-1',
    title: '[워크숍] 디자인 트렌드와 사용자 경험 개선',
    relativeTime: '3일 전',
    mentor: { name: '정하늘', role: '멘토', generation: 30, part: 'FE' },
    mentee: { name: '윤지수', role: '멘티', generation: 33, part: 'FE' },
    isRecommended: true,
    keywords: ['🧩 문제 해결을 잘 해요', '🗂️ 준비성이 좋아요', '✨ 피드백이 좋아요'],
    freeReview:
      '이번 멘토링을 통해 제 커리어 방향을 구체적으로 설계할 수 있었습니다. 혼자서 포트폴리오와 이력서를 점검할 때는 막연했던 부분들이, 현업 경험이 풍부한 멘토님의 세심한 피드백 덕분에 명확해졌습니다.',
  },
  {
    id: 'review-2',
    title: '프론트엔드 성능 최적화 실습',
    relativeTime: '5일 전',
    mentor: { name: '박지훈', role: '멘토', generation: 29, part: 'FE' },
    mentee: { name: '최유진', role: '멘티', generation: 33, part: 'BE' },
    isRecommended: true,
    keywords: ['📚 지식이 풍부해요', '⏰ 시간 약속을 잘 지켜요'],
    freeReview:
      '번들 사이즈와 렌더링 성능을 개선하는 구체적인 방법을 실습 위주로 배울 수 있어서 좋았습니다. 실무에 바로 적용할 수 있는 팁이 많았어요.',
  },
  {
    id: 'review-3',
    title: '포트폴리오 피드백 세션',
    relativeTime: '1주 전',
    mentor: { name: '한도윤', role: '멘토', generation: 31, part: 'DE' },
    mentee: { name: '서지민', role: '멘티', generation: 33, part: 'DE' },
    isRecommended: false,
    keywords: ['🗂️ 준비성이 좋아요'],
    freeReview:
      '포트폴리오 구성에 대한 피드백은 유익했지만, 시간이 조금 짧게 느껴졌습니다. 다음에는 조금 더 여유있게 진행되면 좋을 것 같아요.',
  },
  {
    id: 'review-4',
    title: '기획서 작성 가이드',
    relativeTime: '2주 전',
    mentor: { name: '이현진', role: '멘토', generation: 28, part: 'PLAN' },
    mentee: { name: '김서연', role: '멘티', generation: 33, part: 'PLAN' },
    isRecommended: true,
    keywords: ['✨ 피드백이 좋아요', '📚 지식이 풍부해요'],
    freeReview:
      '기획서 작성에서 놓치기 쉬운 부분들을 꼼꼼하게 짚어주셔서 많은 도움이 되었습니다. 실제 사례를 들어 설명해주신 점이 특히 좋았습니다.',
  },
]

export const INITIAL_MENTORS: ActiveMentor[] = [
  { id: 'mentor-1', name: '정하늘', generation: 28, part: 'FE', satisfactionRate: 88 },
  { id: 'mentor-2', name: '박지훈', generation: 29, part: 'FE', satisfactionRate: 95 },
  { id: 'mentor-3', name: '한도윤', generation: 31, part: 'DE', satisfactionRate: 76 },
  { id: 'mentor-4', name: '이현진', generation: 28, part: 'PLAN', satisfactionRate: 91 },
  { id: 'mentor-5', name: '최민준', generation: 30, part: 'BE', satisfactionRate: 83 },
  { id: 'mentor-6', name: '강서연', generation: 32, part: 'BE', satisfactionRate: 79 },
  { id: 'mentor-7', name: '윤서준', generation: 29, part: 'PLAN', satisfactionRate: 98 },
  { id: 'mentor-8', name: '서지훈', generation: 31, part: 'FE', satisfactionRate: 87 },
  { id: 'mentor-9', name: '조하은', generation: 30, part: 'DE', satisfactionRate: 92 },
  { id: 'mentor-10', name: '임수빈', generation: 33, part: 'BE', satisfactionRate: 84 },
  { id: 'mentor-11', name: '조유진', generation: 32, part: 'FE', satisfactionRate: 90 },
  { id: 'mentor-12', name: '김서연', generation: 33, part: 'PLAN', satisfactionRate: 77 },
  { id: 'mentor-13', name: '윤지수', generation: 33, part: 'DE', satisfactionRate: 96 },
  { id: 'mentor-14', name: '최유진', generation: 33, part: 'FE', satisfactionRate: 81 },
]

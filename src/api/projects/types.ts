// 요청에 보내는 값(백엔드 ProjectType enum 상수명)
export type MeetupProjectType = 'APP' | 'WEB' | 'CHROME_EXTENSION'

// 응답에 오는 값(ProjectType.getName()). 요청 값과 다르다(예: 'chrome extension').
export type MeetupProjectTypeName = 'app' | 'web' | 'chrome extension'

// 목록(isDetail=false)에는 intro/type/start_date/end_date/team이 @JsonInclude(NON_NULL)이라 아예 없다.
// tags는 항상 배열이고 값마다 '#'이 붙는다(예: '#AI').
export interface MeetupProjectListItem {
  meetup_id: number
  cardinal: number
  name: string
  one_line_intro: string
  logo_url: string | null
  poster_url: string | null
  web_thumbnail_url: string | null
  behance_url: string | null
  instagram_url: string | null
  github_url: string | null
  app_url: string | null
  tags: string[]
}

export interface MeetupProjectListResponse {
  meetup_count: number
  meetup_list: MeetupProjectListItem[]
}

// 파트에 멤버가 없으면 배열 대신 null이다.
export interface MeetupProjectTeam {
  name: string
  planner: string[] | null
  designer: string[] | null
  frontend: string[] | null
  backend: string[] | null
  ios: string[] | null
  aos: string[] | null
}

// 상세(isDetail=true)에서만 intro/type/start_date/end_date/team이 온다.
// intro·type은 엔티티에서 null일 수 있고, NON_NULL이라 그때는 키 자체가 빠진다.
export interface MeetupProjectDetail extends MeetupProjectListItem {
  intro?: string
  type?: MeetupProjectTypeName
  team: MeetupProjectTeam
  start_date: string
  end_date: string
}

export interface MeetupProjectCreateRequest {
  cardinal: number
  name: string
  intro: string
  type: MeetupProjectType
  oneLineIntro: string
  teamName: string
  startDate: string
  endDate: string
  instagramUrl?: string
  githubUrl?: string
  appUrl?: string
  behanceUrl?: string
  planner: string[]
  designer: string[]
  frontend: string[]
  backend: string[]
  ios: string[]
  aos: string[]
  logoFile: File
  posterFile: File
}

export interface MeetupProjectUpdateRequest {
  meetupId: number
  cardinal: number
  name: string
  intro: string
  type: MeetupProjectType
  oneLineIntro: string
  teamName: string
  startDate: string
  endDate: string
  instagramUrl?: string
  githubUrl?: string
  appUrl?: string
  behanceUrl?: string
  planner: string[]
  designer: string[]
  frontend: string[]
  backend: string[]
  ios: string[]
  aos: string[]
  logoFile?: File
  posterFile?: File
}

// category는 '#' 없는 태그명 목록, tags는 '#'이 붙은 목록이다. 둘 다 항상 배열이다.
export interface CorporateProjectListItem {
  corporate_id: number
  cardinal: number
  name: string
  content: string
  category: string[]
  logo_url: string | null
  banner_url: string | null
  tags: string[]
}

export interface CorporateProjectListResponse {
  corporateCount: number
  corporateList: CorporateProjectListItem[]
}

export type CorporateProjectDetail = CorporateProjectListItem

export interface CorporateProjectCreateRequest {
  cardinal: number
  name: string
  content: string
  logoFile: File
  bannerFile: File
}

// logoFile/bannerFile은 uploadOrKeep라 생략하면 기존 이미지를 유지한다.
export interface CorporateProjectUpdateRequest {
  corporateId: number
  cardinal: number
  name: string
  content: string
  logoFile?: File
  bannerFile?: File
}

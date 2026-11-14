export type BannerStatus = 'CLOSE' | 'UPCOMING_RECRUIT' | 'MANAGE_RECRUIT' | 'MEMBER_RECRUIT'

// 목록 항목의 이름 외 텍스트(description/corporation/topic)는 서버가 name만 필수로 검사해서
// 기존 데이터나 다른 클라이언트가 넣은 데이터는 null일 수 있다(IntroService#isNamedItem).
export interface ManagementTeamResponse {
  id: number
  name: string
  image_link: string | null
  description: string | null
}

export interface ActivityResponse {
  id: number
  name: string
  image_url1: string | null
  image_url2: string | null
  description: string | null
}

export interface ExpertLectureResponse {
  id: number
  name: string
  image_link: string | null
  corporation: string | null
  description: string | null
}

export interface OBLectureResponse {
  id: number
  name: string
  image_link: string | null
  topic: string | null
}

export interface IntroImageResponse {
  id: number
  image_url: string | null
}

// 목록 필드는 엔티티 초기값이 빈 배열이라 항상 배열이다.
export interface AdminIntroResponse {
  banner_cardinal: number | null
  banner_status: BannerStatus | null
  member_count: number | null
  project_count: number | null
  university_count: number | null
  intro_youtube_link: string | null
  planning_image_url: string | null
  design_image_url: string | null
  frontend_image_url: string | null
  backend_image_url: string | null
  partner_logos: IntroImageResponse[]
  meetup_images: IntroImageResponse[]
  activities: ActivityResponse[]
  teams: ManagementTeamResponse[]
  expert_lecture: ExpertLectureResponse[]
  ob_lecture: OBLectureResponse[]
  sponsors: IntroImageResponse[]
}

export interface TeamItem {
  id?: number
  name: string
  description: string
  imageFile?: File
  removeImage?: boolean
}

export interface ActivityItem {
  id?: number
  name: string
  description: string
  imageFile1?: File
  imageFile2?: File
  removeImage1?: boolean
  removeImage2?: boolean
}

export interface ExpertLectureItem {
  id?: number
  name: string
  corporation: string
  description: string
  imageFile?: File
  removeImage?: boolean
}

export interface OBLectureItem {
  id?: number
  name: string
  topic: string
  imageFile?: File
  removeImage?: boolean
}

export interface IntroImageItem {
  id?: number
  imageFile?: File
}

// 목록 필드(teams/expertLecture/obLecture/activities/partnerLogos/meetupImages/sponsors)는
// 생략하면 기존 목록이 유지된다. 전달하면 id 기준으로 수정/추가하고, 빠진 기존 항목은 삭제되며
// 보낸 순서대로 정렬된다. 자세한 내용은 .claude/references/api/admin-introductions.md 참고.
// bannerCardinal/bannerStatus/memberCount/projectCount/universityCount/introYoutubeLink는 서버에서 필수(@NotNull·@NotBlank)라
// 빠지면 400이다. 폼이 값을 채운 경우에만 보내므로 여기서는 선택으로 둔다.
export interface IntroUpdateRequest {
  bannerCardinal?: number
  bannerStatus?: BannerStatus
  memberCount?: number
  projectCount?: number
  universityCount?: number
  introYoutubeLink?: string
  planningImage?: File
  designImage?: File
  frontendImage?: File
  backendImage?: File
  teams?: TeamItem[]
  expertLecture?: ExpertLectureItem[]
  obLecture?: OBLectureItem[]
  partnerLogos?: IntroImageItem[]
  meetupImages?: IntroImageItem[]
  activities?: ActivityItem[]
  sponsors?: IntroImageItem[]
}

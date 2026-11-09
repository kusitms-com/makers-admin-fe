import { z } from 'zod'
import { apiRequest } from './client'

const managementTeamResponseSchema = z.object({
  name: z.string(),
  image_link: z.string().nullable(),
  description: z.string(),
})

const activityResponseSchema = z.object({
  name: z.string(),
  image_url1: z.string().nullable(),
  image_url2: z.string().nullable(),
  description: z.string(),
})

const expertLectureResponseSchema = z.object({
  name: z.string(),
  image_link: z.string().nullable(),
  corporation: z.string(),
  description: z.string(),
})

const obLectureResponseSchema = z.object({
  name: z.string(),
  image_link: z.string().nullable(),
  topic: z.string(),
})

const adminIntroResponseSchema = z.object({
  banner_cardinal: z.number().nullable(),
  banner_status: z.string().nullable(),
  slogan: z.string().nullable(),
  banner_image_url: z.string().nullable(),
  member_count: z.number().nullable(),
  project_count: z.number().nullable(),
  university_count: z.number().nullable(),
  intro_youtube_link: z.string().nullable(),
  planning_image_url: z.string().nullable(),
  design_image_url: z.string().nullable(),
  frontend_image_url: z.string().nullable(),
  backend_image_url: z.string().nullable(),
  partner_logo_urls: z.array(z.string()),
  meetup_image_urls: z.array(z.string()),
  activities: z.array(activityResponseSchema),
  teams: z.array(managementTeamResponseSchema),
  expert_lecture: z.array(expertLectureResponseSchema),
  ob_lecture: z.array(obLectureResponseSchema),
  sponsor_image_urls: z.array(z.string()),
})

export type AdminIntroResponse = z.infer<typeof adminIntroResponseSchema>

interface RequestContext {
  accessToken: string
  refreshAccessToken?: () => Promise<string>
}

export function getIntroduction({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<AdminIntroResponse> {
  return apiRequest(
    { method: 'GET', path: '/admin/introductions', accessToken, refreshAccessToken },
    adminIntroResponseSchema,
  )
}

export type BannerStatus = 'CLOSE' | 'MANAGE_RECRUIT' | 'MEMBER_RECRUIT'

interface TeamItem {
  name: string
  description: string
  imageFile?: File
}

interface ActivityItem {
  name: string
  description: string
  imageFile1?: File
  imageFile2?: File
}

interface ExpertLectureItem {
  name: string
  corporation: string
  description: string
  imageFile?: File
}

interface OBLectureItem {
  name: string
  topic: string
  imageFile?: File
}

// PUT은 teams/activities/expertLecture/obLecture/partnerLogoFiles/meetupImages/sponsors를
// 매번 전체 교체한다(백엔드가 삭제 후 재생성). 생략한 필드는 서버 쪽 기존 데이터가 지워진다.
// 자세한 내용은 .claude/references/api/admin-introductions.md 참고.
export interface IntroUpdateRequest {
  bannerCardinal?: number
  bannerStatus?: BannerStatus
  slogan?: string
  bannerImageFile?: File
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
  partnerLogoFiles?: File[]
  meetupImages?: File[]
  activities?: ActivityItem[]
  sponsors?: File[]
}

// 백엔드가 @ModelAttribute로 바인딩하므로 배열 항목은 `key[index].field` 형태로 보내야 한다.
function appendIndexedItems(formData: FormData, key: string, items: object[] | undefined) {
  items?.forEach((item, index) => {
    Object.entries(item).forEach(([field, value]) => {
      if (typeof value !== 'string' && !(value instanceof File)) return
      formData.append(`${key}[${String(index)}].${field}`, value)
    })
  })
}

function appendFiles(formData: FormData, key: string, files: File[] | undefined) {
  files?.forEach((file) => {
    formData.append(key, file)
  })
}

function buildIntroFormData(request: IntroUpdateRequest): FormData {
  const formData = new FormData()

  if (request.bannerCardinal !== undefined) {
    formData.append('bannerCardinal', String(request.bannerCardinal))
  }
  if (request.bannerStatus !== undefined) {
    formData.append('bannerStatus', request.bannerStatus)
  }
  if (request.slogan !== undefined) {
    formData.append('slogan', request.slogan)
  }
  if (request.bannerImageFile) {
    formData.append('bannerImageFile', request.bannerImageFile)
  }
  if (request.memberCount !== undefined) {
    formData.append('memberCount', String(request.memberCount))
  }
  if (request.projectCount !== undefined) {
    formData.append('projectCount', String(request.projectCount))
  }
  if (request.universityCount !== undefined) {
    formData.append('universityCount', String(request.universityCount))
  }
  if (request.introYoutubeLink !== undefined) {
    formData.append('introYoutubeLink', request.introYoutubeLink)
  }
  if (request.planningImage) {
    formData.append('planningImage', request.planningImage)
  }
  if (request.designImage) {
    formData.append('designImage', request.designImage)
  }
  if (request.frontendImage) {
    formData.append('frontendImage', request.frontendImage)
  }
  if (request.backendImage) {
    formData.append('backendImage', request.backendImage)
  }

  appendIndexedItems(formData, 'teams', request.teams)
  appendIndexedItems(formData, 'expertLecture', request.expertLecture)
  appendIndexedItems(formData, 'obLecture', request.obLecture)
  appendIndexedItems(formData, 'activities', request.activities)
  appendFiles(formData, 'partnerLogoFiles', request.partnerLogoFiles)
  appendFiles(formData, 'meetupImages', request.meetupImages)
  appendFiles(formData, 'sponsors', request.sponsors)

  return formData
}

export function updateIntroduction(
  request: IntroUpdateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'PUT',
      path: '/admin/introductions',
      body: buildIntroFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

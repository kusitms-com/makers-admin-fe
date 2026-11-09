import { z } from 'zod'
import { apiRequest } from './client'

const managementTeamResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  image_link: z.string().nullable(),
  description: z.string(),
})

const activityResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  image_url1: z.string().nullable(),
  image_url2: z.string().nullable(),
  description: z.string(),
})

const expertLectureResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  image_link: z.string().nullable(),
  corporation: z.string(),
  description: z.string(),
})

const obLectureResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  image_link: z.string().nullable(),
  topic: z.string(),
})

const introImageResponseSchema = z.object({
  id: z.number(),
  image_url: z.string().nullable(),
})

const adminIntroResponseSchema = z.object({
  banner_cardinal: z.number().nullable(),
  banner_status: z.string().nullable(),
  member_count: z.number().nullable(),
  project_count: z.number().nullable(),
  university_count: z.number().nullable(),
  intro_youtube_link: z.string().nullable(),
  planning_image_url: z.string().nullable(),
  design_image_url: z.string().nullable(),
  frontend_image_url: z.string().nullable(),
  backend_image_url: z.string().nullable(),
  partner_logos: z.array(introImageResponseSchema),
  meetup_images: z.array(introImageResponseSchema),
  activities: z.array(activityResponseSchema),
  teams: z.array(managementTeamResponseSchema),
  expert_lecture: z.array(expertLectureResponseSchema),
  ob_lecture: z.array(obLectureResponseSchema),
  sponsors: z.array(introImageResponseSchema),
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
  id?: number
  name: string
  description: string
  imageFile?: File
  removeImage?: boolean
}

interface ActivityItem {
  id?: number
  name: string
  description: string
  imageFile1?: File
  imageFile2?: File
  removeImage1?: boolean
  removeImage2?: boolean
}

interface ExpertLectureItem {
  id?: number
  name: string
  corporation: string
  description: string
  imageFile?: File
  removeImage?: boolean
}

interface OBLectureItem {
  id?: number
  name: string
  topic: string
  imageFile?: File
  removeImage?: boolean
}

interface IntroImageItem {
  id?: number
  imageFile?: File
}

// 목록 필드(teams/expertLecture/obLecture/activities/partnerLogos/meetupImages/sponsors)는
// 생략하면 기존 목록이 유지된다. 전달하면 id 기준으로 수정/추가하고, 빠진 기존 항목은 삭제되며
// 보낸 순서대로 정렬된다. 자세한 내용은 .claude/references/api/admin-introductions.md 참고.
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

// 백엔드가 @ModelAttribute로 바인딩하므로 배열 항목은 `key[index].field` 형태로 보내야 한다.
function appendIndexedItems(formData: FormData, key: string, items: object[] | undefined) {
  items?.forEach((item, index) => {
    Object.entries(item).forEach(([field, value]) => {
      if (value === undefined) return
      formData.append(
        `${key}[${String(index)}].${field}`,
        value instanceof File ? value : String(value),
      )
    })
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
  appendIndexedItems(formData, 'partnerLogos', request.partnerLogos)
  appendIndexedItems(formData, 'meetupImages', request.meetupImages)
  appendIndexedItems(formData, 'sponsors', request.sponsors)

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

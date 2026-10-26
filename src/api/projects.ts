import { z } from 'zod'
import { apiRequest } from './client'

interface RequestContext {
  accessToken: string
  refreshAccessToken?: () => Promise<string>
}

export type MeetupProjectType = 'APP' | 'WEB' | 'CHROME_EXTENSION'

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

function appendStringList(formData: FormData, key: string, values: string[]) {
  values.forEach((value) => {
    formData.append(key, value)
  })
}

// 백엔드가 @ModelAttribute로 바인딩한다(AdminController#addMeetupProject). List<String> 필드는
// introductions의 List<객체> 필드와 달리 인덱스 없이 같은 필드명을 반복하면 Spring이 자동으로 묶는다.
function buildMeetupFormData(request: MeetupProjectCreateRequest): FormData {
  const formData = new FormData()

  formData.append('cardinal', String(request.cardinal))
  formData.append('name', request.name)
  formData.append('intro', request.intro)
  formData.append('type', request.type)
  formData.append('oneLineIntro', request.oneLineIntro)
  formData.append('teamName', request.teamName)
  formData.append('startDate', request.startDate)
  formData.append('endDate', request.endDate)
  if (request.instagramUrl) formData.append('instagramUrl', request.instagramUrl)
  if (request.githubUrl) formData.append('githubUrl', request.githubUrl)
  if (request.appUrl) formData.append('appUrl', request.appUrl)
  if (request.behanceUrl) formData.append('behanceUrl', request.behanceUrl)
  appendStringList(formData, 'planner', request.planner)
  appendStringList(formData, 'designer', request.designer)
  appendStringList(formData, 'frontend', request.frontend)
  appendStringList(formData, 'backend', request.backend)
  appendStringList(formData, 'ios', request.ios)
  appendStringList(formData, 'aos', request.aos)
  formData.append('logoFile', request.logoFile)
  formData.append('posterFile', request.posterFile)

  return formData
}

// MeetupRequest.logoFile/posterFile은 백엔드가 null 체크 없이 바로 업로드하므로(AdminService#saveMeetup)
// 둘 다 필수다. 자세한 내용은 .claude/references/api/admin-projects.md 참고.
export function createMeetupProject(
  request: MeetupProjectCreateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'POST',
      path: '/admin/projects/meetup',
      body: buildMeetupFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

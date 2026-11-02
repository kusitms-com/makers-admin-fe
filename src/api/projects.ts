import { z } from 'zod'
import { apiRequest } from './client'

interface RequestContext {
  accessToken: string
  refreshAccessToken?: () => Promise<string>
}

export type MeetupProjectType = 'APP' | 'WEB' | 'CHROME_EXTENSION'

// GET은 목록 조회라 isDetail=false로 내려온다(AdminService#getMeetupProjects,
// new MeetupDetailResponse(p, false)) — intro/type/start_date/end_date/team은
// @JsonInclude(NON_NULL)이라 이 응답에는 아예 포함되지 않는다.
const meetupProjectListItemSchema = z.object({
  meetup_id: z.number(),
  cardinal: z.number(),
  name: z.string(),
  one_line_intro: z.string(),
  logo_url: z.string().nullable(),
  poster_url: z.string().nullable(),
  web_thumbnail_url: z.string().nullable(),
  behance_url: z.string().nullable(),
  instagram_url: z.string().nullable(),
  github_url: z.string().nullable(),
  app_url: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
})

const meetupProjectListResponseSchema = z.object({
  meetup_count: z.number(),
  meetup_list: z.array(meetupProjectListItemSchema),
})

export type MeetupProjectListItem = z.infer<typeof meetupProjectListItemSchema>
export type MeetupProjectListResponse = z.infer<typeof meetupProjectListResponseSchema>

export function getMeetupProjects({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<MeetupProjectListResponse> {
  return apiRequest(
    { method: 'GET', path: '/admin/meetup', accessToken, refreshAccessToken },
    meetupProjectListResponseSchema,
  )
}

const meetupProjectTeamSchema = z.object({
  name: z.string(),
  planner: z.array(z.string()).nullable(),
  designer: z.array(z.string()).nullable(),
  frontend: z.array(z.string()).nullable(),
  backend: z.array(z.string()).nullable(),
  ios: z.array(z.string()).nullable(),
  aos: z.array(z.string()).nullable(),
})

// 상세 조회(isDetail=true)에서만 내려오는 intro/type/start_date/end_date/team을 포함한다.
// type은 ProjectType enum 상수명과 달리 응답에서 소문자로 내려오는 경우가 있어 string으로만 검증한다.
const meetupProjectDetailSchema = z.object({
  meetup_id: z.number(),
  cardinal: z.number(),
  name: z.string(),
  intro: z.string(),
  type: z.string(),
  team: meetupProjectTeamSchema,
  one_line_intro: z.string(),
  logo_url: z.string().nullable(),
  poster_url: z.string().nullable(),
  web_thumbnail_url: z.string().nullable(),
  behance_url: z.string().nullable(),
  instagram_url: z.string().nullable(),
  github_url: z.string().nullable(),
  app_url: z.string().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  tags: z.array(z.string()).nullable(),
})

export type MeetupProjectTeam = z.infer<typeof meetupProjectTeamSchema>
export type MeetupProjectDetail = z.infer<typeof meetupProjectDetailSchema>

export function getMeetupProject(
  id: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<MeetupProjectDetail> {
  return apiRequest(
    { method: 'GET', path: `/admin/meetup/${String(id)}`, accessToken, refreshAccessToken },
    meetupProjectDetailSchema,
  )
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

// PUT의 updateMeetup은 uploadOrKeep를 쓰므로 logoFile/posterFile을 생략하면 기존 값을 유지한다.
// 자세한 내용은 .claude/references/api/admin-projects.md 참고.
function buildMeetupUpdateFormData(request: MeetupProjectUpdateRequest): FormData {
  const formData = new FormData()

  formData.append('meetupId', String(request.meetupId))
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
  if (request.logoFile) formData.append('logoFile', request.logoFile)
  if (request.posterFile) formData.append('posterFile', request.posterFile)

  return formData
}

export function updateMeetupProject(
  request: MeetupProjectUpdateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'PUT',
      path: '/admin/projects/meetup',
      body: buildMeetupUpdateFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export function deleteMeetupProject(
  id: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'DELETE',
      path: `/admin/projects/meetup/${String(id)}`,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

// logo_url/banner_url은 밋업과 동일하게 버킷 도메인과 key 사이 슬래시가 빠져 있다
// (CorporateDetailResponse도 MeetupDetailResponse와 같은 s3Url + key 문자열 연결 방식으로 보인다).
// toAbsoluteS3Url()로 정규화해서 써야 한다.
const corporateProjectListItemSchema = z.object({
  corporate_id: z.number(),
  cardinal: z.number(),
  name: z.string(),
  content: z.string(),
  category: z.array(z.string()),
  logo_url: z.string().nullable(),
  banner_url: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
})

const corporateProjectListResponseSchema = z.object({
  corporateCount: z.number(),
  corporateList: z.array(corporateProjectListItemSchema),
})

export type CorporateProjectListItem = z.infer<typeof corporateProjectListItemSchema>
export type CorporateProjectListResponse = z.infer<typeof corporateProjectListResponseSchema>

export function getCorporateProjects({
  accessToken,
  refreshAccessToken,
}: RequestContext): Promise<CorporateProjectListResponse> {
  return apiRequest(
    { method: 'GET', path: '/admin/corporate', accessToken, refreshAccessToken },
    corporateProjectListResponseSchema,
  )
}

const corporateProjectDetailSchema = z.object({
  corporate_id: z.number(),
  cardinal: z.number(),
  name: z.string(),
  content: z.string(),
  category: z.array(z.string()),
  logo_url: z.string().nullable(),
  banner_url: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
})

export type CorporateProjectDetail = z.infer<typeof corporateProjectDetailSchema>

export function getCorporateProject(
  id: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<CorporateProjectDetail> {
  return apiRequest(
    { method: 'GET', path: `/admin/corporate/${String(id)}`, accessToken, refreshAccessToken },
    corporateProjectDetailSchema,
  )
}

export interface CorporateProjectCreateRequest {
  cardinal: number
  name: string
  content: string
  logoFile: File
  bannerFile: File
}

function buildCorporateFormData(request: CorporateProjectCreateRequest): FormData {
  const formData = new FormData()

  formData.append('cardinal', String(request.cardinal))
  formData.append('name', request.name)
  formData.append('content', request.content)
  // AdminService#saveCorporate가 request.getTag()를 null 체크 없이 바로 .size()를 호출해서,
  // tag 필드를 아예 안 보내면 NPE로 500이 난다. tag UI가 아직 없어서 빈 문자열 하나를 보내
  // null 바인딩을 피한다. 자세한 내용은
  // .claude/known-issues/records/api-corporate-create-tag-npe.md 참고.
  formData.append('tag', '')
  formData.append('logoFile', request.logoFile)
  formData.append('bannerFile', request.bannerFile)

  return formData
}

export function createCorporateProject(
  request: CorporateProjectCreateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'POST',
      path: '/admin/projects/corporate',
      body: buildCorporateFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export interface CorporateProjectUpdateRequest {
  corporateId: number
  cardinal: number
  name: string
  content: string
  logoFile?: File
  bannerFile?: File
}

// PUT의 updateCorporate도 saveCorporate와 동일하게 tag를 null 체크 없이 바로 .size()를 호출하므로
// (.claude/known-issues/records/api-corporate-create-tag-npe.md), 생성과 동일하게 빈 문자열을 보낸다.
// logoFile/bannerFile은 Swagger 설명(uploadOrKeep)대로 생략 시 기존 이미지를 유지하므로 선택이다.
function buildCorporateUpdateFormData(request: CorporateProjectUpdateRequest): FormData {
  const formData = new FormData()

  formData.append('corporateId', String(request.corporateId))
  formData.append('cardinal', String(request.cardinal))
  formData.append('name', request.name)
  formData.append('content', request.content)
  formData.append('tag', '')
  if (request.logoFile) formData.append('logoFile', request.logoFile)
  if (request.bannerFile) formData.append('bannerFile', request.bannerFile)

  return formData
}

export function updateCorporateProject(
  request: CorporateProjectUpdateRequest,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'PUT',
      path: '/admin/projects/corporate',
      body: buildCorporateUpdateFormData(request),
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

export function deleteCorporateProject(
  id: number,
  { accessToken, refreshAccessToken }: RequestContext,
): Promise<unknown> {
  return apiRequest(
    {
      method: 'DELETE',
      path: `/admin/projects/corporate/${String(id)}`,
      accessToken,
      refreshAccessToken,
    },
    z.unknown(),
  )
}

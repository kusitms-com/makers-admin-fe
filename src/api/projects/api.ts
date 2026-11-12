import { apiRequest, apiRequestVoid } from '../client'
import type {
  MeetupProjectListResponse,
  MeetupProjectDetail,
  MeetupProjectCreateRequest,
  MeetupProjectUpdateRequest,
  CorporateProjectListResponse,
  CorporateProjectDetail,
  CorporateProjectCreateRequest,
  CorporateProjectUpdateRequest,
} from './types'

export function getMeetupProjects(): Promise<MeetupProjectListResponse> {
  return apiRequest({ method: 'GET', path: '/admin/meetup' })
}

export function getMeetupProject(id: number): Promise<MeetupProjectDetail> {
  return apiRequest({ method: 'GET', path: `/admin/meetup/${String(id)}` })
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
export function createMeetupProject(request: MeetupProjectCreateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'POST',
    path: '/admin/projects/meetup',
    body: buildMeetupFormData(request),
  })
}

// PUT의 updateMeetup은 uploadOrKeep를 쓰므로 logoFile/posterFile을 생략하면 기존 값을 유지한다.
// URL 필드는 생략하면 null로 덮어쓴다. 자세한 내용은 .claude/references/api/admin-projects.md 참고.
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

export function updateMeetupProject(request: MeetupProjectUpdateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'PUT',
    path: '/admin/projects/meetup',
    body: buildMeetupUpdateFormData(request),
  })
}

export function deleteMeetupProject(id: number): Promise<void> {
  return apiRequestVoid({ method: 'DELETE', path: `/admin/projects/meetup/${String(id)}` })
}

export function getCorporateProjects(): Promise<CorporateProjectListResponse> {
  return apiRequest({ method: 'GET', path: '/admin/corporate' })
}

export function getCorporateProject(id: number): Promise<CorporateProjectDetail> {
  return apiRequest({ method: 'GET', path: `/admin/corporate/${String(id)}` })
}

// tag UI가 아직 없어서 tag는 보내지 않는다. 생성 시 생략하면 태그 없이 만들어지고,
// 수정 시 생략하면 기존 태그·분류를 유지한다(AdminService#updateCorporate). 빈 문자열을 보내면 태그가 지워진다.
function buildCorporateFormData(
  request: CorporateProjectCreateRequest | CorporateProjectUpdateRequest,
): FormData {
  const formData = new FormData()

  if ('corporateId' in request) formData.append('corporateId', String(request.corporateId))
  formData.append('cardinal', String(request.cardinal))
  formData.append('name', request.name)
  formData.append('content', request.content)
  if (request.logoFile) formData.append('logoFile', request.logoFile)
  if (request.bannerFile) formData.append('bannerFile', request.bannerFile)

  return formData
}

export function createCorporateProject(request: CorporateProjectCreateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'POST',
    path: '/admin/projects/corporate',
    body: buildCorporateFormData(request),
  })
}

export function updateCorporateProject(request: CorporateProjectUpdateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'PUT',
    path: '/admin/projects/corporate',
    body: buildCorporateFormData(request),
  })
}

export function deleteCorporateProject(id: number): Promise<void> {
  return apiRequestVoid({ method: 'DELETE', path: `/admin/projects/corporate/${String(id)}` })
}

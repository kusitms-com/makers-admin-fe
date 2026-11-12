import { apiRequest, apiRequestVoid } from '../client'
import type { AdminIntroResponse, IntroUpdateRequest } from './types'

export function getIntroduction(): Promise<AdminIntroResponse> {
  return apiRequest({ method: 'GET', path: '/admin/introductions' })
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

export function updateIntroduction(request: IntroUpdateRequest): Promise<void> {
  return apiRequestVoid({
    method: 'PUT',
    path: '/admin/introductions',
    body: buildIntroFormData(request),
  })
}

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { AdminIntroResponse, BannerStatus, IntroUpdateRequest } from '@api/introductions'
import { useIntroductionQuery, useUpdateIntroductionMutation } from './useIntroductions'

export type PartKey = 'plan' | 'design' | 'frontend' | 'backend'

export interface IntroductionItem {
  id: string
  title: string
  description: string
  extra?: string
  thumbnailUrl?: string
  thumbnailFile?: File
  thumbnailUrl2?: string
  thumbnailFile2?: File
}

export interface PartnerLogo {
  id: string
  imageUrl?: string
  imageFile?: File
}

export function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

// 기수 선택 소스가 생기기 전까지 현재 활동 기수를 고정값으로 둔다.
const CURRENT_GENERATION = 33

function toOptionalCount(value: string): number | undefined {
  if (value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

function toFileList(items: PartnerLogo[]): File[] {
  return items.map((item) => item.imageFile).filter((file): file is File => file !== undefined)
}

// ponytail: 백엔드가 이미지 필드에 완전한 URL이 아니라 S3 object key만 반환해서 버킷 도메인을 하드코딩해 붙인다.
// 백엔드가 완전한 URL을 반환하도록 고치면 이 우회 코드를 제거한다.
// 자세한 내용은 .claude/known-issues/records/api-introductions-image-url-not-absolute.md 참고.
const S3_BASE_URL = 'https://kusitms-bucket.s3.ap-northeast-2.amazonaws.com'

function toAbsoluteImageUrl(key: string | null): string | undefined {
  if (!key) return undefined
  if (key.startsWith('http://') || key.startsWith('https://')) return key
  const encodedKey = key.split('/').map(encodeURIComponent).join('/')
  return `${S3_BASE_URL}/${encodedKey}`
}

function toPartnerLogoList(urls: string[]): PartnerLogo[] {
  return urls.map((url) => ({ id: crypto.randomUUID(), imageUrl: toAbsoluteImageUrl(url) }))
}

function toSnapshotItem({
  id,
  title,
  description,
  extra,
  thumbnailUrl,
  thumbnailUrl2,
}: IntroductionItem) {
  return { id, title, description, extra, thumbnailUrl, thumbnailUrl2 }
}

function toLogoSnapshot(items: PartnerLogo[]) {
  return items.map(({ id, imageUrl }) => ({ id, imageUrl }))
}

function buildFormSnapshot(fields: {
  bannerStatus: BannerStatus | ''
  slogan: string
  bannerImageUrl: string | undefined
  memberCount: string
  projectCount: string
  universityCount: string
  introYoutubeLink: string
  partImages: Record<PartKey, string | undefined>
  activities: IntroductionItem[]
  teams: IntroductionItem[]
  partnerLogos: PartnerLogo[]
  expertLecture: IntroductionItem[]
  obLecture: IntroductionItem[]
  meetupImages: PartnerLogo[]
  sponsors: PartnerLogo[]
}) {
  return JSON.stringify({
    bannerStatus: fields.bannerStatus,
    slogan: fields.slogan,
    bannerImageUrl: fields.bannerImageUrl,
    memberCount: fields.memberCount,
    projectCount: fields.projectCount,
    universityCount: fields.universityCount,
    introYoutubeLink: fields.introYoutubeLink,
    partImages: fields.partImages,
    activities: fields.activities.map(toSnapshotItem),
    teams: fields.teams.map(toSnapshotItem),
    partnerLogos: toLogoSnapshot(fields.partnerLogos),
    expertLecture: fields.expertLecture.map(toSnapshotItem),
    obLecture: fields.obLecture.map(toSnapshotItem),
    meetupImages: toLogoSnapshot(fields.meetupImages),
    sponsors: toLogoSnapshot(fields.sponsors),
  })
}

function hydrateFromResponse(data: AdminIntroResponse) {
  return {
    bannerStatus: (data.banner_status ?? '') as BannerStatus | '',
    slogan: data.slogan ?? '',
    bannerImageUrl: toAbsoluteImageUrl(data.banner_image_url),
    memberCount: data.member_count !== null ? String(data.member_count) : '',
    projectCount: data.project_count !== null ? String(data.project_count) : '',
    universityCount: data.university_count !== null ? String(data.university_count) : '',
    introYoutubeLink: data.intro_youtube_link ?? '',
    partImages: {
      plan: toAbsoluteImageUrl(data.planning_image_url),
      design: toAbsoluteImageUrl(data.design_image_url),
      frontend: toAbsoluteImageUrl(data.frontend_image_url),
      backend: toAbsoluteImageUrl(data.backend_image_url),
    },
    teams: data.teams.map((team) => ({
      id: crypto.randomUUID(),
      title: team.name,
      description: team.description,
      thumbnailUrl: toAbsoluteImageUrl(team.image_link),
    })),
    activities: data.activities.map((activity) => ({
      id: crypto.randomUUID(),
      title: activity.name,
      description: activity.description,
      thumbnailUrl: toAbsoluteImageUrl(activity.image_url1),
      thumbnailUrl2: toAbsoluteImageUrl(activity.image_url2),
    })),
    expertLecture: data.expert_lecture.map((lecture) => ({
      id: crypto.randomUUID(),
      title: lecture.name,
      description: lecture.description,
      extra: lecture.corporation,
      thumbnailUrl: toAbsoluteImageUrl(lecture.image_link),
    })),
    obLecture: data.ob_lecture.map((lecture) => ({
      id: crypto.randomUUID(),
      title: lecture.name,
      description: lecture.topic,
      thumbnailUrl: toAbsoluteImageUrl(lecture.image_link),
    })),
    partnerLogos: toPartnerLogoList(data.partner_logo_urls),
    meetupImages: toPartnerLogoList(data.meetup_image_urls),
    sponsors: toPartnerLogoList(data.sponsor_image_urls),
  }
}

function createImageListHandlers(setItems: Dispatch<SetStateAction<PartnerLogo[]>>) {
  return {
    onAdd: () => {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), imageUrl: undefined }])
    },
    onReplace: (id: string, file: File) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          revokeIfBlobUrl(item.imageUrl)
          return { ...item, imageUrl: URL.createObjectURL(file), imageFile: file }
        }),
      )
    },
    onDelete: (id: string) => {
      setItems((prev) => {
        revokeIfBlobUrl(prev.find((item) => item.id === id)?.imageUrl)
        return prev.filter((item) => item.id !== id)
      })
    },
  }
}

export function useIntroductionsForm() {
  const introductionQuery = useIntroductionQuery()
  const updateMutation = useUpdateIntroductionMutation()

  const [bannerStatus, setBannerStatus] = useState<BannerStatus | ''>('')
  const [slogan, setSlogan] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>()
  const [bannerImageFile, setBannerImageFile] = useState<File | undefined>()
  const [memberCount, setMemberCount] = useState('')
  const [projectCount, setProjectCount] = useState('')
  const [universityCount, setUniversityCount] = useState('')
  const [introYoutubeLink, setIntroYoutubeLink] = useState('')

  const [partImages, setPartImages] = useState<Record<PartKey, string | undefined>>({
    plan: undefined,
    design: undefined,
    frontend: undefined,
    backend: undefined,
  })
  const [partImageFiles, setPartImageFiles] = useState<Record<PartKey, File | undefined>>({
    plan: undefined,
    design: undefined,
    frontend: undefined,
    backend: undefined,
  })

  const [activities, setActivities] = useState<IntroductionItem[]>([])
  const [teams, setTeams] = useState<IntroductionItem[]>([])
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([])
  const [expertLecture, setExpertLecture] = useState<IntroductionItem[]>([])
  const [obLecture, setObLecture] = useState<IntroductionItem[]>([])
  const [meetupImages, setMeetupImages] = useState<PartnerLogo[]>([])
  const [sponsors, setSponsors] = useState<PartnerLogo[]>([])

  const formSnapshot = buildFormSnapshot({
    bannerStatus,
    slogan,
    bannerImageUrl,
    memberCount,
    projectCount,
    universityCount,
    introYoutubeLink,
    partImages,
    activities,
    teams,
    partnerLogos,
    expertLecture,
    obLecture,
    meetupImages,
    sponsors,
  })
  const [pristineSnapshot, setPristineSnapshot] = useState(formSnapshot)
  const isDirty = formSnapshot !== pristineSnapshot

  const hasHydratedRef = useRef(false)
  useEffect(() => {
    const data = introductionQuery.data
    if (!data || hasHydratedRef.current) return
    hasHydratedRef.current = true

    const hydrated = hydrateFromResponse(data)

    setBannerStatus(hydrated.bannerStatus)
    setSlogan(hydrated.slogan)
    setBannerImageUrl(hydrated.bannerImageUrl)
    setMemberCount(hydrated.memberCount)
    setProjectCount(hydrated.projectCount)
    setUniversityCount(hydrated.universityCount)
    setIntroYoutubeLink(hydrated.introYoutubeLink)
    setPartImages(hydrated.partImages)
    setTeams(hydrated.teams)
    setActivities(hydrated.activities)
    setExpertLecture(hydrated.expertLecture)
    setObLecture(hydrated.obLecture)
    setPartnerLogos(hydrated.partnerLogos)
    setMeetupImages(hydrated.meetupImages)
    setSponsors(hydrated.sponsors)

    setPristineSnapshot(buildFormSnapshot(hydrated))
  }, [introductionQuery.data])

  const latestImagesRef = useRef({
    bannerImageUrl,
    partImages,
    activities,
    teams,
    partnerLogos,
    expertLecture,
    obLecture,
    meetupImages,
    sponsors,
  })
  useEffect(() => {
    latestImagesRef.current = {
      bannerImageUrl,
      partImages,
      activities,
      teams,
      partnerLogos,
      expertLecture,
      obLecture,
      meetupImages,
      sponsors,
    }
  }, [
    bannerImageUrl,
    partImages,
    activities,
    teams,
    partnerLogos,
    expertLecture,
    obLecture,
    meetupImages,
    sponsors,
  ])

  useEffect(() => {
    return () => {
      const current = latestImagesRef.current
      revokeIfBlobUrl(current.bannerImageUrl)
      Object.values(current.partImages).forEach(revokeIfBlobUrl)
      ;[current.activities, current.teams, current.expertLecture, current.obLecture].forEach(
        (items) => {
          items.forEach((item) => {
            revokeIfBlobUrl(item.thumbnailUrl)
            revokeIfBlobUrl(item.thumbnailUrl2)
          })
        },
      )
      ;[current.partnerLogos, current.meetupImages, current.sponsors].forEach((items) => {
        items.forEach((item) => {
          revokeIfBlobUrl(item.imageUrl)
        })
      })
    }
  }, [])

  function buildPayload(): IntroUpdateRequest {
    const payload: IntroUpdateRequest = { bannerCardinal: CURRENT_GENERATION }

    if (bannerStatus) payload.bannerStatus = bannerStatus
    if (slogan) payload.slogan = slogan
    if (bannerImageFile) payload.bannerImageFile = bannerImageFile
    const memberCountValue = toOptionalCount(memberCount)
    if (memberCountValue !== undefined) payload.memberCount = memberCountValue
    const projectCountValue = toOptionalCount(projectCount)
    if (projectCountValue !== undefined) payload.projectCount = projectCountValue
    const universityCountValue = toOptionalCount(universityCount)
    if (universityCountValue !== undefined) payload.universityCount = universityCountValue
    if (introYoutubeLink) payload.introYoutubeLink = introYoutubeLink
    if (partImageFiles.plan) payload.planningImage = partImageFiles.plan
    if (partImageFiles.design) payload.designImage = partImageFiles.design
    if (partImageFiles.frontend) payload.frontendImage = partImageFiles.frontend
    if (partImageFiles.backend) payload.backendImage = partImageFiles.backend

    payload.teams = teams.map((item) => ({
      name: item.title,
      description: item.description,
      imageFile: item.thumbnailFile,
    }))
    payload.activities = activities.map((item) => ({
      name: item.title,
      description: item.description,
      imageFile1: item.thumbnailFile,
      imageFile2: item.thumbnailFile2,
    }))
    payload.expertLecture = expertLecture.map((item) => ({
      name: item.title,
      corporation: item.extra ?? '',
      description: item.description,
      imageFile: item.thumbnailFile,
    }))
    payload.obLecture = obLecture.map((item) => ({
      name: item.title,
      topic: item.description,
      imageFile: item.thumbnailFile,
    }))
    payload.partnerLogoFiles = toFileList(partnerLogos)
    payload.meetupImages = toFileList(meetupImages)
    payload.sponsors = toFileList(sponsors)

    return payload
  }

  async function handleSave() {
    await updateMutation.mutateAsync(buildPayload())
    setPristineSnapshot(formSnapshot)
  }

  function onBannerImageChange(file: File) {
    setBannerImageUrl((prev) => {
      revokeIfBlobUrl(prev)
      return URL.createObjectURL(file)
    })
    setBannerImageFile(file)
  }

  function onBannerImageDelete() {
    setBannerImageUrl((prev) => {
      revokeIfBlobUrl(prev)
      return undefined
    })
    setBannerImageFile(undefined)
  }

  function onPartImageChange(key: PartKey, file: File) {
    setPartImages((prev) => {
      revokeIfBlobUrl(prev[key])
      return { ...prev, [key]: URL.createObjectURL(file) }
    })
    setPartImageFiles((prev) => ({ ...prev, [key]: file }))
  }

  function onPartImageDelete(key: PartKey) {
    setPartImages((prev) => {
      revokeIfBlobUrl(prev[key])
      return { ...prev, [key]: undefined }
    })
    setPartImageFiles((prev) => ({ ...prev, [key]: undefined }))
  }

  const partnerLogoHandlers = createImageListHandlers(setPartnerLogos)
  const meetupImageHandlers = createImageListHandlers(setMeetupImages)
  const sponsorHandlers = createImageListHandlers(setSponsors)

  return {
    cardinal: CURRENT_GENERATION,
    bannerStatus,
    setBannerStatus,
    slogan,
    setSlogan,
    bannerImageUrl,
    onBannerImageChange,
    onBannerImageDelete,
    memberCount,
    setMemberCount,
    projectCount,
    setProjectCount,
    universityCount,
    setUniversityCount,
    introYoutubeLink,
    setIntroYoutubeLink,
    partImages,
    onPartImageChange,
    onPartImageDelete,
    activities,
    setActivities,
    teams,
    setTeams,
    partnerLogos,
    onPartnerLogoAdd: partnerLogoHandlers.onAdd,
    onPartnerLogoReplace: partnerLogoHandlers.onReplace,
    onPartnerLogoDelete: partnerLogoHandlers.onDelete,
    expertLecture,
    setExpertLecture,
    obLecture,
    setObLecture,
    meetupImages,
    onMeetupImageAdd: meetupImageHandlers.onAdd,
    onMeetupImageReplace: meetupImageHandlers.onReplace,
    onMeetupImageDelete: meetupImageHandlers.onDelete,
    sponsors,
    onSponsorAdd: sponsorHandlers.onAdd,
    onSponsorReplace: sponsorHandlers.onReplace,
    onSponsorDelete: sponsorHandlers.onDelete,
    isDirty,
    isSaving: updateMutation.isPending,
    handleSave,
    isLoadingIntroduction: introductionQuery.isLoading,
    isIntroductionError: introductionQuery.isError,
    refetchIntroduction: () => {
      void introductionQuery.refetch()
    },
  }
}

export type UseIntroductionsFormResult = ReturnType<typeof useIntroductionsForm>

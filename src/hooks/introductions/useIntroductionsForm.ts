import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { BannerStatus, IntroUpdateRequest } from '@api/introductions'
import { useUpdateIntroductionMutation } from './useIntroductions'

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

  function toSnapshotItem({ id, title, description, extra, thumbnailUrl }: IntroductionItem) {
    return { id, title, description, extra, thumbnailUrl }
  }

  const formSnapshot = JSON.stringify({
    bannerStatus,
    slogan,
    bannerImageUrl,
    memberCount,
    projectCount,
    universityCount,
    introYoutubeLink,
    partImages,
    activities: activities.map(toSnapshotItem),
    teams: teams.map(toSnapshotItem),
    partnerLogos: partnerLogos.map(({ id, imageUrl }) => ({ id, imageUrl })),
    expertLecture: expertLecture.map(toSnapshotItem),
    obLecture: obLecture.map(toSnapshotItem),
    meetupImages: meetupImages.map(({ id, imageUrl }) => ({ id, imageUrl })),
    sponsors: sponsors.map(({ id, imageUrl }) => ({ id, imageUrl })),
  })
  const [pristineSnapshot, setPristineSnapshot] = useState(formSnapshot)
  const isDirty = formSnapshot !== pristineSnapshot

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
  }
}

export type UseIntroductionsFormResult = ReturnType<typeof useIntroductionsForm>

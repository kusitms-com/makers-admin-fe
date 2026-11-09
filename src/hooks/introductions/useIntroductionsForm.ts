import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { AdminIntroResponse, BannerStatus, IntroUpdateRequest } from '@api/introductions'
import { useCurrentCardinalQuery } from '@hooks/auth/useCurrentCardinal'
import { toAbsoluteS3Url } from '@lib/s3'
import { useIntroductionQuery, useUpdateIntroductionMutation } from './useIntroductions'

export type PartKey = 'plan' | 'design' | 'frontend' | 'backend'

export interface IntroductionItem {
  id: string
  remoteId?: number
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
  remoteId?: number
  imageUrl?: string
  imageFile?: File
}

export function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function toOptionalCount(value: string): number | undefined {
  if (value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

function toPartnerLogoList(items: { id: number; image_url: string | null }[]): PartnerLogo[] {
  return items.map((item) => ({
    id: crypto.randomUUID(),
    remoteId: item.id,
    imageUrl: toAbsoluteS3Url(item.image_url),
  }))
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
    bannerCardinal: data.banner_cardinal ?? undefined,
    bannerStatus: (data.banner_status ?? '') as BannerStatus | '',
    memberCount: data.member_count !== null ? String(data.member_count) : '',
    projectCount: data.project_count !== null ? String(data.project_count) : '',
    universityCount: data.university_count !== null ? String(data.university_count) : '',
    introYoutubeLink: data.intro_youtube_link ?? '',
    partImages: {
      plan: toAbsoluteS3Url(data.planning_image_url),
      design: toAbsoluteS3Url(data.design_image_url),
      frontend: toAbsoluteS3Url(data.frontend_image_url),
      backend: toAbsoluteS3Url(data.backend_image_url),
    },
    teams: data.teams.map((team) => ({
      id: crypto.randomUUID(),
      remoteId: team.id,
      title: team.name,
      description: team.description,
      thumbnailUrl: toAbsoluteS3Url(team.image_link),
    })),
    activities: data.activities.map((activity) => ({
      id: crypto.randomUUID(),
      remoteId: activity.id,
      title: activity.name,
      description: activity.description,
      thumbnailUrl: toAbsoluteS3Url(activity.image_url1),
      thumbnailUrl2: toAbsoluteS3Url(activity.image_url2),
    })),
    expertLecture: data.expert_lecture.map((lecture) => ({
      id: crypto.randomUUID(),
      remoteId: lecture.id,
      title: lecture.name,
      description: lecture.description,
      extra: lecture.corporation,
      thumbnailUrl: toAbsoluteS3Url(lecture.image_link),
    })),
    obLecture: data.ob_lecture.map((lecture) => ({
      id: crypto.randomUUID(),
      remoteId: lecture.id,
      title: lecture.name,
      description: lecture.topic,
      thumbnailUrl: toAbsoluteS3Url(lecture.image_link),
    })),
    partnerLogos: toPartnerLogoList(data.partner_logos),
    meetupImages: toPartnerLogoList(data.meetup_images),
    sponsors: toPartnerLogoList(data.sponsors),
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
  const currentCardinalQuery = useCurrentCardinalQuery()

  const [bannerCardinal, setBannerCardinal] = useState<number | undefined>()
  const [bannerStatus, setBannerStatus] = useState<BannerStatus | ''>('')
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

    setBannerCardinal(hydrated.bannerCardinal)
    setBannerStatus(hydrated.bannerStatus)
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

  const cardinal = bannerCardinal ?? currentCardinalQuery.data

  function toImageItems(items: PartnerLogo[]) {
    return items.map((item) => ({ id: item.remoteId, imageFile: item.imageFile }))
  }

  function buildPayload(resolvedCardinal: number): IntroUpdateRequest {
    const payload: IntroUpdateRequest = { bannerCardinal: resolvedCardinal }

    if (bannerStatus) payload.bannerStatus = bannerStatus
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
      id: item.remoteId,
      name: item.title,
      description: item.description,
      imageFile: item.thumbnailFile,
    }))
    payload.activities = activities.map((item) => ({
      id: item.remoteId,
      name: item.title,
      description: item.description,
      imageFile1: item.thumbnailFile,
      imageFile2: item.thumbnailFile2,
    }))
    payload.expertLecture = expertLecture.map((item) => ({
      id: item.remoteId,
      name: item.title,
      corporation: item.extra ?? '',
      description: item.description,
      imageFile: item.thumbnailFile,
    }))
    payload.obLecture = obLecture.map((item) => ({
      id: item.remoteId,
      name: item.title,
      topic: item.description,
      imageFile: item.thumbnailFile,
    }))
    payload.partnerLogos = toImageItems(partnerLogos)
    payload.meetupImages = toImageItems(meetupImages)
    payload.sponsors = toImageItems(sponsors)

    return payload
  }

  async function handleSave() {
    if (cardinal === undefined) return
    await updateMutation.mutateAsync(buildPayload(cardinal))
    setPristineSnapshot(formSnapshot)
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
    cardinal: cardinal ?? 0,
    cardinalReady: cardinal !== undefined,
    bannerStatus,
    setBannerStatus,
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

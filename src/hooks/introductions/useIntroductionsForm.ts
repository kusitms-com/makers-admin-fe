import { useEffect, useRef, useState } from 'react'
import type { IntroUpdateRequest } from '@api/introductions'
import { useUpdateIntroductionMutation } from './useIntroductions'

export type PartKey = 'plan' | 'design' | 'frontend' | 'backend'

export interface IntroductionItem {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  thumbnailFile?: File
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

export function useIntroductionsForm() {
  const updateMutation = useUpdateIntroductionMutation()

  const [slogan, setSlogan] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>()
  const [bannerImageFile, setBannerImageFile] = useState<File | undefined>()
  const [memberCount, setMemberCount] = useState('')
  const [projectCount, setProjectCount] = useState('')
  const [universityCount, setUniversityCount] = useState('')

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
  const [partners, setPartners] = useState<PartnerLogo[]>([])

  const formSnapshot = JSON.stringify({
    slogan,
    bannerImageUrl,
    memberCount,
    projectCount,
    universityCount,
    partImages,
    activities: activities.map(({ id, title, description, thumbnailUrl }) => ({
      id,
      title,
      description,
      thumbnailUrl,
    })),
    teams: teams.map(({ id, title, description, thumbnailUrl }) => ({
      id,
      title,
      description,
      thumbnailUrl,
    })),
    partners: partners.map(({ id, imageUrl }) => ({ id, imageUrl })),
  })
  const [pristineSnapshot, setPristineSnapshot] = useState(formSnapshot)
  const isDirty = formSnapshot !== pristineSnapshot

  const latestImagesRef = useRef({ bannerImageUrl, partImages, activities, teams, partners })
  useEffect(() => {
    latestImagesRef.current = { bannerImageUrl, partImages, activities, teams, partners }
  }, [bannerImageUrl, partImages, activities, teams, partners])

  useEffect(() => {
    return () => {
      const current = latestImagesRef.current
      revokeIfBlobUrl(current.bannerImageUrl)
      Object.values(current.partImages).forEach(revokeIfBlobUrl)
      current.activities.forEach((item) => {
        revokeIfBlobUrl(item.thumbnailUrl)
      })
      current.teams.forEach((item) => {
        revokeIfBlobUrl(item.thumbnailUrl)
      })
      current.partners.forEach((partner) => {
        revokeIfBlobUrl(partner.imageUrl)
      })
    }
  }, [])

  function buildPayload(): IntroUpdateRequest {
    const payload: IntroUpdateRequest = { bannerCardinal: CURRENT_GENERATION }

    if (slogan) payload.slogan = slogan
    if (bannerImageFile) payload.bannerImageFile = bannerImageFile
    const memberCountValue = toOptionalCount(memberCount)
    if (memberCountValue !== undefined) payload.memberCount = memberCountValue
    const projectCountValue = toOptionalCount(projectCount)
    if (projectCountValue !== undefined) payload.projectCount = projectCountValue
    const universityCountValue = toOptionalCount(universityCount)
    if (universityCountValue !== undefined) payload.universityCount = universityCountValue
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
    }))
    payload.partnerLogoFiles = partners
      .map((partner) => partner.imageFile)
      .filter((file): file is File => file !== undefined)

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

  function onPartnerAdd() {
    setPartners((prev) => [...prev, { id: crypto.randomUUID(), imageUrl: undefined }])
  }

  function onPartnerReplace(id: string, file: File) {
    setPartners((prev) =>
      prev.map((partner) => {
        if (partner.id !== id) return partner
        revokeIfBlobUrl(partner.imageUrl)
        return { ...partner, imageUrl: URL.createObjectURL(file), imageFile: file }
      }),
    )
  }

  function onPartnerDelete(id: string) {
    setPartners((prev) => {
      revokeIfBlobUrl(prev.find((partner) => partner.id === id)?.imageUrl)
      return prev.filter((partner) => partner.id !== id)
    })
  }

  return {
    cardinal: CURRENT_GENERATION,
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
    partImages,
    onPartImageChange,
    onPartImageDelete,
    activities,
    setActivities,
    teams,
    setTeams,
    partners,
    onPartnerAdd,
    onPartnerReplace,
    onPartnerDelete,
    isDirty,
    isSaving: updateMutation.isPending,
    handleSave,
  }
}

export type UseIntroductionsFormResult = ReturnType<typeof useIntroductionsForm>

import { useState } from 'react'
import type { IntroductionItem, PartnerLogo } from '@pages/introductions/IntroductionsPage.mock'

export type PartKey = 'plan' | 'design' | 'frontend' | 'backend'

export function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

interface UseIntroductionsFormOptions {
  cardinal: number
  initialActivities: IntroductionItem[]
  initialTeams: IntroductionItem[]
  initialPartners: PartnerLogo[]
}

export function useIntroductionsForm({
  cardinal,
  initialActivities,
  initialTeams,
  initialPartners,
}: UseIntroductionsFormOptions) {
  const [slogan, setSlogan] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>()
  const [memberCount, setMemberCount] = useState('')
  const [projectCount, setProjectCount] = useState('')
  const [universityCount, setUniversityCount] = useState('')

  const [partImages, setPartImages] = useState<Record<PartKey, string | undefined>>({
    plan: undefined,
    design: undefined,
    frontend: undefined,
    backend: undefined,
  })

  const [activities, setActivities] = useState<IntroductionItem[]>(initialActivities)
  const [teams, setTeams] = useState<IntroductionItem[]>(initialTeams)
  const [partners, setPartners] = useState<PartnerLogo[]>(initialPartners)

  const formSnapshot = JSON.stringify({
    slogan,
    bannerImageUrl,
    memberCount,
    projectCount,
    universityCount,
    partImages,
    activities,
    teams,
    partners,
  })
  const [pristineSnapshot, setPristineSnapshot] = useState(formSnapshot)
  const isDirty = formSnapshot !== pristineSnapshot

  function handleSave() {
    setPristineSnapshot(formSnapshot)
  }

  function onBannerImageChange(file: File) {
    setBannerImageUrl((prev) => {
      revokeIfBlobUrl(prev)
      return URL.createObjectURL(file)
    })
  }

  function onBannerImageDelete() {
    setBannerImageUrl((prev) => {
      revokeIfBlobUrl(prev)
      return undefined
    })
  }

  function onPartImageChange(key: PartKey, file: File) {
    setPartImages((prev) => {
      revokeIfBlobUrl(prev[key])
      return { ...prev, [key]: URL.createObjectURL(file) }
    })
  }

  function onPartImageDelete(key: PartKey) {
    setPartImages((prev) => {
      revokeIfBlobUrl(prev[key])
      return { ...prev, [key]: undefined }
    })
  }

  function onPartnerAdd() {
    setPartners((prev) => [...prev, { id: crypto.randomUUID(), imageUrl: undefined }])
  }

  function onPartnerReplace(id: string, file: File) {
    setPartners((prev) =>
      prev.map((partner) => {
        if (partner.id !== id) return partner
        revokeIfBlobUrl(partner.imageUrl)
        return { ...partner, imageUrl: URL.createObjectURL(file) }
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
    cardinal,
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
    handleSave,
  }
}

export type { IntroductionItem, PartnerLogo } from '@pages/introductions/IntroductionsPage.mock'
export type UseIntroductionsFormResult = ReturnType<typeof useIntroductionsForm>

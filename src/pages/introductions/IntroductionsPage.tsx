import { useState, type ChangeEvent } from 'react'
import { AddCircleButton } from '@components/introductions/AddCircleButton'
import { Button } from '@components/common/Button'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageBoxThumbnail } from '@components/introductions/ImageBoxThumbnail'
import { Inputfield } from '@components/common/Inputfield'
import { IntroductionCard } from '@components/introductions/IntroductionCard'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { PageHeader } from '@components/common/PageHeader'
import { PartImageCard } from '@components/introductions/PartImageCard'
import { PartnerImageBox } from '@components/introductions/PartnerImageBox'
import { useImageFileInput } from '@hooks/common/useImageFileInput'
import {
  CURRENT_GENERATION,
  INITIAL_ACTIVITIES,
  INITIAL_PARTNERS,
  INITIAL_TEAMS,
  type IntroductionItem,
  type PartnerLogo,
} from './IntroductionsPage.mock'

type PartKey = 'plan' | 'design' | 'frontend' | 'backend'

const PART_FIELDS: { key: PartKey; label: string }[] = [
  { key: 'plan', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontend', label: '프론트엔드' },
  { key: 'backend', label: '백엔드' },
]

interface PartImageFieldProps {
  label: string
  imageUrl?: string
  onFileChange: (file: File) => void
  onDelete: () => void
}

function PartImageField({ label, imageUrl, onFileChange, onDelete }: PartImageFieldProps) {
  const { inputProps, openFilePicker } = useImageFileInput({ onFileChange })

  return (
    <>
      <input {...inputProps} />
      <PartImageCard
        partLabel={label}
        imageUrl={imageUrl}
        onReplace={openFilePicker}
        onDelete={onDelete}
      />
    </>
  )
}

function createEmptyItem(): IntroductionItem {
  return { id: crypto.randomUUID(), title: '', description: '' }
}

function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export function IntroductionsPage() {
  const [slogan, setSlogan] = useState('')
  const [bannerImageUrl, setBannerImageUrl] = useState<string | undefined>()
  const bannerImageInput = useImageFileInput({
    onFileChange: (file) => {
      setBannerImageUrl((prev) => {
        revokeIfBlobUrl(prev)
        return URL.createObjectURL(file)
      })
    },
  })

  const [memberCount, setMemberCount] = useState('')
  const [projectCount, setProjectCount] = useState('')
  const [universityCount, setUniversityCount] = useState('')

  const [partImages, setPartImages] = useState<Record<PartKey, string | undefined>>({
    plan: undefined,
    design: undefined,
    frontend: undefined,
    backend: undefined,
  })

  const [activities, setActivities] = useState<IntroductionItem[]>(INITIAL_ACTIVITIES)
  const [teams, setTeams] = useState<IntroductionItem[]>(INITIAL_TEAMS)
  const [partners, setPartners] = useState<PartnerLogo[]>(INITIAL_PARTNERS)

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

  function handlePartFileChange(key: PartKey, file: File) {
    setPartImages((prev) => {
      revokeIfBlobUrl(prev[key])
      return { ...prev, [key]: URL.createObjectURL(file) }
    })
  }

  function handlePartDelete(key: PartKey) {
    setPartImages((prev) => {
      revokeIfBlobUrl(prev[key])
      return { ...prev, [key]: undefined }
    })
  }

  function updateActivity(id: string, patch: Partial<IntroductionItem>) {
    setActivities((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function updateTeam(id: string, patch: Partial<IntroductionItem>) {
    setTeams((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function handlePartnerReplace(id: string, file: File) {
    setPartners((prev) =>
      prev.map((partner) => {
        if (partner.id !== id) return partner
        revokeIfBlobUrl(partner.imageUrl)
        return { ...partner, imageUrl: URL.createObjectURL(file) }
      }),
    )
  }

  function handlePartnerDelete(id: string) {
    setPartners((prev) => {
      revokeIfBlobUrl(prev.find((partner) => partner.id === id)?.imageUrl)
      return prev.filter((partner) => partner.id !== id)
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="학회 소개"
        actionLabel="저장하기"
        actionDisabled={!isDirty}
        onAction={handleSave}
      />

      <div className="flex flex-col gap-7 px-6 pt-6 pb-15">
        <IntroductionSection title="상단 배너">
          <div className="flex items-stretch gap-3">
            <CardinalField cardinal={CURRENT_GENERATION} className="w-[150px] shrink-0" />
            <FormField label="슬로건" className="flex-1">
              <Inputfield
                value={slogan}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSlogan(event.target.value)
                }}
                placeholder="슬로건을 입력해주세요"
              />
            </FormField>
          </div>
          <FormField label="배너 이미지">
            <div className="flex items-center gap-2.5">
              <input {...bannerImageInput.inputProps} />
              <ImageBoxThumbnail imageUrl={bannerImageUrl} size="m" />
              <div className="flex flex-col justify-center gap-1.5">
                <Button variant="primary" size="s" onClick={bannerImageInput.openFilePicker}>
                  {bannerImageUrl ? '교체하기' : '추가하기'}
                </Button>
                <Button
                  variant="error"
                  size="s"
                  onClick={() => {
                    setBannerImageUrl((prev) => {
                      revokeIfBlobUrl(prev)
                      return undefined
                    })
                  }}
                >
                  삭제하기
                </Button>
              </div>
            </div>
          </FormField>
        </IntroductionSection>

        <IntroductionSection title="학회 정보">
          <div className="flex items-stretch gap-4">
            <FormField label="누적 회원 수" className="flex-1">
              <Inputfield
                value={memberCount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setMemberCount(event.target.value)
                }}
                placeholder="숫자를 입력해주세요"
                inputMode="numeric"
              />
            </FormField>
            <FormField label="프로젝트 결과물" className="flex-1">
              <Inputfield
                value={projectCount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setProjectCount(event.target.value)
                }}
                placeholder="숫자를 입력해주세요"
                inputMode="numeric"
              />
            </FormField>
            <FormField label="참여 대학수" className="flex-1">
              <Inputfield
                value={universityCount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setUniversityCount(event.target.value)
                }}
                placeholder="숫자를 입력해주세요"
                inputMode="numeric"
              />
            </FormField>
          </div>
        </IntroductionSection>

        <IntroductionSection title="파트별 소개">
          <div className="grid grid-cols-4 gap-4">
            {PART_FIELDS.map(({ key, label }) => (
              <PartImageField
                key={key}
                label={label}
                imageUrl={partImages[key]}
                onFileChange={(file) => {
                  handlePartFileChange(key, file)
                }}
                onDelete={() => {
                  handlePartDelete(key)
                }}
              />
            ))}
          </div>
        </IntroductionSection>

        <IntroductionSection title="큐시즘 활동 소개">
          <div className="flex flex-col gap-4">
            {activities.map((item) => (
              <IntroductionCard
                key={item.id}
                variant={item.title.trim() ? 'active' : 'default'}
                title={item.title}
                onTitleChange={(value) => {
                  updateActivity(item.id, { title: value })
                }}
                description={item.description}
                onDescriptionChange={(value) => {
                  updateActivity(item.id, { description: value })
                }}
                thumbnailUrl={item.thumbnailUrl}
                onThumbnailChange={(file) => {
                  revokeIfBlobUrl(item.thumbnailUrl)
                  updateActivity(item.id, { thumbnailUrl: URL.createObjectURL(file) })
                }}
                onDelete={() => {
                  revokeIfBlobUrl(item.thumbnailUrl)
                  setActivities((prev) => prev.filter((activity) => activity.id !== item.id))
                }}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <AddCircleButton
              aria-label="큐시즘 활동 추가"
              onClick={() => {
                setActivities((prev) => [...prev, createEmptyItem()])
              }}
            />
          </div>
        </IntroductionSection>

        <IntroductionSection title="운영진 소개">
          <div className="flex flex-col gap-4">
            {teams.map((item) => (
              <IntroductionCard
                key={item.id}
                variant={item.title.trim() ? 'active' : 'default'}
                title={item.title}
                onTitleChange={(value) => {
                  updateTeam(item.id, { title: value })
                }}
                description={item.description}
                onDescriptionChange={(value) => {
                  updateTeam(item.id, { description: value })
                }}
                thumbnailUrl={item.thumbnailUrl}
                onThumbnailChange={(file) => {
                  revokeIfBlobUrl(item.thumbnailUrl)
                  updateTeam(item.id, { thumbnailUrl: URL.createObjectURL(file) })
                }}
                onDelete={() => {
                  revokeIfBlobUrl(item.thumbnailUrl)
                  setTeams((prev) => prev.filter((team) => team.id !== item.id))
                }}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <AddCircleButton
              aria-label="운영진 추가"
              onClick={() => {
                setTeams((prev) => [...prev, createEmptyItem()])
              }}
            />
          </div>
        </IntroductionSection>

        <IntroductionSection title="후원사">
          <div className="flex flex-wrap gap-3">
            {partners.map((partner) => (
              <PartnerImageBox
                key={partner.id}
                imageUrl={partner.imageUrl}
                onFileChange={(file) => {
                  handlePartnerReplace(partner.id, file)
                }}
                onDelete={() => {
                  handlePartnerDelete(partner.id)
                }}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <AddCircleButton
              aria-label="후원사 추가"
              onClick={() => {
                setPartners((prev) => [...prev, { id: crypto.randomUUID(), imageUrl: undefined }])
              }}
            />
          </div>
        </IntroductionSection>
      </div>
    </div>
  )
}

export default IntroductionsPage

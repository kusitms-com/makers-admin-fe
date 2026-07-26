import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { AddCircleButton } from '@components/introductions/AddCircleButton'
import { FormField } from '@components/common/FormField'
import { Inputfield } from '@components/common/Inputfield'
import { IntroductionCard } from '@components/introductions/IntroductionCard'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { PageHeader } from '@components/common/PageHeader'
import { PartImageCard } from '@components/introductions/PartImageCard'
import { useImageFileInput } from '@hooks/common/useImageFileInput'
import {
  revokeIfBlobUrl,
  useIntroductionsForm,
  type IntroductionItem,
  type PartKey,
} from '@hooks/introductions/useIntroductionsForm'
import { IntroductionBannerSection } from './IntroductionBannerSection'
import { IntroductionPartnerSection } from './IntroductionPartnerSection'
import {
  CURRENT_GENERATION,
  INITIAL_ACTIVITIES,
  INITIAL_PARTNERS,
  INITIAL_TEAMS,
} from './IntroductionsPage.mock'

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

interface CardListSectionProps {
  title: string
  addLabel: string
  items: IntroductionItem[]
  setItems: Dispatch<SetStateAction<IntroductionItem[]>>
}

function CardListSection({ title, addLabel, items, setItems }: CardListSectionProps) {
  function updateItem(id: string, patch: Partial<IntroductionItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <IntroductionSection title={title}>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <IntroductionCard
            key={item.id}
            variant={item.title.trim() ? 'active' : 'default'}
            title={item.title}
            onTitleChange={(value) => {
              updateItem(item.id, { title: value })
            }}
            description={item.description}
            onDescriptionChange={(value) => {
              updateItem(item.id, { description: value })
            }}
            thumbnailUrl={item.thumbnailUrl}
            onThumbnailChange={(file) => {
              revokeIfBlobUrl(item.thumbnailUrl)
              updateItem(item.id, { thumbnailUrl: URL.createObjectURL(file) })
            }}
            onDelete={() => {
              revokeIfBlobUrl(item.thumbnailUrl)
              setItems((prev) => prev.filter((existing) => existing.id !== item.id))
            }}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <AddCircleButton
          aria-label={addLabel}
          onClick={() => {
            setItems((prev) => [...prev, createEmptyItem()])
          }}
        />
      </div>
    </IntroductionSection>
  )
}

export function IntroductionsPage() {
  const form = useIntroductionsForm({
    cardinal: CURRENT_GENERATION,
    initialActivities: INITIAL_ACTIVITIES,
    initialTeams: INITIAL_TEAMS,
    initialPartners: INITIAL_PARTNERS,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="학회 소개"
        actionLabel="저장하기"
        actionDisabled={!form.isDirty}
        onAction={form.handleSave}
      />

      <div className="flex flex-col gap-7 px-6 pt-6 pb-15">
        <IntroductionBannerSection
          cardinal={form.cardinal}
          slogan={form.slogan}
          onSloganChange={form.setSlogan}
          bannerImageUrl={form.bannerImageUrl}
          onImageChange={form.onBannerImageChange}
          onImageDelete={form.onBannerImageDelete}
        />

        <IntroductionSection title="학회 정보">
          <div className="flex items-stretch gap-4">
            <FormField label="누적 회원 수" className="flex-1">
              <Inputfield
                value={form.memberCount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  form.setMemberCount(event.target.value)
                }}
                placeholder="숫자를 입력해주세요"
                inputMode="numeric"
              />
            </FormField>
            <FormField label="프로젝트 결과물" className="flex-1">
              <Inputfield
                value={form.projectCount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  form.setProjectCount(event.target.value)
                }}
                placeholder="숫자를 입력해주세요"
                inputMode="numeric"
              />
            </FormField>
            <FormField label="참여 대학수" className="flex-1">
              <Inputfield
                value={form.universityCount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  form.setUniversityCount(event.target.value)
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
                imageUrl={form.partImages[key]}
                onFileChange={(file) => {
                  form.onPartImageChange(key, file)
                }}
                onDelete={() => {
                  form.onPartImageDelete(key)
                }}
              />
            ))}
          </div>
        </IntroductionSection>

        <CardListSection
          title="큐시즘 활동 소개"
          addLabel="큐시즘 활동 추가"
          items={form.activities}
          setItems={form.setActivities}
        />

        <CardListSection
          title="운영진 소개"
          addLabel="운영진 추가"
          items={form.teams}
          setItems={form.setTeams}
        />

        <IntroductionPartnerSection
          partners={form.partners}
          onReplace={form.onPartnerReplace}
          onDelete={form.onPartnerDelete}
          onAdd={form.onPartnerAdd}
        />
      </div>
    </div>
  )
}

export default IntroductionsPage

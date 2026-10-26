import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { AddCircleButton } from '@components/introductions/AddCircleButton'
import { FormField } from '@components/common/FormField'
import { Inputfield } from '@components/common/Inputfield'
import { IntroductionCard } from '@components/introductions/IntroductionCard'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { PageHeader } from '@components/common/PageHeader'
import { PartImageCard } from '@components/introductions/PartImageCard'
import { useImageFileInput } from '@hooks/common/useImageFileInput'
import { useToast } from '@hooks/common/useToast'
import {
  revokeIfBlobUrl,
  useIntroductionsForm,
  type IntroductionItem,
  type PartKey,
} from '@hooks/introductions/useIntroductionsForm'
import { ImageSection } from './ImageSection'
import { IntroductionBannerSection } from './IntroductionBannerSection'

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
      <input {...inputProps} aria-label={label} />
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
  descriptionLabel?: string
  extraLabel?: string
  allowMultipleImages?: boolean
}

function CardListSection({
  title,
  addLabel,
  items,
  setItems,
  descriptionLabel,
  extraLabel,
  allowMultipleImages,
}: CardListSectionProps) {
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
            descriptionLabel={descriptionLabel}
            description={item.description}
            onDescriptionChange={(value) => {
              updateItem(item.id, { description: value })
            }}
            extraLabel={extraLabel}
            extraValue={item.extra}
            onExtraChange={(value) => {
              updateItem(item.id, { extra: value })
            }}
            thumbnailUrl={item.thumbnailUrl}
            onThumbnailChange={(file) => {
              revokeIfBlobUrl(item.thumbnailUrl)
              updateItem(item.id, { thumbnailUrl: URL.createObjectURL(file), thumbnailFile: file })
            }}
            allowMultipleImages={allowMultipleImages}
            thumbnailUrl2={item.thumbnailUrl2}
            onThumbnailChange2={(file) => {
              revokeIfBlobUrl(item.thumbnailUrl2)
              updateItem(item.id, {
                thumbnailUrl2: URL.createObjectURL(file),
                thumbnailFile2: file,
              })
            }}
            onDelete={() => {
              revokeIfBlobUrl(item.thumbnailUrl)
              revokeIfBlobUrl(item.thumbnailUrl2)
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
  const form = useIntroductionsForm()
  const addToast = useToast()

  function handleSave() {
    void form.handleSave().catch((error: unknown) => {
      if (error instanceof Error) {
        addToast({ type: 'error', message: '저장하지 못했습니다. 다시 시도해주세요.' })
        return
      }
      throw error
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="학회 소개"
        actionLabel="저장하기"
        actionDisabled={!form.isDirty || form.isSaving}
        onAction={handleSave}
      />

      <div className="flex flex-col gap-7 px-6 pt-6 pb-15">
        <IntroductionBannerSection
          cardinal={form.cardinal}
          bannerStatus={form.bannerStatus}
          onBannerStatusChange={form.setBannerStatus}
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

        <IntroductionSection title="학회 소개 영상">
          <FormField label="유튜브 링크">
            <Inputfield
              value={form.introYoutubeLink}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                form.setIntroYoutubeLink(event.target.value)
              }}
              placeholder="유튜브 링크를 입력해주세요"
            />
          </FormField>
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
          title="운영진 소개"
          addLabel="운영진 추가"
          items={form.teams}
          setItems={form.setTeams}
        />

        <CardListSection
          title="큐시즘 활동 소개"
          addLabel="큐시즘 활동 추가"
          items={form.activities}
          setItems={form.setActivities}
          allowMultipleImages
        />

        <ImageSection
          title="밋업 이미지"
          addLabel="밋업 이미지 추가"
          partners={form.meetupImages}
          onReplace={form.onMeetupImageReplace}
          onDelete={form.onMeetupImageDelete}
          onAdd={form.onMeetupImageAdd}
        />

        <ImageSection
          title="파트너사"
          addLabel="파트너사 이미지 추가"
          partners={form.partnerLogos}
          onReplace={form.onPartnerLogoReplace}
          onDelete={form.onPartnerLogoDelete}
          onAdd={form.onPartnerLogoAdd}
        />

        <CardListSection
          title="전문가 초청 강연자 소개"
          addLabel="전문가 강연자 추가"
          items={form.expertLecture}
          setItems={form.setExpertLecture}
          extraLabel="소속"
        />

        <CardListSection
          title="OB 초청 강연자 소개"
          addLabel="OB 강연자 추가"
          items={form.obLecture}
          setItems={form.setObLecture}
          descriptionLabel="주제"
        />

        <ImageSection
          title="후원사"
          addLabel="후원사 추가"
          partners={form.sponsors}
          onReplace={form.onSponsorReplace}
          onDelete={form.onSponsorDelete}
          onAdd={form.onSponsorAdd}
        />
      </div>
    </div>
  )
}

export default IntroductionsPage

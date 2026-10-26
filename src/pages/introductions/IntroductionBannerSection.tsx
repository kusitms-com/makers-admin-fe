import type { ChangeEvent } from 'react'
import type { BannerStatus } from '@api/introductions'
import { Button } from '@components/common/Button'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageBoxThumbnail } from '@components/introductions/ImageBoxThumbnail'
import { Inputfield } from '@components/common/Inputfield'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'
import { useImageFileInput } from '@hooks/common/useImageFileInput'

const BANNER_STATUS_OPTIONS: SelectFieldOption[] = [
  { value: 'CLOSE', label: '마감' },
  { value: 'MANAGE_RECRUIT', label: '운영진 모집중' },
  { value: 'MEMBER_RECRUIT', label: '회원 모집중' },
]

interface IntroductionBannerSectionProps {
  cardinal: number
  bannerStatus: BannerStatus | ''
  onBannerStatusChange: (value: BannerStatus) => void
  slogan: string
  onSloganChange: (value: string) => void
  bannerImageUrl?: string
  onImageChange: (file: File) => void
  onImageDelete: () => void
}

export function IntroductionBannerSection({
  cardinal,
  bannerStatus,
  onBannerStatusChange,
  slogan,
  onSloganChange,
  bannerImageUrl,
  onImageChange,
  onImageDelete,
}: IntroductionBannerSectionProps) {
  const bannerImageInput = useImageFileInput({ onFileChange: onImageChange })

  return (
    <IntroductionSection title="상단 배너">
      <div className="flex items-stretch gap-3">
        <CardinalField cardinal={cardinal} className="w-[150px] shrink-0" />
        <FormField label="배너 상태" className="w-[200px] shrink-0">
          <SelectField
            value={bannerStatus}
            options={BANNER_STATUS_OPTIONS}
            onValueChange={(value) => {
              onBannerStatusChange(value as BannerStatus)
            }}
            placeholder="배너 상태를 선택해주세요"
          />
        </FormField>
        <FormField label="슬로건" className="flex-1">
          <Inputfield
            value={slogan}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onSloganChange(event.target.value)
            }}
            placeholder="슬로건을 입력해주세요"
          />
        </FormField>
      </div>
      <FormField label="배너 이미지">
        <div className="flex items-center gap-2.5">
          <input {...bannerImageInput.inputProps} aria-label="배너 이미지" />
          <ImageBoxThumbnail imageUrl={bannerImageUrl} size="m" />
          <div className="flex flex-col justify-center gap-1.5">
            <Button variant="primary" size="s" onClick={bannerImageInput.openFilePicker}>
              {bannerImageUrl ? '교체하기' : '추가하기'}
            </Button>
            <Button variant="error" size="s" onClick={onImageDelete}>
              삭제하기
            </Button>
          </div>
        </div>
      </FormField>
    </IntroductionSection>
  )
}

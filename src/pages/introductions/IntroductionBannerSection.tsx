import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageBoxThumbnail } from '@components/introductions/ImageBoxThumbnail'
import { Inputfield } from '@components/common/Inputfield'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { useImageFileInput } from '@hooks/common/useImageFileInput'

interface IntroductionBannerSectionProps {
  cardinal: number
  slogan: string
  onSloganChange: (value: string) => void
  bannerImageUrl?: string
  onImageChange: (file: File) => void
  onImageDelete: () => void
}

export function IntroductionBannerSection({
  cardinal,
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
          <input {...bannerImageInput.inputProps} />
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

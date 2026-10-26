import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { Inputfield } from '@components/common/Inputfield'
import { useImageFileInput } from '@hooks/common/useImageFileInput'
import { ImageBoxThumbnail } from '../ImageBoxThumbnail'
import { cn } from '@lib/utils'

interface IntroductionCardProps {
  variant: 'default' | 'active'
  title?: string
  titlePlaceholder?: string
  onTitleChange?: (value: string) => void
  descriptionLabel?: string
  description?: string
  descriptionPlaceholder?: string
  onDescriptionChange?: (value: string) => void
  extraLabel?: string
  extraValue?: string
  extraPlaceholder?: string
  onExtraChange?: (value: string) => void
  thumbnailUrl?: string
  onThumbnailChange?: (file: File) => void
  onDelete?: () => void
  className?: string
}

export function IntroductionCard({
  variant,
  title,
  titlePlaceholder = '타이틀',
  onTitleChange,
  descriptionLabel = '설명',
  description,
  descriptionPlaceholder = '설명을 입력해주세요',
  onDescriptionChange,
  extraLabel,
  extraValue,
  extraPlaceholder,
  onExtraChange,
  thumbnailUrl,
  onThumbnailChange,
  onDelete,
  className,
}: IntroductionCardProps) {
  const isActive = variant === 'active'
  const { inputProps, openFilePicker } = useImageFileInput({ onFileChange: onThumbnailChange })

  return (
    <div className={cn('border-line-neutral flex rounded-xl border bg-white', className)}>
      <div className="bg-fill-netural border-line-alternative flex w-[187px] shrink-0 flex-col gap-2.5 border-r px-4 py-3.5">
        <span className="text-label-14b text-label-normal">타이틀</span>
        <Inputfield
          value={title}
          placeholder={titlePlaceholder}
          aria-label="타이틀"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onTitleChange?.(event.target.value)
          }}
          className="w-full"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {extraLabel && (
          <div className="flex flex-col gap-2.5">
            <span className="text-caption-12sb text-label-alternative">{extraLabel}</span>
            <Inputfield
              value={extraValue}
              placeholder={extraPlaceholder}
              aria-label={extraLabel}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onExtraChange?.(event.target.value)
              }}
              className="w-full"
            />
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          <span className="text-caption-12sb text-label-alternative">{descriptionLabel}</span>
          <Inputfield
            value={description}
            placeholder={descriptionPlaceholder}
            aria-label={descriptionLabel}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onDescriptionChange?.(event.target.value)
            }}
            className="w-full"
          />
        </div>
        <div className="flex flex-col justify-center gap-2.5">
          <span className="text-caption-12sb text-label-alternative">썸네일</span>
          <div className="flex items-center gap-2.5">
            <input {...inputProps} aria-label="썸네일" />
            <ImageBoxThumbnail imageUrl={thumbnailUrl} />
            <div className="flex flex-col justify-center gap-1.5">
              <Button variant={isActive ? 'primary' : 'disable'} size="s" onClick={openFilePicker}>
                {thumbnailUrl ? '교체하기' : '추가하기'}
              </Button>
              <Button variant="error" size="s" onClick={onDelete}>
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

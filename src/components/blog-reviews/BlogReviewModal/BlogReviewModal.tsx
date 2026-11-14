import type { ChangeEvent } from 'react'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { ModalActions } from '@components/common/ModalActions'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'
import { TextareaField } from '@components/common/TextareaField'
import { linkError } from '@lib/url'

interface BlogReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  cardinal: number
  // 등록 모달에서만 넘긴다. 없으면 기수는 고정 표시
  cardinalOptions?: SelectFieldOption[]
  onCardinalChange?: (cardinal: number) => void
  part: string
  partOptions: SelectFieldOption[]
  onPartChange: (value: string) => void
  activity: string
  activityOptions: SelectFieldOption[]
  onActivityChange: (value: string) => void
  title: string
  onTitleChange: (value: string) => void
  previewText: string
  onPreviewTextChange: (value: string) => void
  link: string
  onLinkChange: (value: string) => void
  thumbnailUrl?: string
  onThumbnailChange?: (file: File) => void
  onThumbnailDelete?: () => void
  onCancel: () => void
  onSave: () => void
  saveDisabled?: boolean
  className?: string
}

export function BlogReviewModal({
  open,
  onOpenChange,
  mode = 'create',
  cardinal,
  cardinalOptions,
  onCardinalChange,
  part,
  partOptions,
  onPartChange,
  activity,
  activityOptions,
  onActivityChange,
  title,
  onTitleChange,
  previewText,
  onPreviewTextChange,
  link,
  onLinkChange,
  thumbnailUrl,
  onThumbnailChange,
  onThumbnailDelete,
  onCancel,
  onSave,
  saveDisabled = true,
  className,
}: BlogReviewModalProps) {
  const isEdit = mode === 'edit'

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? '블로그 후기 수정' : '블로그 후기 등록'}
      className={className}
      footer={
        <ModalActions
          onCancel={onCancel}
          onSave={onSave}
          saveDisabled={saveDisabled}
          saveLabel={isEdit ? '수정하기' : '저장하기'}
        />
      }
    >
      <div className="flex items-stretch gap-3">
        <CardinalField
          cardinal={cardinal}
          options={cardinalOptions}
          onCardinalChange={onCardinalChange}
          className="flex-1"
        />
        <FormField label="파트" className="flex-1">
          <SelectField value={part} options={partOptions} onValueChange={onPartChange} />
        </FormField>
      </div>
      <FormField label="활동">
        <SelectField
          value={activity}
          options={activityOptions}
          onValueChange={onActivityChange}
          placeholder="활동을 선택해주세요"
        />
      </FormField>
      <FormField label="블로그 제목">
        <Inputfield
          value={title}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onTitleChange(event.target.value)
          }}
          placeholder="제목을 입력해주세요"
        />
      </FormField>
      <FormField label="링크">
        <Inputfield
          value={link}
          error={linkError(link)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onLinkChange(event.target.value)
          }}
          placeholder="링크를 입력해주세요"
        />
      </FormField>
      <FormField label="미리보기 텍스트">
        <TextareaField
          value={previewText}
          onChange={(event) => {
            onPreviewTextChange(event.target.value)
          }}
          placeholder="미리보기 텍스트를 입력해주세요"
        />
      </FormField>
      <FormField label="미리보기 이미지">
        <ImageUploadBox
          imageUrl={thumbnailUrl}
          onFileChange={onThumbnailChange}
          onDelete={onThumbnailDelete}
        />
      </FormField>
    </Modal>
  )
}

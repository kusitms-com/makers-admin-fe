import type { ChangeEvent } from 'react'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { ModalActions } from '@components/common/ModalActions'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'

interface BlogReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardinal: number
  part: string
  partOptions: SelectFieldOption[]
  onPartChange: (value: string) => void
  activity: string
  activityOptions: SelectFieldOption[]
  onActivityChange: (value: string) => void
  title: string
  onTitleChange: (value: string) => void
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
  cardinal,
  part,
  partOptions,
  onPartChange,
  activity,
  activityOptions,
  onActivityChange,
  title,
  onTitleChange,
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
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="블로그 후기 등록"
      className={className}
      footer={<ModalActions onCancel={onCancel} onSave={onSave} saveDisabled={saveDisabled} />}
    >
      <div className="flex items-stretch gap-3">
        <CardinalField cardinal={cardinal} className="flex-1" />
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
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onLinkChange(event.target.value)
          }}
          placeholder="링크를 업로드해주세요"
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

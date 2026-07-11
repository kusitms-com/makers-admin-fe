import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
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
  thumbnailUrl,
  onThumbnailChange,
  onThumbnailDelete,
  onCancel,
  onSave,
  saveDisabled = true,
  className,
}: BlogReviewModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className={className}>
      <Modal.Title>블로그 후기 등록</Modal.Title>
      <Modal.Body>
        <div className="flex items-stretch gap-3">
          <FormField label="기수" className="flex-1">
            <SelectField value={`${String(cardinal)}기`} options={[]} />
          </FormField>
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
        <FormField label="제목">
          <Inputfield
            value={title}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onTitleChange(event.target.value)
            }}
            placeholder="제목을 입력해주세요"
          />
        </FormField>
        <FormField label="미리보기 이미지">
          <ImageUploadBox
            imageUrl={thumbnailUrl}
            onFileChange={onThumbnailChange}
            onDelete={onThumbnailDelete}
          />
        </FormField>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="error" size="l" className="w-[140px]" onClick={onCancel}>
          취소하기
        </Button>
        <Button
          variant={saveDisabled ? 'disable' : 'strong'}
          size="l"
          className="w-[140px]"
          disabled={saveDisabled}
          onClick={onSave}
        >
          저장하기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

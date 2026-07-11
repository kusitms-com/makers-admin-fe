import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { SelectField } from '@components/common/SelectField'

interface CompanyProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardinal: number
  name: string
  onNameChange: (value: string) => void
  content: string
  onContentChange: (value: string) => void
  bannerUrl?: string
  onBannerChange?: (file: File) => void
  onBannerDelete?: () => void
  onCancel: () => void
  onSave: () => void
  saveDisabled?: boolean
  className?: string
}

export function CompanyProjectModal({
  open,
  onOpenChange,
  cardinal,
  name,
  onNameChange,
  content,
  onContentChange,
  bannerUrl,
  onBannerChange,
  onBannerDelete,
  onCancel,
  onSave,
  saveDisabled = true,
  className,
}: CompanyProjectModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="기업 프로젝트 등록"
      className={className}
      footer={
        <>
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
        </>
      }
    >
      <div className="flex items-stretch gap-3">
        <FormField label="기수" className="w-[130px] shrink-0">
          <SelectField value={`${String(cardinal)}기`} options={[]} />
        </FormField>
        <FormField label="기업 이름" className="flex-1">
          <Inputfield
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onNameChange(event.target.value)
            }}
            placeholder="기업 이름을 입력해주세요"
          />
        </FormField>
      </div>
      <FormField label="프로젝트 소개">
        <Inputfield
          value={content}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onContentChange(event.target.value)
          }}
          placeholder="프로젝트 소개를 입력해주세요"
        />
      </FormField>
      <FormField label="배너">
        <ImageUploadBox
          imageUrl={bannerUrl}
          onFileChange={onBannerChange}
          onDelete={onBannerDelete}
        />
      </FormField>
    </Modal>
  )
}

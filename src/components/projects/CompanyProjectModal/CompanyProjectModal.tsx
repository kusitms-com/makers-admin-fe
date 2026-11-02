import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { ModalActions } from '@components/common/ModalActions'

interface CompanyProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardinal: number
  name: string
  onNameChange: (value: string) => void
  content: string
  onContentChange: (value: string) => void
  logoUrl?: string
  onLogoChange?: (file: File) => void
  onLogoDelete?: () => void
  bannerUrl?: string
  onBannerChange?: (file: File) => void
  onBannerDelete?: () => void
  onCancel: () => void
  onSave: () => void
  saveDisabled?: boolean
  readOnly?: boolean
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
  logoUrl,
  onLogoChange,
  onLogoDelete,
  bannerUrl,
  onBannerChange,
  onBannerDelete,
  onCancel,
  onSave,
  saveDisabled = true,
  readOnly = false,
  className,
}: CompanyProjectModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? '기업 프로젝트 상세' : '기업 프로젝트 등록'}
      className={className ?? 'left-[calc(50%+30px)]'}
      footer={
        readOnly ? (
          <Button variant="outlined" size="l" className="w-[140px]" onClick={onCancel}>
            닫기
          </Button>
        ) : (
          <ModalActions onCancel={onCancel} onSave={onSave} saveDisabled={saveDisabled} />
        )
      }
    >
      <div className="flex items-stretch gap-3">
        <CardinalField cardinal={cardinal} className="w-[130px] shrink-0" />
        <FormField label="기업 이름" className="flex-1">
          <Inputfield
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onNameChange(event.target.value)
            }}
            readOnly={readOnly}
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
          readOnly={readOnly}
          placeholder="프로젝트 소개를 입력해주세요"
        />
      </FormField>
      <FormField label="로고 이미지">
        <ImageUploadBox
          imageUrl={logoUrl}
          onFileChange={onLogoChange}
          onDelete={onLogoDelete}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="배너">
        <ImageUploadBox
          imageUrl={bannerUrl}
          onFileChange={onBannerChange}
          onDelete={onBannerDelete}
          readOnly={readOnly}
        />
      </FormField>
    </Modal>
  )
}

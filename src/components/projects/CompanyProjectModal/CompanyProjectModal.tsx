import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { ModalActions } from '@components/common/ModalActions'
import type { SelectFieldOption } from '@components/common/SelectField'

interface CompanyProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardinal: number
  // 등록 모달에서만 넘긴다. 없으면 기수는 고정 표시
  cardinalOptions?: SelectFieldOption[]
  onCardinalChange?: (cardinal: number) => void
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
  onEdit?: () => void
  saveDisabled?: boolean
  readOnly?: boolean
  className?: string
}

export function CompanyProjectModal({
  open,
  onOpenChange,
  cardinal,
  cardinalOptions,
  onCardinalChange,
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
  onEdit,
  saveDisabled = true,
  readOnly = false,
  className,
}: CompanyProjectModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? '기업 프로젝트 상세' : onEdit ? '기업 프로젝트 수정' : '기업 프로젝트 등록'}
      className={className ?? 'left-[calc(50%+30px)]'}
      footer={
        onEdit ? (
          <>
            <Button variant="outlined" size="l" className="w-[140px]" onClick={onCancel}>
              닫기
            </Button>
            {readOnly ? (
              <Button variant="outlined" size="l" className="w-[140px]" onClick={onEdit}>
                수정하기
              </Button>
            ) : (
              <Button
                variant={saveDisabled ? 'disable' : 'strong'}
                size="l"
                className="w-[140px]"
                disabled={saveDisabled}
                onClick={onSave}
              >
                확인
              </Button>
            )}
          </>
        ) : readOnly ? (
          <Button variant="outlined" size="l" className="w-[140px]" onClick={onCancel}>
            닫기
          </Button>
        ) : (
          <ModalActions onCancel={onCancel} onSave={onSave} saveDisabled={saveDisabled} />
        )
      }
    >
      <div className="flex items-stretch gap-3">
        <CardinalField
          cardinal={cardinal}
          options={cardinalOptions}
          onCardinalChange={onCardinalChange}
          className="w-[130px] shrink-0"
        />
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

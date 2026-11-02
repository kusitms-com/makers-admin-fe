import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { ModalActions } from '@components/common/ModalActions'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'
import { TextareaField } from '@components/common/TextareaField'

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardinal: number
  team: string
  teamOptions: SelectFieldOption[]
  onTeamChange: (value: string) => void
  name: string
  onNameChange: (value: string) => void
  review: string
  onReviewChange: (value: string) => void
  onCancel: () => void
  onSave: () => void
  onEdit?: () => void
  saveDisabled?: boolean
  readOnly?: boolean
  className?: string
}

export function ReviewModal({
  open,
  onOpenChange,
  cardinal,
  team,
  teamOptions,
  onTeamChange,
  name,
  onNameChange,
  review,
  onReviewChange,
  onCancel,
  onSave,
  onEdit,
  saveDisabled = true,
  readOnly = false,
  className,
}: ReviewModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? '활동 후기 상세' : onEdit ? '활동 후기 수정' : '활동 후기 등록'}
      className={className}
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
        ) : (
          <ModalActions onCancel={onCancel} onSave={onSave} saveDisabled={saveDisabled} />
        )
      }
    >
      <div className="flex items-stretch gap-3">
        <CardinalField cardinal={cardinal} className="flex-1" />
        <FormField label="파트" className="flex-1">
          <SelectField
            value={team}
            options={teamOptions}
            onValueChange={onTeamChange}
            disabled={readOnly}
          />
        </FormField>
      </div>
      <FormField label="이름">
        <Inputfield
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onNameChange(event.target.value)
          }}
          readOnly={readOnly}
          placeholder="이름을 입력해주세요"
        />
      </FormField>
      <FormField label="내용">
        <TextareaField
          value={review}
          onChange={(event) => {
            onReviewChange(event.target.value)
          }}
          readOnly={readOnly}
          placeholder="내용을 입력해주세요"
        />
      </FormField>
    </Modal>
  )
}

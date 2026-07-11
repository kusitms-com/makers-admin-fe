import type { ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { FormField } from '@components/common/FormField'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
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
  saveDisabled?: boolean
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
  saveDisabled = true,
  className,
}: ReviewModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className={className}>
      <Modal.Title>후기 등록</Modal.Title>
      <Modal.Body>
        <div className="flex items-stretch gap-3">
          <FormField label="기수" className="flex-1">
            <SelectField value={`${String(cardinal)}기`} options={[]} />
          </FormField>
          <FormField label="파트" className="flex-1">
            <SelectField value={team} options={teamOptions} onValueChange={onTeamChange} />
          </FormField>
        </div>
        <FormField label="이름">
          <Inputfield
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onNameChange(event.target.value)
            }}
            placeholder="이름을 입력해주세요"
          />
        </FormField>
        <FormField label="내용">
          <TextareaField
            value={review}
            onChange={(event) => {
              onReviewChange(event.target.value)
            }}
            placeholder="내용을 입력해주세요"
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

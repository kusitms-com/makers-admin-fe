import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'

interface ModalActionsProps {
  onCancel: () => void
  onSave: () => void
  saveDisabled?: boolean
}

export function ModalActions({ onCancel, onSave, saveDisabled = true }: ModalActionsProps) {
  return (
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
  )
}

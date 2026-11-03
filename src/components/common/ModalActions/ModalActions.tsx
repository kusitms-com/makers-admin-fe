import { Button } from '@components/common/Button'

interface ModalActionsProps {
  onCancel: () => void
  onSave: () => void
  saveDisabled?: boolean
  saveLabel?: string
}

export function ModalActions({
  onCancel,
  onSave,
  saveDisabled = true,
  saveLabel = '저장하기',
}: ModalActionsProps) {
  return (
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
        {saveLabel}
      </Button>
    </>
  )
}

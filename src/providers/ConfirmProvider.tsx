import type { ReactNode } from 'react'
import { AlertModal } from '@/components/common/AlertModal'
import { Button } from '@/components/common/Button'
import { useConfirmStore } from '@/hooks/common/useConfirm'

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const request = useConfirmStore((state) => state.request)
  const isOpen = useConfirmStore((state) => state.isOpen)
  const close = useConfirmStore((state) => state.close)

  return (
    <>
      {children}
      <AlertModal
        open={isOpen}
        title={request?.title ?? ''}
        description={request?.description}
        onOpenChange={(open) => {
          if (!open) close(false)
        }}
      >
        {/* Figma 모달의 회색(disable 타입) 버튼 모양을 쓰지만 누를 수 있어야 한다. */}
        <Button
          variant="disable"
          size="l"
          disabled={false}
          className="flex-1 cursor-pointer"
          onClick={() => {
            close(false)
          }}
        >
          취소
        </Button>
        <Button
          variant="strong"
          size="l"
          className="flex-1"
          onClick={() => {
            close(true)
          }}
        >
          {request?.confirmLabel ?? '확인'}
        </Button>
      </AlertModal>
    </>
  )
}

import type { ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@lib/utils'

interface ModalRootProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  className?: string
}

function ModalRoot({ open, onOpenChange, children, className }: ModalRootProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop data-testid="modal-backdrop" className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Popup
          className={cn(
            'border-line-neutral bg-fill-normal fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[460px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border shadow-[0px_16px_24px_-6px_rgba(23,23,23,0.08),0px_6px_10px_-4px_rgba(23,23,23,0.08)]',
            className,
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface ModalTitleProps {
  children: ReactNode
  className?: string
}

function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <Dialog.Title
      className={cn(
        'border-line-neutral text-body-18b text-label-normal shrink-0 border-b px-6 pt-5 pb-[18px]',
        className,
      )}
    >
      {children}
    </Dialog.Title>
  )
}

interface ModalBodyProps {
  children: ReactNode
  className?: string
}

function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('flex flex-col gap-6 overflow-y-auto px-6 pt-[18px] pb-6', className)}>
      {children}
    </div>
  )
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'border-line-alternative flex shrink-0 items-center justify-center gap-2.5 border-t px-6 pt-4 pb-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const Modal = Object.assign(ModalRoot, {
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
})

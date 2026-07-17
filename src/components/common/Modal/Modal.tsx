import type { ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@lib/utils'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  header,
  footer,
  children,
  className,
  'aria-label': ariaLabel,
}: ModalProps) {
  const visibleTitle = !header && title && (
    <Dialog.Title className="border-line-neutral text-body-18b text-label-normal shrink-0 border-b px-6 pt-5 pb-[18px]">
      {title}
    </Dialog.Title>
  )
  const hiddenTitle = header && title && <Dialog.Title className="sr-only">{title}</Dialog.Title>

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          data-testid="modal-backdrop"
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
        />
        <Dialog.Popup
          aria-label={ariaLabel}
          className={cn(
            'border-line-neutral bg-fill-normal fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[460px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border shadow-[0px_16px_24px_-6px_rgba(23,23,23,0.08),0px_6px_10px_-4px_rgba(23,23,23,0.08)] transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
        >
          {visibleTitle}
          {hiddenTitle}
          {header}
          <div className="flex flex-col gap-6 overflow-y-auto px-6 pt-[18px] pb-6">{children}</div>
          {footer && (
            <div className="border-line-alternative flex shrink-0 items-center justify-center gap-2.5 border-t px-6 pt-4 pb-5">
              {footer}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

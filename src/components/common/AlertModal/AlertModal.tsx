import type { ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import ToastWarningIcon from '@/assets/icons/generated/ToastWarningIcon'
import { cn } from '@lib/utils'

interface AlertModalProps {
  open: boolean
  title: string
  description?: string
  // 넘기지 않으면 Esc로도 닫히지 않는다. 바깥 클릭으로는 항상 닫히지 않는다.
  onOpenChange?: (open: boolean) => void
  // 하단 버튼 영역
  children: ReactNode
  className?: string
}

export function AlertModal({
  open,
  title,
  description,
  onOpenChange,
  children,
  className,
}: AlertModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <Dialog.Portal>
        <Dialog.Backdrop className="bg-fill-transparent-black fixed inset-0 z-40 transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        {/* Figma 주석: 왼쪽 사이드바 때문에 시각 보정으로 중앙에서 오른쪽 40px, 위로 20px 이동 */}
        <Dialog.Popup
          className={cn(
            'border-line-neutral bg-fill-normal fixed top-[calc(50%-20px)] left-[calc(50%+40px)] z-50 flex w-[336px] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-clip rounded-2xl border shadow-[0px_10px_15px_-5px_rgba(23,23,23,0.1),0px_24px_38px_-10px_rgba(23,23,23,0.12)]',
            // 기존 Modal과 같은 등장·퇴장 전환. scale은 translate와 별도 속성이라 가운데 정렬을 깨지 않는다.
            'transition-[opacity,scale] duration-200 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none',
            className,
          )}
        >
          <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-2">
            <div className="flex size-12 items-center justify-center">
              <ToastWarningIcon className="size-[43.636px]" aria-hidden="true" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Dialog.Title className="text-body-18sb text-label-normal">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="text-label-14r text-label-light">
                  {description}
                </Dialog.Description>
              )}
            </div>
          </div>
          <div className="flex w-full gap-2 px-5 pt-4 pb-5">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

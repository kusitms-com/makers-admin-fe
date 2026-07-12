import type { HTMLAttributes } from 'react'
import { tv } from '@lib/tv'
import ToastCompleteIcon from '@/assets/icons/generated/ToastCompleteIcon'
import ToastErrorIcon from '@/assets/icons/generated/ToastErrorIcon'
import ToastInfoIcon from '@/assets/icons/generated/ToastInfoIcon'
import ToastWarningIcon from '@/assets/icons/generated/ToastWarningIcon'

const toastVariants = tv({
  base: 'relative isolate flex items-center gap-2 rounded-full py-2 pr-4 pl-4',
})

export type ToastType = 'complete' | 'warning' | 'info' | 'error'

const TOAST_ICONS: Record<ToastType, typeof ToastCompleteIcon> = {
  complete: ToastCompleteIcon,
  warning: ToastWarningIcon,
  info: ToastInfoIcon,
  error: ToastErrorIcon,
}

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  type: ToastType
  message: string
}

export function Toast({ type, message, className, ...props }: ToastProps) {
  const Icon = TOAST_ICONS[type]

  return (
    <div
      className={toastVariants({ className })}
      {...props}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="bg-label-normal/[0.52] absolute inset-0 -z-10 rounded-full backdrop-blur-[32px]" />
      <span className="bg-brand-primary/5 absolute inset-0 -z-10 rounded-full" />
      <Icon className="size-6 shrink-0" aria-hidden="true" />
      <p className="text-label-14sb text-static-white/[0.88] min-w-0 flex-1 truncate">{message}</p>
    </div>
  )
}

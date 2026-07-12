import type { ReactNode } from 'react'
import { Toast } from '@/components/common/Toast'
import { useToastStore } from '@/hooks/common/useToast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <>
      {children}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
        {toasts.map((item) => (
          <Toast key={item.id} type={item.type} message={item.message} />
        ))}
      </div>
    </>
  )
}

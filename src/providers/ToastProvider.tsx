import type { ReactNode } from 'react'
import { Toast } from '@/components/common/Toast'
import { useToastStore } from '@/hooks/common/useToast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <>
      {children}
      {/* 표 하단 페이지네이션과 겹치지 않게 오른쪽 위, 헤더(84px) 아래에 띄운다. */}
      <div className="fixed top-[100px] right-6 z-50 flex flex-col items-end gap-3">
        {toasts.map((item) => (
          <Toast
            key={item.id}
            type={item.type}
            message={item.message}
            className={
              item.leaving ? 'motion-safe:animate-toast-out' : 'motion-safe:animate-toast-in'
            }
          />
        ))}
      </div>
    </>
  )
}

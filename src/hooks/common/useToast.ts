import { create } from 'zustand'
import type { ToastType } from '@/components/common/Toast'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  // 사라지는 애니메이션 중이면 true
  leaving?: boolean
}

interface ToastStore {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id' | 'leaving'>) => void
  removeToast: (id: string) => void
}

// 화면에 머무는 총시간. 마지막 TOAST_EXIT_MS 동안 사라지는 애니메이션을 보여준다(index.css의 toast-out과 맞춤).
const TOAST_DURATION_MS = 4000
const TOAST_EXIT_MS = 200
const MAX_TOASTS = 4

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }].slice(-MAX_TOASTS) }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.map((item) => (item.id === id ? { ...item, leaving: true } : item)),
      }))
    }, TOAST_DURATION_MS - TOAST_EXIT_MS)
    setTimeout(() => {
      get().removeToast(id)
    }, TOAST_DURATION_MS)
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }))
  },
}))

export function useToast() {
  return useToastStore((state) => state.addToast)
}

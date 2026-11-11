import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
}

interface ConfirmRequest extends ConfirmOptions {
  resolve: (confirmed: boolean) => void
}

interface ConfirmStore {
  // 닫힌 뒤에도 퇴장 애니메이션 동안 문구가 보이도록 마지막 요청을 남겨 둔다.
  request: ConfirmRequest | null
  isOpen: boolean
  open: (options: ConfirmOptions) => Promise<boolean>
  close: (confirmed: boolean) => void
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  request: null,
  isOpen: false,
  open: (options) => {
    // 이미 열린 확인창이 있으면 취소로 끝내고 새 요청으로 바꾼다.
    if (get().isOpen) get().request?.resolve(false)
    return new Promise((resolve) => {
      set({ request: { ...options, resolve }, isOpen: true })
    })
  },
  close: (confirmed) => {
    if (!get().isOpen) return
    get().request?.resolve(confirmed)
    set({ isOpen: false })
  },
}))

// window.confirm 대신 쓴다. 확인을 누르면 true, 취소·Esc면 false로 끝난다.
export function useConfirm() {
  return useConfirmStore((state) => state.open)
}

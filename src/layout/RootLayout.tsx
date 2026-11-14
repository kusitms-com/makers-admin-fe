import { Outlet } from 'react-router'
import { ApiError } from '@api/client'
import { useCurrentCardinalQuery, useUpdateCurrentCardinalMutation } from '@api/auth/queries'
import { Sidebar } from '@/components/common'
import { useConfirm } from '@hooks/common/useConfirm'
import { useToast } from '@hooks/common/useToast'
import { useAuthStore } from '@hooks/auth/useAuth'
import { TOAST_MESSAGES } from '@/constants/toastMessages'

export function RootLayout() {
  const logout = useAuthStore((state) => state.logout)
  const isOwner = useAuthStore(
    (state) => state.session.status === 'authenticated' && state.session.authority === 'OWNER',
  )
  const addToast = useToast()
  const confirm = useConfirm()
  const currentCardinal = useCurrentCardinalQuery().data
  const updateCardinalMutation = useUpdateCurrentCardinalMutation()

  // 전체 회원의 YB/OB가 다시 계산되는 작업이라 OWNER만, 확인을 거쳐 다음 기수로만 바꾼다.
  async function handleCardinalAdvance() {
    if (currentCardinal === undefined || updateCardinalMutation.isPending) return
    const nextCardinal = currentCardinal + 1
    const confirmed = await confirm({
      title: `현재 기수를 ${String(nextCardinal)}기로 변경하시겠습니까?`,
      description: '전체 회원의 역할(YB/OB)이 다시 계산됩니다.',
      confirmLabel: '변경하기',
    })
    if (!confirmed) return

    updateCardinalMutation.mutate(nextCardinal, {
      onSuccess: (result) => {
        addToast({
          type: 'complete',
          message: `${String(result.currentCardinal)}기로 변경했습니다. YB→OB ${String(result.changedToOb)}명`,
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          message: error instanceof ApiError ? error.message : TOAST_MESSAGES.cardinalChangeFailed,
        })
      },
    })
  }

  function handleLogout() {
    void logout().catch((error: unknown) => {
      if (error instanceof Error) {
        addToast({ type: 'error', message: TOAST_MESSAGES.logoutFailed })
        return
      }
      throw error
    })
  }

  return (
    <div className="bg-fill-netural min-h-screen">
      <Sidebar
        className="fixed inset-y-0 left-0"
        onLogout={handleLogout}
        currentCardinal={currentCardinal}
        onCardinalAdvance={
          isOwner
            ? () => {
                void handleCardinalAdvance()
              }
            : undefined
        }
      />
      <main className="pl-sidebar flex min-h-screen flex-col">
        <Outlet />
      </main>
    </div>
  )
}

// src/routes.ts가 파일 기반 라우팅으로 참조하려면 default export가 필요하다.
export default RootLayout

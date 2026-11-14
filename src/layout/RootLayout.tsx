import { Outlet } from 'react-router'
import { ApiError } from '@api/client'
import {
  useCurrentCardinalQuery,
  useFetchLatestCurrentCardinal,
  useUpdateCurrentCardinalMutation,
} from '@api/auth/queries'
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
  const fetchLatestCardinal = useFetchLatestCurrentCardinal()

  // 전체 회원의 YB/OB가 다시 계산되는 작업이라 OWNER만, 확인을 거쳐 바꾼다. 선택지는 ±1기뿐이다.
  async function handleCardinalChange(cardinal: number) {
    if (updateCardinalMutation.isPending || currentCardinal === undefined) return
    const baseCardinal = currentCardinal
    const confirmed = await confirm({
      title: `현재 기수를 ${String(cardinal)}기로 변경하시겠습니까?`,
      description: '전체 회원의 역할(YB/OB)이 다시 계산됩니다.',
      confirmLabel: '변경하기',
    })
    if (!confirmed) return

    // 확인하는 사이 기준 기수가 바뀌었으면 오래된 목표로 되돌리지 않도록 멈춘다.
    // ponytail: 확인 직후와 요청 사이의 짧은 경쟁은 막지 못한다. 완전히 막으려면 서버가 예상 기수를 받아 비교해야 한다.
    try {
      if ((await fetchLatestCardinal()) !== baseCardinal) {
        addToast({ type: 'error', message: TOAST_MESSAGES.cardinalChangedElsewhere })
        return
      }
    } catch {
      addToast({ type: 'error', message: TOAST_MESSAGES.cardinalChangeFailed })
      return
    }

    updateCardinalMutation.mutate(cardinal, {
      onSuccess: (result) => {
        // 다음 기수로 가면 YB→OB, 되돌리면 OB→YB가 생긴다.
        const roleChange =
          result.changedToYb > 0
            ? `OB→YB ${String(result.changedToYb)}명`
            : `YB→OB ${String(result.changedToOb)}명`
        addToast({
          type: 'complete',
          message: `${String(result.currentCardinal)}기로 변경했습니다. ${roleChange}`,
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
        onCardinalChange={
          isOwner
            ? (cardinal) => {
                void handleCardinalChange(cardinal)
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

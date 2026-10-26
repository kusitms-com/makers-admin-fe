import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { IntroductionsPage } from './IntroductionsPage'

vi.mock('@api/introductions', () => ({
  updateIntroduction: vi.fn().mockResolvedValue(undefined),
}))

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <IntroductionsPage />
    </QueryClientProvider>,
  )
}

describe('IntroductionsPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'test-token', authority: 'MANAGER' },
    })
  })

  it('변경 사항이 없으면 저장 버튼이 비활성화된다', () => {
    renderPage()

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it('슬로건을 입력하면 저장 버튼이 활성화되고, 저장하면 다시 비활성화된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByPlaceholderText('슬로건을 입력해주세요'), '새로운 슬로건')

    const saveButton = screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    await waitFor(() => {
      expect(saveButton.disabled).toBe(true)
    })
  })
})

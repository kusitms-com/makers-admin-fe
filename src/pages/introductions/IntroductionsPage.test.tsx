import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type * as AuthApi from '@api/auth/api'
import { getIntroduction, updateIntroduction } from '@api/introductions/api'
import { useAuthStore } from '@hooks/auth/useAuth'
import { IntroductionsPage } from './IntroductionsPage'

vi.mock('@api/auth/api', async (importOriginal) => {
  const actual = await importOriginal<typeof AuthApi>()
  return { ...actual, getCurrentCardinal: vi.fn().mockResolvedValue(33) }
})

function emptyIntroResponse() {
  return {
    banner_cardinal: null,
    banner_status: null,
    member_count: null,
    project_count: null,
    university_count: null,
    intro_youtube_link: null,
    planning_image_url: null,
    design_image_url: null,
    frontend_image_url: null,
    backend_image_url: null,
    partner_logos: [],
    meetup_images: [],
    activities: [],
    teams: [],
    expert_lecture: [],
    ob_lecture: [],
    sponsors: [],
  }
}

vi.mock('@api/introductions/api', () => ({
  getIntroduction: vi.fn(),
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
    vi.mocked(getIntroduction).mockResolvedValue(emptyIntroResponse())
    vi.mocked(updateIntroduction).mockClear()
  })

  it('변경 사항이 없으면 저장 버튼이 비활성화된다', async () => {
    renderPage()

    const saveButton = await screen.findByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(true)
  })

  it('학회 정보를 입력하면 저장 버튼이 활성화되고, 저장하면 다시 비활성화된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(await screen.findByLabelText('누적 회원 수'), '100')

    const saveButton = screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    await waitFor(() => {
      expect(saveButton.disabled).toBe(true)
    })
  })

  it('상단 배너 기수를 다음 기수로 바꿔 저장할 수 있다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('combobox', { name: '기수' }))
    await user.click(await screen.findByRole('option', { name: '34기' }))

    const saveButton = screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)
    await user.click(saveButton)

    await waitFor(() => {
      expect(updateIntroduction).toHaveBeenCalledTimes(1)
    })
    expect(vi.mocked(updateIntroduction).mock.calls[0][0].bannerCardinal).toBe(34)
  })

  it('숫자 칸에는 숫자가 아닌 글자가 입력되지 않는다', async () => {
    const user = userEvent.setup()
    renderPage()

    const memberCount = await screen.findByLabelText<HTMLInputElement>('누적 회원 수')
    await user.clear(memberCount)
    await user.type(memberCount, 'abc-1')

    expect(memberCount.value).toBe('1')
  })

  it('기존 운영진 항목을 수정해 저장하면 조회 응답의 id가 그대로 실려간다', async () => {
    vi.mocked(getIntroduction).mockResolvedValue({
      ...emptyIntroResponse(),
      teams: [{ id: 7, name: '학부학', description: '기존 설명', image_link: null }],
    })
    const user = userEvent.setup()
    renderPage()

    const titleInput = await screen.findByDisplayValue('학부학')
    await user.clear(titleInput)
    await user.type(titleInput, '학부학팀')

    await user.click(screen.getByRole('button', { name: '저장하기' }))

    await waitFor(() => {
      expect(updateIntroduction).toHaveBeenCalledTimes(1)
    })
    const [payload] = vi.mocked(updateIntroduction).mock.calls[0]
    expect(payload.teams).toEqual([
      { id: 7, name: '학부학팀', description: '기존 설명', imageFile: undefined },
    ])
  })
})

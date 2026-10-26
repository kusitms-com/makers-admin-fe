import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { CompanyProjectsPage } from './CompanyProjectsPage'

const INITIAL_CORPORATE_ITEMS = [
  { corporate_id: 1, cardinal: 33, name: '큐시즘 파트너스' },
  { corporate_id: 2, cardinal: 33, name: '테크브릿지' },
  { corporate_id: 3, cardinal: 33, name: '넥스트웨이브' },
  { corporate_id: 4, cardinal: 33, name: '핀포인트' },
  { corporate_id: 5, cardinal: 32, name: '그로우업' },
  { corporate_id: 6, cardinal: 32, name: '오르빗랩' },
  { corporate_id: 7, cardinal: 31, name: '브릿지웍스' },
  { corporate_id: 8, cardinal: 30, name: '데일리테크' },
].map((item) => ({
  corporate_id: item.corporate_id,
  cardinal: item.cardinal,
  name: item.name,
  content: `${item.name} 소개`,
  category: [],
  logo_url: null,
  banner_url: null,
  tags: null,
}))

const corporateList = [...INITIAL_CORPORATE_ITEMS]

vi.mock('@api/projects', () => ({
  getCorporateProjects: vi
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ corporateCount: corporateList.length, corporateList }),
    ),
  createCorporateProject: vi.fn().mockResolvedValue(undefined),
}))

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <CompanyProjectsPage />
    </QueryClientProvider>,
  )
}

describe('CompanyProjectsPage', () => {
  beforeEach(() => {
    corporateList.splice(0, corporateList.length, ...INITIAL_CORPORATE_ITEMS)
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'test-token', authority: 'MANAGER' },
    })
  })

  it('기수 필터를 선택하면 해당 기수 프로젝트만 보여준다', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('큐시즘 파트너스')).toBeTruthy()
    expect(screen.queryByText('브릿지웍스')).toBeFalsy()

    await user.click(screen.getByRole('tab', { name: '31기' }))

    expect(screen.queryByText('큐시즘 파트너스')).toBeFalsy()
    expect(screen.getByText('브릿지웍스')).toBeTruthy()
  })

  it('필수 필드를 모두 채우기 전에는 저장 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: '추가하기' }))

    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled,
    ).toBe(true)
  })

  it('필수 필드를 채우면 저장 버튼이 활성화되고, 저장하면 모달이 닫힌다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByPlaceholderText('기업 이름을 입력해주세요'), '테스트 기업')
    await user.type(
      within(dialog).getByPlaceholderText('프로젝트 소개를 입력해주세요'),
      '프로젝트 소개',
    )

    const logoField = within(dialog).getByText('로고 이미지').closest('div')
    const bannerField = within(dialog).getByText('배너').closest('div')
    if (!logoField || !bannerField) throw new Error('이미지 필드를 찾을 수 없습니다')

    await user.upload(
      within(logoField).getByLabelText('파일 선택'),
      new File(['logo'], 'logo.png', { type: 'image/png' }),
    )
    await user.upload(
      within(bannerField).getByLabelText('파일 선택'),
      new File(['banner'], 'banner.png', { type: 'image/png' }),
    )

    const saveButton = within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeFalsy()
    })
  })

  it('취소를 누르면 모달이 닫히고 목록이 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByPlaceholderText('기업 이름을 입력해주세요'), '취소될 기업')
    await user.click(within(dialog).getByRole('button', { name: '취소하기' }))

    expect(screen.queryByRole('dialog')).toBeFalsy()
    expect(screen.queryByText('취소될 기업')).toBeFalsy()
    expect(screen.getByText('큐시즘 파트너스')).toBeTruthy()
  })

  it('배너를 업로드한 뒤 취소하면 사용하던 banner blob URL을 해제한다', async () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    const bannerField = within(dialog).getByText('배너').closest('div')
    if (!bannerField) throw new Error('배너 필드를 찾을 수 없습니다')
    await user.upload(
      within(bannerField).getByLabelText('파일 선택'),
      new File(['banner'], 'banner.png', { type: 'image/png' }),
    )

    revokeSpy.mockClear()
    await user.click(within(dialog).getByRole('button', { name: '취소하기' }))

    expect(revokeSpy).toHaveBeenCalledTimes(1)
  })

  it('기수의 마지막 프로젝트를 삭제하면 empty state 문구가 보인다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('tab', { name: '31기' }))
    expect(screen.getByText('브릿지웍스')).toBeTruthy()

    await user.hover(screen.getByText('브릿지웍스'))
    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(screen.queryByText('브릿지웍스')).toBeFalsy()
    expect(screen.getByText('등록된 프로젝트가 없습니다')).toBeTruthy()
  })
})

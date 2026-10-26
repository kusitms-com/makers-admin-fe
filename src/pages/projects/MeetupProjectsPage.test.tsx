import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { MeetupProjectsPage } from './MeetupProjectsPage'

vi.mock('@api/projects', () => ({
  createMeetupProject: vi.fn().mockResolvedValue(undefined),
}))

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MeetupProjectsPage />
    </QueryClientProvider>,
  )
}

describe('MeetupProjectsPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: { status: 'authenticated', accessToken: 'test-token', authority: 'MANAGER' },
    })
  })

  it('기수 필터를 선택하면 해당 기수 프로젝트만 보여준다', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(screen.getByText('큐첵')).toBeTruthy()
    expect(screen.queryByText('모먼트')).toBeFalsy()

    await user.click(screen.getByRole('tab', { name: '31기' }))

    expect(screen.queryByText('큐첵')).toBeFalsy()
    expect(screen.getByText('모먼트')).toBeTruthy()
  })

  it('필수 필드를 모두 채우기 전에는 저장 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '추가하기' }))

    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled,
    ).toBe(true)
  })

  it('필수 필드를 채우면 저장 버튼이 활성화되고, 저장하면 목록에 추가된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(
      within(dialog).getByPlaceholderText('서비스 이름을 입력해주세요'),
      '테스트 프로젝트',
    )
    await user.type(within(dialog).getByPlaceholderText('한 줄 소개를 입력해주세요'), '한 줄 소개')
    await user.type(
      within(dialog).getByPlaceholderText('프로젝트 소개를 입력해주세요'),
      '프로젝트 소개',
    )
    await user.type(within(dialog).getByPlaceholderText('팀명을 입력해주세요'), '테스트 팀')
    await user.type(within(dialog).getByLabelText('추가할 팀원 이름'), '홍길동')
    await user.click(within(dialog).getByRole('button', { name: '추가하기' }))

    const logoField = within(dialog).getByText('로고 이미지').closest('div')
    if (!logoField) throw new Error('로고 이미지 필드를 찾을 수 없습니다')
    await user.upload(
      within(logoField).getByLabelText('파일 선택'),
      new File(['logo'], 'logo.png', { type: 'image/png' }),
    )

    const posterField = within(dialog).getByText('포스터 이미지').closest('div')
    if (!posterField) throw new Error('포스터 이미지 필드를 찾을 수 없습니다')
    await user.upload(
      within(posterField).getByLabelText('파일 선택'),
      new File(['poster'], 'poster.png', { type: 'image/png' }),
    )

    const saveButton = within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeFalsy()
    })
    expect(screen.getByText('테스트 프로젝트')).toBeTruthy()
  })

  it('취소를 누르면 모달이 닫히고 목록이 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(
      within(dialog).getByPlaceholderText('서비스 이름을 입력해주세요'),
      '취소될 프로젝트',
    )
    await user.click(within(dialog).getByRole('button', { name: '취소하기' }))

    expect(screen.queryByRole('dialog')).toBeFalsy()
    expect(screen.queryByText('취소될 프로젝트')).toBeFalsy()
    expect(screen.getByText('큐첵')).toBeTruthy()
  })

  it('추가한 팀원을 삭제하면 목록에서 사라진다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByLabelText('추가할 팀원 이름'), '홍길동')
    await user.click(within(dialog).getByRole('button', { name: '추가하기' }))
    expect(within(dialog).getByLabelText('홍길동 이름')).toBeTruthy()

    await user.click(within(dialog).getByRole('button', { name: '홍길동 삭제' }))

    expect(within(dialog).queryByLabelText('홍길동 이름')).toBeFalsy()
  })

  it('기수의 마지막 프로젝트를 삭제하면 empty state 문구가 보인다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('tab', { name: '31기' }))
    expect(screen.getByText('모먼트')).toBeTruthy()

    await user.hover(screen.getByText('모먼트'))
    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(screen.queryByText('모먼트')).toBeFalsy()
    expect(screen.getByText('등록된 프로젝트가 없습니다')).toBeTruthy()
  })

  it('저장 후 삭제하면 카드가 사용하던 poster blob URL을 해제한다', async () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(
      within(dialog).getByPlaceholderText('서비스 이름을 입력해주세요'),
      '삭제될 프로젝트',
    )
    await user.type(within(dialog).getByPlaceholderText('한 줄 소개를 입력해주세요'), '한 줄 소개')
    await user.type(
      within(dialog).getByPlaceholderText('프로젝트 소개를 입력해주세요'),
      '프로젝트 소개',
    )
    await user.type(within(dialog).getByPlaceholderText('팀명을 입력해주세요'), '테스트 팀')
    await user.type(within(dialog).getByLabelText('추가할 팀원 이름'), '홍길동')
    await user.click(within(dialog).getByRole('button', { name: '추가하기' }))

    const logoField = within(dialog).getByText('로고 이미지').closest('div')
    if (!logoField) throw new Error('로고 이미지 필드를 찾을 수 없습니다')
    await user.upload(
      within(logoField).getByLabelText('파일 선택'),
      new File(['logo'], 'logo.png', { type: 'image/png' }),
    )

    const posterField = within(dialog).getByText('포스터 이미지').closest('div')
    if (!posterField) throw new Error('포스터 이미지 필드를 찾을 수 없습니다')
    await user.upload(
      within(posterField).getByLabelText('파일 선택'),
      new File(['poster'], 'poster.png', { type: 'image/png' }),
    )

    await user.click(within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' }))
    await waitFor(() => {
      expect(screen.getByText('삭제될 프로젝트')).toBeTruthy()
    })

    revokeSpy.mockClear()
    const card = screen.getByRole('group', { name: '삭제될 프로젝트' })
    await user.hover(card)
    await user.click(within(card).getByRole('button', { name: '삭제하기' }))

    expect(screen.queryByText('삭제될 프로젝트')).toBeFalsy()
    expect(revokeSpy).toHaveBeenCalledTimes(1)
  })
})

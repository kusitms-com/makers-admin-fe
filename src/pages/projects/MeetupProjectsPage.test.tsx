import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@hooks/auth/useAuth'
import { MeetupProjectsPage } from './MeetupProjectsPage'

vi.mock('@api/projects', () => ({
  getMeetupProjects: vi.fn().mockResolvedValue({
    meetup_count: 8,
    meetup_list: [
      { meetup_id: 1, cardinal: 33, name: '큐첵' },
      { meetup_id: 2, cardinal: 33, name: '모여봐요 스터디숲' },
      { meetup_id: 3, cardinal: 33, name: '오늘의 큐레이션' },
      { meetup_id: 4, cardinal: 33, name: '핏플랜' },
      { meetup_id: 5, cardinal: 32, name: '북적북적' },
      { meetup_id: 6, cardinal: 32, name: '루틴메이트' },
      { meetup_id: 7, cardinal: 31, name: '모먼트' },
      { meetup_id: 8, cardinal: 30, name: '컬러링북' },
    ].map((item) => ({
      cardinal: item.cardinal,
      name: item.name,
      meetup_id: item.meetup_id,
      one_line_intro: '한 줄 소개',
      logo_url: null,
      poster_url: null,
      web_thumbnail_url: null,
      behance_url: null,
      instagram_url: null,
      github_url: null,
      app_url: null,
      tags: null,
    })),
  }),
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

    expect(await screen.findByText('큐첵')).toBeTruthy()
    expect(screen.queryByText('모먼트')).toBeFalsy()

    await user.click(screen.getByRole('tab', { name: '31기' }))

    expect(screen.queryByText('큐첵')).toBeFalsy()
    expect(screen.getByText('모먼트')).toBeTruthy()
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

  it('필수 필드를 채우면 저장 버튼이 활성화되고, 저장하면 목록에 추가된다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: '추가하기' }))
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
  })

  it('취소를 누르면 모달이 닫히고 목록이 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: '추가하기' }))
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

    await user.click(await screen.findByRole('button', { name: '추가하기' }))
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

    await user.click(await screen.findByRole('tab', { name: '31기' }))
    expect(screen.getByText('모먼트')).toBeTruthy()

    await user.hover(screen.getByText('모먼트'))
    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(screen.queryByText('모먼트')).toBeFalsy()
    expect(screen.getByText('등록된 프로젝트가 없습니다')).toBeTruthy()
  })
})

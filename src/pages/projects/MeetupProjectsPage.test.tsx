import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MeetupProjectsPage } from './MeetupProjectsPage'

describe('MeetupProjectsPage', () => {
  it('기수 필터를 선택하면 해당 기수 프로젝트만 보여준다', async () => {
    const user = userEvent.setup()
    render(<MeetupProjectsPage />)

    expect(screen.getByText('큐첵')).toBeTruthy()
    expect(screen.queryByText('모먼트')).toBeFalsy()

    await user.click(screen.getByRole('tab', { name: '31기' }))

    expect(screen.queryByText('큐첵')).toBeFalsy()
    expect(screen.getByText('모먼트')).toBeTruthy()
  })

  it('필수 필드를 모두 채우기 전에는 저장 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    render(<MeetupProjectsPage />)

    await user.click(screen.getByRole('button', { name: '추가하기' }))

    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled,
    ).toBe(true)
  })

  it('필수 필드를 채우면 저장 버튼이 활성화되고, 저장하면 목록에 추가된다', async () => {
    const user = userEvent.setup()
    render(<MeetupProjectsPage />)

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
    await user.type(within(dialog).getByLabelText('추가할 팀원 이름'), '홍길동')
    await user.click(within(dialog).getByRole('button', { name: '추가하기' }))

    const fileInput = dialog.querySelector<HTMLInputElement>('input[type="file"]')
    if (!fileInput) throw new Error('포스터 업로드 input을 찾을 수 없습니다')
    const posterFile = new File(['poster'], 'poster.png', { type: 'image/png' })
    await user.upload(fileInput, posterFile)

    const saveButton = within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    expect(screen.queryByRole('dialog')).toBeFalsy()
    expect(screen.getByText('테스트 프로젝트')).toBeTruthy()
  })
})

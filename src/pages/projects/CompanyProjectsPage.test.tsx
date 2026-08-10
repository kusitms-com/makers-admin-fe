import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CompanyProjectsPage } from './CompanyProjectsPage'

describe('CompanyProjectsPage', () => {
  it('기수 필터를 선택하면 해당 기수 프로젝트만 보여준다', async () => {
    const user = userEvent.setup()
    render(<CompanyProjectsPage />)

    expect(screen.getByText('큐시즘 파트너스')).toBeTruthy()
    expect(screen.queryByText('브릿지웍스')).toBeFalsy()

    await user.click(screen.getByRole('tab', { name: '31기' }))

    expect(screen.queryByText('큐시즘 파트너스')).toBeFalsy()
    expect(screen.getByText('브릿지웍스')).toBeTruthy()
  })

  it('필수 필드를 모두 채우기 전에는 저장 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    render(<CompanyProjectsPage />)

    await user.click(screen.getByRole('button', { name: '추가하기' }))

    const dialog = screen.getByRole('dialog')
    expect(
      within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled,
    ).toBe(true)
  })

  it('필수 필드를 채우면 저장 버튼이 활성화되고, 저장하면 목록에 추가된다', async () => {
    const user = userEvent.setup()
    render(<CompanyProjectsPage />)

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByPlaceholderText('기업 이름을 입력해주세요'), '테스트 기업')
    await user.type(
      within(dialog).getByPlaceholderText('프로젝트 소개를 입력해주세요'),
      '프로젝트 소개',
    )

    const fileInput = dialog.querySelector<HTMLInputElement>('input[type="file"]')
    if (!fileInput) throw new Error('배너 업로드 input을 찾을 수 없습니다')
    const bannerFile = new File(['banner'], 'banner.png', { type: 'image/png' })
    await user.upload(fileInput, bannerFile)

    const saveButton = within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    expect(screen.queryByRole('dialog')).toBeFalsy()
    expect(screen.getByText('테스트 기업')).toBeTruthy()
  })

  it('취소를 누르면 모달이 닫히고 목록이 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    render(<CompanyProjectsPage />)

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByPlaceholderText('기업 이름을 입력해주세요'), '취소될 기업')
    await user.click(within(dialog).getByRole('button', { name: '취소하기' }))

    expect(screen.queryByRole('dialog')).toBeFalsy()
    expect(screen.queryByText('취소될 기업')).toBeFalsy()
    expect(screen.getByText('큐시즘 파트너스')).toBeTruthy()
  })

  it('기수의 마지막 프로젝트를 삭제하면 empty state 문구가 보인다', async () => {
    const user = userEvent.setup()
    render(<CompanyProjectsPage />)

    await user.click(screen.getByRole('tab', { name: '31기' }))
    expect(screen.getByText('브릿지웍스')).toBeTruthy()

    await user.hover(screen.getByText('브릿지웍스'))
    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(screen.queryByText('브릿지웍스')).toBeFalsy()
    expect(screen.getByText('등록된 프로젝트가 없습니다')).toBeTruthy()
  })

  it('저장 후 삭제하면 카드가 사용하던 banner blob URL을 해제한다', async () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    const user = userEvent.setup()
    render(<CompanyProjectsPage />)

    await user.click(screen.getByRole('button', { name: '추가하기' }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByPlaceholderText('기업 이름을 입력해주세요'), '삭제될 기업')
    await user.type(
      within(dialog).getByPlaceholderText('프로젝트 소개를 입력해주세요'),
      '프로젝트 소개',
    )

    const fileInput = dialog.querySelector<HTMLInputElement>('input[type="file"]')
    if (!fileInput) throw new Error('배너 업로드 input을 찾을 수 없습니다')
    const bannerFile = new File(['banner'], 'banner.png', { type: 'image/png' })
    await user.upload(fileInput, bannerFile)

    await user.click(within(dialog).getByRole<HTMLButtonElement>('button', { name: '저장하기' }))
    expect(screen.getByText('삭제될 기업')).toBeTruthy()

    revokeSpy.mockClear()
    const card = screen.getByRole('group', { name: '삭제될 기업' })
    await user.hover(card)
    await user.click(within(card).getByRole('button', { name: '삭제하기' }))

    expect(screen.queryByText('삭제될 기업')).toBeFalsy()
    expect(revokeSpy).toHaveBeenCalledTimes(1)
  })
})

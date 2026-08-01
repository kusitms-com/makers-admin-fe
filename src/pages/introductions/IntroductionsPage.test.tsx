import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { IntroductionsPage } from './IntroductionsPage'

describe('IntroductionsPage', () => {
  it('변경 사항이 없으면 저장 버튼이 비활성화된다', () => {
    render(<IntroductionsPage />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it('슬로건을 입력하면 저장 버튼이 활성화되고, 저장하면 다시 비활성화된다', async () => {
    const user = userEvent.setup()
    render(<IntroductionsPage />)

    await user.type(screen.getByPlaceholderText('슬로건을 입력해주세요'), '새로운 슬로건')

    const saveButton = screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' })
    expect(saveButton.disabled).toBe(false)

    await user.click(saveButton)

    expect(saveButton.disabled).toBe(true)
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PartnerImageBox } from './PartnerImageBox'

describe('PartnerImageBox', () => {
  it('이미지가 없으면 업로드 안내를 보여준다', () => {
    render(<PartnerImageBox />)

    expect(screen.getByText('업로드')).toBeTruthy()
  })

  it('이미지가 없으면 변경/삭제 버튼을 보여주지 않는다', () => {
    render(<PartnerImageBox />)

    expect(screen.queryByRole('button', { name: '이미지 삭제' })).toBeNull()
    expect(screen.queryByRole('button', { name: '이미지 변경' })).toBeNull()
  })

  it('이미지가 있으면 변경/삭제 버튼을 보여준다', () => {
    render(<PartnerImageBox imageUrl="/thumb.png" />)

    expect(screen.getByRole('button', { name: '이미지 변경' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '이미지 삭제' })).toBeTruthy()
  })

  it('삭제 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<PartnerImageBox imageUrl="/thumb.png" onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: '이미지 삭제' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('파일을 선택하면 onFileChange가 호출된다', async () => {
    const user = userEvent.setup()
    const onFileChange = vi.fn()
    render(<PartnerImageBox onFileChange={onFileChange} />)

    const file = new File(['content'], 'logo.png', { type: 'image/png' })
    const input = screen.getByLabelText('업로드')
    await user.upload(input, file)

    expect(onFileChange).toHaveBeenCalledWith(file)
  })
})

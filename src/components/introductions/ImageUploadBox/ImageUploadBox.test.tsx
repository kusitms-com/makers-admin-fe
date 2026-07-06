import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ImageUploadBox } from './ImageUploadBox'

describe('ImageUploadBox', () => {
  it('이미지가 없으면 파일 선택 안내를 보여준다', () => {
    render(<ImageUploadBox />)

    expect(screen.getByText('파일 선택')).toBeTruthy()
  })

  it('이미지가 없으면 삭제하기/교체하기 버튼을 보여주지 않는다', () => {
    render(<ImageUploadBox />)

    expect(screen.queryByRole('button', { name: '삭제하기' })).toBeNull()
    expect(screen.queryByRole('button', { name: '교체하기' })).toBeNull()
  })

  it('이미지가 있으면 삭제하기/교체하기 버튼을 보여준다', () => {
    render(<ImageUploadBox imageUrl="/preview.png" />)

    expect(screen.getByRole('button', { name: '삭제하기' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '교체하기' })).toBeTruthy()
  })

  it('삭제하기 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<ImageUploadBox imageUrl="/preview.png" onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: '삭제하기' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('파일을 선택하면 onFileChange가 호출된다', async () => {
    const user = userEvent.setup()
    const onFileChange = vi.fn()
    render(<ImageUploadBox onFileChange={onFileChange} />)

    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    const input = screen.getByLabelText('파일 선택')
    await user.upload(input, file)

    expect(onFileChange).toHaveBeenCalledWith(file)
  })
})

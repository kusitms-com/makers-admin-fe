import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('제목을 렌더링한다', () => {
    render(<PageHeader title="기업 프로젝트 관리" />)

    expect(screen.getByRole('heading', { level: 1, name: '기업 프로젝트 관리' })).toBeTruthy()
  })

  it('actionLabel이 없으면 액션 버튼을 렌더링하지 않는다', () => {
    render(<PageHeader title="기업 프로젝트 관리" />)

    expect(screen.queryByRole('button')).toBeNull()
  })

  it('actionLabel이 있으면 버튼을 렌더링하고 클릭 시 onAction이 호출된다', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<PageHeader title="기업 프로젝트 관리" actionLabel="저장하기" onAction={onAction} />)

    const button = screen.getByRole('button', { name: '저장하기' })
    expect(button).toBeTruthy()

    await user.click(button)

    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('actionDisabled가 true면 액션 버튼이 비활성화된다', () => {
    render(<PageHeader title="기업 프로젝트 관리" actionLabel="저장하기" actionDisabled />)

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '저장하기' }).disabled).toBe(true)
  })

  it('children을 제목 옆에 렌더링한다', () => {
    render(
      <PageHeader title="기업 프로젝트 관리">
        <span>배지</span>
      </PageHeader>,
    )

    expect(screen.getByText('배지')).toBeTruthy()
  })
})

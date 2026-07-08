import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MentorApplicationRow } from './MentorApplicationRow'

const STATUS_OPTIONS = [
  { value: 'pending', label: '대기' },
  { value: 'accepted', label: '합격' },
  { value: 'rejected', label: '거절' },
]

describe('MentorApplicationRow', () => {
  it('이름, 기수, 연락처, 이메일, 지원일을 렌더링한다', () => {
    render(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={vi.fn()}
      />,
    )

    expect(screen.getByText('이현진')).toBeTruthy()
    expect(screen.getByText('33기')).toBeTruthy()
    expect(screen.getByText('010-1234-5678')).toBeTruthy()
    expect(screen.getByText('abc12345@gmail.com')).toBeTruthy()
    expect(screen.getByText('26.03.12 18:33')).toBeTruthy()
  })

  it('지원여부를 Y/N으로 표시한다', () => {
    const { rerender } = render(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Y')).toBeTruthy()

    rerender(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied={false}
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={vi.fn()}
      />,
    )

    expect(screen.getByText('N')).toBeTruthy()
  })

  it('fileName이 있으면 첨부파일 칩을 렌더링한다', () => {
    render(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={vi.fn()}
        fileName="수료증_이현진.pdf"
      />,
    )

    expect(screen.getByText('수료증_이현진.pdf')).toBeTruthy()
  })

  it('삭제 버튼 클릭 시 onDelete가 호출된다', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={vi.fn()}
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('onDelete가 없으면 삭제 버튼이 비활성화된다', () => {
    render(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={vi.fn()}
      />,
    )

    expect(screen.getByRole<HTMLButtonElement>('button', { name: '삭제' }).disabled).toBe(true)
  })

  it('드롭다운에서 상태를 선택하면 onStatusChange가 호출된다', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    render(
      <MentorApplicationRow
        name="이현진"
        generation={33}
        part="PLAN"
        phone="010-1234-5678"
        email="abc12345@gmail.com"
        appliedAt="26.03.12 18:33"
        isApplied
        status="rejected"
        statusOptions={STATUS_OPTIONS}
        onStatusChange={onStatusChange}
      />,
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: '합격' }))

    expect(onStatusChange).toHaveBeenCalledWith('accepted')
  })
})

import { screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'

// Base UI Dialog는 열린 뒤 첫 포커스를 requestAnimationFrame으로 한 프레임 늦게 옮긴다(enqueueFocus).
// 그 전에 입력칸을 클릭·타이핑하면 늦게 도착한 첫 포커스가 포커스를 빼앗아 글자가 다른 요소로 간다.
// 부하가 큰 전체 실행에서만 간헐적으로 실패하므로, 모달 안에서 타이핑하기 전에 반드시 기다린다.
export async function waitForDialogFocus() {
  await waitFor(() => {
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })
}

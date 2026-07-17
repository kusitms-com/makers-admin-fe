import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { GlobalErrorPage } from './GlobalErrorPage'

function renderWithError(loader: () => never) {
  const router = createMemoryRouter(
    [{ path: '/', loader, Component: () => null, ErrorBoundary: GlobalErrorPage }],
    { initialEntries: ['/'] },
  )
  return render(<RouterProvider router={router} />)
}

describe('GlobalErrorPage', () => {
  it('route error response면 상태 코드를 포함한 메시지를 보여준다', async () => {
    renderWithError(() => {
      // react-router의 route error response 관례상 Response를 직접 throw한다.
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new Response('Not Found', { status: 404, statusText: 'Not Found' })
    })

    expect(await screen.findByText('오류가 발생했습니다 (404)')).toBeTruthy()
  })

  it('일반 에러면 공통 안내 문구를 보여준다', async () => {
    renderWithError(() => {
      throw new Error('boom')
    })

    expect(await screen.findByText('문제가 발생했습니다')).toBeTruthy()
  })
})

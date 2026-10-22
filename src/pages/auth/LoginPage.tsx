import { useState, type SubmitEvent } from 'react'
import { Button, Inputfield, Logo, Sidebar } from '@/components/common'
import { ReviewsPage } from '@pages/reviews/ReviewsPage'

export function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  // 로그인 API 연동은 별도 이슈에서 진행한다.
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="bg-fill-netural min-h-screen">
      {/* Figma처럼 관리자 화면을 흐리게 깔아 두는 배경이라 조작할 수 없게 막는다. */}
      <div inert aria-hidden="true" className="blur-sm">
        <Sidebar className="fixed inset-y-0 left-0" />
        <div className="pl-sidebar flex min-h-screen flex-col">
          <ReviewsPage />
        </div>
      </div>
      <main className="fixed inset-0 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-fill-normal border-line-neutral flex w-[354px] flex-col gap-9 rounded-2xl border p-9 shadow-[0_24px_19px_rgba(23,23,23,0.06)]"
        >
          <h1 className="sr-only">KUSITMS 관리자 로그인</h1>
          <Logo size="lg" className="h-[52px]" />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="login-id" className="text-label-14b text-label-normal">
                  로그인
                </label>
                <Inputfield
                  id="login-id"
                  required
                  autoComplete="username"
                  placeholder="아이디를 입력해주세요"
                  className="h-11"
                  value={id}
                  onChange={(event) => {
                    setId(event.target.value)
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="text-label-14b text-label-normal">
                  비밀번호
                </label>
                <Inputfield
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해주세요"
                  className="h-11"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                />
              </div>
            </div>
            <Button type="submit" variant="strong" size="l">
              로그인
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default LoginPage

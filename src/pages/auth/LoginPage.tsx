import { Controller, useForm, type FieldErrors, type Resolver } from 'react-hook-form'
import { Navigate } from 'react-router'
import { z } from 'zod'
import { Button, Inputfield, Logo, Sidebar } from '@/components/common'
import { ApiError } from '@api/client'
import { useAuthStore } from '@hooks/auth/useAuth'
import { ReviewsPage } from '@pages/reviews/ReviewsPage'

const loginSchema = z.object({
  id: z.string().trim().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const loginResolver: Resolver<LoginFormValues> = (values) => {
  const result = loginSchema.safeParse(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }

  const errors: FieldErrors<LoginFormValues> = {}
  result.error.issues.forEach((issue) => {
    const field = issue.path[0]
    if (field === 'id' || field === 'password') {
      errors[field] = { type: issue.code, message: issue.message }
    }
  })
  return { values: {}, errors }
}

export function LoginPage() {
  const session = useAuthStore((state) => state.session)
  const login = useAuthStore((state) => state.login)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: { id: '', password: '' },
  })
  const error = errors.root?.message ?? errors.id?.message ?? errors.password?.message

  async function handleLogin({ id, password }: LoginFormValues) {
    try {
      await login(id, password)
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 403) {
        setError('root', { type: 'server', message: '관리자 권한이 없는 계정입니다.' })
      } else if (failure instanceof ApiError && failure.status === 401) {
        setError('root', { type: 'server', message: '아이디 또는 비밀번호를 확인해 주세요.' })
      } else {
        setError('root', {
          type: 'server',
          message: '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        })
      }
    }
  }

  if (session.status === 'loading') {
    return <p role="status">로그인 상태를 확인하고 있습니다.</p>
  }
  if (session.status === 'authenticated') {
    return <Navigate to="/introduction" replace />
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
      {/* m-auto는 화면이 폼보다 낮으면 위쪽부터 배치되어 스크롤로 폼 전체에 접근할 수 있다. */}
      <main className="fixed inset-0 flex overflow-y-auto p-4">
        <form
          onSubmit={(event) => {
            void handleSubmit(handleLogin)(event)
          }}
          className="bg-fill-normal border-line-neutral m-auto flex w-[354px] flex-col gap-9 rounded-2xl border p-9 shadow-[0_24px_19px_rgba(23,23,23,0.06)]"
        >
          <h1 className="sr-only">KUSITMS 관리자 로그인</h1>
          <Logo size="lg" className="h-[52px]" />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {/* 디자인상 보이는 문구는 '로그인'이지만 입력란 이름은 '로그인 아이디'로 안내한다. */}
                <label htmlFor="login-id" className="text-label-14b text-label-normal">
                  로그인<span className="sr-only"> 아이디</span>
                </label>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <Inputfield
                      {...field}
                      id="login-id"
                      required
                      autoComplete="username"
                      placeholder="아이디를 입력해주세요"
                      className="h-11"
                      aria-invalid={Boolean(errors.id)}
                      aria-describedby={error ? 'login-error' : undefined}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="text-label-14b text-label-normal">
                  비밀번호
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Inputfield
                      {...field}
                      id="login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력해주세요"
                      className="h-11"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={error ? 'login-error' : undefined}
                    />
                  )}
                />
              </div>
            </div>
            {error && (
              <p id="login-error" role="alert" className="text-label-14m text-status-negative">
                {error}
              </p>
            )}
            <Button
              type="submit"
              variant={isSubmitting ? 'disable' : 'strong'}
              size="l"
              disabled={isSubmitting}
            >
              {isSubmitting ? '로그인 중' : '로그인'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default LoginPage

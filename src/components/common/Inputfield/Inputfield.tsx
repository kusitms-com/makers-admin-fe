import { useId, type ComponentPropsWithRef } from 'react'
import { cn } from '@lib/utils'

interface InputfieldProps extends ComponentPropsWithRef<'input'> {
  className?: string
  // 있으면 테두리를 오류 색으로 바꾸고 입력칸 아래에 문구를 보여 준다.
  error?: string
}

export function Inputfield({ className, ref, error, ...props }: InputfieldProps) {
  const errorId = useId()
  const hasValue = props.value != null && String(props.value).length > 0

  // 오류가 생기고 사라져도 input의 트리 위치가 같아야 입력 중 포커스를 잃지 않는다. 문구만 형제로 붙였다 뗀다.
  return (
    <>
      <div
        className={cn(
          'border-line-normal focus-within:border-brand-primary focus-within:bg-fill-normal flex h-10 items-center rounded-lg border px-3 py-1.5',
          hasValue ? 'bg-fill-normal' : 'bg-fill-netural',
          error && 'border-status-negative focus-within:border-status-negative',
          className,
        )}
      >
        <input
          ref={ref}
          className="text-label-14m text-label-strong placeholder:text-label-assitive w-full bg-transparent outline-none"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-caption-12r text-status-negative">
          {error}
        </p>
      )}
    </>
  )
}

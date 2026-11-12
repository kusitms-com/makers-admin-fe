import { cn } from '@lib/utils'

interface LoadingStateProps {
  // 화면 낭독기에 읽어 줄 문구
  label?: string
  className?: string
}

export function LoadingState({ label = '불러오는 중입니다', className }: LoadingStateProps) {
  return (
    <div role="status" className={cn('flex items-center justify-center', className)}>
      <span
        aria-hidden="true"
        className="border-line-normal border-t-brand-primary size-6 rounded-full border-2 motion-safe:animate-spin"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

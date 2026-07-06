import { HeaderDesktopLogo } from '@kusitms.com/icons'
import { AdminWordmark } from '@/assets/icons/generated'
import { cn } from '@lib/utils'

type LogoSize = 'sm' | 'lg'

interface LogoProps {
  size?: LogoSize
  className?: string
}

const markSizeClassName: Record<LogoSize, string> = {
  sm: 'h-6 w-auto',
  lg: 'h-[42px] w-auto',
}

const wordmarkSizeClassName: Record<LogoSize, string> = {
  sm: 'h-[10px] w-auto -ml-[5px]',
  lg: 'h-[17px] w-auto -ml-[9px]',
}

export function Logo({ size = 'sm', className }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center', className)}>
      <HeaderDesktopLogo className={markSizeClassName[size]} aria-hidden="true" />
      <AdminWordmark className={wordmarkSizeClassName[size]} aria-hidden="true" />
    </div>
  )
}

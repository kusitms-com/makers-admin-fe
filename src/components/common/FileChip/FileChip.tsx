import AttachFileIcon from '@/assets/icons/generated/AttachFileIcon'
import { cn } from '@lib/utils'

interface FileChipProps {
  fileName: string
  className?: string
}

export function FileChip({ fileName, className }: FileChipProps) {
  return (
    <div
      className={cn(
        'bg-fill-netural flex h-[34px] items-center gap-1 rounded-full py-1.5 pr-3 pl-2',
        className,
      )}
    >
      <AttachFileIcon className="text-label-assitive size-5 shrink-0" aria-hidden="true" />
      <span className="text-label-13m text-label-light min-w-0 truncate">{fileName}</span>
    </div>
  )
}

import { cn } from '@lib/utils'

interface MentorSatisfactionRowProps {
  name: string
  generation: number
  part: string
  satisfactionRate: number
  avatarUrl?: string
  className?: string
}

export function MentorSatisfactionRow({
  name,
  generation,
  part,
  satisfactionRate,
  avatarUrl,
  className,
}: MentorSatisfactionRowProps) {
  const clampedRate = Math.min(100, Math.max(0, satisfactionRate))

  return (
    <div
      className={cn(
        'border-line-alternative flex items-center justify-between border-b py-4',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="bg-fill-alternative size-9 shrink-0 rounded-full" aria-hidden="true" />
        )}
        <div className="flex flex-col gap-0.5">
          <p className="text-body-16sb text-label-netural whitespace-nowrap">{name} 멘토</p>
          <p className="text-label-13r text-label-alternative flex items-center gap-1 whitespace-nowrap">
            <span>{generation}기</span>
            <span className="bg-label-alternative size-0.5 rounded-full" aria-hidden="true" />
            <span>{part}</span>
          </p>
        </div>
      </div>
      <div className="flex min-w-[130px] flex-col items-end gap-[5px] pl-5">
        <p className="text-caption-12r text-label-alternative flex items-center gap-1 whitespace-nowrap">
          만족도
          <span className="text-caption-12sb text-brand-primary">{clampedRate}%</span>
        </p>
        <div className="bg-fill-strong h-1.5 w-[111px] rounded-full">
          <div
            className="from-brand-primary to-brand-assisitve h-1.5 rounded-full bg-linear-to-r"
            style={{ width: `${String(clampedRate)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

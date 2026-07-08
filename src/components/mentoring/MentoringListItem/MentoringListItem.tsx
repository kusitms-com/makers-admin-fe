import { ArrowRightIcon } from '@kusitms.com/icons'
import { StatusChip, type StatusChipStatus } from '@components/common/StatusChip/StatusChip'
import { cn } from '@lib/utils'

interface Participant {
  name: string
  role: string
  avatarUrl?: string
}

interface MentoringListItemProps {
  mentor: Participant
  mentee: Participant
  dateRange: string
  title: string
  status: StatusChipStatus
  className?: string
}

function ParticipantAvatar({ name, role, avatarUrl }: Participant) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="size-8 shrink-0 rounded-2xl object-cover" />
      ) : (
        <div className="bg-fill-alternative size-8 shrink-0 rounded-2xl" aria-hidden="true" />
      )}
      <p className="text-label-14sb text-label-normal whitespace-nowrap">
        {name} <span className="text-caption-12r text-label-alternative">{role}</span>
      </p>
    </div>
  )
}

export function MentoringListItem({
  mentor,
  mentee,
  dateRange,
  title,
  status,
  className,
}: MentoringListItemProps) {
  return (
    <div
      className={cn(
        'border-line-alternative flex items-center justify-center border-b py-[18px]',
        className,
      )}
    >
      <div className="flex min-w-px flex-1 items-center gap-4">
        <div className="flex min-w-px flex-1 items-center gap-6">
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex shrink-0 items-center gap-3 pr-2">
              <ParticipantAvatar {...mentor} />
              <ArrowRightIcon
                className="text-label-alternative size-4 shrink-0"
                aria-hidden="true"
              />
              <ParticipantAvatar {...mentee} />
            </div>
            <span className="text-label-13r text-label-alternative whitespace-nowrap">
              {dateRange}
            </span>
          </div>
          <p className="text-label-14m text-label-netural min-w-px flex-1 truncate">{title}</p>
        </div>
        <StatusChip status={status} className="shrink-0" />
      </div>
    </div>
  )
}

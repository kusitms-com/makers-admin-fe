import { cn } from '@lib/utils'

interface ParticipantMeta {
  name: string
  role: string
  generation: number
  part: string
}

interface MentoringReviewRowProps {
  title: string
  relativeTime: string
  mentor: ParticipantMeta
  mentee: ParticipantMeta
  isRecommended: boolean
  keywords: string[]
  freeReview: string
  className?: string
}

function ParticipantMetaLabel({ name, role, generation, part }: ParticipantMeta) {
  return (
    <p className="text-label-14m text-label-netural flex items-center gap-1 whitespace-nowrap">
      <span>
        {name} {role}
      </span>
      <span className="text-label-13r text-label-alternative flex items-center gap-1">
        <span>{generation}기</span>
        <span className="bg-label-alternative size-0.5 rounded-full" aria-hidden="true" />
        <span>{part}</span>
      </span>
    </p>
  )
}

export function MentoringReviewRow({
  title,
  relativeTime,
  mentor,
  mentee,
  isRecommended,
  keywords,
  freeReview,
  className,
}: MentoringReviewRowProps) {
  return (
    <div
      className={cn('border-line-alternative flex w-full flex-col gap-5 border-b py-4', className)}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <p className="text-body-16m text-label-normal min-w-0 truncate">{title}</p>
        <p className="text-label-13r text-label-assitive shrink-0 whitespace-nowrap">
          {relativeTime}
        </p>
      </div>

      <div className="bg-fill-netural inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1">
        <ParticipantMetaLabel {...mentor} />
        <span className="text-caption-12sb text-label-alternative">→</span>
        <ParticipantMetaLabel {...mentee} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-caption-12sb text-label-alternative">키워드 후기</p>
        <div className="flex flex-wrap gap-2">
          {isRecommended && (
            <span className="bg-fill-primary text-brand-primary text-label-14sb rounded-full px-3.5 py-1.5">
              👍 추천해요
            </span>
          )}
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="border-line-neutral text-label-normal text-label-14m bg-fill-normal rounded-full border px-3.5 py-1.5"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-caption-12sb text-label-alternative">자유 후기</p>
        <p className="text-label-14r text-label-normal line-clamp-2">{freeReview}</p>
      </div>
    </div>
  )
}

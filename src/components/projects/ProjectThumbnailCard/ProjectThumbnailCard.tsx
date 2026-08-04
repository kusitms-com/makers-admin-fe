import { Button } from '@components/common/Button'
import { cn } from '@lib/utils'

interface ProjectThumbnailCardProps {
  imageUrl: string
  serviceName: string
  onDelete?: () => void
  className?: string
}

export function ProjectThumbnailCard({
  imageUrl,
  serviceName,
  onDelete,
  className,
}: ProjectThumbnailCardProps) {
  return (
    <div
      role="group"
      aria-label={serviceName}
      className={cn(
        'border-line-neutral group w-[282px] overflow-hidden rounded-xl border',
        className,
      )}
    >
      <div
        className="relative h-[150px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="bg-fill-transparent-black absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <Button variant="error" size="m" className="w-[100px]" onClick={onDelete}>
            삭제하기
          </Button>
        </div>
      </div>
      <div className="bg-fill-normal flex flex-col justify-center gap-1 px-3 pt-3 pb-3.5">
        <span className="text-body-16sb text-label-normal">{serviceName}</span>
      </div>
    </div>
  )
}

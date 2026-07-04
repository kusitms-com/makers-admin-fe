import { Button } from '@components/common/Button'
import { ImageBoxThumbnail } from './ImageBoxThumbnail'
import { cn } from '@lib/utils'

interface PartImageCardProps {
  partLabel: string
  imageUrl?: string
  onDelete?: () => void
  onReplace?: () => void
  className?: string
}

export function PartImageCard({
  partLabel,
  imageUrl,
  onDelete,
  onReplace,
  className,
}: PartImageCardProps) {
  return (
    <div
      className={cn(
        'border-line-neutral flex h-[258px] w-[258px] flex-col rounded-xl border bg-white',
        className,
      )}
    >
      <div className="bg-fill-netural border-line-alternative flex items-center gap-2 border-b px-3.5 pt-3 pb-2.5">
        <span className="text-label-14b text-label-light">{partLabel}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3.5 py-3">
        <ImageBoxThumbnail imageUrl={imageUrl} className="h-full min-h-0 w-full flex-1" />
        <div className="flex gap-2">
          <Button
            variant={imageUrl ? 'error' : 'disable'}
            size="m"
            className="flex-1"
            onClick={onDelete}
          >
            삭제하기
          </Button>
          <Button variant="primary" size="m" className="flex-1" onClick={onReplace}>
            교체하기
          </Button>
        </div>
      </div>
    </div>
  )
}

import UploadIcon from '@/assets/icons/generated/UploadIcon'
import { cn } from '@lib/utils'

interface ImageBoxThumbnailProps {
  imageUrl?: string
  alt?: string
  uploadLabel?: string
  className?: string
}

export function ImageBoxThumbnail({
  imageUrl,
  alt = '',
  uploadLabel = '업로드',
  className,
}: ImageBoxThumbnailProps) {
  return (
    <div
      className={cn(
        'border-fill-alternative relative h-20 w-[150px] overflow-hidden rounded-md border',
        !imageUrl && 'bg-fill-normal flex items-center justify-center',
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-caption-12sb text-label-alternative flex items-center gap-1 pr-1.5">
          <UploadIcon className="size-[18px]" aria-hidden="true" />
          {uploadLabel}
        </span>
      )}
    </div>
  )
}

import UploadIcon from '@/assets/icons/generated/UploadIcon'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '@lib/tv'

const imageBoxThumbnailVariants = tv({
  base: 'border-fill-alternative relative overflow-hidden rounded-md border',
  variants: {
    size: {
      m: 'h-20 w-[150px]',
      l: 'h-[100px] w-[162px]',
    },
    type: {
      default: 'bg-fill-normal flex items-center justify-center',
      image: '',
    },
  },
})

type ImageBoxThumbnailVariants = VariantProps<typeof imageBoxThumbnailVariants>
export type ImageBoxThumbnailSize = NonNullable<ImageBoxThumbnailVariants['size']>

interface ImageBoxThumbnailProps {
  imageUrl?: string
  alt?: string
  uploadLabel?: string
  size?: ImageBoxThumbnailSize
  className?: string
}

export function ImageBoxThumbnail({
  imageUrl,
  alt = '',
  uploadLabel = '업로드',
  size = 'm',
  className,
}: ImageBoxThumbnailProps) {
  return (
    <div
      className={imageBoxThumbnailVariants({
        size,
        type: imageUrl ? 'image' : 'default',
        className,
      })}
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

import { SwitchCamera } from 'lucide-react'
import DeleteIcon from '@/assets/icons/generated/DeleteIcon'
import UploadIcon from '@/assets/icons/generated/UploadIcon'
import { cn } from '@lib/utils'

interface PartnerImageBoxProps {
  imageUrl?: string
  alt?: string
  uploadLabel?: string
  onChange?: () => void
  onDelete?: () => void
  className?: string
}

export function PartnerImageBox({
  imageUrl,
  alt = '',
  uploadLabel = '업로드',
  onChange,
  onDelete,
  className,
}: PartnerImageBoxProps) {
  return (
    <div
      className={cn(
        'border-line-neutral group relative flex h-[130px] w-[213px] items-center justify-center overflow-hidden rounded-lg border',
        imageUrl ? 'bg-fill-normal' : 'bg-fill-netural',
        className,
      )}
    >
      {imageUrl ? (
        <>
          <img src={imageUrl} alt={alt} className="h-[109px] w-[187px] object-cover" />
          <div className="bg-fill-transparent-black pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
            <button
              type="button"
              onClick={onChange}
              aria-label="이미지 변경"
              className="bg-fill-netural flex size-9 items-center justify-center rounded-full"
            >
              <SwitchCamera className="text-label-netural size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="이미지 삭제"
              className="bg-fill-destructive flex size-9 items-center justify-center rounded-full"
            >
              <DeleteIcon className="text-status-negative size-6" aria-hidden="true" />
            </button>
          </div>
        </>
      ) : (
        <span className="text-caption-12sb text-label-alternative flex items-center gap-1">
          <UploadIcon className="size-[18px]" aria-hidden="true" />
          {uploadLabel}
        </span>
      )}
    </div>
  )
}

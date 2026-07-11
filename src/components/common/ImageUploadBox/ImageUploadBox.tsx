import { Button } from '@components/common/Button'
import { useImageFileInput } from '@hooks/common/useImageFileInput'
import UploadIcon from '@/assets/icons/generated/UploadIcon'
import { cn } from '@lib/utils'

interface ImageUploadBoxProps {
  imageUrl?: string
  alt?: string
  onFileChange?: (file: File) => void
  onDelete?: () => void
  className?: string
}

export function ImageUploadBox({
  imageUrl,
  alt = '',
  onFileChange,
  onDelete,
  className,
}: ImageUploadBoxProps) {
  const { inputId, inputProps, openFilePicker } = useImageFileInput({ onFileChange })

  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      <input {...inputProps} />
      {imageUrl ? (
        <>
          <div className="border-brand-tertiary h-[318px] w-full overflow-hidden rounded-lg border border-dashed">
            <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
          </div>
          <div className="flex h-10 w-full items-start justify-center gap-3">
            <Button variant="error" size="m" className="w-[120px]" onClick={onDelete}>
              삭제하기
            </Button>
            <Button variant="primary" size="m" className="w-[120px]" onClick={openFilePicker}>
              교체하기
            </Button>
          </div>
        </>
      ) : (
        <label
          htmlFor={inputId}
          className="bg-fill-primary border-brand-tertiary text-brand-primary text-label-13sb flex h-[90px] w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed"
        >
          <UploadIcon className="size-[18px]" aria-hidden="true" />
          파일 선택
        </label>
      )}
    </div>
  )
}

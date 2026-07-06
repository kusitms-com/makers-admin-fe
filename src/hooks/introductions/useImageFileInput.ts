import { useId, useRef, type ChangeEvent } from 'react'

interface UseImageFileInputOptions {
  onFileChange?: (file: File) => void
}

export function useImageFileInput({ onFileChange }: UseImageFileInputOptions) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileChange?.(file)
    }
    event.target.value = ''
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  return {
    inputId,
    openFilePicker,
    inputProps: {
      ref: inputRef,
      id: inputId,
      type: 'file' as const,
      accept: 'image/*',
      onChange: handleChange,
      className: 'sr-only',
      tabIndex: -1,
    },
  }
}

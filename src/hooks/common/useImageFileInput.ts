import { useId, useRef, type ChangeEvent } from 'react'

interface UseImageFileInputOptions {
  id?: string
  onFileChange?: (file: File) => void
}

export function useImageFileInput({ id, onFileChange }: UseImageFileInputOptions) {
  const generatedId = useId()
  const inputId = id ?? generatedId
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

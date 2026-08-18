import { useEffect, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'

const companyProjectFormSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  bannerUrl: z.string().min(1),
})

export type CompanyProjectFormValues = z.infer<typeof companyProjectFormSchema>

// @hookform/resolvers 의존성 없이 zod safeParse 결과를 RHF Resolver 형식으로 직접 변환한다.
const companyProjectFormResolver: Resolver<CompanyProjectFormValues> = (values) => {
  const result = companyProjectFormSchema.safeParse(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }

  const errors = result.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (acc, issue) => {
      const path = issue.path.join('.')
      acc[path] ??= { type: issue.code, message: issue.message }
      return acc
    },
    {},
  )
  return { values: {}, errors }
}

function createDefaultValues(): CompanyProjectFormValues {
  return { name: '', content: '', bannerUrl: '' }
}

function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

type StringFieldKey = keyof CompanyProjectFormValues

export function useCompanyProjectForm() {
  const { watch, setValue, reset, handleSubmit, formState } = useForm<CompanyProjectFormValues>({
    mode: 'onChange',
    resolver: companyProjectFormResolver,
    defaultValues: createDefaultValues(),
  })

  const values = watch()

  const latestBannerUrlRef = useRef(values.bannerUrl)
  useEffect(() => {
    latestBannerUrlRef.current = values.bannerUrl
  }, [values.bannerUrl])
  useEffect(() => {
    return () => {
      revokeIfBlobUrl(latestBannerUrlRef.current)
    }
  }, [])

  function setStringField(key: StringFieldKey, value: string) {
    setValue(key, value, { shouldValidate: true })
  }

  function onBannerChange(file: File) {
    revokeIfBlobUrl(values.bannerUrl)
    setStringField('bannerUrl', URL.createObjectURL(file))
  }

  function onBannerDelete() {
    revokeIfBlobUrl(values.bannerUrl)
    setStringField('bannerUrl', '')
  }

  function resetForm() {
    revokeIfBlobUrl(values.bannerUrl)
    reset(createDefaultValues())
  }

  // 저장 성공 후에는 bannerUrl 소유권이 저장된 카드로 넘어가므로 revoke 없이 폼만 비운다.
  function resetAfterSave() {
    reset(createDefaultValues())
  }

  return {
    name: values.name,
    setName: (value: string) => {
      setStringField('name', value)
    },
    content: values.content,
    setContent: (value: string) => {
      setStringField('content', value)
    },
    bannerUrl: values.bannerUrl || undefined,
    onBannerChange,
    onBannerDelete,
    isValid: formState.isValid,
    handleSubmit,
    reset: resetForm,
    resetAfterSave,
  }
}

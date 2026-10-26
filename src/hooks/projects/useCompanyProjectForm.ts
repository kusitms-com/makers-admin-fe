import { useEffect, useRef, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'

const companyProjectFormSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  logoUrl: z.string().min(1),
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
  return { name: '', content: '', logoUrl: '', bannerUrl: '' }
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

  // logoUrl/bannerUrl은 미리보기용 blob URL일 뿐이라 업로드에 쓸 원본 File은 별도로 보관한다.
  const [logoFile, setLogoFile] = useState<File | undefined>()
  const [bannerFile, setBannerFile] = useState<File | undefined>()

  const latestLogoUrlRef = useRef(values.logoUrl)
  const latestBannerUrlRef = useRef(values.bannerUrl)
  useEffect(() => {
    latestLogoUrlRef.current = values.logoUrl
    latestBannerUrlRef.current = values.bannerUrl
  }, [values.logoUrl, values.bannerUrl])
  useEffect(() => {
    return () => {
      revokeIfBlobUrl(latestLogoUrlRef.current)
      revokeIfBlobUrl(latestBannerUrlRef.current)
    }
  }, [])

  function setStringField(key: StringFieldKey, value: string) {
    setValue(key, value, { shouldValidate: true })
  }

  function onLogoChange(file: File) {
    revokeIfBlobUrl(values.logoUrl)
    setStringField('logoUrl', URL.createObjectURL(file))
    setLogoFile(file)
  }

  function onLogoDelete() {
    revokeIfBlobUrl(values.logoUrl)
    setStringField('logoUrl', '')
    setLogoFile(undefined)
  }

  function onBannerChange(file: File) {
    revokeIfBlobUrl(values.bannerUrl)
    setStringField('bannerUrl', URL.createObjectURL(file))
    setBannerFile(file)
  }

  function onBannerDelete() {
    revokeIfBlobUrl(values.bannerUrl)
    setStringField('bannerUrl', '')
    setBannerFile(undefined)
  }

  function resetForm() {
    revokeIfBlobUrl(values.logoUrl)
    revokeIfBlobUrl(values.bannerUrl)
    setLogoFile(undefined)
    setBannerFile(undefined)
    reset(createDefaultValues())
  }

  // 저장 성공 후에는 bannerUrl 소유권이 저장된 카드로 넘어가므로 revoke 없이 폼만 비운다.
  // 로고는 카드에 표시되지 않으므로 그대로 revoke한다.
  function resetAfterSave() {
    revokeIfBlobUrl(values.logoUrl)
    setLogoFile(undefined)
    setBannerFile(undefined)
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
    logoUrl: values.logoUrl || undefined,
    logoFile,
    onLogoChange,
    onLogoDelete,
    bannerUrl: values.bannerUrl || undefined,
    bannerFile,
    onBannerChange,
    onBannerDelete,
    isValid: formState.isValid,
    handleSubmit,
    reset: resetForm,
    resetAfterSave,
  }
}

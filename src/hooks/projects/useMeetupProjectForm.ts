import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import type { MeetupTeamMember } from '@components/projects/MeetupProjectModal'

const DATE_FORMAT = 'YYYY-MM-DD'

const meetupProjectFormSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  oneLineIntro: z.string().min(1),
  intro: z.string().min(1),
  teamName: z.string().min(1),
  members: z.array(z.object({ id: z.string(), part: z.string(), name: z.string().min(1) })).min(1),
  logoUrl: z.string().min(1),
  posterUrl: z.string().min(1),
  githubUrl: z.string(),
  behanceUrl: z.string(),
  appUrl: z.string(),
  instagramUrl: z.string(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

export type MeetupProjectFormValues = z.infer<typeof meetupProjectFormSchema>

interface FieldErrorEntry {
  type: string
  message: string
}

// path 세그먼트를 따라 중첩 object/array를 만들어 RHF의 FieldErrors 구조에 맞춘다.
function setNestedError(
  target: Record<string, unknown>,
  path: PropertyKey[],
  error: FieldErrorEntry,
) {
  let cursor: Record<string, unknown> = target
  path.forEach((segment, index) => {
    const key = String(segment)
    if (index === path.length - 1) {
      cursor[key] ??= error
      return
    }
    const nextSegment = path[index + 1]
    cursor[key] ??= typeof nextSegment === 'number' ? [] : {}
    cursor = cursor[key] as Record<string, unknown>
  })
}

// @hookform/resolvers 의존성 없이 zod safeParse 결과를 RHF Resolver 형식으로 직접 변환한다.
export const meetupProjectFormResolver: Resolver<MeetupProjectFormValues> = (values) => {
  const result = meetupProjectFormSchema.safeParse(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }

  const errors: Record<string, unknown> = {}
  result.error.issues.forEach((issue) => {
    setNestedError(errors, issue.path, { type: issue.code, message: issue.message })
  })
  return { values: {}, errors }
}

function createDefaultValues(): MeetupProjectFormValues {
  const today = dayjs().format(DATE_FORMAT)
  return {
    type: 'WEB',
    name: '',
    oneLineIntro: '',
    intro: '',
    teamName: '',
    members: [],
    logoUrl: '',
    posterUrl: '',
    githubUrl: '',
    behanceUrl: '',
    appUrl: '',
    instagramUrl: '',
    startDate: today,
    endDate: today,
  }
}

function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

type StringFieldKey = Exclude<keyof MeetupProjectFormValues, 'members'>

export function useMeetupProjectForm() {
  const { watch, setValue, reset, handleSubmit, formState } = useForm<MeetupProjectFormValues>({
    mode: 'onChange',
    resolver: meetupProjectFormResolver,
    defaultValues: createDefaultValues(),
  })

  const values = watch()

  // posterUrl/logoUrl은 미리보기용 blob URL일 뿐이라 업로드에 쓸 원본 File은 별도로 보관한다.
  const [posterFile, setPosterFile] = useState<File | undefined>()
  const [logoFile, setLogoFile] = useState<File | undefined>()

  const latestPosterUrlRef = useRef(values.posterUrl)
  const latestLogoUrlRef = useRef(values.logoUrl)
  useEffect(() => {
    latestPosterUrlRef.current = values.posterUrl
    latestLogoUrlRef.current = values.logoUrl
  }, [values.posterUrl, values.logoUrl])
  useEffect(() => {
    return () => {
      revokeIfBlobUrl(latestPosterUrlRef.current)
      revokeIfBlobUrl(latestLogoUrlRef.current)
    }
  }, [])

  function setStringField(key: StringFieldKey, value: string) {
    setValue(key, value, { shouldValidate: true })
  }

  function onPosterChange(file: File) {
    revokeIfBlobUrl(values.posterUrl)
    setStringField('posterUrl', URL.createObjectURL(file))
    setPosterFile(file)
  }

  function onPosterDelete() {
    revokeIfBlobUrl(values.posterUrl)
    setStringField('posterUrl', '')
    setPosterFile(undefined)
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

  function onMemberAdd(member: { part: string; name: string }) {
    const next: MeetupTeamMember[] = [...values.members, { id: crypto.randomUUID(), ...member }]
    setValue('members', next, { shouldValidate: true })
  }

  function onMemberPartChange(id: string, part: string) {
    setValue(
      'members',
      values.members.map((member) => (member.id === id ? { ...member, part } : member)),
      { shouldValidate: true },
    )
  }

  function onMemberRemove(id: string) {
    setValue(
      'members',
      values.members.filter((member) => member.id !== id),
      { shouldValidate: true },
    )
  }

  function resetForm() {
    revokeIfBlobUrl(values.posterUrl)
    revokeIfBlobUrl(values.logoUrl)
    setPosterFile(undefined)
    setLogoFile(undefined)
    reset(createDefaultValues())
  }

  // 저장 성공 후 카드 목록은 서버 응답의 poster_url로 다시 렌더링되므로
  // 폼이 만든 posterUrl/logoUrl blob은 둘 다 그대로 revoke한다.
  function resetAfterSave() {
    revokeIfBlobUrl(values.posterUrl)
    revokeIfBlobUrl(values.logoUrl)
    setPosterFile(undefined)
    setLogoFile(undefined)
    reset(createDefaultValues())
  }

  return {
    type: values.type,
    setType: (value: string) => {
      setStringField('type', value)
    },
    name: values.name,
    setName: (value: string) => {
      setStringField('name', value)
    },
    oneLineIntro: values.oneLineIntro,
    setOneLineIntro: (value: string) => {
      setStringField('oneLineIntro', value)
    },
    intro: values.intro,
    setIntro: (value: string) => {
      setStringField('intro', value)
    },
    teamName: values.teamName,
    setTeamName: (value: string) => {
      setStringField('teamName', value)
    },
    members: values.members,
    onMemberAdd,
    onMemberPartChange,
    onMemberRemove,
    logoUrl: values.logoUrl || undefined,
    logoFile,
    onLogoChange,
    onLogoDelete,
    posterUrl: values.posterUrl || undefined,
    posterFile,
    onPosterChange,
    onPosterDelete,
    githubUrl: values.githubUrl,
    setGithubUrl: (value: string) => {
      setStringField('githubUrl', value)
    },
    behanceUrl: values.behanceUrl,
    setBehanceUrl: (value: string) => {
      setStringField('behanceUrl', value)
    },
    appUrl: values.appUrl,
    setAppUrl: (value: string) => {
      setStringField('appUrl', value)
    },
    instagramUrl: values.instagramUrl,
    setInstagramUrl: (value: string) => {
      setStringField('instagramUrl', value)
    },
    startDate: dayjs(values.startDate).toDate(),
    startDateIso: values.startDate,
    setStartDate: (date: Date) => {
      setStringField('startDate', dayjs(date).format(DATE_FORMAT))
    },
    endDate: dayjs(values.endDate).toDate(),
    endDateIso: values.endDate,
    setEndDate: (date: Date) => {
      setStringField('endDate', dayjs(date).format(DATE_FORMAT))
    },
    isValid: formState.isValid,
    handleSubmit,
    reset: resetForm,
    resetAfterSave,
  }
}

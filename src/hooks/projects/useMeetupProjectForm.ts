import { useEffect, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import type { MeetupTeamMember } from '@components/projects/MeetupProjectModal'

const meetupProjectFormSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  oneLineIntro: z.string().min(1),
  intro: z.string().min(1),
  members: z.array(z.object({ id: z.string(), part: z.string(), name: z.string().min(1) })).min(1),
  posterUrl: z.string().min(1),
  githubUrl: z.string(),
  behanceUrl: z.string(),
  appUrl: z.string(),
})

export type MeetupProjectFormValues = z.infer<typeof meetupProjectFormSchema>

// @hookform/resolvers 의존성 없이 zod safeParse 결과를 RHF Resolver 형식으로 직접 변환한다.
const meetupProjectFormResolver: Resolver<MeetupProjectFormValues> = (values) => {
  const result = meetupProjectFormSchema.safeParse(values)
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

function createDefaultValues(): MeetupProjectFormValues {
  return {
    type: 'Web',
    name: '',
    oneLineIntro: '',
    intro: '',
    members: [],
    posterUrl: '',
    githubUrl: '',
    behanceUrl: '',
    appUrl: '',
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

  const latestPosterUrlRef = useRef(values.posterUrl)
  useEffect(() => {
    latestPosterUrlRef.current = values.posterUrl
  }, [values.posterUrl])
  useEffect(() => {
    return () => {
      revokeIfBlobUrl(latestPosterUrlRef.current)
    }
  }, [])

  function setStringField(key: StringFieldKey, value: string) {
    setValue(key, value, { shouldValidate: true })
  }

  function onPosterChange(file: File) {
    revokeIfBlobUrl(values.posterUrl)
    setStringField('posterUrl', URL.createObjectURL(file))
  }

  function onPosterDelete() {
    revokeIfBlobUrl(values.posterUrl)
    setStringField('posterUrl', '')
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
    members: values.members,
    onMemberAdd,
    onMemberPartChange,
    onMemberRemove,
    posterUrl: values.posterUrl || undefined,
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
    isValid: formState.isValid,
    handleSubmit,
    reset: resetForm,
  }
}

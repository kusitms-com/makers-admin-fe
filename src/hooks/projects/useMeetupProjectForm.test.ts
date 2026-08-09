import { act, renderHook } from '@testing-library/react'
import type { ResolverOptions } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import {
  meetupProjectFormResolver,
  useMeetupProjectForm,
  type MeetupProjectFormValues,
} from './useMeetupProjectForm'

const RESOLVER_OPTIONS = {
  fields: {},
  shouldUseNativeValidation: false,
} as ResolverOptions<MeetupProjectFormValues>

function createFile() {
  return new File(['poster'], 'poster.png', { type: 'image/png' })
}

describe('meetupProjectFormResolver', () => {
  it('배열 하위 필드 오류를 RHF가 기대하는 중첩 구조로 반환한다', async () => {
    const result = await meetupProjectFormResolver(
      {
        type: 'Web',
        name: '이름',
        oneLineIntro: '한 줄 소개',
        intro: '소개',
        members: [{ id: '1', part: 'planner', name: '' }],
        posterUrl: 'blob:poster',
        githubUrl: '',
        behanceUrl: '',
        appUrl: '',
      },
      undefined,
      RESOLVER_OPTIONS,
    )

    const errors = result.errors as Record<string, { name?: { message?: string } }[] | undefined>
    expect(errors.members?.[0]?.name?.message).toBeTruthy()
  })
})

describe('useMeetupProjectForm', () => {
  it('resetAfterSave는 현재 posterUrl을 revoke하지 않는다', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    const { result } = renderHook(() => useMeetupProjectForm())

    act(() => {
      result.current.onPosterChange(createFile())
    })
    const savedPosterUrl = result.current.posterUrl
    revokeSpy.mockClear()

    act(() => {
      result.current.resetAfterSave()
    })

    expect(revokeSpy).not.toHaveBeenCalledWith(savedPosterUrl)
  })

  it('reset(취소/재오픈)은 현재 posterUrl을 revoke한다', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')
    const { result } = renderHook(() => useMeetupProjectForm())

    act(() => {
      result.current.onPosterChange(createFile())
    })
    const draftPosterUrl = result.current.posterUrl
    revokeSpy.mockClear()

    act(() => {
      result.current.reset()
    })

    expect(revokeSpy).toHaveBeenCalledWith(draftPosterUrl)
  })
})

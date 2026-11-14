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
        type: 'WEB',
        name: '이름',
        oneLineIntro: '한 줄 소개',
        intro: '소개',
        teamName: '팀명',
        members: [{ id: '1', part: 'planner', name: '' }],
        logoUrl: 'blob:logo',
        posterUrl: 'blob:poster',
        githubUrl: '',
        behanceUrl: '',
        appUrl: '',
        instagramUrl: '',
        startDate: '2026-01-01',
        endDate: '2026-01-02',
      },
      undefined,
      RESOLVER_OPTIONS,
    )

    const errors = result.errors as Record<string, { name?: { message?: string } }[] | undefined>
    expect(errors.members?.[0]?.name?.message).toBeTruthy()
  })
})

describe('meetupProjectFormResolver 링크 검증', () => {
  it('링크 형식이 틀리면 안내 문구로 막고, 비워 두면 통과한다', async () => {
    const base = {
      type: 'WEB',
      name: '이름',
      oneLineIntro: '한 줄 소개',
      intro: '소개',
      teamName: '팀명',
      members: [{ id: '1', part: 'planner', name: '홍길동' }],
      logoUrl: 'blob:logo',
      posterUrl: 'blob:poster',
      githubUrl: 'abc',
      behanceUrl: '',
      appUrl: 'https://kusitms.com',
      instagramUrl: '',
      startDate: '2026-01-01',
      endDate: '2026-01-02',
    }

    const invalid = await meetupProjectFormResolver(base, undefined, RESOLVER_OPTIONS)
    const valid = await meetupProjectFormResolver(
      { ...base, githubUrl: '' },
      undefined,
      RESOLVER_OPTIONS,
    )

    const errors = invalid.errors as Record<string, { message?: string } | undefined>
    expect(errors.githubUrl?.message).toBe('링크 형식을 확인해주세요.')
    expect(errors.appUrl).toBeUndefined()
    expect(valid.errors).toEqual({})
  })
})

describe('useMeetupProjectForm', () => {
  it('resetAfterSave는 현재 posterUrl도 revoke한다', () => {
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

    expect(revokeSpy).toHaveBeenCalledWith(savedPosterUrl)
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

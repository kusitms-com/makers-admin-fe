import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// text-body-16sb 같은 typography 토큰이 text-* 색상 유틸리티와 접두사가 겹쳐
// tailwind-merge가 충돌로 오인하는 문제를 막기 위해 font-size로 명시한다.
// tv()(src/lib/tv.ts)도 같은 목록을 재사용한다.
export const TYPOGRAPHY_TEXT_TOKENS = [
  'pc-64b',
  'pc-64sb',
  'pc-48b',
  'pc-48sb',
  'pc-40b',
  'pc-40sb',
  'pc-36b',
  'pc-36sb',
  'pc-36m',
  'pc-32b',
  'pc-32sb',
  'pc-32m',
  'pc-30b',
  'pc-30m',
  'mobile-40b',
  'mobile-40sb',
  'mobile-32b',
  'mobile-32sb',
  'mobile-28b',
  'mobile-28sb',
  'mobile-24b',
  'mobile-24sb',
  'headline-24b',
  'headline-24sb',
  'headline-24m',
  'headline-24r',
  'headline-20b',
  'headline-20sb',
  'headline-20m',
  'headline-20r',
  'body-18b',
  'body-18sb',
  'body-18m',
  'body-18r',
  'body-16b',
  'body-16sb',
  'body-16m',
  'body-16r',
  'label-14b',
  'label-14sb',
  'label-14m',
  'label-14r',
  'label-13b',
  'label-13sb',
  'label-13m',
  'label-13r',
  'caption-12sb',
  'caption-12r',
  'caption-11sb',
  'caption-11r',
] as const

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: TYPOGRAPHY_TEXT_TOKENS,
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

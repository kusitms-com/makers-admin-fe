import { createTV } from 'tailwind-variants'
import { TYPOGRAPHY_TEXT_TOKENS } from './utils'

// cn()(utils.ts)과 동일한 typography 토큰 merge 수정을 재사용한다.
export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: {
        text: TYPOGRAPHY_TEXT_TOKENS,
      },
    },
  },
})

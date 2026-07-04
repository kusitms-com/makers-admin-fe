import { createTV } from 'tailwind-variants'
import { TYPOGRAPHY_TEXT_TOKENS } from './utils'

// Reuses the same typography-token merge fix as cn() (see utils.ts) so variant-driven
// components resolve text-*/color conflicts the same way as the rest of the app.
export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: {
        text: TYPOGRAPHY_TEXT_TOKENS,
      },
    },
  },
})

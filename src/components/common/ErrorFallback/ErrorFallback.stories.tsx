import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorFallback } from './ErrorFallback'

const meta = {
  title: 'common/ErrorFallback',
  component: ErrorFallback,
  parameters: { layout: 'fullscreen' },
  args: {
    title: '문제가 발생했습니다',
    description: '잠시 후 다시 시도해주세요.',
  },
} satisfies Meta<typeof ErrorFallback>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TitleOnly: Story = {
  args: { description: undefined },
}

export const NotFound: Story = {
  args: {
    title: '페이지를 찾을 수 없습니다',
    description: '주소를 다시 확인해주세요.',
  },
}

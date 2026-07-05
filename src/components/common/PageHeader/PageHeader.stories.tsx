import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHeader } from './PageHeader'

const meta = {
  title: 'common/PageHeader',
  component: PageHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    title: '학회 소개',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    actionLabel: '추가하기',
    onAction: () => {
      console.info('action clicked')
    },
  },
}

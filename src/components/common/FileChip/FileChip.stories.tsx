import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileChip } from './FileChip'

const meta = {
  title: 'common/FileChip',
  component: FileChip,
  parameters: { layout: 'centered' },
  args: {
    fileName: '수료증_이현진.pdf',
  },
} satisfies Meta<typeof FileChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongFileName: Story = {
  args: {
    fileName: '2026년도_상반기_프로젝트_최종_수료증_및_평가서.pdf',
    className: 'w-[200px]',
  },
}

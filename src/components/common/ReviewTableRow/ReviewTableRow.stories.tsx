import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewTableRow } from './ReviewTableRow'

const meta = {
  title: 'common/ReviewTableRow',
  component: ReviewTableRow,
  parameters: { layout: 'centered' },
  args: {
    type: 'memberReview',
    name: '이현진',
    generation: 33,
    part: 'DE',
    title: '큐시즘 34기 서류 합격 후기',
    onDelete: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[922px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewTableRow>

export default meta
type Story = StoryObj<typeof meta>

export const MemberReview: Story = {
  args: {
    type: 'memberReview',
    fileName: 'IMG_2346.PNG',
    phone: '010-1234-5678',
  },
}

export const BlogReview: Story = {
  args: {
    type: 'blogReview',
    category: '서류 후기',
  },
}

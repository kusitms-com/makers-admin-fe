import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewTable } from './ReviewTable'

const ROWS = [
  {
    id: '1',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '2',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '3',
    name: '이현진',
    generation: 33,
    part: 'DE',
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '4',
    name: '이현진',
    generation: 33,
    part: 'FE',
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '5',
    name: '이현진',
    generation: 33,
    part: 'BE',
    category: '서류 후기',
    title: '큐시즘 34기 서류 합격 후기',
  },
] as const

function ControlledReviewTable() {
  const [page, setPage] = useState(1)
  return (
    <ReviewTable
      rows={[...ROWS]}
      page={page}
      totalPages={4}
      onPageChange={setPage}
      totalLabel="총 6개의 후기"
    />
  )
}

const meta = {
  title: 'common/ReviewTable',
  component: ReviewTable,
  parameters: { layout: 'centered' },
  args: {
    rows: [...ROWS],
    page: 1,
    totalPages: 4,
    onPageChange: () => {},
    totalLabel: '총 6개의 후기',
  },
  decorators: [
    (Story) => (
      <div className="w-[923px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlledReviewTable />,
}

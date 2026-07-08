import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewTable } from './ReviewTable'

const BLOG_REVIEW_ROWS = [
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

const MEMBER_REVIEW_ROWS = [
  {
    id: '1',
    name: '이현진',
    generation: 33,
    part: 'DE',
    phone: '010-1234-5678',
    fileName: 'IMG_2346.PNG',
    title: '큐시즘 34기 서류 합격 후기',
  },
  {
    id: '2',
    name: '이현진',
    generation: 33,
    part: 'PLAN',
    phone: '010-1234-5678',
    title: '큐시즘 34기 서류 합격 후기',
  },
] as const

function ControlledReviewTable({
  type,
  rows,
  totalLabel,
}: {
  type: 'blogReview' | 'memberReview'
  rows: typeof BLOG_REVIEW_ROWS | typeof MEMBER_REVIEW_ROWS
  totalLabel: string
}) {
  const [page, setPage] = useState(1)
  return (
    <ReviewTable
      type={type}
      rows={[...rows]}
      page={page}
      totalPages={4}
      onPageChange={setPage}
      totalLabel={totalLabel}
    />
  )
}

const meta = {
  title: 'common/ReviewTable',
  component: ReviewTable,
  parameters: { layout: 'centered' },
  args: {
    type: 'blogReview',
    rows: [...BLOG_REVIEW_ROWS],
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

export const BlogReview: Story = {
  render: () => (
    <ControlledReviewTable type="blogReview" rows={BLOG_REVIEW_ROWS} totalLabel="총 6개의 후기" />
  ),
}

export const MemberReview: Story = {
  render: () => (
    <ControlledReviewTable
      type="memberReview"
      rows={MEMBER_REVIEW_ROWS}
      totalLabel="총 2개의 후기"
    />
  ),
}

export const Empty: Story = {
  args: {
    rows: [],
    totalLabel: '총 0개의 후기',
  },
}

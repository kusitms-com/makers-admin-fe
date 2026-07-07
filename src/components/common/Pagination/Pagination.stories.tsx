import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

function ControlledPagination({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(1)
  return <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
}

const meta = {
  title: 'common/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  args: {
    page: 1,
    totalPages: 2,
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlledPagination totalPages={2} />,
}

export const ManyPages: Story = {
  render: () => <ControlledPagination totalPages={6} />,
}

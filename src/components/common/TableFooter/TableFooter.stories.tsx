import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TableFooter } from './TableFooter'

function ControlledTableFooter({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(1)
  return (
    <TableFooter
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      totalLabel="총 6개의 후기"
      className="w-[600px]"
    />
  )
}

const meta = {
  title: 'common/TableFooter',
  component: TableFooter,
  parameters: { layout: 'centered' },
  args: {
    page: 1,
    totalPages: 4,
    onPageChange: () => {},
    totalLabel: '총 6개의 후기',
  },
} satisfies Meta<typeof TableFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlledTableFooter totalPages={4} />,
}

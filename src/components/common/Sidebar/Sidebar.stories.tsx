import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar, type SidebarNavKey } from './Sidebar'

function ControlledSidebar() {
  const [activeKey, setActiveKey] = useState<SidebarNavKey>('introduction')
  return (
    <div className="h-screen">
      <Sidebar
        activeKey={activeKey}
        onNavigate={setActiveKey}
        onLogout={() => {
          console.info('logout clicked')
        }}
      />
    </div>
  )
}

const meta = {
  title: 'common/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  args: {
    activeKey: 'introduction',
    onNavigate: () => {},
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlledSidebar />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '@components/common/Button'
import { Modal } from './Modal'

const meta = {
  title: 'common/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  args: {
    open: true,
    onOpenChange: () => {},
    children: (
      <>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p className="text-label-14m text-label-normal">모달 본문 영역입니다.</p>
        </Modal.Body>
      </>
    ),
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

function ModalDemo() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button
        variant="strong"
        size="m"
        onClick={() => {
          setOpen(true)
        }}
      >
        모달 열기
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Title>기업 프로젝트 등록</Modal.Title>
        <Modal.Body>
          <p className="text-label-14m text-label-normal">모달 본문 영역입니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="error"
            size="l"
            className="w-[140px]"
            onClick={() => {
              setOpen(false)
            }}
          >
            취소하기
          </Button>
          <Button variant="disable" size="l" className="w-[140px]">
            저장하기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}

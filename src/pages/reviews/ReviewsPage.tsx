import { useState } from 'react'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { ReviewTable } from '@components/common/ReviewTable'
import { PART_LABELS, type PartBadgeType } from '@components/common/PartBadge'
import type { SelectFieldOption } from '@components/common/SelectField'
import { ReviewModal } from '@components/reviews/ReviewModal'
import {
  CATEGORY_LABEL,
  CURRENT_GENERATION,
  INITIAL_ROWS,
  type ReviewRow,
} from './ReviewsPage.mock'

const PART_OPTIONS: SelectFieldOption[] = Object.entries(PART_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const PAGE_SIZE = 7

function isPartBadgeType(value: string): value is PartBadgeType {
  return Object.prototype.hasOwnProperty.call(PART_LABELS, value)
}

export function ReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>(INITIAL_ROWS)
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [part, setPart] = useState<PartBadgeType>('PLAN')
  const [name, setName] = useState('')
  const [review, setReview] = useState('')

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetForm() {
    setPart('PLAN')
    setName('')
    setReview('')
  }

  function handleDeleteRow(id: string) {
    const nextRows = rows.filter((row) => row.id !== id)

    setRows(nextRows)
    setPage((currentPage) =>
      Math.min(currentPage, Math.max(1, Math.ceil(nextRows.length / PAGE_SIZE))),
    )
  }

  function handlePartChange(value: string) {
    if (isPartBadgeType(value)) {
      setPart(value)
    }
  }

  function handleSave() {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        generation: CURRENT_GENERATION,
        part,
        category: CATEGORY_LABEL,
        title: review,
      },
    ])
    resetForm()
    setModalOpen(false)
  }

  function handleCancel() {
    resetForm()
    setModalOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="활동 후기 관리" />

      <div className="flex flex-col gap-8 px-8 pt-7 pb-15">
        <section className="flex flex-col items-start gap-3">
          <h2 className="text-body-18sb text-label-normal">후기 관리하기</h2>
          <Button
            variant="outlined"
            size="l"
            onClick={() => {
              setModalOpen(true)
            }}
          >
            추가하기
          </Button>
        </section>

        <section className="flex flex-col items-start gap-3">
          <h2 className="text-body-18sb text-label-normal">리스트</h2>
          <ReviewTable
            type="blogReview"
            rows={pagedRows}
            onDeleteRow={handleDeleteRow}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalLabel={`총 ${String(rows.length)}개의 후기`}
          />
        </section>
      </div>

      <ReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        cardinal={CURRENT_GENERATION}
        team={part}
        teamOptions={PART_OPTIONS}
        onTeamChange={handlePartChange}
        name={name}
        onNameChange={setName}
        review={review}
        onReviewChange={setReview}
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={!name || !review}
      />
    </div>
  )
}

export default ReviewsPage

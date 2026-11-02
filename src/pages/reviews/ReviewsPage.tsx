import { useState } from 'react'
import type { ReviewListItem } from '@api/reviews'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { ReviewTable } from '@components/common/ReviewTable'
import { PART_LABELS, type PartBadgeType } from '@components/common/PartBadge'
import type { SelectFieldOption } from '@components/common/SelectField'
import { ReviewModal } from '@components/reviews/ReviewModal'
import { useReviewsQuery } from '@hooks/reviews/useReviews'
import { CURRENT_GENERATION, type ReviewRow } from './ReviewsPage.mock'

const PART_OPTIONS: SelectFieldOption[] = Object.entries(PART_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const PAGE_SIZE = 7

function isPartBadgeType(value: string): value is PartBadgeType {
  return Object.prototype.hasOwnProperty.call(PART_LABELS, value)
}

// 서버는 소속팀을 PLAN/DE/FE/BE enum이 아니라 "기획팀"/"디자인팀"/"개발팀" 3종 자유 텍스트로 내려준다.
// FE/BE를 구분하지 않으므로 색상은 프론트엔드(FE) 뱃지 색으로 통일한다.
const TEAM_BADGE_PART: Record<string, PartBadgeType> = {
  기획팀: 'PLAN',
  디자인팀: 'DE',
  개발팀: 'FE',
}

function toReviewRow(item: ReviewListItem): ReviewRow {
  return {
    id: String(item.review_id),
    name: item.name,
    generation: item.cardinal,
    team: item.team,
    part: TEAM_BADGE_PART[item.team],
    title: item.review,
  }
}

export function ReviewsPage() {
  const reviewsQuery = useReviewsQuery()

  const [localRows, setLocalRows] = useState<ReviewRow[]>()
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [part, setPart] = useState<PartBadgeType>('PLAN')
  const [name, setName] = useState('')
  const [review, setReview] = useState('')

  const rows = localRows ?? reviewsQuery.data?.review_list.map(toReviewRow) ?? []

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetForm() {
    setPart('PLAN')
    setName('')
    setReview('')
  }

  function handleDeleteRow(id: string) {
    const nextRows = rows.filter((row) => row.id !== id)

    setLocalRows(nextRows)
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
    setLocalRows([
      ...rows,
      {
        id: crypto.randomUUID(),
        name,
        generation: CURRENT_GENERATION,
        team: PART_LABELS[part],
        part: part === 'BE' ? 'FE' : part,
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

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="활동 후기 관리" />
        <div className="text-label-14m text-label-alternative flex flex-1 items-center justify-center">
          불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (reviewsQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="활동 후기 관리" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-label-14m text-label-alternative">후기 목록을 불러오지 못했습니다.</p>
          <Button
            variant="primary"
            size="s"
            onClick={() => {
              void reviewsQuery.refetch()
            }}
          >
            다시 시도
          </Button>
        </div>
      </div>
    )
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
            type="review"
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

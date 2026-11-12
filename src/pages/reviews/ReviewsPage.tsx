import { useState } from 'react'
import type { ReviewListItem, ReviewTeam } from '@api/reviews/types'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { ReviewTable } from '@components/common/ReviewTable'
import { type PartBadgeType } from '@components/common/PartBadge'
import type { SelectFieldOption } from '@components/common/SelectField'
import { ReviewModal } from '@components/reviews/ReviewModal'
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useReviewsQuery,
  useUpdateReviewMutation,
} from '@api/reviews/queries'
import { useCurrentCardinalQuery } from '@api/auth/queries'
import { useConfirm } from '@hooks/common/useConfirm'
import { useCardinalSelection } from '@hooks/common/useCardinalSelection'
import { useToast } from '@hooks/common/useToast'
import { TOAST_MESSAGES } from '@/constants/toastMessages'
import { LoadingState } from '@components/common/LoadingState'

interface ReviewRow {
  id: string
  name: string
  generation: number
  team: string
  part?: PartBadgeType
  title: string
}

// ReviewRequest.team enum(Swagger) 중 관리자 폼이 다루는 기획/디자인/개발 3파트만 노출한다.
const TEAM_LABELS: Record<ReviewTeam, string> = {
  PLANNER: '기획팀',
  DESIGNER: '디자인팀',
  DEVELOPER: '개발팀',
}

const TEAM_OPTIONS: SelectFieldOption[] = Object.entries(TEAM_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const PAGE_SIZE = 7

function isReviewTeam(value: string): value is ReviewTeam {
  return Object.prototype.hasOwnProperty.call(TEAM_LABELS, value)
}

function labelToTeam(label: string): ReviewTeam | undefined {
  const value = TEAM_OPTIONS.find((option) => option.label === label)?.value
  return value && isReviewTeam(value) ? value : undefined
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
    // 기획/디자인/개발 외 팀으로 저장된 데이터는 서버가 team을 null로 내려준다.
    team: item.team ?? '-',
    part: item.team ? TEAM_BADGE_PART[item.team] : undefined,
    title: item.review,
  }
}

export function ReviewsPage() {
  const reviewsQuery = useReviewsQuery()
  const currentCardinalQuery = useCurrentCardinalQuery()
  const createReviewMutation = useCreateReviewMutation()
  const updateReviewMutation = useUpdateReviewMutation()
  const deleteReviewMutation = useDeleteReviewMutation()
  const addToast = useToast()
  const confirm = useConfirm()

  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [team, setTeam] = useState<ReviewTeam>('PLANNER')
  const [name, setName] = useState('')
  const [review, setReview] = useState('')

  const [editingRow, setEditingRow] = useState<ReviewRow | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTeam, setEditTeam] = useState<ReviewTeam | undefined>(undefined)
  const [editName, setEditName] = useState('')
  const [editReview, setEditReview] = useState('')

  const rows = reviewsQuery.data?.review_list.map(toReviewRow) ?? []
  const cardinalSelection = useCardinalSelection(rows.map((row) => row.generation))

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetForm() {
    setTeam('PLANNER')
    setName('')
    setReview('')
  }

  async function handleDeleteRow(id: string) {
    if (!(await confirm({ title: '이 후기를 삭제하시겠습니까?', confirmLabel: '삭제하기' }))) {
      return
    }

    deleteReviewMutation.mutate(Number(id), {
      onSuccess: () => {
        addToast({ type: 'complete', message: TOAST_MESSAGES.deleted })
        setPage((currentPage) =>
          Math.min(currentPage, Math.max(1, Math.ceil((rows.length - 1) / PAGE_SIZE))),
        )
      },
      onError: () => {
        addToast({ type: 'error', message: TOAST_MESSAGES.deleteFailed })
      },
    })
  }

  function handleTeamChange(value: string) {
    if (isReviewTeam(value)) {
      setTeam(value)
    }
  }

  function handleEditTeamChange(value: string) {
    if (isReviewTeam(value)) {
      setEditTeam(value)
    }
  }

  function openDetail(row: ReviewRow) {
    setEditingRow(row)
    setEditName(row.name)
    setEditReview(row.title)
    setEditTeam(labelToTeam(row.team))
    setIsEditing(false)
  }

  function closeDetail() {
    setEditingRow(null)
    setIsEditing(false)
  }

  function handleUpdate() {
    if (!editingRow || !editTeam) return

    updateReviewMutation.mutate(
      {
        reviewId: Number(editingRow.id),
        name: editName,
        cardinal: editingRow.generation,
        team: editTeam,
        review: editReview,
      },
      {
        onSuccess: () => {
          addToast({ type: 'complete', message: TOAST_MESSAGES.updated })
          closeDetail()
        },
        onError: () => {
          addToast({ type: 'error', message: TOAST_MESSAGES.updateFailed })
        },
      },
    )
  }

  function handleSave() {
    const currentCardinal = cardinalSelection.cardinal
    if (currentCardinal === undefined) return

    createReviewMutation.mutate(
      { name, cardinal: currentCardinal, team, review },
      {
        onSuccess: () => {
          addToast({ type: 'complete', message: TOAST_MESSAGES.created })
          resetForm()
          setModalOpen(false)
        },
        onError: () => {
          addToast({ type: 'error', message: TOAST_MESSAGES.createFailed })
        },
      },
    )
  }

  function handleCancel() {
    resetForm()
    setModalOpen(false)
  }

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="활동 후기 관리" />
        <LoadingState className="flex-1" />
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
            disabled={currentCardinalQuery.data === undefined}
            onClick={() => {
              cardinalSelection.reset()
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
            onDeleteRow={(id) => {
              void handleDeleteRow(id)
            }}
            onTitleClick={(id) => {
              const row = rows.find((item) => item.id === id)
              if (row) openDetail(row)
            }}
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
        cardinal={cardinalSelection.cardinal ?? 0}
        cardinalOptions={cardinalSelection.options}
        onCardinalChange={cardinalSelection.setCardinal}
        team={team}
        teamOptions={TEAM_OPTIONS}
        onTeamChange={handleTeamChange}
        name={name}
        onNameChange={setName}
        review={review}
        onReviewChange={setReview}
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={
          !name ||
          !review ||
          createReviewMutation.isPending ||
          currentCardinalQuery.data === undefined
        }
      />

      {editingRow && (
        <ReviewModal
          open
          onOpenChange={(open) => {
            if (!open) closeDetail()
          }}
          readOnly={!isEditing}
          onEdit={() => {
            setIsEditing(true)
          }}
          cardinal={editingRow.generation}
          team={editTeam ?? ''}
          teamOptions={TEAM_OPTIONS}
          onTeamChange={handleEditTeamChange}
          name={editName}
          onNameChange={setEditName}
          review={editReview}
          onReviewChange={setEditReview}
          onCancel={closeDetail}
          onSave={handleUpdate}
          saveDisabled={!editName || !editReview || !editTeam || updateReviewMutation.isPending}
        />
      )}
    </div>
  )
}

export default ReviewsPage

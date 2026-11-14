import { useState } from 'react'
import type {
  BlogReviewActivity,
  BlogReviewListItem,
  BlogReviewPart,
} from '@api/blog-reviews/types'
import { BlogReviewModal } from '@components/blog-reviews'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { PART_LABELS, type PartBadgeType } from '@components/common/PartBadge'
import { ReviewTable } from '@components/common/ReviewTable'
import type { SelectFieldOption } from '@components/common/SelectField'
import { useCurrentCardinalQuery } from '@api/auth/queries'
import {
  useBlogReviewsQuery,
  useCreateBlogReviewMutation,
  useDeleteBlogReviewMutation,
  useUpdateBlogReviewMutation,
} from '@api/blog-reviews/queries'
import { useConfirm } from '@hooks/common/useConfirm'
import { useCardinalSelection } from '@hooks/common/useCardinalSelection'
import { useToast } from '@hooks/common/useToast'
import { TOAST_MESSAGES } from '@/constants/toastMessages'
import { LoadingState } from '@components/common/LoadingState'
import { isHttpUrl } from '@lib/url'

interface BlogReviewRow {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  activity: string
  title: string
  link: string
  thumbnailUrl?: string
}

// BlogReviewRequest.activity enum(Swagger): DOCUMENT_REVIEW, INTERVIEW_REVIEW, COMPANY_PROJECT,
// ACTIVITY_REVIEW, MEETUP_PROJECT
const ACTIVITY_OPTIONS = [
  { value: 'DOCUMENT_REVIEW', label: '서류 후기' },
  { value: 'INTERVIEW_REVIEW', label: '면접 후기' },
  { value: 'ACTIVITY_REVIEW', label: '활동 후기' },
  { value: 'COMPANY_PROJECT', label: '기업 프로젝트' },
  { value: 'MEETUP_PROJECT', label: '밋업 프로젝트' },
] as const

const PART_OPTIONS: SelectFieldOption[] = Object.entries(PART_LABELS).map(([value, label]) => ({
  value,
  label,
}))

// PartBadgeType -> BlogReviewRequest.part enum(Swagger) 매핑
const PART_TO_BACKEND: Record<PartBadgeType, BlogReviewPart> = {
  PLAN: 'PLANNER',
  DE: 'DESIGNER',
  FE: 'FRONTEND',
  BE: 'BACKEND',
}

// BlogReviewRequest.part enum(Swagger) -> PartBadgeType 역매핑. 관리자 폼이 다루지 않는
// IOS/ANDROID/DEVELOPER 값은 매핑되지 않아 뱃지 없이 표시된다.
const BACKEND_TO_PART: Record<string, PartBadgeType> = {
  PLANNER: 'PLAN',
  DESIGNER: 'DE',
  FRONTEND: 'FE',
  BACKEND: 'BE',
}

const PAGE_SIZE = 7

function isPartBadgeType(value: string): value is PartBadgeType {
  return Object.prototype.hasOwnProperty.call(PART_LABELS, value)
}

function isBlogReviewActivity(value: string): value is BlogReviewActivity {
  return ACTIVITY_OPTIONS.some((option) => option.value === value)
}

function isKnownBackendPart(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(BACKEND_TO_PART, value)
}

// 작성자 이름은 API 응답에 없어 '관리자'로 고정 표시한다.
function toBlogReviewRow(item: BlogReviewListItem): BlogReviewRow {
  return {
    id: String(item.blog_review_id),
    name: '관리자',
    generation: item.cardinal,
    part: BACKEND_TO_PART[item.part],
    activity:
      ACTIVITY_OPTIONS.find((option) => option.value === item.activity)?.label ?? item.activity,
    title: item.title,
    link: item.blogLink,
    thumbnailUrl: item.thumbnailUrl ?? undefined,
  }
}

interface EditingSnapshot {
  blogReviewId: number
  cardinal: number
  part: PartBadgeType
  activity: string
  title: string
  previewText: string
  link: string
  thumbnailUrl?: string
}

export function BlogReviewsPage() {
  const blogReviewsQuery = useBlogReviewsQuery()
  const currentCardinalQuery = useCurrentCardinalQuery()
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSnapshot, setEditingSnapshot] = useState<EditingSnapshot>()
  const [part, setPart] = useState<PartBadgeType>('PLAN')
  const [activity, setActivity] = useState('')
  const [title, setTitle] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [link, setLink] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()
  const [thumbnailFile, setThumbnailFile] = useState<File>()

  const createBlogReviewMutation = useCreateBlogReviewMutation()
  const updateBlogReviewMutation = useUpdateBlogReviewMutation()
  const deleteBlogReviewMutation = useDeleteBlogReviewMutation()
  const addToast = useToast()
  const confirm = useConfirm()

  const rows = (blogReviewsQuery.data?.blog_review_list ?? []).map(toBlogReviewRow)
  const cardinalSelection = useCardinalSelection(rows.map((row) => row.generation))

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function resetForm() {
    setEditingSnapshot(undefined)
    setPart('PLAN')
    setActivity('')
    setTitle('')
    setPreviewText('')
    setLink('')
    setThumbnailUrl(undefined)
    setThumbnailFile(undefined)
  }

  function handleEditRow(id: string) {
    const item = blogReviewsQuery.data?.blog_review_list.find(
      (reviewItem) => String(reviewItem.blog_review_id) === id,
    )
    if (!item) return

    if (!isKnownBackendPart(item.part)) {
      addToast({ type: 'error', message: TOAST_MESSAGES.unsupportedBlogReviewPart })
      return
    }
    const mappedPart = BACKEND_TO_PART[item.part]

    setEditingSnapshot({
      blogReviewId: item.blog_review_id,
      cardinal: item.cardinal,
      part: mappedPart,
      activity: item.activity,
      title: item.title,
      previewText: item.previewText,
      link: item.blogLink,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
    })
    setPart(mappedPart)
    setActivity(isBlogReviewActivity(item.activity) ? item.activity : '')
    setTitle(item.title)
    setPreviewText(item.previewText)
    setLink(item.blogLink)
    setThumbnailUrl(item.thumbnailUrl ?? undefined)
    setThumbnailFile(undefined)
    setModalOpen(true)
  }

  const isDirty = editingSnapshot
    ? part !== editingSnapshot.part ||
      activity !== editingSnapshot.activity ||
      title !== editingSnapshot.title ||
      previewText !== editingSnapshot.previewText ||
      link !== editingSnapshot.link ||
      thumbnailUrl !== editingSnapshot.thumbnailUrl
    : true

  async function handleDeleteRow(id: string) {
    if (!(await confirm({ title: '이 후기를 삭제하시겠습니까?', confirmLabel: '삭제하기' }))) {
      return
    }

    deleteBlogReviewMutation.mutate(Number(id), {
      onSuccess: () => {
        addToast({ type: 'complete', message: TOAST_MESSAGES.deleted })
      },
      onError: () => {
        addToast({ type: 'error', message: TOAST_MESSAGES.deleteFailed })
      },
    })
  }

  function handlePartChange(value: string) {
    if (isPartBadgeType(value)) {
      setPart(value)
    }
  }

  function handleActivityChange(value: string) {
    if (isBlogReviewActivity(value)) {
      setActivity(value)
    }
  }

  function handleThumbnailChange(file: File) {
    setThumbnailUrl(URL.createObjectURL(file))
    setThumbnailFile(file)
  }

  function handleThumbnailDelete() {
    setThumbnailUrl(undefined)
    setThumbnailFile(undefined)
  }

  function handleSave() {
    const activityValue = activity
    const activityLabel = ACTIVITY_OPTIONS.find((option) => option.value === activity)?.label
    const trimmedTitle = title.trim()
    const trimmedLink = link.trim()

    if (
      !isBlogReviewActivity(activityValue) ||
      !activityLabel ||
      !trimmedTitle ||
      !isHttpUrl(trimmedLink)
    ) {
      return
    }

    if (editingSnapshot) {
      updateBlogReviewMutation.mutate(
        {
          blogReviewId: editingSnapshot.blogReviewId,
          cardinal: editingSnapshot.cardinal,
          part: PART_TO_BACKEND[part],
          activity: activityValue,
          title: trimmedTitle,
          previewText: previewText.trim(),
          blogLink: trimmedLink,
          thumbnailFile,
        },
        {
          onSuccess: () => {
            addToast({ type: 'complete', message: TOAST_MESSAGES.updated })
            resetForm()
            setModalOpen(false)
          },
          onError: () => {
            addToast({ type: 'error', message: TOAST_MESSAGES.updateFailed })
          },
        },
      )
      return
    }

    const currentCardinal = cardinalSelection.cardinal
    if (currentCardinal === undefined) {
      return
    }

    createBlogReviewMutation.mutate(
      {
        cardinal: currentCardinal,
        part: PART_TO_BACKEND[part],
        activity: activityValue,
        title: trimmedTitle,
        previewText: previewText.trim(),
        blogLink: trimmedLink,
        thumbnailFile,
      },
      {
        onSuccess: () => {
          addToast({ type: 'complete', message: TOAST_MESSAGES.created })
          setPage(1)
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

  if (blogReviewsQuery.isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="블로그 후기 관리" />
        <LoadingState className="flex-1" />
      </div>
    )
  }

  if (blogReviewsQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="블로그 후기 관리" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-label-14m text-label-alternative">후기 목록을 불러오지 못했습니다.</p>
          <Button
            variant="primary"
            size="s"
            onClick={() => {
              void blogReviewsQuery.refetch()
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
      <PageHeader title="블로그 후기 관리" />

      <div className="flex flex-col gap-8 px-8 pt-7 pb-15">
        <section className="flex flex-col items-start gap-3">
          <h2 className="text-body-18sb text-label-normal">후기 관리하기</h2>
          <Button
            variant="outlined"
            size="l"
            disabled={currentCardinalQuery.data === undefined}
            onClick={() => {
              resetForm()
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
            type="blogReview"
            rows={pagedRows.map((row) => ({ ...row, category: row.activity }))}
            onEditRow={handleEditRow}
            onDeleteRow={(id) => {
              void handleDeleteRow(id)
            }}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalLabel={`총 ${String(rows.length)}개의 후기`}
          />
        </section>
      </div>

      <BlogReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={editingSnapshot ? 'edit' : 'create'}
        cardinal={editingSnapshot?.cardinal ?? cardinalSelection.cardinal ?? 0}
        cardinalOptions={editingSnapshot ? undefined : cardinalSelection.options}
        onCardinalChange={editingSnapshot ? undefined : cardinalSelection.setCardinal}
        part={part}
        partOptions={PART_OPTIONS}
        onPartChange={handlePartChange}
        activity={activity}
        activityOptions={[...ACTIVITY_OPTIONS]}
        onActivityChange={handleActivityChange}
        title={title}
        onTitleChange={setTitle}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        link={link}
        onLinkChange={setLink}
        thumbnailUrl={thumbnailUrl}
        onThumbnailChange={handleThumbnailChange}
        onThumbnailDelete={handleThumbnailDelete}
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={
          !activity ||
          !title.trim() ||
          !isHttpUrl(link) ||
          createBlogReviewMutation.isPending ||
          updateBlogReviewMutation.isPending ||
          (editingSnapshot ? !isDirty : currentCardinalQuery.data === undefined)
        }
      />
    </div>
  )
}

export default BlogReviewsPage

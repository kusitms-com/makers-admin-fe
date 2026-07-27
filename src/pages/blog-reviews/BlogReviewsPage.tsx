import { useState } from 'react'
import { BlogReviewModal } from '@components/blog-reviews'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { PART_LABELS, type PartBadgeType } from '@components/common/PartBadge'
import { ReviewTable } from '@components/common/ReviewTable'
import type { SelectFieldOption } from '@components/common/SelectField'
import {
  ACTIVITY_OPTIONS,
  CURRENT_GENERATION,
  INITIAL_ROWS,
  type BlogReviewRow,
} from './BlogReviewsPage.mock'

const PART_OPTIONS: SelectFieldOption[] = Object.entries(PART_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const PAGE_SIZE = 7

function isPartBadgeType(value: string): value is PartBadgeType {
  return Object.prototype.hasOwnProperty.call(PART_LABELS, value)
}

export function BlogReviewsPage() {
  const [rows, setRows] = useState<BlogReviewRow[]>(INITIAL_ROWS)
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [part, setPart] = useState<PartBadgeType>('PLAN')
  const [activity, setActivity] = useState('')
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string>()

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetForm() {
    setPart('PLAN')
    setActivity('')
    setTitle('')
    setLink('')
    setThumbnailUrl(undefined)
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

  function handleThumbnailChange(file: File) {
    setThumbnailUrl(URL.createObjectURL(file))
  }

  function handleThumbnailDelete() {
    setThumbnailUrl(undefined)
  }

  function handleSave() {
    const activityLabel = ACTIVITY_OPTIONS.find((option) => option.value === activity)?.label
    const trimmedTitle = title.trim()
    const trimmedLink = link.trim()

    if (!activityLabel || !trimmedTitle || !trimmedLink) {
      return
    }

    setRows((previousRows) => [
      {
        id: crypto.randomUUID(),
        name: '관리자',
        generation: CURRENT_GENERATION,
        part,
        activity: activityLabel,
        title: trimmedTitle,
        link: trimmedLink,
        thumbnailUrl,
      },
      ...previousRows,
    ])
    setPage(1)
    resetForm()
    setModalOpen(false)
  }

  function handleCancel() {
    resetForm()
    setModalOpen(false)
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
            rows={pagedRows.map((row) => ({ ...row, category: row.activity }))}
            onDeleteRow={handleDeleteRow}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalLabel={`총 ${String(rows.length)}개의 후기`}
          />
        </section>
      </div>

      <BlogReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        cardinal={CURRENT_GENERATION}
        part={part}
        partOptions={PART_OPTIONS}
        onPartChange={handlePartChange}
        activity={activity}
        activityOptions={[...ACTIVITY_OPTIONS]}
        onActivityChange={setActivity}
        title={title}
        onTitleChange={setTitle}
        link={link}
        onLinkChange={setLink}
        thumbnailUrl={thumbnailUrl}
        onThumbnailChange={handleThumbnailChange}
        onThumbnailDelete={handleThumbnailDelete}
        onCancel={handleCancel}
        onSave={handleSave}
        saveDisabled={!activity || !title.trim() || !link.trim()}
      />
    </div>
  )
}

export default BlogReviewsPage

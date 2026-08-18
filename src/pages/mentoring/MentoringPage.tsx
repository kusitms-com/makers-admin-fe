import { useRef, useState } from 'react'
import dayjs from 'dayjs'
import { PageHeader } from '@components/common/PageHeader'
import { DatePicker } from '@components/common/DatePicker'
import { Pagination } from '@components/common/Pagination'
import { MentoringSummaryCard } from '@components/mentoring/MentoringSummaryCard'
import { MentoringListItem } from '@components/mentoring/MentoringListItem'
import { MentoringReviewRow } from '@components/mentoring/MentoringReviewRow'
import { MentorSatisfactionRow } from '@components/mentoring/MentorSatisfactionRow'
import DashboardTimeIcon from '@/assets/icons/generated/DashboardTimeIcon'
import DashboardFigureIcon from '@/assets/icons/generated/DashboardFigureIcon'
import DashboardGraphIcon from '@/assets/icons/generated/DashboardGraphIcon'
import {
  INITIAL_MENTORS,
  INITIAL_REVIEWS,
  INITIAL_SESSIONS,
  STAT_CARDS,
} from './MentoringPage.mock'

const PAGE_SIZE = 5
const REVIEW_PAGE_SIZE = 2
const MENTOR_PAGE_SIZE = 7

export function MentoringPage() {
  const sessions = INITIAL_SESSIONS
  const [page, setPage] = useState(1)
  const [filterDate, setFilterDate] = useState(() => new Date())
  const listSectionRef = useRef<HTMLDivElement>(null)

  const reviews = INITIAL_REVIEWS
  const [reviewPage, setReviewPage] = useState(1)

  const mentors = INITIAL_MENTORS
  const [mentorPage, setMentorPage] = useState(1)

  const filteredSessions = sessions.filter((session) =>
    dayjs(session.date).isSame(filterDate, 'day'),
  )
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE))
  const pagedSessions = filteredSessions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterDateChange(date: Date) {
    setFilterDate(date)
    setPage(1)
  }

  const reviewTotalPages = Math.max(1, Math.ceil(reviews.length / REVIEW_PAGE_SIZE))
  const pagedReviews = reviews.slice(
    (reviewPage - 1) * REVIEW_PAGE_SIZE,
    reviewPage * REVIEW_PAGE_SIZE,
  )

  const mentorTotalPages = Math.max(1, Math.ceil(mentors.length / MENTOR_PAGE_SIZE))
  const pagedMentors = mentors.slice(
    (mentorPage - 1) * MENTOR_PAGE_SIZE,
    mentorPage * MENTOR_PAGE_SIZE,
  )

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <PageHeader title="멘토링 관리" />

      <div className="flex min-w-0 flex-1 flex-col gap-4 px-8 pt-7 pb-15">
        <div className="flex items-stretch gap-4">
          <MentoringSummaryCard
            label="승인 대기 요청"
            count={STAT_CARDS.pendingApprovals}
            icon={<DashboardTimeIcon />}
            className="flex-1"
            onClick={() => {
              listSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          />
          <MentoringSummaryCard
            label="진행 중인 멘토링"
            count={STAT_CARDS.ongoing}
            icon={<DashboardFigureIcon />}
            className="flex-1"
          />
          <MentoringSummaryCard
            label="이번달 완료"
            count={STAT_CARDS.completedThisMonth}
            icon={<DashboardGraphIcon />}
            className="flex-1"
          />
        </div>

        <div ref={listSectionRef} className="border-line-neutral bg-fill-normal rounded-2xl border">
          <div className="flex flex-col gap-4 px-6 pt-6 pb-3">
            <h2 className="text-body-18b text-label-normal pb-px">멘토링 현황</h2>
            <DatePicker
              value={filterDate}
              onChange={handleFilterDateChange}
              className="self-start"
            />
          </div>

          <div className="flex flex-col px-6">
            {pagedSessions.length > 0 ? (
              pagedSessions.map((session) => (
                <MentoringListItem
                  key={session.id}
                  mentor={session.mentor}
                  mentee={session.mentee}
                  dateRange={session.dateRange}
                  title={session.title}
                  status={session.status}
                />
              ))
            ) : (
              <p className="text-label-14m text-label-alternative flex h-16 items-center justify-center">
                선택한 날짜에 표시할 멘토링이 없습니다.
              </p>
            )}
          </div>

          <div className="flex justify-center px-6 pt-[18px] pb-[22px]">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

        <div className="flex items-stretch gap-4">
          <div className="border-line-neutral bg-fill-normal flex flex-1 flex-col rounded-2xl border">
            <div className="px-6 pt-6 pb-3">
              <h2 className="text-body-18b text-label-normal pb-px">최근 후기</h2>
            </div>

            <div className="flex flex-col px-6">
              {pagedReviews.map((review) => (
                <MentoringReviewRow
                  key={review.id}
                  title={review.title}
                  relativeTime={review.relativeTime}
                  mentor={review.mentor}
                  mentee={review.mentee}
                  isRecommended={review.isRecommended}
                  keywords={review.keywords}
                  freeReview={review.freeReview}
                />
              ))}
            </div>

            <div className="flex justify-center px-6 pt-[18px] pb-[22px]">
              <Pagination
                page={reviewPage}
                totalPages={reviewTotalPages}
                onPageChange={setReviewPage}
              />
            </div>
          </div>

          <div className="border-line-neutral bg-fill-normal flex w-[373px] shrink-0 flex-col justify-between rounded-2xl border">
            <div>
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-body-18b text-label-normal">활성멘토</h2>
              </div>

              <div className="flex flex-col px-6 pb-1">
                {pagedMentors.map((mentor) => (
                  <MentorSatisfactionRow
                    key={mentor.id}
                    name={mentor.name}
                    generation={mentor.generation}
                    part={mentor.part}
                    satisfactionRate={mentor.satisfactionRate}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center px-6 pt-[18px] pb-[22px]">
              <Pagination
                page={mentorPage}
                totalPages={mentorTotalPages}
                onPageChange={setMentorPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentoringPage

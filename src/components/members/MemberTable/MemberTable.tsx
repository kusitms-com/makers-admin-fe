import memberAvatar from '@/assets/images/member-avatar.png'
import { FileChip, PartBadge, SelectField, TableFooter } from '@/components/common'
import type { PartBadgeType } from '@/components/common/PartBadge'
import type { SelectFieldOption } from '@/components/common/SelectField'

export type MentoringMemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'

export interface MentoringMemberRow {
  id: string
  name: string
  generation?: number
  part?: PartBadgeType
  phone: string
  email: string
  registeredAt: string
  isMentoringMember?: boolean
  status?: MentoringMemberStatus
  remark?: string
}

interface MentoringMemberTableProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  // 승인 대기 화면만 멘토링 여부/상태/비고 컬럼을 쓴다.
  // 회원 목록(GET /admin/members, APPROVED만 조회)은 이미 승인된 회원만 보여주므로 상태 변경이 필요 없다.
  isApprovalView?: boolean
  statusOptions?: SelectFieldOption[]
  onPageChange: (page: number) => void
  onStatusChange?: (id: string, status: MentoringMemberStatus) => void
}

const COLUMNS_BASIC = [
  ['이름', 'px-3'],
  ['기수', 'justify-center px-3'],
  ['파트', 'justify-center px-3'],
  ['전화번호', 'px-3'],
  ['이메일', 'px-3'],
  ['가입일', 'px-3'],
] as const

const COLUMNS_FULL = [
  ['이름', 'px-3'],
  ['기수', 'justify-center px-3'],
  ['파트', 'justify-center px-3'],
  ['전화번호', 'px-3'],
  ['이메일', 'px-3'],
  ['가입일', 'px-3'],
  ['멘토링', 'justify-center px-3'],
  ['상태', 'px-3'],
  ['비고', 'px-3'],
] as const

// 열 최소 너비 합계 + 행 px-1(8px) = 행 min-w.
// 1440px 화면의 본문 폭(1156px) 안에 들어가야 가로 스크롤이 생기지 않는다.
const TABLE_GRID_CLASS_BASIC =
  'grid-cols-[minmax(140px,1.4fr)_minmax(64px,0.55fr)_minmax(100px,0.8fr)_minmax(156px,1.3fr)_minmax(160px,1.5fr)_minmax(132px,1.1fr)]'
const TABLE_GRID_CLASS_FULL =
  'grid-cols-[minmax(140px,1.4fr)_minmax(64px,0.55fr)_minmax(100px,0.8fr)_minmax(156px,1.3fr)_minmax(160px,1.5fr)_minmax(132px,1.1fr)_minmax(72px,0.6fr)_minmax(108px,0.9fr)_minmax(140px,1.3fr)]'
const ROW_MIN_WIDTH_BASIC = 'min-w-[760px]'
const ROW_MIN_WIDTH_FULL = 'min-w-[1080px]'

function MentoringMemberTableRow({
  member,
  statusOptions,
  isApprovalView,
  onStatusChange,
}: {
  member: MentoringMemberRow
  statusOptions?: SelectFieldOption[]
  isApprovalView: boolean
  onStatusChange?: (status: MentoringMemberStatus) => void
}) {
  const gridClassName = isApprovalView ? TABLE_GRID_CLASS_FULL : TABLE_GRID_CLASS_BASIC
  const minWidthClassName = isApprovalView ? ROW_MIN_WIDTH_FULL : ROW_MIN_WIDTH_BASIC

  return (
    <div
      role="row"
      className={`border-line-alternative ${gridClassName} grid h-16 ${minWidthClassName} items-center border-b px-1 last:border-b-0`}
    >
      <div role="cell" className="flex min-w-0 items-center gap-2 px-3">
        <img src={memberAvatar} alt="" className="size-7 rounded-full object-cover" />
        <span className="text-label-14m text-label-normal truncate">{member.name}</span>
      </div>
      <span
        role="cell"
        className="text-label-13m text-label-normal flex min-w-0 justify-center px-3"
      >
        {member.generation ? `${String(member.generation)}기` : '-'}
      </span>
      <div role="cell" className="flex min-w-0 justify-center px-3">
        {member.part ? (
          <PartBadge part={member.part} />
        ) : (
          <span className="text-label-14m text-label-alternative">-</span>
        )}
      </div>
      <span role="cell" className="text-label-14m text-label-normal min-w-0 truncate px-3">
        {member.phone}
      </span>
      <span role="cell" className="text-label-14m text-label-normal min-w-0 truncate px-3">
        {member.email}
      </span>
      <span role="cell" className="text-label-14m text-label-normal min-w-0 truncate px-3">
        {member.registeredAt}
      </span>
      {isApprovalView && (
        <span
          role="cell"
          className="text-label-14m text-label-normal flex min-w-0 justify-center px-3"
        >
          {member.isMentoringMember ? 'Y' : 'N'}
        </span>
      )}
      {isApprovalView && (
        <div role="cell" className="min-w-0 px-3">
          <SelectField
            value={member.status ?? 'PENDING'}
            options={statusOptions ?? []}
            variant="compact"
            onValueChange={(value) => {
              if (statusOptions?.some((option) => option.value === value)) {
                onStatusChange?.(value as MentoringMemberStatus)
              }
            }}
            aria-label={`${member.name} 회원 상태`}
            className="text-label-14sb border-fill-netural h-8 w-[84px] rounded-md py-1.5 pr-2"
          />
        </div>
      )}
      {isApprovalView && (
        <div role="cell" className="flex min-w-0 px-3">
          {member.remark && <FileChip fileName={member.remark} className="w-full" />}
        </div>
      )}
    </div>
  )
}

export const MentoringMemberTable = ({
  members,
  page,
  totalPages,
  totalLabel,
  statusOptions,
  isApprovalView = false,
  onPageChange,
  onStatusChange,
}: MentoringMemberTableProps) => {
  const columns = isApprovalView ? COLUMNS_FULL : COLUMNS_BASIC
  const gridClassName = isApprovalView ? TABLE_GRID_CLASS_FULL : TABLE_GRID_CLASS_BASIC
  const minWidthClassName = isApprovalView ? ROW_MIN_WIDTH_FULL : ROW_MIN_WIDTH_BASIC

  return (
    <section
      role="table"
      aria-label="멘토링 회원 목록"
      className="bg-fill-normal relative w-full overflow-hidden rounded-xl after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:shadow-[inset_0_0_0_1px_var(--line-alternative)] after:content-['']"
    >
      <div className="overflow-x-auto">
        <div
          role="row"
          className={`bg-fill-netural ${gridClassName} grid h-12 ${minWidthClassName} items-center px-1`}
        >
          {columns.map(([label, className]) => (
            <span
              key={label}
              role="columnheader"
              className={`text-label-13sb text-label-alternative flex min-w-0 ${className}`}
            >
              {label}
            </span>
          ))}
        </div>

        {members.length > 0 ? (
          members.map((member) => (
            <MentoringMemberTableRow
              key={member.id}
              member={member}
              statusOptions={statusOptions}
              isApprovalView={isApprovalView}
              onStatusChange={(status) => {
                onStatusChange?.(member.id, status)
              }}
            />
          ))
        ) : (
          <div
            role="row"
            className={`text-label-14m text-label-alternative flex h-16 ${minWidthClassName} items-center justify-center`}
          >
            표시할 회원이 없습니다.
          </div>
        )}
      </div>
      <TableFooter
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalLabel={totalLabel}
      />
    </section>
  )
}

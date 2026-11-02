import MentoringDeleteIcon from '@/assets/icons/generated/MentoringDeleteIcon'
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
  statusOptions: SelectFieldOption[]
  // 승인 대기(mock) 화면만 멘토링 여부/비고(수료증) 컬럼을 쓴다.
  // 실제 회원 목록 API(GET /admin/members) 응답에는 두 필드가 없다.
  showMentoringAndRemark?: boolean
  onPageChange: (page: number) => void
  onStatusChange: (id: string, status: MentoringMemberStatus) => void
  // 멘토링 여부/비고 컬럼과 마찬가지로 삭제 컬럼도 승인 대기(mock) 화면만 쓴다.
  // 실제 회원 목록은 상태 드롭다운에서 반려를 선택해 처리한다.
  onDelete?: (id: string) => void
}

const COLUMNS_BASIC = [
  ['이름', 'px-3'],
  ['기수', 'justify-center px-3'],
  ['파트', 'justify-center px-3'],
  ['전화번호', 'px-3'],
  ['이메일', 'px-3'],
  ['가입일', 'px-3'],
  ['상태', 'px-3'],
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
  ['삭제', 'justify-center px-3'],
  ['비고', 'px-3'],
] as const

// 열 최소 너비 합계 + 행 px-1(8px) = 행 min-w.
// 1440px 화면의 본문 폭(1156px) 안에 들어가야 가로 스크롤이 생기지 않는다.
const TABLE_GRID_CLASS_BASIC =
  'grid-cols-[minmax(140px,1.4fr)_minmax(64px,0.55fr)_minmax(100px,0.8fr)_minmax(156px,1.3fr)_minmax(160px,1.5fr)_minmax(132px,1.1fr)_minmax(108px,0.9fr)]'
const TABLE_GRID_CLASS_FULL =
  'grid-cols-[minmax(140px,1.4fr)_minmax(64px,0.55fr)_minmax(100px,0.8fr)_minmax(156px,1.3fr)_minmax(160px,1.5fr)_minmax(132px,1.1fr)_minmax(72px,0.6fr)_minmax(108px,0.9fr)_minmax(72px,0.6fr)_minmax(140px,1.3fr)]'
const ROW_MIN_WIDTH_BASIC = 'min-w-[868px]'
const ROW_MIN_WIDTH_FULL = 'min-w-[1152px]'

function MentoringMemberTableRow({
  member,
  statusOptions,
  showMentoringAndRemark,
  onStatusChange,
  onDelete,
}: {
  member: MentoringMemberRow
  statusOptions: SelectFieldOption[]
  showMentoringAndRemark: boolean
  onStatusChange: (status: MentoringMemberStatus) => void
  onDelete?: () => void
}) {
  const gridClassName = showMentoringAndRemark ? TABLE_GRID_CLASS_FULL : TABLE_GRID_CLASS_BASIC
  const minWidthClassName = showMentoringAndRemark ? ROW_MIN_WIDTH_FULL : ROW_MIN_WIDTH_BASIC

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
      {showMentoringAndRemark && (
        <span
          role="cell"
          className="text-label-14m text-label-normal flex min-w-0 justify-center px-3"
        >
          {member.isMentoringMember ? 'Y' : 'N'}
        </span>
      )}
      <div role="cell" className="min-w-0 px-3">
        {member.status ? (
          <SelectField
            value={member.status}
            options={statusOptions}
            variant="compact"
            disabled={member.status === 'APPROVED' || member.status === 'REJECTED'}
            onValueChange={(value) => {
              if (statusOptions.some((option) => option.value === value)) {
                onStatusChange(value as MentoringMemberStatus)
              }
            }}
            aria-label={`${member.name} 회원 상태`}
            className="text-label-14sb border-fill-netural h-8 w-[84px] rounded-md py-1.5 pr-2"
          />
        ) : (
          <span className="text-label-14m text-label-alternative">-</span>
        )}
      </div>
      {showMentoringAndRemark && (
        <div role="cell" className="flex min-w-0 justify-center px-3">
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${member.name} 삭제`}
            className="flex size-9 items-center justify-center rounded-full bg-[#fdf2f2]"
          >
            <MentoringDeleteIcon className="size-6" aria-hidden="true" />
          </button>
        </div>
      )}
      {showMentoringAndRemark && (
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
  showMentoringAndRemark = false,
  onPageChange,
  onStatusChange,
  onDelete,
}: MentoringMemberTableProps) => {
  const columns = showMentoringAndRemark ? COLUMNS_FULL : COLUMNS_BASIC
  const gridClassName = showMentoringAndRemark ? TABLE_GRID_CLASS_FULL : TABLE_GRID_CLASS_BASIC
  const minWidthClassName = showMentoringAndRemark ? ROW_MIN_WIDTH_FULL : ROW_MIN_WIDTH_BASIC

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
              showMentoringAndRemark={showMentoringAndRemark}
              onStatusChange={(status) => {
                onStatusChange(member.id, status)
              }}
              onDelete={
                onDelete &&
                (() => {
                  onDelete(member.id)
                })
              }
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

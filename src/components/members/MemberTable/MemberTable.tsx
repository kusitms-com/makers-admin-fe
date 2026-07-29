import MentoringDeleteIcon from '@/assets/icons/generated/MentoringDeleteIcon'
import memberAvatar from '@/assets/images/member-avatar.png'
import { FileChip, PartBadge, SelectField, TableFooter } from '@/components/common'
import type { PartBadgeType } from '@/components/common/PartBadge'

export type MentoringMemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface MentoringMemberRow {
  id: string
  name: string
  generation: number
  part: PartBadgeType
  phone: string
  email: string
  registeredAt: string
  isMentoringMember: boolean
  status: MentoringMemberStatus
  remark?: string
}

interface MentoringMemberTableProps {
  members: MentoringMemberRow[]
  page: number
  totalPages: number
  totalLabel: string
  onPageChange: (page: number) => void
  onStatusChange: (id: string, status: MentoringMemberStatus) => void
  onDelete: (id: string) => void
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: '대기' },
  { value: 'APPROVED', label: '완료' },
  { value: 'REJECTED', label: '거절' },
]

const COLUMNS = [
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

const TABLE_GRID_CLASS =
  'grid-cols-[minmax(170px,1.4fr)_minmax(64px,0.55fr)_minmax(100px,0.8fr)_minmax(156px,1.3fr)_minmax(180px,1.5fr)_minmax(132px,1.1fr)_minmax(72px,0.6fr)_minmax(108px,0.9fr)_minmax(72px,0.6fr)_minmax(160px,1.3fr)]'

function MentoringMemberTableRow({
  member,
  onStatusChange,
  onDelete,
}: {
  member: MentoringMemberRow
  onStatusChange: (status: MentoringMemberStatus) => void
  onDelete: () => void
}) {
  return (
    <div
      role="row"
      className={`border-line-alternative ${TABLE_GRID_CLASS} grid h-16 min-w-[1214px] items-center border-b px-1 last:border-b-0`}
    >
      <div role="cell" className="flex min-w-0 items-center gap-2 px-3">
        <img src={memberAvatar} alt="" className="size-7 rounded-full object-cover" />
        <span className="text-label-14m text-label-normal truncate">{member.name}</span>
      </div>
      <span
        role="cell"
        className="text-label-13m text-label-normal flex min-w-0 justify-center px-3"
      >
        {member.generation}기
      </span>
      <div role="cell" className="flex min-w-0 justify-center px-3">
        <PartBadge part={member.part} />
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
      <span
        role="cell"
        className="text-label-14m text-label-normal flex min-w-0 justify-center px-3"
      >
        {member.isMentoringMember ? 'Y' : 'N'}
      </span>
      <div role="cell" className="min-w-0 px-3">
        <SelectField
          value={member.status}
          options={STATUS_OPTIONS}
          variant="compact"
          onValueChange={(value) => {
            if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
              onStatusChange(value)
            }
          }}
          aria-label={`${member.name} 회원 상태`}
          className="text-label-14sb border-fill-netural h-8 w-[84px] rounded-md py-1.5 pr-2"
        />
      </div>
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
      <div role="cell" className="flex min-w-0 px-3">
        {member.remark && <FileChip fileName={member.remark} className="w-full" />}
      </div>
    </div>
  )
}

export const MentoringMemberTable = ({
  members,
  page,
  totalPages,
  totalLabel,
  onPageChange,
  onStatusChange,
  onDelete,
}: MentoringMemberTableProps) => {
  return (
    <section
      role="table"
      aria-label="멘토링 회원 목록"
      className="bg-fill-normal w-full overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_var(--line-alternative)]"
    >
      <div className="overflow-x-auto">
        <div
          role="row"
          className={`bg-fill-netural ${TABLE_GRID_CLASS} grid h-12 min-w-[1214px] items-center px-1`}
        >
          {COLUMNS.map(([label, className]) => (
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
              onStatusChange={(status) => {
                onStatusChange(member.id, status)
              }}
              onDelete={() => {
                onDelete(member.id)
              }}
            />
          ))
        ) : (
          <div
            role="row"
            className="text-label-14m text-label-alternative flex h-16 min-w-[1214px] items-center justify-center"
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

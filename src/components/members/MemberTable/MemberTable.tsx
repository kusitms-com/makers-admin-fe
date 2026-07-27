import DeleteIcon from '@/assets/icons/generated/DeleteIcon'
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
  ['이름', 'w-[170px] px-3'],
  ['기수', 'w-16 justify-center px-3'],
  ['파트', 'w-[100px] justify-center px-[18px]'],
  ['전화번호', 'w-[156px] px-3'],
  ['이메일', 'w-[180px] px-3'],
  ['가입일', 'w-[132px] px-3'],
  ['멘토링', 'w-[72px] justify-center px-3'],
  ['상태', 'w-[108px] px-3'],
  ['삭제', 'w-[72px] justify-center px-3'],
  ['비고', 'w-40 px-3'],
] as const

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
    <div className="border-line-alternative flex h-16 min-w-[1214px] items-center border-b px-1 last:border-b-0">
      <div className="flex w-[170px] shrink-0 items-center gap-2 px-3">
        <img src={memberAvatar} alt="" className="size-7 rounded-full object-cover" />
        <span className="text-label-14m text-label-normal truncate">{member.name}</span>
      </div>
      <span className="text-label-13m text-label-normal flex w-16 shrink-0 justify-center px-3">
        {member.generation}기
      </span>
      <div className="flex w-[100px] shrink-0 justify-center px-[18px]">
        <PartBadge part={member.part} />
      </div>
      <span className="text-label-14m text-label-normal w-[156px] shrink-0 px-3">
        {member.phone}
      </span>
      <span className="text-label-14m text-label-normal w-[180px] shrink-0 truncate px-3">
        {member.email}
      </span>
      <span className="text-label-14m text-label-normal w-[132px] shrink-0 truncate px-3">
        {member.registeredAt}
      </span>
      <span className="text-label-14m text-label-normal flex w-[72px] shrink-0 justify-center px-3">
        {member.isMentoringMember ? 'Y' : 'N'}
      </span>
      <div className="w-[108px] shrink-0 px-3">
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
      <div className="flex w-[72px] shrink-0 justify-center px-3">
        <button
          type="button"
          onClick={onDelete}
          aria-label={`${member.name} 삭제`}
          className="bg-fill-destructive text-status-negative flex size-9 items-center justify-center rounded-full"
        >
          <DeleteIcon className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="flex w-40 shrink-0 px-3">
        {member.remark && <FileChip fileName={member.remark} className="w-full" />}
      </div>
    </div>
  )
}

export function MentoringMemberTable({
  members,
  page,
  totalPages,
  totalLabel,
  onPageChange,
  onStatusChange,
  onDelete,
}: MentoringMemberTableProps) {
  return (
    <section className="bg-fill-normal w-full overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_var(--line-alternative)]">
      <div className="overflow-x-auto">
        <div className="bg-fill-netural flex h-12 min-w-[1214px] items-center px-1">
          {COLUMNS.map(([label, className]) => (
            <span
              key={label}
              className={`text-label-13sb text-label-alternative flex shrink-0 ${className}`}
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
          <div className="text-label-14m text-label-alternative flex h-16 min-w-[1214px] items-center justify-center">
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

import { Select } from '@base-ui/react/select'
import ChevronDownIcon from '@/assets/icons/generated/ChevronDownIcon'
import DeleteIcon from '@/assets/icons/generated/DeleteIcon'
import { FileChip } from '@components/common/FileChip/FileChip'
import { PartBadge, type PartBadgeType } from '@components/common/PartBadge/PartBadge'
import { cn } from '@lib/utils'

interface StatusOption {
  value: string
  label: string
}

interface MentorApplicationRowProps {
  name: string
  avatarUrl?: string
  generation: number
  part: PartBadgeType
  phone: string
  email: string
  appliedAt: string
  isApplied: boolean
  status: string
  statusOptions: StatusOption[]
  onStatusChange: (value: string) => void
  fileName?: string
  onDelete?: () => void
  className?: string
}

function Field({ children, className }: { children: string; className?: string }) {
  return <span className={cn('text-label-14m text-label-normal', className)}>{children}</span>
}

function StatusSelect({
  value,
  options,
  onValueChange,
}: {
  value: string
  options: StatusOption[]
  onValueChange: (value: string) => void
}) {
  return (
    <Select.Root
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onValueChange(nextValue)
        }
      }}
      items={options}
    >
      <Select.Trigger className="border-line-neutral bg-fill-normal text-label-14sb text-label-light flex w-[84px] items-center justify-between rounded-md border py-1.5 pr-2 pl-3">
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon className="text-label-light size-4" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} className="z-10">
          <Select.Popup className="border-line-neutral bg-fill-normal text-label-14m text-label-normal min-w-[84px] rounded-md border py-1 shadow-md">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="hover:bg-fill-netural cursor-pointer px-3 py-1.5 outline-none"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}

export function MentorApplicationRow({
  name,
  avatarUrl,
  generation,
  part,
  phone,
  email,
  appliedAt,
  isApplied,
  status,
  statusOptions,
  onStatusChange,
  fileName,
  onDelete,
  className,
}: MentorApplicationRowProps) {
  return (
    <div
      className={cn(
        'border-line-alternative flex h-16 w-full items-center gap-1.5 border-b px-1',
        className,
      )}
    >
      <div className="flex h-full shrink-0 items-center justify-center gap-2 px-3 py-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-7 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="bg-fill-alternative size-7 shrink-0 rounded-full" aria-hidden="true" />
        )}
        <Field className="whitespace-nowrap">{name}</Field>
      </div>

      <div className="flex h-full w-16 shrink-0 items-center justify-center px-3 py-[14.5px]">
        <span className="text-label-13m text-label-normal whitespace-nowrap">{generation}기</span>
      </div>

      <div className="flex h-full w-[100px] shrink-0 items-center justify-center px-[18px] py-[21px]">
        <PartBadge part={part} />
      </div>

      <div className="flex h-full shrink-0 items-center justify-center px-3 py-[21px]">
        <Field className="whitespace-nowrap">{phone}</Field>
      </div>

      <div className="flex h-full w-[180px] shrink-0 items-center justify-center overflow-hidden px-3 py-[21px] pb-px">
        <Field className="w-full truncate">{email}</Field>
      </div>

      <div className="flex h-full w-[120px] shrink-0 items-center justify-center overflow-hidden px-3 py-[21px] pb-px">
        <Field className="w-full truncate">{appliedAt}</Field>
      </div>

      <div className="flex h-full w-[72px] shrink-0 items-center justify-center px-3 py-[21px] pb-px">
        <Field>{isApplied ? 'Y' : 'N'}</Field>
      </div>

      <div className="flex h-full shrink-0 items-center justify-center px-3 py-[21px]">
        <StatusSelect value={status} options={statusOptions} onValueChange={onStatusChange} />
      </div>

      <div className="flex h-full w-[72px] shrink-0 items-center justify-center px-3">
        <button
          type="button"
          onClick={onDelete}
          aria-label="삭제"
          className="bg-fill-destructive flex size-9 shrink-0 items-center justify-center rounded-full"
        >
          <DeleteIcon className="text-status-negative size-6" aria-hidden="true" />
        </button>
      </div>

      {fileName && (
        <div className="flex h-full min-w-px flex-1 items-center justify-center px-3">
          <FileChip fileName={fileName} className="w-full" />
        </div>
      )}
    </div>
  )
}

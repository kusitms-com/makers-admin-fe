import { Select } from '@base-ui/react/select'
import ChevronDownIcon from '@/assets/icons/generated/ChevronDownIcon'
import { cn } from '@lib/utils'

export interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps {
  value: string
  options: SelectFieldOption[]
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const fieldClassName =
  'bg-fill-netural border-line-normal flex h-10 w-full items-center rounded-lg border px-3 py-1.5'

export function SelectField({
  value,
  options,
  onValueChange,
  placeholder,
  disabled,
  className,
}: SelectFieldProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value

  if (!onValueChange) {
    return (
      <div className={cn(fieldClassName, className)}>
        <span className="text-label-14m text-label-normal">{selectedLabel}</span>
      </div>
    )
  }

  return (
    <Select.Root
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onValueChange(nextValue)
        }
      }}
      items={options}
      disabled={disabled}
    >
      <Select.Trigger className={cn(fieldClassName, 'justify-between', className)}>
        <Select.Value
          placeholder={placeholder}
          className="text-label-14m text-label-normal data-[placeholder]:text-label-assitive"
        />
        <Select.Icon>
          <ChevronDownIcon className="text-label-assitive size-3 shrink-0" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} className="z-50">
          <Select.Popup className="border-line-normal bg-fill-normal text-label-14m text-label-normal min-w-[var(--anchor-width)] rounded-lg border py-1 shadow-md">
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

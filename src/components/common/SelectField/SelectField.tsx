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
  id?: string
  'aria-label'?: string
}

const fieldClassName =
  'border-line-normal flex h-10 w-full items-center rounded-lg border px-3 py-1.5'

export function SelectField({
  value,
  options,
  onValueChange,
  placeholder,
  disabled,
  className,
  id,
  'aria-label': ariaLabel,
}: SelectFieldProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value
  const hasValue = value.length > 0
  const valueClassName = hasValue ? 'bg-fill-normal text-label-strong' : 'bg-fill-netural'

  if (!onValueChange) {
    return (
      <output
        id={id}
        aria-label={ariaLabel}
        className={cn(fieldClassName, valueClassName, className)}
      >
        <span className="text-label-14m text-label-strong">{selectedLabel}</span>
      </output>
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
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          fieldClassName,
          valueClassName,
          'focus-visible:border-brand-primary focus-visible:bg-fill-normal justify-between outline-none',
          className,
        )}
      >
        <Select.Value
          placeholder={placeholder}
          className="text-label-14m text-label-strong data-placeholder:text-label-assitive"
        />
        <Select.Icon>
          <ChevronDownIcon className="text-label-assitive size-3 shrink-0" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4} className="z-50">
          <Select.Popup className="border-line-normal bg-fill-normal text-label-14m text-label-normal min-w-(--anchor-width) rounded-lg border py-1 shadow-md">
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

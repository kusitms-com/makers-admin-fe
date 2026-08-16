import { cn } from '@lib/utils'

export interface SegmentedControlItem {
  value: string
  label: string
}

interface SegmentedControlProps {
  items: SegmentedControlItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function SegmentedControl({
  items,
  value,
  onValueChange,
  className,
}: SegmentedControlProps) {
  return (
    <div role="tablist" className={cn('flex w-full items-stretch', className)}>
      {items.map((item) => {
        const isActive = item.value === value

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              onValueChange(item.value)
            }}
            className={cn(
              'text-body-16sb -mb-px flex flex-col items-center justify-center border-b-[1.5px] px-5 pt-2 pb-[11px] transition-colors',
              isActive
                ? 'border-brand-primary text-brand-primary'
                : 'border-line-normal text-label-assitive',
            )}
          >
            {item.label}
          </button>
        )
      })}
      <div aria-hidden="true" className="border-line-normal -mb-px flex-1 border-b-[1.5px]" />
    </div>
  )
}

import { useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import dayjs, { type Dayjs } from 'dayjs'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import CaretDownIcon from '@/assets/icons/generated/CaretDownIcon'
import { cn } from '@lib/utils'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']
const YEAR_GRID_SIZE = 12
const YEAR_GRID_BEFORE = 5

type PickerView = 'day' | 'month' | 'year'

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  className?: string
}

function getDayGrid(cursor: Dayjs) {
  const startOfMonth = cursor.startOf('month')
  const weekdayOfFirst = (startOfMonth.day() + 6) % 7
  const gridStart = startOfMonth.subtract(weekdayOfFirst, 'day')

  return Array.from({ length: 42 }, (_, index) => gridStart.add(index, 'day'))
}

function getYearGrid(cursor: Dayjs) {
  const rangeStart = cursor.year() - YEAR_GRID_BEFORE
  return Array.from({ length: YEAR_GRID_SIZE }, (_, index) => rangeStart + index)
}

function withYearMonth(date: Dayjs, year: number, month: number) {
  const daysInTargetMonth = dayjs().year(year).month(month).daysInMonth()
  const day = Math.min(date.date(), daysInTargetMonth)
  return dayjs().year(year).month(month).date(day)
}

const cellClassName =
  'text-label-13m flex items-center justify-center rounded-lg py-[9px] text-center transition-colors'

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<PickerView>('day')
  const [cursor, setCursor] = useState(() => dayjs(value).date(1))
  const [selected, setSelected] = useState(() => dayjs(value))
  const today = dayjs()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setCursor(dayjs(value).date(1))
      setSelected(dayjs(value))
      setView('day')
    }
  }

  function handleApply() {
    onChange(selected.toDate())
    setOpen(false)
  }

  function handlePrev() {
    if (view === 'day') setCursor((current) => current.subtract(1, 'month'))
    else if (view === 'month') setCursor((current) => current.subtract(1, 'year'))
    else setCursor((current) => current.subtract(YEAR_GRID_SIZE, 'year'))
  }

  function handleNext() {
    if (view === 'day') setCursor((current) => current.add(1, 'month'))
    else if (view === 'month') setCursor((current) => current.add(1, 'year'))
    else setCursor((current) => current.add(YEAR_GRID_SIZE, 'year'))
  }

  const headerLabel =
    view === 'day'
      ? cursor.format('YYYY년 M월')
      : view === 'month'
        ? cursor.format('YYYY년')
        : `${String(cursor.year() - YEAR_GRID_BEFORE)} - ${String(cursor.year() + YEAR_GRID_SIZE - YEAR_GRID_BEFORE - 1)}`

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        className={cn(
          'border-line-alternative text-label-light flex items-center gap-[7px] rounded-lg border px-4 py-2 outline-none',
          className,
        )}
      >
        <CalendarIcon className="size-5 shrink-0" aria-hidden="true" />
        <span className="text-label-14m">{dayjs(value).format('YYYY.MM.DD')}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={4} align="start" className="z-50">
          <Popover.Popup className="border-line-neutral bg-fill-normal w-[276px] rounded-xl border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] outline-none">
            <div className="flex flex-col items-stretch py-2">
              <div className="flex flex-col items-stretch pt-5 pb-2.5">
                <div className="flex items-center justify-between px-3">
                  {view === 'year' ? (
                    <span className="text-body-16sb text-label-normal px-3 py-1">
                      {headerLabel}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setView(view === 'day' ? 'month' : 'year')
                      }}
                      className="text-body-16sb text-label-normal hover:bg-fill-netural flex items-center gap-1 rounded-md px-3 py-1"
                    >
                      {headerLabel}
                      <CaretDownIcon className="size-2.5 shrink-0" aria-hidden="true" />
                    </button>
                  )}
                  <div className="flex items-center py-[3px]">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="이전"
                      className="hover:bg-fill-netural flex size-9 items-center justify-center rounded-full"
                    >
                      <ChevronLeft className="text-label-normal size-[18px]" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="다음"
                      className="hover:bg-fill-netural flex size-9 items-center justify-center rounded-full"
                    >
                      <ChevronRight className="text-label-normal size-[18px]" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {view === 'day' && (
                  <div className="flex items-center px-3">
                    {WEEKDAYS.map((weekday) => (
                      <span
                        key={weekday}
                        className="text-caption-11sb text-label-alternative flex-1 py-[11px] text-center"
                      >
                        {weekday}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {view === 'day' && (
                <div className="grid grid-cols-7 gap-0.5 px-3 pb-3.5">
                  {getDayGrid(cursor).map((day) => {
                    const inMonth = day.month() === cursor.month()
                    const isToday = day.isSame(today, 'day')
                    const isSelected = day.isSame(selected, 'day')

                    return (
                      <button
                        key={day.format('YYYY-MM-DD')}
                        type="button"
                        disabled={!inMonth}
                        onClick={() => {
                          setSelected(day)
                        }}
                        className={cn(
                          cellClassName,
                          'size-9 rounded-full',
                          !inMonth && 'text-label-normal/16',
                          inMonth &&
                            !isToday &&
                            !isSelected &&
                            'text-label-normal hover:bg-fill-netural',
                          isToday && !isSelected && 'bg-brand-primary/8 text-brand-primary',
                          isSelected && 'bg-brand-primary text-fill-normal',
                        )}
                      >
                        {day.date()}
                      </button>
                    )
                  })}
                </div>
              )}

              {view === 'month' && (
                <div className="grid grid-cols-3 gap-0.5 px-3 pb-3.5">
                  {Array.from({ length: 12 }, (_, index) => index).map((month) => {
                    const isSelected =
                      cursor.year() === selected.year() && month === selected.month()
                    const isCurrent = month === today.month() && cursor.year() === today.year()

                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => {
                          const next = withYearMonth(selected, cursor.year(), month)
                          setSelected(next)
                          setCursor(next.date(1))
                          setView('day')
                        }}
                        className={cn(
                          cellClassName,
                          !isSelected && !isCurrent && 'text-label-normal hover:bg-fill-netural',
                          isCurrent && !isSelected && 'bg-brand-primary/8 text-brand-primary',
                          isSelected && 'bg-brand-primary text-fill-normal',
                        )}
                      >
                        {month + 1}월
                      </button>
                    )
                  })}
                </div>
              )}

              {view === 'year' && (
                <div className="grid grid-cols-3 gap-0.5 px-3 pb-3.5">
                  {getYearGrid(cursor).map((year) => {
                    const isSelected = year === selected.year()
                    const isCurrent = year === today.year()
                    const isDisabled = year > today.year()

                    return (
                      <button
                        key={year}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          const next = withYearMonth(selected, year, selected.month())
                          setSelected(next)
                          setCursor(next.date(1))
                          setView('month')
                        }}
                        className={cn(
                          cellClassName,
                          isDisabled && 'text-label-normal/16',
                          !isDisabled &&
                            !isSelected &&
                            !isCurrent &&
                            'text-label-normal hover:bg-fill-netural',
                          isCurrent &&
                            !isSelected &&
                            !isDisabled &&
                            'bg-brand-primary/8 text-brand-primary',
                          isSelected && 'bg-brand-primary text-fill-normal',
                        )}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-line-alternative flex items-center border-t px-3 py-2.5">
              <button
                type="button"
                onClick={handleApply}
                className="text-label-14sb text-brand-primary hover:bg-brand-primary/8 rounded-md px-1.5 py-1"
              >
                적용
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

import { FormField } from '@components/common/FormField'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'

interface CardinalFieldProps {
  cardinal: number
  // 둘 다 넘기면 기수를 고를 수 있다. 없으면 현재 값만 보여주는 고정 칸이다(수정 모달 등).
  options?: SelectFieldOption[]
  onCardinalChange?: (cardinal: number) => void
  className?: string
}

export function CardinalField({
  cardinal,
  options,
  onCardinalChange,
  className,
}: CardinalFieldProps) {
  if (!options || !onCardinalChange) {
    return (
      <FormField label="기수" className={className}>
        <SelectField value={`${String(cardinal)}기`} options={[]} />
      </FormField>
    )
  }

  return (
    <FormField label="기수" className={className}>
      <SelectField
        value={String(cardinal)}
        options={options}
        onValueChange={(value) => {
          onCardinalChange(Number(value))
        }}
      />
    </FormField>
  )
}

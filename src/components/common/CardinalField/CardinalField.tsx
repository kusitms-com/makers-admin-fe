import { FormField } from '@components/common/FormField'
import { SelectField } from '@components/common/SelectField'

interface CardinalFieldProps {
  cardinal: number
  className?: string
}

export function CardinalField({ cardinal, className }: CardinalFieldProps) {
  return (
    <FormField label="기수" className={className}>
      <SelectField value={`${String(cardinal)}기`} options={[]} />
    </FormField>
  )
}

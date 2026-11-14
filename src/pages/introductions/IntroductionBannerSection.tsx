import type { BannerStatus } from '@api/introductions/types'
import { CardinalField } from '@components/common/CardinalField'
import { FormField } from '@components/common/FormField'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'

const BANNER_STATUS_OPTIONS: SelectFieldOption[] = [
  { value: 'CLOSE', label: '마감' },
  { value: 'UPCOMING_RECRUIT', label: '모집 예정' },
  { value: 'MANAGE_RECRUIT', label: '운영진 모집중' },
  { value: 'MEMBER_RECRUIT', label: '회원 모집중' },
]

interface IntroductionBannerSectionProps {
  cardinal: number
  bannerStatus: BannerStatus | ''
  onBannerStatusChange: (value: BannerStatus) => void
}

export function IntroductionBannerSection({
  cardinal,
  bannerStatus,
  onBannerStatusChange,
}: IntroductionBannerSectionProps) {
  return (
    <IntroductionSection title="상단 배너">
      <div className="flex items-stretch gap-3">
        <CardinalField cardinal={cardinal} className="w-[150px] shrink-0" />
        <FormField label="배너 상태" className="w-[200px] shrink-0">
          <SelectField
            value={bannerStatus}
            options={BANNER_STATUS_OPTIONS}
            onValueChange={(value) => {
              onBannerStatusChange(value as BannerStatus)
            }}
            placeholder="배너 상태를 선택해주세요"
          />
        </FormField>
      </div>
    </IntroductionSection>
  )
}

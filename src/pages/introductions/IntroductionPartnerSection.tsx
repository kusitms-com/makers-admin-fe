import { AddCircleButton } from '@components/introductions/AddCircleButton'
import { IntroductionSection } from '@components/introductions/IntroductionSection'
import { PartnerImageBox } from '@components/introductions/PartnerImageBox'
import type { PartnerLogo } from '@hooks/introductions/useIntroductionsForm'

interface IntroductionPartnerSectionProps {
  title?: string
  addLabel?: string
  partners: PartnerLogo[]
  onReplace: (id: string, file: File) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function IntroductionPartnerSection({
  title = '후원사',
  addLabel = '후원사 추가',
  partners,
  onReplace,
  onDelete,
  onAdd,
}: IntroductionPartnerSectionProps) {
  return (
    <IntroductionSection title={title}>
      <div className="flex flex-wrap gap-3">
        {partners.map((partner) => (
          <PartnerImageBox
            key={partner.id}
            imageUrl={partner.imageUrl}
            onFileChange={(file) => {
              onReplace(partner.id, file)
            }}
            onDelete={() => {
              onDelete(partner.id)
            }}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <AddCircleButton aria-label={addLabel} onClick={onAdd} />
      </div>
    </IntroductionSection>
  )
}

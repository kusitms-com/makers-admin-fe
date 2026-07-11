import { useState, type ChangeEvent } from 'react'
import { Button } from '@components/common/Button'
import { FormField } from '@components/common/FormField'
import { ImageUploadBox } from '@components/common/ImageUploadBox'
import { Inputfield } from '@components/common/Inputfield'
import { Modal } from '@components/common/Modal'
import { SelectField, type SelectFieldOption } from '@components/common/SelectField'

export interface MeetupTeamMember {
  id: string
  part: string
  name: string
}

interface MeetupProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cardinal: number
  type: string
  typeOptions: SelectFieldOption[]
  onTypeChange: (value: string) => void
  name: string
  onNameChange: (value: string) => void
  oneLineIntro: string
  onOneLineIntroChange: (value: string) => void
  intro: string
  onIntroChange: (value: string) => void
  members: MeetupTeamMember[]
  partOptions: SelectFieldOption[]
  onMemberPartChange: (id: string, value: string) => void
  onMemberRemove: (id: string) => void
  onMemberAdd: (member: { part: string; name: string }) => void
  posterUrl?: string
  onPosterChange?: (file: File) => void
  onPosterDelete?: () => void
  githubUrl: string
  onGithubUrlChange: (value: string) => void
  behanceUrl: string
  onBehanceUrlChange: (value: string) => void
  appUrl: string
  onAppUrlChange: (value: string) => void
  onCancel: () => void
  onSave: () => void
  saveDisabled?: boolean
  className?: string
}

export function MeetupProjectModal({
  open,
  onOpenChange,
  cardinal,
  type,
  typeOptions,
  onTypeChange,
  name,
  onNameChange,
  oneLineIntro,
  onOneLineIntroChange,
  intro,
  onIntroChange,
  members,
  partOptions,
  onMemberPartChange,
  onMemberRemove,
  onMemberAdd,
  posterUrl,
  onPosterChange,
  onPosterDelete,
  githubUrl,
  onGithubUrlChange,
  behanceUrl,
  onBehanceUrlChange,
  appUrl,
  onAppUrlChange,
  onCancel,
  onSave,
  saveDisabled = true,
  className,
}: MeetupProjectModalProps) {
  const [draftPart, setDraftPart] = useState(partOptions[0]?.value ?? '')
  const [draftName, setDraftName] = useState('')

  const handleAddMember = () => {
    const trimmedName = draftName.trim()
    if (!trimmedName) return

    onMemberAdd({ part: draftPart, name: trimmedName })
    setDraftName('')
    setDraftPart(partOptions[0]?.value ?? '')
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="밋업 프로젝트 등록"
      className={className ?? 'w-[540px]'}
      footer={
        <>
          <Button variant="error" size="l" className="w-[140px]" onClick={onCancel}>
            취소하기
          </Button>
          <Button
            variant={saveDisabled ? 'disable' : 'strong'}
            size="l"
            className="w-[140px]"
            disabled={saveDisabled}
            onClick={onSave}
          >
            저장하기
          </Button>
        </>
      }
    >
      <div className="flex items-stretch gap-3">
        <FormField label="기수" className="w-[130px] shrink-0">
          <SelectField value={`${String(cardinal)}기`} options={[]} />
        </FormField>
        <FormField label="유형" className="shrink-0">
          <SelectField
            value={type}
            options={typeOptions}
            onValueChange={onTypeChange}
            className="w-24"
          />
        </FormField>
        <FormField label="프로젝트 이름" className="flex-1">
          <Inputfield
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onNameChange(event.target.value)
            }}
            placeholder="서비스 이름을 입력해주세요"
          />
        </FormField>
      </div>
      <FormField label="한 줄 소개">
        <Inputfield
          value={oneLineIntro}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onOneLineIntroChange(event.target.value)
          }}
          placeholder="한 줄 소개를 입력해주세요"
        />
      </FormField>
      <FormField label="프로젝트 소개">
        <Inputfield
          value={intro}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onIntroChange(event.target.value)
          }}
          placeholder="프로젝트 소개를 입력해주세요"
        />
      </FormField>
      <FormField label="팀원 관리">
        <div className="flex flex-col items-stretch gap-3">
          <div className="flex w-full items-center gap-2">
            <SelectField
              value={draftPart}
              options={partOptions}
              onValueChange={setDraftPart}
              className="w-[130px] shrink-0"
            />
            <Inputfield
              value={draftName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setDraftName(event.target.value)
              }}
              placeholder="이름"
              className="flex-1"
            />
            <Button
              variant={draftName.trim() ? 'primary' : 'disable'}
              size="m"
              className="w-[100px] shrink-0"
              onClick={handleAddMember}
            >
              추가하기
            </Button>
          </div>
          {members.map((member) => (
            <div key={member.id} className="flex w-full items-center gap-2">
              <SelectField
                value={member.part}
                options={partOptions}
                onValueChange={(value) => {
                  onMemberPartChange(member.id, value)
                }}
                className="w-[130px] shrink-0"
              />
              <Inputfield value={member.name} readOnly className="flex-1" />
              <Button
                variant="error"
                size="m"
                className="w-[100px] shrink-0"
                onClick={() => {
                  onMemberRemove(member.id)
                }}
              >
                삭제하기
              </Button>
            </div>
          ))}
        </div>
      </FormField>
      <FormField label="포스터 이미지">
        <ImageUploadBox
          imageUrl={posterUrl}
          onFileChange={onPosterChange}
          onDelete={onPosterDelete}
        />
      </FormField>
      <FormField label="링크">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-caption-12sb text-label-alternative">깃허브 URL</span>
            <Inputfield
              value={githubUrl}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onGithubUrlChange(event.target.value)
              }}
              placeholder="링크를 붙여넣어주세요"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-caption-12sb text-label-alternative">비핸스 URL</span>
            <Inputfield
              value={behanceUrl}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onBehanceUrlChange(event.target.value)
              }}
              placeholder="링크를 붙여넣어주세요"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-caption-12sb text-label-alternative">서비스 URL</span>
            <Inputfield
              value={appUrl}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onAppUrlChange(event.target.value)
              }}
              placeholder="링크를 붙여넣어주세요"
            />
          </div>
        </div>
      </FormField>
    </Modal>
  )
}

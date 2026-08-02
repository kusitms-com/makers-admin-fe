import { useState } from 'react'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { SegmentedControl } from '@components/common/SegmentedControl'
import { MeetupProjectModal } from '@components/projects/MeetupProjectModal'
import { ProjectThumbnailCard } from '@components/projects/ProjectThumbnailCard'
import { useMeetupProjectForm } from '@hooks/projects/useMeetupProjectForm'
import {
  COHORT_OPTIONS,
  CURRENT_GENERATION,
  INITIAL_MEETUP_PROJECTS,
  PART_OPTIONS,
  PLACEHOLDER_THUMBNAIL_URL,
  TYPE_OPTIONS,
  type MeetupProjectCard,
} from './MeetupProjectsPage.mock'

export function MeetupProjectsPage() {
  const [projects, setProjects] = useState<MeetupProjectCard[]>(INITIAL_MEETUP_PROJECTS)
  const [cohort, setCohort] = useState(String(CURRENT_GENERATION))
  const [modalOpen, setModalOpen] = useState(false)

  const form = useMeetupProjectForm()

  const visibleProjects = projects.filter((project) => project.cardinal === Number(cohort))

  function openModal() {
    form.reset()
    setModalOpen(true)
  }

  function handleSave() {
    void form.handleSubmit((values) => {
      setProjects((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          cardinal: CURRENT_GENERATION,
          serviceName: values.name,
          imageUrl: values.posterUrl || PLACEHOLDER_THUMBNAIL_URL,
        },
      ])
      setModalOpen(false)
    })()
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((project) => project.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="밋업 프로젝트" />

      <div className="flex flex-col gap-7 px-6 pt-6 pb-15">
        <section className="flex items-center justify-between">
          <h2 className="text-body-18sb text-label-normal">프로젝트 추가하기</h2>
          <Button variant="outlined" size="l" onClick={openModal}>
            추가하기
          </Button>
        </section>

        <section className="flex flex-col gap-6">
          <SegmentedControl items={COHORT_OPTIONS} value={cohort} onValueChange={setCohort} />

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {visibleProjects.map((project) => (
              <ProjectThumbnailCard
                key={project.id}
                imageUrl={project.imageUrl}
                serviceName={project.serviceName}
                onDelete={() => {
                  handleDelete(project.id)
                }}
              />
            ))}
          </div>
        </section>
      </div>

      <MeetupProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        cardinal={CURRENT_GENERATION}
        type={form.type}
        typeOptions={TYPE_OPTIONS}
        onTypeChange={form.setType}
        name={form.name}
        onNameChange={form.setName}
        oneLineIntro={form.oneLineIntro}
        onOneLineIntroChange={form.setOneLineIntro}
        intro={form.intro}
        onIntroChange={form.setIntro}
        members={form.members}
        partOptions={PART_OPTIONS}
        onMemberPartChange={form.onMemberPartChange}
        onMemberRemove={form.onMemberRemove}
        onMemberAdd={form.onMemberAdd}
        posterUrl={form.posterUrl}
        onPosterChange={form.onPosterChange}
        onPosterDelete={form.onPosterDelete}
        githubUrl={form.githubUrl}
        onGithubUrlChange={form.setGithubUrl}
        behanceUrl={form.behanceUrl}
        onBehanceUrlChange={form.setBehanceUrl}
        appUrl={form.appUrl}
        onAppUrlChange={form.setAppUrl}
        onCancel={() => {
          setModalOpen(false)
        }}
        onSave={handleSave}
        saveDisabled={!form.isValid}
      />
    </div>
  )
}

export default MeetupProjectsPage

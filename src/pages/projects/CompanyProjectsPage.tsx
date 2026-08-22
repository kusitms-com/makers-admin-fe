import { useEffect, useRef, useState } from 'react'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { SegmentedControl } from '@components/common/SegmentedControl'
import { CompanyProjectModal } from '@components/projects/CompanyProjectModal'
import { ProjectThumbnailCard } from '@components/projects/ProjectThumbnailCard'
import { useCompanyProjectForm } from '@hooks/projects/useCompanyProjectForm'
import {
  COHORT_OPTIONS,
  CURRENT_GENERATION,
  INITIAL_COMPANY_PROJECTS,
  type CompanyProjectCard,
} from './CompanyProjectsPage.mock'

function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export function CompanyProjectsPage() {
  const [projects, setProjects] = useState<CompanyProjectCard[]>(INITIAL_COMPANY_PROJECTS)
  const [cohort, setCohort] = useState(String(CURRENT_GENERATION))
  const [modalOpen, setModalOpen] = useState(false)

  const form = useCompanyProjectForm()

  const latestProjectsRef = useRef(projects)
  useEffect(() => {
    latestProjectsRef.current = projects
  }, [projects])
  useEffect(() => {
    return () => {
      latestProjectsRef.current.forEach((project) => {
        revokeIfBlobUrl(project.imageUrl)
      })
    }
  }, [])

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
          content: values.content,
          imageUrl: values.bannerUrl,
        },
      ])
      form.resetAfterSave()
      setModalOpen(false)
    })()
  }

  function handleDelete(id: string) {
    const target = projects.find((project) => project.id === id)
    revokeIfBlobUrl(target?.imageUrl)
    setProjects((prev) => prev.filter((project) => project.id !== id))
  }

  function closeModal() {
    form.reset()
    setModalOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="기업 프로젝트" />

      <div className="flex flex-col gap-7 pt-6 pr-8 pb-15 pl-6">
        <section className="flex flex-col items-start gap-3">
          <h2 className="text-body-18sb text-label-normal">프로젝트 추가하기</h2>
          <Button variant="outlined" size="l" onClick={openModal}>
            추가하기
          </Button>
        </section>

        <section className="flex flex-col gap-6">
          <SegmentedControl items={COHORT_OPTIONS} value={cohort} onValueChange={setCohort} />

          {visibleProjects.length === 0 ? (
            <p className="text-body-16sb text-label-alternative py-10 text-center">
              등록된 프로젝트가 없습니다
            </p>
          ) : (
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
          )}
        </section>
      </div>

      <CompanyProjectModal
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal()
          }
        }}
        cardinal={CURRENT_GENERATION}
        name={form.name}
        onNameChange={form.setName}
        content={form.content}
        onContentChange={form.setContent}
        bannerUrl={form.bannerUrl}
        onBannerChange={form.onBannerChange}
        onBannerDelete={form.onBannerDelete}
        onCancel={closeModal}
        onSave={handleSave}
        saveDisabled={!form.isValid}
      />
    </div>
  )
}

export default CompanyProjectsPage

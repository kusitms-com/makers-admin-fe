import { useEffect, useRef, useState } from 'react'
import type {
  CorporateProjectCreateRequest,
  CorporateProjectDetail,
  CorporateProjectListItem,
  CorporateProjectUpdateRequest,
} from '@api/projects'
import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'
import { PageHeader } from '@components/common/PageHeader'
import { SegmentedControl } from '@components/common/SegmentedControl'
import { CompanyProjectModal } from '@components/projects/CompanyProjectModal'
import { ProjectThumbnailCard } from '@components/projects/ProjectThumbnailCard'
import { useCurrentCardinalQuery } from '@hooks/auth/useCurrentCardinal'
import { useCardinalSelection } from '@hooks/common/useCardinalSelection'
import { useToast } from '@hooks/common/useToast'
import {
  useCompanyProjectForm,
  type CompanyProjectFormValues,
} from '@hooks/projects/useCompanyProjectForm'
import {
  useCompanyProjectQuery,
  useCompanyProjectsQuery,
  useCreateCompanyProjectMutation,
  useDeleteCompanyProjectMutation,
  useUpdateCompanyProjectMutation,
} from '@hooks/projects/useCompanyProjects'
import { toCohortOptions } from '@lib/cohort'
import { toAbsoluteS3Url } from '@lib/s3'
import { PLACEHOLDER_THUMBNAIL_URL } from './projects.constants'
import { TOAST_MESSAGES } from '@/constants/toastMessages'

function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function toProjectCard(item: CorporateProjectListItem) {
  return {
    id: String(item.corporate_id),
    cardinal: item.cardinal,
    serviceName: item.name,
    content: item.content,
    imageUrl: toAbsoluteS3Url(item.banner_url) ?? PLACEHOLDER_THUMBNAIL_URL,
  }
}

function detailToFormValues(detail: CorporateProjectDetail): CompanyProjectFormValues {
  return {
    name: detail.name,
    content: detail.content,
    logoUrl: toAbsoluteS3Url(detail.logo_url) ?? '',
    bannerUrl: toAbsoluteS3Url(detail.banner_url) ?? '',
  }
}

export function CompanyProjectsPage() {
  const projectsQuery = useCompanyProjectsQuery()
  const currentCardinalQuery = useCurrentCardinalQuery()
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const form = useCompanyProjectForm()
  const editForm = useCompanyProjectForm()
  const addToast = useToast()
  const createMutation = useCreateCompanyProjectMutation()
  const updateMutation = useUpdateCompanyProjectMutation()
  const deleteMutation = useDeleteCompanyProjectMutation()
  const detailQuery = useCompanyProjectQuery(detailId ?? undefined)

  const projects = (projectsQuery.data?.corporateList ?? []).map(toProjectCard)
  const cardinalSelection = useCardinalSelection(projects.map((project) => project.cardinal))

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

  // 선택한 기수의 마지막 프로젝트를 지워도 그 탭이 남아 있어야 어느 기수의 빈 목록인지 알 수 있다.
  const cohortOptions = toCohortOptions(
    [
      ...projects.map((project) => project.cardinal),
      ...(selectedCohort ? [Number(selectedCohort)] : []),
    ],
    currentCardinalQuery.data,
  )
  const cohort = selectedCohort ?? cohortOptions.at(0)?.value ?? ''
  const visibleProjects = projects.filter((project) => project.cardinal === Number(cohort))

  function openDetail(id: string) {
    setDetailId(Number(id))
  }

  function closeDetail() {
    setDetailId(null)
    setIsEditing(false)
    editForm.reset()
  }

  function startEdit() {
    if (!detailQuery.data) return
    editForm.loadValues(detailToFormValues(detailQuery.data))
    setIsEditing(true)
  }

  function handleUpdate() {
    void editForm.handleSubmit((values) => {
      if (detailId === null || !detailQuery.data) return

      const request: CorporateProjectUpdateRequest = {
        corporateId: detailId,
        cardinal: detailQuery.data.cardinal,
        name: values.name,
        content: values.content,
        logoFile: editForm.logoFile,
        bannerFile: editForm.bannerFile,
      }

      updateMutation.mutate(request, {
        onSuccess: () => {
          addToast({ type: 'complete', message: TOAST_MESSAGES.updated })
          setIsEditing(false)
        },
        onError: () => {
          addToast({ type: 'error', message: TOAST_MESSAGES.updateFailed })
        },
      })
    })()
  }

  function openModal() {
    form.reset()
    cardinalSelection.reset()
    setModalOpen(true)
  }

  function handleSave() {
    void form.handleSubmit((values) => {
      // zod 검증(logoUrl/bannerUrl 필수)을 통과했다면 onLogoChange/onBannerChange에서
      // 항상 같이 설정되므로 logoFile/bannerFile도 존재한다.
      if (!form.logoFile || !form.bannerFile) return

      const currentCardinal = cardinalSelection.cardinal
      if (currentCardinal === undefined) return

      const request: CorporateProjectCreateRequest = {
        cardinal: currentCardinal,
        name: values.name,
        content: values.content,
        logoFile: form.logoFile,
        bannerFile: form.bannerFile,
      }

      createMutation.mutate(request, {
        onSuccess: () => {
          addToast({ type: 'complete', message: TOAST_MESSAGES.saved })
          form.resetAfterSave()
          setModalOpen(false)
        },
        onError: () => {
          addToast({ type: 'error', message: TOAST_MESSAGES.saveFailed })
        },
      })
    })()
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => {
        addToast({ type: 'complete', message: TOAST_MESSAGES.deleted })
        revokeIfBlobUrl(projects.find((project) => project.id === id)?.imageUrl)
      },
      onError: () => {
        addToast({ type: 'error', message: TOAST_MESSAGES.deleteFailed })
      },
    })
  }

  function closeModal() {
    form.reset()
    setModalOpen(false)
  }

  if (projectsQuery.isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="기업 프로젝트" />
        <div className="text-label-14m text-label-alternative flex flex-1 items-center justify-center">
          불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (projectsQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="기업 프로젝트" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-label-14m text-label-alternative">
            기업 프로젝트 목록을 불러오지 못했습니다.
          </p>
          <Button
            variant="primary"
            size="s"
            onClick={() => {
              void projectsQuery.refetch()
            }}
          >
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="기업 프로젝트" />

      <div className="flex flex-col gap-7 pt-6 pr-8 pb-15 pl-6">
        <section className="flex flex-col items-start gap-3">
          <h2 className="text-body-18sb text-label-normal">프로젝트 추가하기</h2>
          <Button
            variant="outlined"
            size="l"
            disabled={currentCardinalQuery.data === undefined}
            onClick={openModal}
          >
            추가하기
          </Button>
        </section>

        <section className="flex flex-col gap-6">
          <SegmentedControl
            items={cohortOptions}
            value={cohort}
            onValueChange={setSelectedCohort}
          />

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
                  onViewDetail={() => {
                    openDetail(project.id)
                  }}
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
        cardinal={cardinalSelection.cardinal ?? 0}
        cardinalOptions={cardinalSelection.options}
        onCardinalChange={cardinalSelection.setCardinal}
        name={form.name}
        onNameChange={form.setName}
        content={form.content}
        onContentChange={form.setContent}
        logoUrl={form.logoUrl}
        onLogoChange={form.onLogoChange}
        onLogoDelete={form.onLogoDelete}
        bannerUrl={form.bannerUrl}
        onBannerChange={form.onBannerChange}
        onBannerDelete={form.onBannerDelete}
        onCancel={closeModal}
        onSave={handleSave}
        saveDisabled={
          !form.isValid || createMutation.isPending || currentCardinalQuery.data === undefined
        }
      />

      {detailId !== null && detailQuery.isPending && (
        <Modal
          open
          onOpenChange={closeDetail}
          title="기업 프로젝트 상세"
          footer={
            <Button variant="outlined" size="l" className="w-[140px]" onClick={closeDetail}>
              닫기
            </Button>
          }
        >
          <p className="text-label-14m text-label-alternative py-10 text-center">
            불러오는 중입니다...
          </p>
        </Modal>
      )}

      {detailId !== null && detailQuery.isError && (
        <Modal
          open
          onOpenChange={closeDetail}
          title="기업 프로젝트 상세"
          footer={
            <Button variant="outlined" size="l" className="w-[140px]" onClick={closeDetail}>
              닫기
            </Button>
          }
        >
          <p className="text-label-14m text-label-alternative py-10 text-center">
            상세 정보를 불러오지 못했습니다.
          </p>
        </Modal>
      )}

      {detailQuery.data && (
        <CompanyProjectModal
          open={detailId !== null}
          onOpenChange={(open) => {
            if (!open) closeDetail()
          }}
          readOnly={!isEditing}
          onEdit={startEdit}
          cardinal={detailQuery.data.cardinal}
          name={isEditing ? editForm.name : detailQuery.data.name}
          onNameChange={isEditing ? editForm.setName : () => {}}
          content={isEditing ? editForm.content : detailQuery.data.content}
          onContentChange={isEditing ? editForm.setContent : () => {}}
          logoUrl={isEditing ? editForm.logoUrl : toAbsoluteS3Url(detailQuery.data.logo_url)}
          onLogoChange={isEditing ? editForm.onLogoChange : undefined}
          onLogoDelete={isEditing ? editForm.onLogoDelete : undefined}
          bannerUrl={isEditing ? editForm.bannerUrl : toAbsoluteS3Url(detailQuery.data.banner_url)}
          onBannerChange={isEditing ? editForm.onBannerChange : undefined}
          onBannerDelete={isEditing ? editForm.onBannerDelete : undefined}
          onCancel={closeDetail}
          onSave={handleUpdate}
          saveDisabled={!editForm.isValid || updateMutation.isPending}
        />
      )}
    </div>
  )
}

export default CompanyProjectsPage

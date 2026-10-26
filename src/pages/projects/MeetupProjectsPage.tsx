import { useEffect, useRef, useState } from 'react'
import type {
  MeetupProjectCreateRequest,
  MeetupProjectListItem,
  MeetupProjectType,
} from '@api/projects'
import { Button } from '@components/common/Button'
import { PageHeader } from '@components/common/PageHeader'
import { SegmentedControl } from '@components/common/SegmentedControl'
import { MeetupProjectModal } from '@components/projects/MeetupProjectModal'
import { ProjectThumbnailCard } from '@components/projects/ProjectThumbnailCard'
import { useToast } from '@hooks/common/useToast'
import {
  useMeetupProjectForm,
  type MeetupProjectFormValues,
} from '@hooks/projects/useMeetupProjectForm'
import {
  useCreateMeetupProjectMutation,
  useMeetupProjectsQuery,
} from '@hooks/projects/useMeetupProjects'
import { toAbsoluteS3Url } from '@lib/s3'
import {
  COHORT_OPTIONS,
  CURRENT_GENERATION,
  PART_OPTIONS,
  PLACEHOLDER_THUMBNAIL_URL,
  TYPE_OPTIONS,
  type MeetupProjectCard,
} from './MeetupProjectsPage.mock'

function revokeIfBlobUrl(url: string | undefined) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function membersByPart(members: MeetupProjectFormValues['members'], part: string) {
  return members.filter((member) => member.part === part).map((member) => member.name)
}

function toProjectCard(item: MeetupProjectListItem): MeetupProjectCard {
  return {
    id: String(item.meetup_id),
    cardinal: item.cardinal,
    serviceName: item.name,
    imageUrl: toAbsoluteS3Url(item.poster_url) ?? PLACEHOLDER_THUMBNAIL_URL,
  }
}

export function MeetupProjectsPage() {
  const projectsQuery = useMeetupProjectsQuery()
  const [cohort, setCohort] = useState(String(CURRENT_GENERATION))
  const [modalOpen, setModalOpen] = useState(false)
  // 삭제 API가 아직 없어서, 조회 데이터에서 숨길 id만 로컬로 들고 있는다.
  const [hiddenProjectIds, setHiddenProjectIds] = useState<Set<string>>(new Set())

  const form = useMeetupProjectForm()
  const addToast = useToast()
  const createMutation = useCreateMeetupProjectMutation()

  const projects = (projectsQuery.data?.meetup_list ?? [])
    .map(toProjectCard)
    .filter((project) => !hiddenProjectIds.has(project.id))

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
      // zod 검증(posterUrl/logoUrl 필수)을 통과했다면 onPosterChange/onLogoChange에서
      // 항상 같이 설정되므로 posterFile/logoFile도 존재한다.
      if (!form.posterFile || !form.logoFile) return

      const request: MeetupProjectCreateRequest = {
        cardinal: CURRENT_GENERATION,
        name: values.name,
        intro: values.intro,
        type: values.type as MeetupProjectType,
        oneLineIntro: values.oneLineIntro,
        teamName: values.teamName,
        startDate: form.startDateIso,
        endDate: form.endDateIso,
        instagramUrl: values.instagramUrl,
        githubUrl: values.githubUrl,
        appUrl: values.appUrl,
        behanceUrl: values.behanceUrl,
        planner: membersByPart(values.members, 'planner'),
        designer: membersByPart(values.members, 'designer'),
        frontend: membersByPart(values.members, 'frontend'),
        backend: membersByPart(values.members, 'backend'),
        ios: membersByPart(values.members, 'ios'),
        aos: membersByPart(values.members, 'aos'),
        logoFile: form.logoFile,
        posterFile: form.posterFile,
      }

      createMutation.mutate(request, {
        onSuccess: () => {
          form.resetAfterSave()
          setModalOpen(false)
        },
        onError: () => {
          addToast({ type: 'error', message: '저장하지 못했습니다. 다시 시도해주세요.' })
        },
      })
    })()
  }

  function handleDelete(id: string) {
    const target = projects.find((project) => project.id === id)
    revokeIfBlobUrl(target?.imageUrl)
    setHiddenProjectIds((prev) => new Set(prev).add(id))
  }

  if (projectsQuery.isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="밋업 프로젝트" />
        <div className="text-label-14m text-label-alternative flex flex-1 items-center justify-center">
          불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (projectsQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="밋업 프로젝트" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-label-14m text-label-alternative">
            밋업 프로젝트 목록을 불러오지 못했습니다.
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
      <PageHeader title="밋업 프로젝트" />

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
        teamName={form.teamName}
        onTeamNameChange={form.setTeamName}
        members={form.members}
        partOptions={PART_OPTIONS}
        onMemberPartChange={form.onMemberPartChange}
        onMemberRemove={form.onMemberRemove}
        onMemberAdd={form.onMemberAdd}
        logoUrl={form.logoUrl}
        onLogoChange={form.onLogoChange}
        onLogoDelete={form.onLogoDelete}
        posterUrl={form.posterUrl}
        onPosterChange={form.onPosterChange}
        onPosterDelete={form.onPosterDelete}
        githubUrl={form.githubUrl}
        onGithubUrlChange={form.setGithubUrl}
        behanceUrl={form.behanceUrl}
        onBehanceUrlChange={form.setBehanceUrl}
        appUrl={form.appUrl}
        onAppUrlChange={form.setAppUrl}
        instagramUrl={form.instagramUrl}
        onInstagramUrlChange={form.setInstagramUrl}
        startDate={form.startDate}
        onStartDateChange={form.setStartDate}
        endDate={form.endDate}
        onEndDateChange={form.setEndDate}
        onCancel={() => {
          setModalOpen(false)
        }}
        onSave={handleSave}
        saveDisabled={!form.isValid || createMutation.isPending}
      />
    </div>
  )
}

export default MeetupProjectsPage

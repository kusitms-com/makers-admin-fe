import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router'
import {
  BlogIcon,
  CompanyIcon,
  DashboardIcon,
  IntroductionIcon,
  LogoutIcon,
  MeetupIcon,
  MentoringIcon,
  ReviewIcon,
} from '@/assets/icons/generated'
import { cn } from '@lib/utils'
import { Button } from '../Button'
import { Logo } from '../Logo'

interface SidebarNavConfig {
  path: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

// 실제 라우트 등록(src/routes) 전 잠정 경로. 라우팅 설계가 확정되면 함께 갱신한다.
const NAV_ITEMS: SidebarNavConfig[] = [
  { path: '/introduction', label: '학회 소개', icon: IntroductionIcon },
  { path: '/meetup', label: '밋업 프로젝트', icon: MeetupIcon },
  { path: '/company', label: '기업 프로젝트', icon: CompanyIcon },
  { path: '/review', label: '활동 후기', icon: ReviewIcon },
  { path: '/blog-review', label: '블로그 후기', icon: BlogIcon },
  { path: '/members', label: '회원 관리', icon: MentoringIcon },
  { path: '/mentoring', label: '멘토링 관리', icon: DashboardIcon },
]

interface SidebarNavLinkProps {
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
}

function SidebarNavLink({ path, icon: Icon, label }: SidebarNavLinkProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          'text-body-16sb flex items-center gap-2.5 self-stretch rounded-[8px] px-3 py-2.5 transition-colors',
          isActive
            ? 'bg-fill-primary text-brand-primary'
            : 'text-label-light hover:bg-fill-alternative',
        )
      }
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {label}
    </NavLink>
  )
}

interface SidebarProps {
  onLogout?: () => void
  // 어드민 전체의 기준 기수. 아직 못 받았으면 표시하지 않는다.
  currentCardinal?: number
  // OWNER에게만 넘긴다. 있으면 다음 기수로 바꾸는 버튼을 보여 준다.
  onCardinalAdvance?: () => void
  className?: string
}

// NavLink를 사용하므로 react-router의 Router context 안에서만 렌더링 가능하다.
export function Sidebar({ onLogout, currentCardinal, onCardinalAdvance, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-fill-normal border-line-neutral w-sidebar flex h-full flex-col border-r',
        className,
      )}
    >
      <div className="border-line-neutral flex h-[84px] items-center gap-2.5 border-b py-4 pr-5 pb-[18px] pl-6">
        <Logo size="sm" />
      </div>
      <nav className="flex flex-1 flex-col justify-between px-3 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="px-3 pt-3.5 pb-[7px] text-left">
            <span className="text-label-14sb text-label-assitive">MENU</span>
          </div>
          {NAV_ITEMS.map((item) => (
            <SidebarNavLink key={item.path} path={item.path} icon={item.icon} label={item.label} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {currentCardinal !== undefined && (
            <div className="flex items-center justify-between gap-2 px-4">
              <span className="text-label-14m text-label-alternative">
                현재 {currentCardinal}기
              </span>
              {onCardinalAdvance && (
                <Button variant="outlined" size="s" onClick={onCardinalAdvance}>
                  {currentCardinal + 1}기로 변경
                </Button>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="text-body-16r text-label-netural hover:bg-fill-alternative flex h-12 cursor-pointer items-center gap-2.5 rounded-[8px] px-4 transition-colors"
          >
            <LogoutIcon className="text-label-alternative size-5 shrink-0" aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </nav>
    </aside>
  )
}

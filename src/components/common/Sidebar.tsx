import type { ComponentType, SVGProps } from 'react'
import {
  BlogIcon,
  CompanyIcon,
  IntroductionIcon,
  LogoutIcon,
  MeetupIcon,
  ReviewIcon,
} from '@/assets/icons/generated'
import { cn } from '@lib/utils'
import { Logo } from './Logo'

export type SidebarNavKey =
  | 'introduction'
  | 'meetup'
  | 'company'
  | 'review'
  | 'blog-review'
  | 'members'
  | 'mentoring'

interface SidebarNavConfig {
  key: SidebarNavKey
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const NAV_ITEMS: SidebarNavConfig[] = [
  { key: 'introduction', label: '학회 소개', icon: IntroductionIcon },
  { key: 'meetup', label: '밋업 프로젝트', icon: MeetupIcon },
  { key: 'company', label: '기업 프로젝트', icon: CompanyIcon },
  { key: 'review', label: '후기', icon: ReviewIcon },
  { key: 'blog-review', label: '블로그 후기', icon: BlogIcon },
  { key: 'members', label: '회원 관리', icon: BlogIcon },
  { key: 'mentoring', label: '멘토링 관리', icon: BlogIcon },
]

interface SidebarNavButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  active: boolean
  onClick: () => void
}

function SidebarNavButton({ icon: Icon, label, active, onClick }: SidebarNavButtonProps) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'text-body-16sb flex items-center gap-2.5 self-stretch rounded-[8px] px-3 py-2.5 transition-colors',
        active
          ? 'bg-fill-primary text-brand-primary'
          : 'text-label-light hover:bg-fill-alternative',
      )}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {label}
    </button>
  )
}

interface SidebarProps {
  activeKey: SidebarNavKey
  onNavigate: (key: SidebarNavKey) => void
  onLogout?: () => void
  className?: string
}

export function Sidebar({ activeKey, onNavigate, onLogout, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-fill-normal border-line-neutral flex h-full w-[220px] flex-col border-r',
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
            <SidebarNavButton
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={item.key === activeKey}
              onClick={() => {
                onNavigate(item.key)
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-body-16r text-label-netural hover:bg-fill-alternative flex h-12 items-center gap-2.5 rounded-[8px] px-4 transition-colors"
        >
          <LogoutIcon className="text-label-alternative size-5 shrink-0" aria-hidden="true" />
          로그아웃
        </button>
      </nav>
    </aside>
  )
}

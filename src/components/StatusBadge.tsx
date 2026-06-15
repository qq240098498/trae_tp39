import type { MaintenanceStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; className: string }> = {
  overdue: {
    label: '已过期',
    className: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  warning: {
    label: '即将到期',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  safe: {
    label: '安全',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
}

interface StatusBadgeProps {
  status: MaintenanceStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {status === 'overdue' && (
        <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {status === 'warning' && (
        <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )}
      {status === 'safe' && (
        <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )}
      {config.label}
    </span>
  )
}

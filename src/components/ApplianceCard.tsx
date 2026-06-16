import type { Appliance, MaintenanceStatus } from '@/types'
import { StatusBadge } from './StatusBadge'
import { getMaintenanceStatus, getDaysLabel, formatDisplayDate, daysUntil } from '@/utils/date'
import { APPLIANCE_TYPE_MAP, ROOM_MAP } from '@/constants/templates'
import { cn } from '@/lib/utils'
import {
  AirVent,
  WashingMachine,
  Refrigerator,
  CookingPot,
  Flame,
  Droplets,
  Bot,
  Wrench,
  MapPin,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  AirVent,
  WashingMachine,
  Refrigerator,
  CookingPot,
  Flame,
  Droplets,
  Bot,
  Wrench,
}

interface ApplianceCardProps {
  appliance: Appliance
  onMaintenance: (appliance: Appliance) => void
  onEdit: (appliance: Appliance) => void
  onDelete: (id: string) => void
  onViewRecords: (id: string) => void
}

export function ApplianceCard({
  appliance,
  onMaintenance,
  onEdit,
  onDelete,
  onViewRecords,
}: ApplianceCardProps) {
  const status: MaintenanceStatus = getMaintenanceStatus(appliance.nextMaintenanceDate)
  const daysLabel = getDaysLabel(appliance.nextMaintenanceDate)
  const template = APPLIANCE_TYPE_MAP[appliance.type]
  const IconComponent = ICON_MAP[appliance.icon] || Wrench

  const borderColor = {
    overdue: 'border-l-red-500',
    warning: 'border-l-amber-500',
    safe: 'border-l-emerald-500',
  }[status]

  const glowColor = {
    overdue: 'shadow-red-500/5',
    warning: 'shadow-amber-500/5',
    safe: 'shadow-emerald-500/5',
  }[status]

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-zinc-700/40 border-l-4 bg-zinc-800/50 p-5 transition-all duration-300 hover:border-zinc-600/60 hover:shadow-lg',
        borderColor,
        glowColor
      )}
    >
      {status === 'overdue' && (
        <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden">
          <div className="absolute -right-8 top-3 rotate-45 bg-red-500/80 px-6 py-0.5 text-center text-[10px] font-bold text-white">
            过期
          </div>
        </div>
      )}

      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              status === 'overdue' && 'bg-red-500/15 text-red-400',
              status === 'warning' && 'bg-amber-500/15 text-amber-400',
              status === 'safe' && 'bg-emerald-500/15 text-emerald-400'
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">{appliance.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-zinc-500">{template?.label || '其他'}</p>
              <span className="flex items-center gap-0.5 text-xs text-zinc-600">
                <MapPin className="h-3 w-3" />
                {ROOM_MAP[appliance.room]?.label || '其他'}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-3 space-y-1.5 text-sm">
        <div className="flex items-center justify-between text-zinc-400">
          <span>保养周期</span>
          <span className="text-zinc-300">{appliance.cycleDescription}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>上次保养</span>
          <span className="text-zinc-300">{formatDisplayDate(appliance.lastMaintenanceDate)}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>下次保养</span>
          <span className="text-zinc-300">{formatDisplayDate(appliance.nextMaintenanceDate)}</span>
        </div>
      </div>

      <div
        className={cn(
          'mb-4 rounded-lg px-3 py-2 text-center text-sm font-medium',
          status === 'overdue' && 'bg-red-500/10 text-red-400',
          status === 'warning' && 'bg-amber-500/10 text-amber-400',
          status === 'safe' && 'bg-emerald-500/10 text-emerald-400'
        )}
      >
        {daysLabel}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onMaintenance(appliance)}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all duration-200',
            status === 'overdue'
              ? 'bg-red-500/80 hover:bg-red-500'
              : status === 'warning'
              ? 'bg-amber-500/80 hover:bg-amber-500'
              : 'bg-orange-500/80 hover:bg-orange-500'
          )}
        >
          {status === 'overdue' || status === 'warning' ? '立即保养' : '提前保养'}
        </button>
        <button
          onClick={() => onViewRecords(appliance.id)}
          className="rounded-lg border border-zinc-600/50 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
        >
          记录
        </button>
        <button
          onClick={() => onEdit(appliance)}
          className="rounded-lg border border-zinc-600/50 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(appliance.id)}
          className="rounded-lg border border-zinc-600/50 p-2 text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

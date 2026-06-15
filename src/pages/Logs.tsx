import { useStore } from '@/store/useStore'
import { getMaintenanceStatus, formatDisplayDate } from '@/utils/date'
import { APPLIANCE_TYPE_MAP } from '@/constants/templates'
import { cn } from '@/lib/utils'
import {
  User,
  Wrench,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState } from 'react'

export default function Logs() {
  const { appliances, records } = useStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const applianceRecords = appliances
    .map((a) => ({
      appliance: a,
      records: records
        .filter((r) => r.applianceId === a.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }))
    .filter((ar) => ar.records.length > 0)
    .sort((a, b) => {
      const latestA = new Date(a.records[0].date).getTime()
      const latestB = new Date(b.records[0].date).getTime()
      return latestB - latestA
    })

  const totalCost = records.reduce((sum, r) => sum + r.cost, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">保养记录</h1>
        <p className="mt-1 text-sm text-zinc-500">查看所有电器的保养历史与花费</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/50 px-4 py-3">
          <p className="text-xs text-zinc-500">保养次数</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{records.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/50 px-4 py-3">
          <p className="text-xs text-zinc-500">涉及电器</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{applianceRecords.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/50 px-4 py-3">
          <p className="text-xs text-zinc-500">总花费</p>
          <p className="mt-1 text-2xl font-bold text-orange-400">
            ¥{totalCost.toFixed(2)}
          </p>
        </div>
      </div>

      {applianceRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 py-20">
          <FileText className="mb-4 h-12 w-12 text-zinc-600" />
          <p className="text-lg font-medium text-zinc-400">暂无保养记录</p>
          <p className="mt-1 text-sm text-zinc-600">完成第一次保养后，记录将显示在这里</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applianceRecords.map(({ appliance, records: recs }) => {
            const template = APPLIANCE_TYPE_MAP[appliance.type]
            const status = getMaintenanceStatus(appliance.nextMaintenanceDate)
            const isExpanded = expandedId === appliance.id
            const displayRecords = isExpanded ? recs : recs.slice(0, 3)

            return (
              <div
                key={appliance.id}
                className="overflow-hidden rounded-xl border border-zinc-700/40 bg-zinc-800/30"
              >
                <div className="flex items-center justify-between border-b border-zinc-700/30 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        status === 'overdue' && 'bg-red-500/15 text-red-400',
                        status === 'warning' && 'bg-amber-500/15 text-amber-400',
                        status === 'safe' && 'bg-emerald-500/15 text-emerald-400'
                      )}
                    >
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">{appliance.name}</h3>
                      <p className="text-xs text-zinc-500">{template?.label} · {recs.length}次保养</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-300">
                      ¥{recs.reduce((s, r) => s + r.cost, 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-500">累计花费</p>
                  </div>
                </div>

                <div className="divide-y divide-zinc-700/20">
                  {displayRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-zinc-800/50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700/40">
                        {record.operatorType === 'self' ? (
                          <User className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Wrench className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-200">
                            {record.operator}
                          </span>
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[10px] font-medium',
                              record.operatorType === 'self'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-blue-500/15 text-blue-400'
                            )}
                          >
                            {record.operatorType === 'self' ? '自己' : '维修工'}
                          </span>
                        </div>
                        {record.note && (
                          <p className="mt-0.5 truncate text-xs text-zinc-500">{record.note}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {record.cost > 0 && (
                          <p className="flex items-center gap-1 text-sm font-medium text-orange-400">
                            <DollarSign className="h-3 w-3" />
                            {record.cost.toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs text-zinc-500">{formatDisplayDate(record.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {recs.length > 3 && (
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : appliance.id)
                    }
                    className="flex w-full items-center justify-center gap-1 border-t border-zinc-700/30 py-2.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {isExpanded ? (
                      <>
                        收起 <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        查看全部 {recs.length} 条记录 <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

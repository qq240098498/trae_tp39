import { useState, useRef } from 'react'
import type { Appliance, PhotoProof, Room } from '@/types'
import { useStore } from '@/store/useStore'
import { getMaintenanceStatus } from '@/utils/date'
import { ApplianceCard } from '@/components/ApplianceCard'
import { ApplianceForm } from '@/components/ApplianceForm'
import { MaintenanceForm } from '@/components/MaintenanceForm'
import { TutorialDetail } from '@/components/TutorialDetail'
import { APPLIANCE_TYPE_MAP, ROOMS, ROOM_MAP } from '@/constants/templates'
import { cn } from '@/lib/utils'
import { Plus, Search, SlidersHorizontal, Download, Upload, MapPin } from 'lucide-react'

type FilterType = 'all' | 'overdue' | 'warning' | 'safe'
type RoomFilter = 'all' | Room

export default function Appliances() {
  const { appliances, updateAppliance, deleteAppliance, performMaintenance, exportChecklist, importChecklist } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [showMaintenance, setShowMaintenance] = useState(false)
  const [editAppliance, setEditAppliance] = useState<Appliance | null>(null)
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [roomFilter, setRoomFilter] = useState<RoomFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showTutorialDetail, setShowTutorialDetail] = useState(false)
  const [selectedTutorialId, setSelectedTutorialId] = useState<string | null>(null)
  const [showExportSuccess, setShowExportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sortedAppliances = [...appliances]
    .map((a) => ({ ...a, status: getMaintenanceStatus(a.nextMaintenanceDate) }))
    .filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false
      if (roomFilter !== 'all' && a.room !== roomFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const label = APPLIANCE_TYPE_MAP[a.type]?.label || ''
        const roomLabel = ROOM_MAP[a.room]?.label || ''
        return a.name.toLowerCase().includes(q) || label.includes(q) || roomLabel.includes(q)
      }
      return true
    })
    .sort((a, b) => {
      const order = { overdue: 0, warning: 1, safe: 2 }
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
      return new Date(a.nextMaintenanceDate).getTime() - new Date(b.nextMaintenanceDate).getTime()
    })

  const counts = {
    all: appliances.length,
    overdue: appliances.filter((a) => getMaintenanceStatus(a.nextMaintenanceDate) === 'overdue').length,
    warning: appliances.filter((a) => getMaintenanceStatus(a.nextMaintenanceDate) === 'warning').length,
    safe: appliances.filter((a) => getMaintenanceStatus(a.nextMaintenanceDate) === 'safe').length,
  }

  const roomCounts = ROOMS.reduce(
    (acc, r) => {
      acc[r.key] = appliances.filter((a) => a.room === r.key).length
      return acc
    },
    {} as Record<string, number>
  )

  const handleExport = () => {
    const json = exportChecklist()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `全屋电器保养清单_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportSuccess(true)
    setTimeout(() => setShowExportSuccess(false), 3000)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const success = importChecklist(text)
      if (success) {
        setShowExportSuccess(true)
        setTimeout(() => setShowExportSuccess(false), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleEdit = (appliance: Appliance) => {
    setEditAppliance(appliance)
    setShowForm(true)
  }

  const handleMaintenance = (appliance: Appliance) => {
    setSelectedAppliance(appliance)
    setShowMaintenance(true)
  }

  const handleDelete = (id: string) => {
    deleteAppliance(id)
    setShowDeleteConfirm(null)
  }

  const handleSubmit = (data: Omit<Appliance, 'id' | 'nextMaintenanceDate'>) => {
    if (editAppliance) {
      updateAppliance(editAppliance.id, data)
    } else {
      useStore.getState().addAppliance(data)
    }
  }

  const handleMaintenanceSubmit = (
    applianceId: string,
    operator: string,
    operatorType: 'self' | 'repairman',
    cost: number,
    note: string,
    tutorialId?: string,
    photos?: PhotoProof[]
  ) => {
    performMaintenance(applianceId, operator, operatorType, cost, note, tutorialId, photos)
  }

  const handleOpenTutorial = (tutorialId: string) => {
    setSelectedTutorialId(tutorialId)
    setShowTutorialDetail(true)
  }

  const FILTER_OPTIONS: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: '全部', color: 'text-zinc-300' },
    { key: 'overdue', label: '已过期', color: 'text-red-400' },
    { key: 'warning', label: '即将到期', color: 'text-amber-400' },
    { key: 'safe', label: '安全', color: 'text-emerald-400' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">我的电器</h1>
          <p className="mt-1 text-sm text-zinc-500">管理家中的电器保养计划</p>
        </div>
        <div className="flex items-center gap-2">
          {appliances.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:text-zinc-100"
              >
                <Download className="h-4 w-4" />
                导出清单
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:text-zinc-100"
              >
                <Upload className="h-4 w-4" />
                导入清单
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </>
          )}
          <button
            onClick={() => {
              setEditAppliance(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <Plus className="h-4 w-4" />
            添加电器
          </button>
        </div>
      </div>

      {showExportSuccess && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          操作成功！
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
        <MapPin className="h-4 w-4 shrink-0 text-zinc-500" />
        <button
          onClick={() => setRoomFilter('all')}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
            roomFilter === 'all'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'border border-zinc-700/50 text-zinc-400 hover:text-zinc-300'
          )}
        >
          全部房间
        </button>
        {ROOMS.map((room) => (
          <button
            key={room.key}
            onClick={() => setRoomFilter(room.key)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
              roomFilter === room.key
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'border border-zinc-700/50 text-zinc-400 hover:text-zinc-300'
            )}
          >
            {room.label}
            {roomCounts[room.key] > 0 && (
              <span className="ml-1 opacity-60">({roomCounts[room.key]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索电器名称..."
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 sm:w-64"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-700/40 bg-zinc-800/30 p-1">
          <SlidersHorizontal className="ml-2 h-4 w-4 text-zinc-500" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
                filter === opt.key
                  ? 'bg-zinc-700/60 text-zinc-100'
                  : `${opt.color} hover:bg-zinc-700/30`
              )}
            >
              {opt.label}
              {counts[opt.key] > 0 && (
                <span className="ml-1 text-[10px] opacity-60">({counts[opt.key]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {sortedAppliances.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <SlidersHorizontal className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="mb-2 text-lg font-medium text-zinc-400">
            {appliances.length === 0 ? '还没有添加电器' : '没有匹配的结果'}
          </p>
          <p className="mb-6 text-sm text-zinc-600">
            {appliances.length === 0 ? '点击上方按钮添加你的第一个电器' : '尝试调整筛选条件'}
          </p>
          {appliances.length === 0 && (
            <button
              onClick={() => {
                setEditAppliance(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              添加电器
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAppliances.map((appliance) => (
            <ApplianceCard
              key={appliance.id}
              appliance={appliance}
              onMaintenance={handleMaintenance}
              onEdit={handleEdit}
              onDelete={(id) => setShowDeleteConfirm(id)}
              onViewRecords={() => {}}
            />
          ))}
        </div>
      )}

      <ApplianceForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditAppliance(null)
        }}
        onSubmit={handleSubmit}
        editAppliance={editAppliance}
      />

      <MaintenanceForm
        isOpen={showMaintenance}
        onClose={() => {
          setShowMaintenance(false)
          setSelectedAppliance(null)
        }}
        onSubmit={handleMaintenanceSubmit}
        appliance={selectedAppliance}
        onOpenTutorial={handleOpenTutorial}
      />

      <TutorialDetail
        isOpen={showTutorialDetail}
        onClose={() => {
          setShowTutorialDetail(false)
          setSelectedTutorialId(null)
        }}
        tutorialId={selectedTutorialId}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100">确认删除</h3>
            <p className="mt-2 text-sm text-zinc-400">
              删除后将无法恢复，相关保养记录也会一并删除。确定要删除吗？
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-zinc-700/50 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import type { Appliance, ApplianceType } from '@/types'
import { APPLIANCE_TEMPLATES } from '@/constants/templates'
import { formatDate } from '@/utils/date'
import { Modal } from './Modal'
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
  Plus,
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

interface ApplianceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Appliance, 'id' | 'nextMaintenanceDate'>) => void
  editAppliance?: Appliance | null
}

export function ApplianceForm({ isOpen, onClose, onSubmit, editAppliance }: ApplianceFormProps) {
  const [selectedType, setSelectedType] = useState<ApplianceType>(
    editAppliance?.type || 'air_conditioner'
  )
  const [name, setName] = useState(editAppliance?.name || '')
  const [lastDate, setLastDate] = useState(
    editAppliance?.lastMaintenanceDate || formatDate(new Date())
  )
  const [cycleMonths, setCycleMonths] = useState(
    editAppliance?.cycleMonths || APPLIANCE_TEMPLATES[0].defaultCycleMonths
  )
  const [cycleDescription, setCycleDescription] = useState(
    editAppliance?.cycleDescription || APPLIANCE_TEMPLATES[0].cycleDescription
  )

  const handleTypeSelect = (type: ApplianceType) => {
    setSelectedType(type)
    const template = APPLIANCE_TEMPLATES.find((t) => t.type === type)
    if (template) {
      setCycleMonths(template.defaultCycleMonths)
      setCycleDescription(template.cycleDescription)
      if (!name) {
        setName(template.label)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const template = APPLIANCE_TEMPLATES.find((t) => t.type === selectedType)
    onSubmit({
      name,
      type: selectedType,
      icon: template?.icon || 'Wrench',
      lastMaintenanceDate: lastDate,
      cycleMonths,
      cycleDescription,
    })
    onClose()
    if (!editAppliance) {
      setName('')
      setSelectedType('air_conditioner')
      setLastDate(formatDate(new Date()))
      setCycleMonths(APPLIANCE_TEMPLATES[0].defaultCycleMonths)
      setCycleDescription(APPLIANCE_TEMPLATES[0].cycleDescription)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAppliance ? '编辑电器' : '添加电器'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">选择电器类型</label>
          <div className="grid grid-cols-4 gap-2">
            {APPLIANCE_TEMPLATES.map((template) => {
              const Icon = ICON_MAP[template.icon] || Wrench
              return (
                <button
                  key={template.type}
                  type="button"
                  onClick={() => handleTypeSelect(template.type)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs transition-all duration-200',
                    selectedType === template.type
                      ? 'border-orange-500/50 bg-orange-500/15 text-orange-400'
                      : 'border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{template.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">电器名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：客厅空调"
            required
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">上次保养日期</label>
            <input
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">保养周期（月）</label>
            <input
              type="number"
              value={cycleMonths}
              onChange={(e) => setCycleMonths(Number(e.target.value))}
              min={1}
              max={60}
              required
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">周期描述</label>
          <input
            type="text"
            value={cycleDescription}
            onChange={(e) => setCycleDescription(e.target.value)}
            placeholder="例：滤网每3个月清洗"
            required
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25"
        >
          <Plus className="h-4 w-4" />
          {editAppliance ? '保存修改' : '添加电器'}
        </button>
      </form>
    </Modal>
  )
}

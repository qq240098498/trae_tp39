import { useState } from 'react'
import type { Appliance } from '@/types'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'

interface MaintenanceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    applianceId: string,
    operator: string,
    operatorType: 'self' | 'repairman',
    cost: number,
    note: string
  ) => void
  appliance: Appliance | null
}

export function MaintenanceForm({
  isOpen,
  onClose,
  onSubmit,
  appliance,
}: MaintenanceFormProps) {
  const [operatorType, setOperatorType] = useState<'self' | 'repairman'>('self')
  const [operator, setOperator] = useState('')
  const [cost, setCost] = useState('')
  const [note, setNote] = useState('')

  if (!appliance) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(
      appliance.id,
      operator || (operatorType === 'self' ? '自己' : '维修工'),
      operatorType,
      cost ? parseFloat(cost) : 0,
      note
    )
    onClose()
    setOperatorType('self')
    setOperator('')
    setCost('')
    setNote('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="记录保养">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <p className="text-sm text-orange-400">
            正在为 <span className="font-semibold">{appliance.name}</span> 记录保养
          </p>
          <p className="mt-1 text-xs text-zinc-500">{appliance.cycleDescription}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">操作人类型</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOperatorType('self')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200',
                operatorType === 'self'
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                  : 'border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              自己
            </button>
            <button
              type="button"
              onClick={() => setOperatorType('repairman')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200',
                operatorType === 'repairman'
                  ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                  : 'border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              维修工
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            操作人姓名 <span className="text-zinc-500">（选填）</span>
          </label>
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            placeholder={operatorType === 'self' ? '例：小明' : '例：张师傅'}
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            花费金额（元） <span className="text-zinc-500">（选填）</span>
          </label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            备注 <span className="text-zinc-500">（选填）</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例：更换了滤芯、清洗了内筒"
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          完成保养
        </button>
      </form>
    </Modal>
  )
}

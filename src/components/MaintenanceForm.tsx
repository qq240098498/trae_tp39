import { useState, useEffect } from 'react'
import type { Appliance, PhotoProof } from '@/types'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'
import { PhotoUploader } from './PhotoUploader'
import { getTutorialsByApplianceType } from '@/constants/tutorials'
import { TUTORIAL_MAP } from '@/constants/tutorials'
import { useStore } from '@/store/useStore'
import { BookOpen, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'

interface MaintenanceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    applianceId: string,
    operator: string,
    operatorType: 'self' | 'repairman',
    cost: number,
    note: string,
    tutorialId?: string,
    photos?: PhotoProof[]
  ) => void
  appliance: Appliance | null
  onOpenTutorial?: (tutorialId: string) => void
}

export function MaintenanceForm({
  isOpen,
  onClose,
  onSubmit,
  appliance,
  onOpenTutorial,
}: MaintenanceFormProps) {
  const [operatorType, setOperatorType] = useState<'self' | 'repairman'>('self')
  const [operator, setOperator] = useState('')
  const [cost, setCost] = useState('')
  const [note, setNote] = useState('')
  const [selectedTutorialId, setSelectedTutorialId] = useState<string | undefined>()
  const [photos, setPhotos] = useState<PhotoProof[]>([])
  const [showTutorialPicker, setShowTutorialPicker] = useState(false)

  const { getLastTutorialForAppliance } = useStore()

  const availableTutorials = appliance ? getTutorialsByApplianceType(appliance.type) : []
  const lastTutorialId = appliance ? getLastTutorialForAppliance(appliance.id) : undefined
  const lastTutorial = lastTutorialId ? TUTORIAL_MAP[lastTutorialId] : undefined
  const selectedTutorial = selectedTutorialId ? TUTORIAL_MAP[selectedTutorialId] : undefined

  useEffect(() => {
    if (isOpen) {
      setOperatorType('self')
      setOperator('')
      setCost('')
      setNote('')
      setSelectedTutorialId(undefined)
      setPhotos([])
      setShowTutorialPicker(false)
    }
  }, [isOpen])

  if (!appliance) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(
      appliance.id,
      operator || (operatorType === 'self' ? '自己' : '维修工'),
      operatorType,
      cost ? parseFloat(cost) : 0,
      note,
      selectedTutorialId,
      photos.length > 0 ? photos : undefined
    )
    onClose()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-500/15'
      case 'medium':
        return 'text-amber-400 bg-amber-500/15'
      case 'hard':
        return 'text-red-400 bg-red-500/15'
      default:
        return 'text-zinc-400 bg-zinc-500/15'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单'
      case 'medium':
        return '中等'
      case 'hard':
        return '困难'
      default:
        return difficulty
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="记录保养">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <p className="text-sm text-orange-400">
            正在为 <span className="font-semibold">{appliance.name}</span> 记录保养
          </p>
          <p className="mt-1 text-xs text-zinc-500">{appliance.cycleDescription}</p>
        </div>

        {lastTutorial && !selectedTutorialId && (
          <button
            type="button"
            onClick={() => {
              setSelectedTutorialId(lastTutorialId)
            }}
            className="w-full rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 text-left transition-all hover:bg-orange-500/15"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-100">快速使用上次教程</p>
                <p className="text-xs text-zinc-400">{lastTutorial.title}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-500" />
            </div>
          </button>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-400" />
              关联保养教程 <span className="text-zinc-500">（选填）</span>
            </div>
          </label>

          {selectedTutorial ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <p className="text-sm font-medium text-zinc-100">{selectedTutorial.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{selectedTutorial.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium',
                      getDifficultyColor(selectedTutorial.difficulty)
                    )}>
                      {getDifficultyLabel(selectedTutorial.difficulty)}
                    </span>
                    <span className="text-xs text-zinc-500">{selectedTutorial.estimatedTime}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {onOpenTutorial && (
                    <button
                      type="button"
                      onClick={() => onOpenTutorial(selectedTutorialId!)}
                      className="text-xs text-orange-400 hover:text-orange-300"
                    >
                      查看教程
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedTutorialId(undefined)}
                    className="text-xs text-zinc-500 hover:text-zinc-400"
                  >
                    更换
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowTutorialPicker(!showTutorialPicker)}
                className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-3 text-left transition-all hover:border-zinc-600 hover:bg-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">选择相关教程...</span>
                  <ChevronRight className={cn(
                    'h-4 w-4 text-zinc-500 transition-transform',
                    showTutorialPicker && 'rotate-90'
                  )} />
                </div>
              </button>

              {showTutorialPicker && availableTutorials.length > 0 && (
                <div className="mt-2 space-y-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-2">
                  {availableTutorials.map((tutorial) => (
                    <button
                      key={tutorial.id}
                      type="button"
                      onClick={() => {
                        setSelectedTutorialId(tutorial.id)
                        setShowTutorialPicker(false)
                      }}
                      className="w-full rounded-md p-3 text-left transition-all hover:bg-zinc-700/50"
                    >
                      <p className="text-sm font-medium text-zinc-100">{tutorial.title}</p>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{tutorial.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={cn(
                          'rounded px-2 py-0.5 text-xs font-medium',
                          getDifficultyColor(tutorial.difficulty)
                        )}>
                          {getDifficultyLabel(tutorial.difficulty)}
                        </span>
                        <span className="text-xs text-zinc-500">{tutorial.estimatedTime}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showTutorialPicker && availableTutorials.length === 0 && (
                <div className="mt-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 text-center">
                  <p className="text-sm text-zinc-400">暂无相关教程</p>
                  <p className="mt-1 text-xs text-zinc-500">可以到教程库浏览所有教程</p>
                </div>
              )}
            </>
          )}
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

        <PhotoUploader photos={photos} onChange={setPhotos} />

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

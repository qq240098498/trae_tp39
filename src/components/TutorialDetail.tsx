import { useState } from 'react'
import { Modal } from './Modal'
import { TUTORIAL_MAP } from '@/constants/tutorials'
import {
  X,
  Clock,
  Wrench,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TutorialDetailProps {
  isOpen: boolean
  onClose: () => void
  tutorialId: string | null
}

export function TutorialDetail({ isOpen, onClose, tutorialId }: TutorialDetailProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const tutorial = tutorialId ? TUTORIAL_MAP[tutorialId] : null

  if (!tutorial) return null

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

  const toggleStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  const handleClose = () => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
    onClose()
  }

  const progress = (completedSteps.size / tutorial.steps.length) * 100

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="保养教程">
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-100">{tutorial.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{tutorial.description}</p>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium',
              getDifficultyColor(tutorial.difficulty)
            )}>
              <AlertCircle className="h-3 w-3" />
              {getDifficultyLabel(tutorial.difficulty)}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <Clock className="h-3 w-3" />
              {tutorial.estimatedTime}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300">
              <BookOpen className="h-3 w-3" />
              {tutorial.steps.length} 步骤
            </span>
          </div>
        </div>

        {tutorial.tools && tutorial.tools.length > 0 && (
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <Wrench className="h-4 w-4 text-orange-400" />
              所需工具
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tutorial.tools.map((tool, index) => (
                <span
                  key={index}
                  className="rounded-lg bg-zinc-700/50 px-3 py-1 text-xs text-zinc-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {tutorial.safetyNotes && tutorial.safetyNotes.length > 0 && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400">
              <AlertTriangle className="h-4 w-4" />
              安全注意事项
            </h3>
            <ul className="mt-3 space-y-2">
              {tutorial.safetyNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100">操作步骤</h3>
            <span className="text-xs text-zinc-400">
              {completedSteps.size}/{tutorial.steps.length} 已完成
            </span>
          </div>

          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3">
            {tutorial.steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isActive = currentStep === index

              return (
                <div
                  key={step.id}
                  className={cn(
                    'group cursor-pointer rounded-xl border p-4 transition-all duration-200',
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : isActive
                      ? 'border-orange-500/30 bg-orange-500/5'
                      : 'border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600'
                  )}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStepComplete(step.id)
                      }}
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-zinc-600 bg-transparent text-transparent hover:border-orange-400'
                      )}
                    >
                      {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-zinc-700 text-zinc-400'
                        )}>
                          {index + 1}
                        </span>
                        <h4 className={cn(
                          'text-sm font-semibold',
                          isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-100'
                        )}>
                          {step.title}
                        </h4>
                      </div>

                      {isActive && (
                        <div className="mt-3 space-y-3">
                          <p className={cn(
                            'text-sm leading-relaxed',
                            isCompleted ? 'text-zinc-500' : 'text-zinc-300'
                          )}>
                            {step.description}
                          </p>

                          {step.tips && (
                            <div className="flex gap-3 rounded-lg bg-amber-500/10 p-3">
                              <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" />
                              <p className="text-xs text-amber-300">{step.tips}</p>
                            </div>
                          )}

                          {step.warning && (
                            <div className="flex gap-3 rounded-lg bg-red-500/10 p-3">
                              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                              <p className="text-xs text-red-300">{step.warning}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!isActive && (
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                currentStep === 0
                  ? 'cursor-not-allowed bg-zinc-800 text-zinc-600'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              上一步
            </button>

            <div className="flex items-center gap-1">
              {tutorial.steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    completedSteps.has(tutorial.steps[index].id)
                      ? 'w-4 bg-emerald-500'
                      : index === currentStep
                      ? 'w-4 bg-orange-500'
                      : 'w-2 bg-zinc-700'
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1))}
              disabled={currentStep === tutorial.steps.length - 1}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                currentStep === tutorial.steps.length - 1
                  ? 'cursor-not-allowed bg-zinc-800 text-zinc-600'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              )}
            >
              下一步
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {completedSteps.size === tutorial.steps.length && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-emerald-400">恭喜！教程已完成</h3>
            <p className="mt-2 text-sm text-zinc-400">
              别忘了在保养记录中上传完成照片作为凭证
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}

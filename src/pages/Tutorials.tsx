import { useState, useMemo } from 'react'
import { APPLIANCE_TEMPLATES, APPLIANCE_TYPE_MAP } from '@/constants/templates'
import { TUTORIALS, getTutorialsByApplianceType } from '@/constants/tutorials'
import type { ApplianceType } from '@/types'
import {
  BookOpen,
  Clock,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TutorialDetail } from '@/components/TutorialDetail'

export default function Tutorials() {
  const [selectedType, setSelectedType] = useState<ApplianceType | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTutorialDetail, setShowTutorialDetail] = useState(false)
  const [selectedTutorialId, setSelectedTutorialId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredTutorials = useMemo(() => {
    let result = selectedType === 'all' ? TUTORIALS : getTutorialsByApplianceType(selectedType)

    if (selectedDifficulty !== 'all') {
      result = result.filter((t) => t.difficulty === selectedDifficulty)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      )
    }

    return result
  }, [selectedType, selectedDifficulty, searchQuery])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
      case 'medium':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30'
      case 'hard':
        return 'text-red-400 bg-red-500/15 border-red-500/30'
      default:
        return 'text-zinc-400 bg-zinc-500/15 border-zinc-500/30'
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

  const applianceOptions = [
    { type: 'all', label: '全部电器', icon: 'BookOpen' },
    ...APPLIANCE_TEMPLATES.map((t) => ({
      type: t.type,
      label: t.label,
      icon: t.icon,
    })),
  ]

  const handleOpenTutorial = (tutorialId: string) => {
    setSelectedTutorialId(tutorialId)
    setShowTutorialDetail(true)
  }

  const activeFiltersCount =
    (selectedType !== 'all' ? 1 : 0) + (selectedDifficulty !== 'all' ? 1 : 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">保养教程库</h1>
            <p className="text-sm text-zinc-500">图文教程，一步步教你保养家电</p>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索教程..."
            className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 py-3 pl-11 pr-12 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
              showFilters || activeFiltersCount > 0
                ? 'border-orange-500/50 bg-orange-500/15 text-orange-400'
                : 'border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
            )}
          >
            <Filter className="h-4 w-4" />
            筛选
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4 rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">电器类型</label>
              <div className="flex flex-wrap gap-2">
                {applianceOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type as ApplianceType | 'all')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                      selectedType === option.type
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">难度等级</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'easy', label: '简单' },
                  { value: 'medium', label: '中等' },
                  { value: 'hard', label: '困难' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDifficulty(option.value as 'all' | 'easy' | 'medium' | 'hard')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                      selectedDifficulty === option.value
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSelectedType('all')
                  setSelectedDifficulty('all')
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                清除所有筛选
              </button>
            )}
          </div>
        )}
      </div>

      {filteredTutorials.length > 0 ? (
        <div className="space-y-3">
          {filteredTutorials.map((tutorial) => {
            const template = APPLIANCE_TYPE_MAP[tutorial.applianceType]
            return (
              <div
                key={tutorial.id}
                onClick={() => handleOpenTutorial(tutorial.id)}
                className="group cursor-pointer rounded-xl border border-zinc-700/30 bg-zinc-800/30 p-5 transition-all duration-200 hover:border-orange-500/30 hover:bg-zinc-800/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10">
                    <BookOpen className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-zinc-100">{tutorial.title}</h3>
                        <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                          {tutorial.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-orange-400" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-300">
                        {template?.label}
                      </span>
                      <span className="rounded-md bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-300">
                        {tutorial.category}
                      </span>
                      <span className={cn(
                        'flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
                        getDifficultyColor(tutorial.difficulty)
                      )}>
                        <AlertCircle className="h-3 w-3" />
                        {getDifficultyLabel(tutorial.difficulty)}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-300">
                        <Clock className="h-3 w-3" />
                        {tutorial.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-300">
                        <Wrench className="h-3 w-3" />
                        {tutorial.steps.length} 步骤
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <BookOpen className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="mb-2 text-lg font-medium text-zinc-400">暂无匹配的教程</p>
          <p className="text-sm text-zinc-600">
            {searchQuery ? '试试其他关键词' : '清除筛选条件查看更多教程'}
          </p>
        </div>
      )}

      <TutorialDetail
        isOpen={showTutorialDetail}
        onClose={() => {
          setShowTutorialDetail(false)
          setSelectedTutorialId(null)
        }}
        tutorialId={selectedTutorialId}
      />
    </div>
  )
}

import { useState } from 'react'
import type { Appliance, PhotoProof } from '@/types'
import { useStore } from '@/store/useStore'
import { getMaintenanceStatus, getDaysLabel, daysUntil, formatDisplayDate } from '@/utils/date'
import { APPLIANCE_TYPE_MAP } from '@/constants/templates'
import { MaintenanceForm } from '@/components/MaintenanceForm'
import { TutorialDetail } from '@/components/TutorialDetail'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Plus,
  Home,
  Settings,
  ArrowRight,
  Package,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CONSUMABLE_CATEGORY_MAP } from '@/constants/consumables'

export default function Dashboard() {
  const { appliances, consumables, products, performMaintenance, getProductByConsumable } = useStore()
  const navigate = useNavigate()
  const [showMaintenance, setShowMaintenance] = useState(false)
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null)
  const [showTutorialDetail, setShowTutorialDetail] = useState(false)
  const [selectedTutorialId, setSelectedTutorialId] = useState<string | null>(null)

  const appliancesWithStatus = appliances
    .map((a) => ({
      ...a,
      status: getMaintenanceStatus(a.nextMaintenanceDate),
      days: daysUntil(a.nextMaintenanceDate),
    }))
    .sort((a, b) => a.days - b.days)

  const overdue = appliancesWithStatus.filter((a) => a.status === 'overdue')
  const warning = appliancesWithStatus.filter((a) => a.status === 'warning')
  const safe = appliancesWithStatus.filter((a) => a.status === 'safe')
  const needsAttention = [...overdue, ...warning]

  const lowStockConsumables = consumables.filter((c) => c.quantity <= c.threshold)

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

  const STAT_CARDS = [
    {
      label: '已过期',
      count: overdue.length,
      icon: AlertTriangle,
      bgClass: 'from-red-500/20 to-red-600/5',
      iconClass: 'text-red-400',
      borderClass: 'border-red-500/20',
    },
    {
      label: '7天内到期',
      count: warning.length,
      icon: Bell,
      bgClass: 'from-amber-500/20 to-amber-600/5',
      iconClass: 'text-amber-400',
      borderClass: 'border-amber-500/20',
    },
    {
      label: '安全',
      count: safe.length,
      icon: CheckCircle2,
      bgClass: 'from-emerald-500/20 to-emerald-600/5',
      iconClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/20',
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">家电保养助手</h1>
            <p className="text-sm text-zinc-500">让每一次保养都不被遗忘</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={cn(
                'overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-lg',
                card.borderClass,
                card.bgClass
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-zinc-100">{card.count}</p>
                </div>
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl',
                    card.bgClass
                  )}
                >
                  <Icon className={cn('h-5 w-5', card.iconClass)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {needsAttention.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-zinc-100">保养提醒</h2>
              <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
                {needsAttention.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/appliances')}
              className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-orange-400"
            >
              查看全部 <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {needsAttention.map((appliance) => {
              const template = APPLIANCE_TYPE_MAP[appliance.type]
              return (
                <div
                  key={appliance.id}
                  className={cn(
                    'group flex items-center justify-between rounded-xl border-l-4 bg-zinc-800/40 px-5 py-4 transition-all duration-200 hover:bg-zinc-800/60',
                    appliance.status === 'overdue'
                      ? 'border-l-red-500'
                      : 'border-l-amber-500'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        appliance.status === 'overdue'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-amber-500/15 text-amber-400'
                      )}
                    >
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-zinc-100">{appliance.name}</h3>
                        <span className="text-xs text-zinc-500">{template?.label}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        {appliance.cycleDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          appliance.status === 'overdue' ? 'text-red-400' : 'text-amber-400'
                        )}
                      >
                        {getDaysLabel(appliance.nextMaintenanceDate)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDisplayDate(appliance.nextMaintenanceDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAppliance(appliance)
                        setShowMaintenance(true)
                      }}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200',
                        appliance.status === 'overdue'
                          ? 'bg-red-500/80 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25'
                          : 'bg-amber-500/80 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25'
                      )}
                    >
                      立即保养
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {needsAttention.length === 0 && appliances.length > 0 && (
        <div className="mb-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-500/20 bg-emerald-500/5 py-12">
          <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-500/50" />
          <p className="text-lg font-medium text-emerald-400">一切正常！</p>
          <p className="mt-1 text-sm text-zinc-500">所有电器都在保养周期内，暂无待处理提醒</p>
        </div>
      )}

      {appliances.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-zinc-500" />
            <h2 className="text-lg font-semibold text-zinc-100">所有电器概览</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {appliancesWithStatus.map((appliance) => {
              const template = APPLIANCE_TYPE_MAP[appliance.type]
              return (
                <div
                  key={appliance.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border bg-zinc-800/30 px-4 py-3 transition-all duration-200 hover:bg-zinc-800/50',
                    appliance.status === 'overdue' && 'border-red-500/20',
                    appliance.status === 'warning' && 'border-amber-500/20',
                    appliance.status === 'safe' && 'border-zinc-700/30'
                  )}
                >
                  <div
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      appliance.status === 'overdue' && 'bg-red-500',
                      appliance.status === 'warning' && 'bg-amber-500',
                      appliance.status === 'safe' && 'bg-emerald-500'
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200">{appliance.name}</p>
                    <p className="text-xs text-zinc-500">{template?.label}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-xs font-medium',
                      appliance.status === 'overdue' && 'text-red-400',
                      appliance.status === 'warning' && 'text-amber-400',
                      appliance.status === 'safe' && 'text-emerald-400'
                    )}
                  >
                    {getDaysLabel(appliance.nextMaintenanceDate)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {lowStockConsumables.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-zinc-100">耗材库存预警</h2>
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400">
                {lowStockConsumables.length} 该买了
              </span>
            </div>
            <button
              onClick={() => navigate('/consumables')}
              className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-red-400"
            >
              查看全部 <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {lowStockConsumables.slice(0, 5).map((consumable) => {
              const catInfo = CONSUMABLE_CATEGORY_MAP[consumable.category]
              const product = getProductByConsumable(consumable)
              return (
                <div
                  key={consumable.id}
                  className="group flex items-center justify-between rounded-xl border-l-4 border-l-red-500 bg-zinc-800/40 px-5 py-4 transition-all duration-200 hover:bg-zinc-800/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-zinc-100">{consumable.name}</h3>
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        剩 {consumable.quantity} {consumable.unit} · 阈值 {consumable.threshold}{' '}
                        {consumable.unit}
                      </p>
                      {product && (
                        <p className="mt-0.5 text-xs text-emerald-400">
                          <TrendingDown className="mr-1 inline h-3 w-3" />
                          历史最低价 ¥{product.lowestPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/consumables')}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      去补货
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div
          onClick={() => navigate('/consumables')}
          className="cursor-pointer overflow-hidden rounded-xl border border-zinc-700/30 bg-zinc-800/30 p-5 transition-all duration-200 hover:border-orange-500/30 hover:bg-zinc-800/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
              <Package className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-orange-400" />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-zinc-100">耗材库存</h3>
            <p className="mt-1 text-sm text-zinc-500">
              共 {consumables.length} 种，{lowStockConsumables.length} 种需要补货
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                <span>库存充足</span>
                <span>
                  {consumables.length - lowStockConsumables.length}/{consumables.length}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-700/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{
                    width: `${consumables.length > 0 ? ((consumables.length - lowStockConsumables.length) / consumables.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/products')}
          className="cursor-pointer overflow-hidden rounded-xl border border-zinc-700/30 bg-zinc-800/30 p-5 transition-all duration-200 hover:border-emerald-500/30 hover:bg-zinc-800/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-emerald-400" />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-zinc-100">采购比价</h3>
            <p className="mt-1 text-sm text-zinc-500">
              商品库 {products.length} 件，随时查看历史最低价
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400">
              <TrendingDown className="h-3 w-3" />
              最低价
            </div>
            <div className="flex items-center gap-1 rounded-md bg-zinc-700/30 px-2 py-1 text-[11px] text-zinc-400">
              多平台比价
            </div>
          </div>
        </div>
      </div>

      {appliances.length === 0 && lowStockConsumables.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <Plus className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="mb-2 text-lg font-medium text-zinc-400">开始管理你的家电保养</p>
          <p className="mb-6 text-sm text-zinc-600">添加第一个电器，开启智能保养提醒</p>
          <button
            onClick={() => navigate('/appliances')}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <Plus className="h-4 w-4" />
            添加电器
          </button>
        </div>
      )}

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
    </div>
  )
}

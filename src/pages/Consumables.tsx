import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { ConsumableForm } from '@/components/ConsumableForm'
import { CONSUMABLE_CATEGORY_MAP, PLATFORM_MAP } from '@/constants/consumables'
import { cn } from '@/lib/utils'
import type { Consumable } from '@/types'
import { formatDisplayDate } from '@/utils/date'
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Minus,
  Plus as PlusIcon,
  Edit2,
  Trash2,
  ShoppingCart,
  TrendingDown,
  ChevronRight,
  Tag,
  History,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type FilterType = 'all' | 'low' | 'normal'

export default function Consumables() {
  const {
    consumables,
    addConsumable,
    updateConsumable,
    deleteConsumable,
    adjustConsumableQuantity,
    getProductByConsumable,
  } = useStore()
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [editConsumable, setEditConsumable] = useState<Consumable | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showProductDetail, setShowProductDetail] = useState<Consumable | null>(null)

  const sortedConsumables = [...consumables]
    .map((c) => ({
      ...c,
      isLow: c.quantity <= c.threshold,
    }))
    .filter((c) => {
      if (filter === 'low' && !c.isLow) return false
      if (filter === 'normal' && c.isLow) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const catLabel = CONSUMABLE_CATEGORY_MAP[c.category]?.label || ''
        return (
          c.name.toLowerCase().includes(q) ||
          catLabel.toLowerCase().includes(q) ||
          (c.note || '').toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (a.isLow !== b.isLow) return a.isLow ? -1 : 1
      return a.quantity - b.quantity
    })

  const lowStockCount = consumables.filter((c) => c.quantity <= c.threshold).length

  const handleEdit = (consumable: Consumable) => {
    setEditConsumable(consumable)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteConsumable(id)
    setShowDeleteConfirm(null)
  }

  const handleSubmit = (data: Omit<Consumable, 'id' | 'updatedAt'>) => {
    if (editConsumable) {
      updateConsumable(editConsumable.id, data)
    } else {
      addConsumable(data)
    }
  }

  const FILTER_OPTIONS: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: '全部', color: 'text-zinc-300' },
    { key: 'low', label: '库存不足', color: 'text-red-400' },
    { key: 'normal', label: '库存充足', color: 'text-emerald-400' },
  ]

  const counts = {
    all: consumables.length,
    low: lowStockCount,
    normal: consumables.length - lowStockCount,
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">保养耗材库存</h1>
          <p className="mt-1 text-sm text-zinc-500">记录耗材剩余数量，低于阈值自动提醒</p>
        </div>
        <button
          onClick={() => {
            setEditConsumable(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25"
        >
          <Plus className="h-4 w-4" />
          添加耗材
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/50 px-4 py-3">
          <p className="text-xs text-zinc-500">耗材种类</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{consumables.length}</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="text-xs text-red-400">库存不足</p>
          <p className="mt-1 text-2xl font-bold text-red-400">{lowStockCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <p className="text-xs text-emerald-400">库存充足</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {consumables.length - lowStockCount}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索耗材名称..."
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 sm:w-64"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-700/40 bg-zinc-800/30 p-1">
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

      {sortedConsumables.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <Package className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="mb-2 text-lg font-medium text-zinc-400">
            {consumables.length === 0 ? '还没有添加耗材' : '没有匹配的结果'}
          </p>
          <p className="mb-6 text-sm text-zinc-600">
            {consumables.length === 0
              ? '添加耗材，开始管理保养库存'
              : '尝试调整筛选条件或搜索词'}
          </p>
          {consumables.length === 0 && (
            <button
              onClick={() => {
                setEditConsumable(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              添加耗材
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedConsumables.map((consumable) => {
            const catInfo = CONSUMABLE_CATEGORY_MAP[consumable.category]
            const progress =
              consumable.threshold > 0
                ? Math.min(100, (consumable.quantity / (consumable.threshold * 3)) * 100)
                : 100
            const product = getProductByConsumable(consumable)

            return (
              <div
                key={consumable.id}
                className={cn(
                  'overflow-hidden rounded-xl border bg-zinc-800/30 transition-all duration-200',
                  consumable.isLow
                    ? 'border-red-500/30 hover:border-red-500/50'
                    : 'border-zinc-700/30 hover:border-zinc-600/50'
                )}
              >
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          consumable.isLow
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-zinc-700/40 text-zinc-400'
                        )}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-100">{consumable.name}</h3>
                          {consumable.isLow && (
                            <span className="flex items-center gap-0.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-400">
                              <AlertTriangle className="h-3 w-3" />
                              该买了
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {catInfo?.label || '其他分类'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(consumable)}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700/50 hover:text-zinc-300"
                        title="编辑"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(consumable.id)}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-zinc-500">当前库存</p>
                        <p className="mt-0.5 flex items-baseline gap-1">
                          <span
                            className={cn(
                              'text-2xl font-bold',
                              consumable.isLow ? 'text-red-400' : 'text-zinc-100'
                            )}
                          >
                            {consumable.quantity}
                          </span>
                          <span className="text-sm text-zinc-500">{consumable.unit}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-lg border border-zinc-700/40 bg-zinc-800/50 p-0.5">
                        <button
                          onClick={() => adjustConsumableQuantity(consumable.id, -1)}
                          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700/50 hover:text-zinc-200"
                          title="减少1个"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-zinc-200">
                          {consumable.quantity}
                        </span>
                        <button
                          onClick={() => adjustConsumableQuantity(consumable.id, 1)}
                          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700/50 hover:text-zinc-200"
                          title="增加1个"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-700/50">
                      <div
                        className={cn(
                          'absolute left-0 top-0 h-full rounded-full transition-all duration-500',
                          consumable.isLow
                            ? 'bg-gradient-to-r from-red-500 to-red-400'
                            : progress < 50
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      预警阈值：≤ {consumable.threshold} {consumable.unit}
                    </p>
                  </div>

                  {product && (
                    <button
                      onClick={() => setShowProductDetail(consumable)}
                      className="mt-4 flex w-full items-center justify-between rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5 text-xs transition-colors hover:bg-orange-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-orange-400" />
                        <span className="text-zinc-300">已关联商品</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-emerald-400" />
                          <span className="font-semibold text-emerald-400">
                            ¥{product.lowestPrice}
                          </span>
                          <span className="text-zinc-500">历史最低</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                      </div>
                    </button>
                  )}

                  {!product && (
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-4 flex w-full items-center justify-between rounded-lg border border-dashed border-zinc-700/50 px-3 py-2.5 text-xs text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-400"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>去商品库关联采购比价</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <p className="mt-2 text-[11px] text-zinc-600">
                    更新于 {formatDisplayDate(consumable.updatedAt)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConsumableForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditConsumable(null)
        }}
        onSubmit={handleSubmit}
        editConsumable={editConsumable}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100">确认删除</h3>
            <p className="mt-2 text-sm text-zinc-400">删除后将无法恢复，确定要删除这个耗材吗？</p>
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

      {showProductDetail && (
        <ProductDetailModal
          consumable={showProductDetail}
          onClose={() => setShowProductDetail(null)}
        />
      )}
    </div>
  )
}

function ProductDetailModal({
  consumable,
  onClose,
}: {
  consumable: Consumable
  onClose: () => void
}) {
  const { getProductByConsumable } = useStore()
  const product = getProductByConsumable(consumable)
  const navigate = useNavigate()

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-700/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">商品比价信息</h2>
            <p className="mt-0.5 text-xs text-zinc-500">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingDown className="h-3 w-3" />
                历史最低价
              </div>
              <p className="mt-1 text-xl font-bold text-emerald-400">¥{product.lowestPrice}</p>
              <p className="mt-0.5 text-[10px] text-zinc-500">
                {PLATFORM_MAP[product.lowestPricePlatform] || product.lowestPricePlatform} ·{' '}
                {formatDisplayDate(product.lowestPriceDate)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-700/40 bg-zinc-800/50 p-3">
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Tag className="h-3 w-3" />
                当前参考价
              </div>
              <p className="mt-1 text-xl font-bold text-zinc-200">
                {product.currentPrice ? `¥${product.currentPrice}` : '--'}
              </p>
              {product.currentPrice && product.lowestPrice && (
                <p className="mt-0.5 text-[10px] text-orange-400">
                  比最低价贵 ¥{(product.currentPrice - product.lowestPrice).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {(product.brand || product.spec) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {product.brand && (
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">
                  品牌：{product.brand}
                </span>
              )}
              {product.spec && (
                <span className="rounded-md bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">
                  规格：{product.spec}
                </span>
              )}
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-zinc-300">
              <History className="h-4 w-4" />
              价格记录
            </div>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-2">
              {product.priceRecords.map((record, index) => {
                const isLowest = record.price === product.lowestPrice
                return (
                  <div
                    key={record.id}
                    className={cn(
                      'flex items-center justify-between rounded-md px-3 py-2',
                      isLowest ? 'bg-emerald-500/10' : 'bg-zinc-800/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">
                        #{product.priceRecords.length - index}
                      </span>
                      <div>
                        <p className="text-xs text-zinc-400">
                          {PLATFORM_MAP[record.platform] || record.platform}
                        </p>
                        <p className="text-[10px] text-zinc-600">
                          {formatDisplayDate(record.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isLowest ? 'text-emerald-400' : 'text-zinc-200'
                        )}
                      >
                        ¥{record.price}
                      </p>
                      {isLowest && (
                        <p className="text-[10px] text-emerald-500">历史最低</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => {
              onClose()
              navigate('/products')
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <ShoppingCart className="h-4 w-4" />
            前往商品库查看详情
          </button>
        </div>
      </div>
    </div>
  )
}

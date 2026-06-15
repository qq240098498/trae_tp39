import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { ProductForm } from '@/components/ProductForm'
import { CONSUMABLE_CATEGORY_MAP, PLATFORMS, PLATFORM_MAP } from '@/constants/consumables'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import { formatDate, formatDisplayDate } from '@/utils/date'
import {
  Plus,
  Search,
  ShoppingCart,
  TrendingDown,
  Edit2,
  Trash2,
  Tag,
  History,
  ExternalLink,
  ChevronRight,
  Package,
  Plus as PlusCircle,
  X,
} from 'lucide-react'

type FilterType = 'all' | string

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, addPriceRecord, consumables } =
    useStore()

  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showPriceModal, setShowPriceModal] = useState<Product | null>(null)
  const [showDetail, setShowDetail] = useState<Product | null>(null)

  const sortedProducts = [...products]
    .filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const catLabel = CONSUMABLE_CATEGORY_MAP[p.category]?.label || ''
        return (
          p.name.toLowerCase().includes(q) ||
          catLabel.toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.note || '').toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (a.currentPrice && b.currentPrice) {
        return a.currentPrice / a.lowestPrice - b.currentPrice / b.lowestPrice
      }
      return a.lowestPrice - b.lowestPrice
    })

  const categories = [
    { value: 'all', label: '全部' },
    ...CONSUMABLE_CATEGORY_MAP
      ? Object.entries(CONSUMABLE_CATEGORY_MAP).map(([k, v]) => ({
          value: k,
          label: v.label,
        }))
      : [],
  ]

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setShowDeleteConfirm(null)
  }

  const handleSubmit = (data: Omit<Product, 'id' | 'createdAt'>) => {
    if (editProduct) {
      updateProduct(editProduct.id, data)
    } else {
      addProduct(data)
    }
  }

  const getLinkedConsumables = (productId: string) => {
    return consumables.filter((c) => c.productId === productId)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">家庭采购比价</h1>
          <p className="mt-1 text-sm text-zinc-500">记录商品价格，一键查看历史最低价</p>
        </div>
        <button
          onClick={() => {
            setEditProduct(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25"
        >
          <Plus className="h-4 w-4" />
          添加商品
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/50 px-4 py-3">
          <p className="text-xs text-zinc-500">商品数量</p>
          <p className="mt-1 text-2xl font-bold text-zinc-100">{products.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <p className="text-xs text-emerald-400">累计最低价商品</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {products.filter((p) => p.currentPrice && p.currentPrice <= p.lowestPrice).length}
          </p>
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <p className="text-xs text-orange-400">平均降价空间</p>
          <p className="mt-1 text-2xl font-bold text-orange-400">
            {products.length > 0
              ? (
                  (products.reduce(
                    (sum, p) =>
                      sum +
                      ((p.currentPrice || p.lowestPrice) > p.lowestPrice
                        ? ((p.currentPrice || p.lowestPrice) - p.lowestPrice) /
                          (p.currentPrice || p.lowestPrice) *
                          100
                        : 0),
                    0
                  ) /
                    products.length)
                ).toFixed(1)
              : 0}
            %
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
            placeholder="搜索商品名称、品牌..."
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50 sm:w-64"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-700/40 bg-zinc-800/30 p-1">
          {categories.slice(0, 6).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
                filter === opt.value
                  ? 'bg-zinc-700/60 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700/50 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <ShoppingCart className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="mb-2 text-lg font-medium text-zinc-400">
            {products.length === 0 ? '商品库是空的' : '没有匹配的结果'}
          </p>
          <p className="mb-6 text-sm text-zinc-600">
            {products.length === 0
              ? '添加商品，开始记录历史最低价'
              : '尝试调整筛选条件或搜索词'}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => {
                setEditProduct(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              添加商品
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedProducts.map((product) => {
            const catInfo = CONSUMABLE_CATEGORY_MAP[product.category]
            const priceDiff =
              product.currentPrice && product.currentPrice > product.lowestPrice
                ? product.currentPrice - product.lowestPrice
                : 0
            const isAtLowest = !product.currentPrice || product.currentPrice <= product.lowestPrice
            const linkedConsumables = getLinkedConsumables(product.id)

            return (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border border-zinc-700/30 bg-zinc-800/30 transition-all duration-200 hover:border-zinc-600/50"
              >
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-zinc-100 truncate">{product.name}</h3>
                        <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-zinc-500">{catInfo?.label || '其他'}</span>
                          {product.brand && (
                            <span className="rounded bg-zinc-700/50 px-1.5 py-0.5 text-[10px] text-zinc-400">
                              {product.brand}
                            </span>
                          )}
                          {isAtLowest && (
                            <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                              <TrendingDown className="h-3 w-3" />
                              历史最低
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowPriceModal(product)}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                        title="添加价格记录"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700/50 hover:text-zinc-300"
                        title="编辑"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product.id)}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {product.spec && (
                    <p className="mt-2 text-xs text-zinc-500">规格：{product.spec}</p>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <div className="flex items-center gap-1 text-xs text-emerald-400">
                        <TrendingDown className="h-3 w-3" />
                        历史最低
                      </div>
                      <p className="mt-1 text-xl font-bold text-emerald-400">
                        ¥{product.lowestPrice}
                      </p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">
                        {PLATFORM_MAP[product.lowestPricePlatform] || product.lowestPricePlatform}
                      </p>
                    </div>
                    <div className="rounded-lg border border-zinc-700/40 bg-zinc-800/50 p-3">
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Tag className="h-3 w-3" />
                        当前参考
                      </div>
                      <p className="mt-1 text-xl font-bold text-zinc-200">
                        {product.currentPrice ? `¥${product.currentPrice}` : '--'}
                      </p>
                      {priceDiff > 0 && (
                        <p className="mt-0.5 text-[10px] text-orange-400">
                          贵 ¥{priceDiff.toFixed(2)} (
                          {((priceDiff / product.currentPrice!) * 100).toFixed(0)}%)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <History className="h-3 w-3" />
                        {product.priceRecords.length} 条价格记录
                      </span>
                      {linkedConsumables.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-orange-400">
                          <Package className="h-3 w-3" />
                          关联 {linkedConsumables.length} 个耗材
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowDetail(product)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-orange-400 transition-colors hover:bg-orange-500/10"
                    >
                      详情
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {product.urls && product.urls.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.urls.slice(0, 2).map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-md border border-zinc-700/40 bg-zinc-800/50 px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:border-orange-500/30 hover:text-orange-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          购买链接{idx + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ProductForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditProduct(null)
        }}
        onSubmit={handleSubmit}
        editProduct={editProduct}
      />

      {showPriceModal && (
        <AddPriceModal
          product={showPriceModal}
          onClose={() => setShowPriceModal(null)}
          onSubmit={(price, platform, note) => {
            addPriceRecord(showPriceModal.id, {
              date: formatDate(new Date()),
              price,
              platform,
              note,
            })
            setShowPriceModal(null)
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-700/50 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100">确认删除</h3>
            <p className="mt-2 text-sm text-zinc-400">
              删除后将无法恢复，价格记录也会一并删除。确定要删除吗？
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

      {showDetail && (
        <ProductDetailModal product={showDetail} onClose={() => setShowDetail(null)} />
      )}
    </div>
  )
}

function AddPriceModal({
  product,
  onClose,
  onSubmit,
}: {
  product: Product
  onClose: () => void
  onSubmit: (price: number, platform: string, note?: string) => void
}) {
  const [price, setPrice] = useState(product.currentPrice || product.lowestPrice)
  const [platform, setPlatform] = useState(product.lowestPricePlatform)
  const [note, setNote] = useState('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-700/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">添加价格记录</h2>
            <p className="mt-0.5 text-xs text-zinc-500 truncate max-w-[240px]">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(price, platform, note.trim() || undefined)
          }}
          className="space-y-4 px-6 py-4"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">价格 (¥)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
              autoFocus
            />
            {price < product.lowestPrice && (
              <p className="mt-1 text-[11px] text-emerald-400">🎉 恭喜！刷新了历史最低价</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">购买平台</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">备注</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="活动信息、券后价等..."
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700/50 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-700/50 bg-zinc-900 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{product.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-zinc-500">
                {CONSUMABLE_CATEGORY_MAP[product.category]?.label || '其他'}
              </span>
              {product.brand && (
                <span className="rounded bg-zinc-700/50 px-1.5 py-0.5 text-[10px] text-zinc-400">
                  {product.brand}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {product.spec && (
            <div>
              <p className="mb-1 text-xs font-medium text-zinc-500">规格</p>
              <p className="text-sm text-zinc-300">{product.spec}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingDown className="h-3 w-3" />
                历史最低价
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-400">¥{product.lowestPrice}</p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {PLATFORM_MAP[product.lowestPricePlatform] || product.lowestPricePlatform}
              </p>
              <p className="text-[11px] text-zinc-600">
                {formatDisplayDate(product.lowestPriceDate)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-700/40 bg-zinc-800/50 p-4">
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Tag className="h-3 w-3" />
                当前参考价
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-200">
                {product.currentPrice ? `¥${product.currentPrice}` : '--'}
              </p>
              {product.currentPrice && product.currentPrice > product.lowestPrice && (
                <p className="mt-1 text-[11px] text-orange-400">
                  等一等更划算 · 可省 ¥
                  {(product.currentPrice - product.lowestPrice).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {product.urls && product.urls.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-zinc-500">购买链接</p>
              <div className="space-y-2">
                {product.urls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-zinc-700/40 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-300 transition-colors hover:border-orange-500/30 hover:text-orange-400"
                  >
                    <span className="truncate pr-2">链接 {idx + 1}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {product.note && (
            <div>
              <p className="mb-1 text-xs font-medium text-zinc-500">备注</p>
              <p className="text-sm text-zinc-400">{product.note}</p>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <History className="h-4 w-4 text-zinc-400" />
              <p className="text-sm font-medium text-zinc-300">价格历史</p>
              <span className="text-xs text-zinc-500">({product.priceRecords.length}条)</span>
            </div>
            <div className="space-y-2 rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-2">
              {product.priceRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record, idx) => {
                  const isLowest = record.price === product.lowestPrice
                  return (
                    <div
                      key={record.id}
                      className={cn(
                        'flex items-center justify-between rounded-md px-3 py-2',
                        isLowest ? 'bg-emerald-500/10' : 'bg-zinc-800/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center text-[10px] text-zinc-500">
                          #{product.priceRecords.length - idx}
                        </span>
                        <div>
                          <p className="text-xs text-zinc-300">
                            {PLATFORM_MAP[record.platform] || record.platform}
                          </p>
                          <p className="text-[10px] text-zinc-500">
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
                        {isLowest ? (
                          <p className="text-[10px] text-emerald-500">历史最低</p>
                        ) : (
                          <p className="text-[10px] text-zinc-500">
                            +¥{(record.price - product.lowestPrice).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

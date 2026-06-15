import { useState, useEffect } from 'react'
import { Modal } from '@/components/Modal'
import type { Product, PriceRecord } from '@/types'
import { CONSUMABLE_CATEGORIES, PLATFORMS } from '@/constants/consumables'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/date'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void
  editProduct?: Product | null
}

export function ProductForm({ isOpen, onClose, onSubmit, editProduct }: ProductFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('other')
  const [brand, setBrand] = useState('')
  const [spec, setSpec] = useState('')
  const [lowestPrice, setLowestPrice] = useState(0)
  const [lowestPriceDate, setLowestPriceDate] = useState(formatDate(new Date()))
  const [lowestPricePlatform, setLowestPricePlatform] = useState('taobao')
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(undefined)
  const [urls, setUrls] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name)
      setCategory(editProduct.category)
      setBrand(editProduct.brand || '')
      setSpec(editProduct.spec || '')
      setLowestPrice(editProduct.lowestPrice)
      setLowestPriceDate(editProduct.lowestPriceDate)
      setLowestPricePlatform(editProduct.lowestPricePlatform)
      setCurrentPrice(editProduct.currentPrice)
      setUrls(editProduct.urls?.join('\n') || '')
      setNote(editProduct.note || '')
    } else {
      setName('')
      setCategory('other')
      setBrand('')
      setSpec('')
      setLowestPrice(0)
      setLowestPriceDate(formatDate(new Date()))
      setLowestPricePlatform('taobao')
      setCurrentPrice(undefined)
      setUrls('')
      setNote('')
    }
  }, [editProduct, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const initialPriceRecord: PriceRecord = {
      id: 'init',
      date: lowestPriceDate,
      price: lowestPrice,
      platform: lowestPricePlatform,
      note: '初始历史最低价',
    }

    const priceRecords: PriceRecord[] = [initialPriceRecord]
    if (currentPrice !== undefined && currentPrice !== lowestPrice) {
      priceRecords.unshift({
        id: 'current',
        date: formatDate(new Date()),
        price: currentPrice,
        platform: lowestPricePlatform,
        note: '当前参考价',
      })
    }

    onSubmit({
      name: name.trim(),
      category,
      brand: brand.trim() || undefined,
      spec: spec.trim() || undefined,
      lowestPrice,
      lowestPriceDate,
      lowestPricePlatform,
      currentPrice,
      priceRecords,
      urls: urls ? urls.split('\n').filter((u) => u.trim()) : undefined,
      note: note.trim() || undefined,
    })

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editProduct ? '编辑商品' : '添加商品'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">商品名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如：净水器PP棉滤芯 通用10寸"
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            >
              {CONSUMABLE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">品牌</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="选填"
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">规格</label>
          <input
            type="text"
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            placeholder="如：10寸 5微米 / 125g*3包"
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-emerald-400">
              历史最低价 (¥)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={lowestPrice}
              onChange={(e) => setLowestPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              当前参考价 (¥)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={currentPrice ?? ''}
              onChange={(e) =>
                setCurrentPrice(
                  e.target.value === '' ? undefined : parseFloat(e.target.value)
                )
              }
              placeholder="选填"
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">最低价日期</label>
            <input
              type="date"
              value={lowestPriceDate}
              onChange={(e) => setLowestPriceDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">购买平台</label>
            <select
              value={lowestPricePlatform}
              onChange={(e) => setLowestPricePlatform(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            购买链接（每行一个）
          </label>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="选填：粘贴商品链接，每行一个"
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">备注</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="选填：活动信息、注意事项等..."
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-orange-500/50"
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
            disabled={!name.trim()}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-colors',
              name.trim()
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'cursor-not-allowed bg-orange-500/50'
            )}
          >
            {editProduct ? '保存' : '添加'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

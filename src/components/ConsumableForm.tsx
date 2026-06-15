import { useState, useEffect } from 'react'
import { Modal } from '@/components/Modal'
import { useStore } from '@/store/useStore'
import type { Consumable } from '@/types'
import { CONSUMABLE_CATEGORIES, CONSUMABLE_UNITS } from '@/constants/consumables'
import { cn } from '@/lib/utils'

interface ConsumableFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Consumable, 'id' | 'updatedAt'>) => void
  editConsumable?: Consumable | null
}

export function ConsumableForm({ isOpen, onClose, onSubmit, editConsumable }: ConsumableFormProps) {
  const { appliances, products } = useStore()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('other')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('个')
  const [threshold, setThreshold] = useState(1)
  const [applianceId, setApplianceId] = useState('')
  const [productId, setProductId] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (editConsumable) {
      setName(editConsumable.name)
      setCategory(editConsumable.category)
      setQuantity(editConsumable.quantity)
      setUnit(editConsumable.unit)
      setThreshold(editConsumable.threshold)
      setApplianceId(editConsumable.applianceId || '')
      setProductId(editConsumable.productId || '')
      setNote(editConsumable.note || '')
    } else {
      setName('')
      setCategory('other')
      setQuantity(1)
      setUnit('个')
      setThreshold(1)
      setApplianceId('')
      setProductId('')
      setNote('')
    }
  }, [editConsumable, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      category,
      quantity,
      unit,
      threshold,
      applianceId: applianceId || undefined,
      productId: productId || undefined,
      note: note.trim() || undefined,
    })

    onClose()
  }

  const matchedProducts = products.filter((p) => p.category === category)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editConsumable ? '编辑耗材' : '添加耗材'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">耗材名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如：净水器滤芯"
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
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">关联电器</label>
            <select
              value={applianceId}
              onChange={(e) => setApplianceId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            >
              <option value="">不关联</option>
              {appliances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">数量</label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">单位</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            >
              {CONSUMABLE_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">阈值</label>
            <input
              type="number"
              min={0}
              value={threshold}
              onChange={(e) => setThreshold(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            关联商品（采购比价）
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500/50"
          >
            <option value="">不关联</option>
            {matchedProducts.length === 0 ? (
              <option value="" disabled>
                该分类暂无商品
              </option>
            ) : (
              matchedProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (历史最低 ¥{p.lowestPrice})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">备注</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="可选：购买链接、规格说明等..."
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
            {editConsumable ? '保存' : '添加'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

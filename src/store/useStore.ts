import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appliance, MaintenanceRecord, PhotoProof, Consumable, Product, PriceRecord } from '@/types'
import { addMonths, formatDate, generateId } from '@/utils/date'
import { APPLIANCE_TYPE_MAP } from '@/constants/templates'
import { TUTORIAL_MAP } from '@/constants/tutorials'
import { DEFAULT_CONSUMABLES, DEFAULT_PRODUCTS } from '@/constants/consumables'

interface ApplianceStore {
  appliances: Appliance[]
  records: MaintenanceRecord[]
  consumables: Consumable[]
  products: Product[]

  addAppliance: (data: Omit<Appliance, 'id' | 'nextMaintenanceDate'>) => void
  updateAppliance: (id: string, data: Partial<Omit<Appliance, 'id'>>) => void
  deleteAppliance: (id: string) => void
  performMaintenance: (
    applianceId: string,
    operator: string,
    operatorType: 'self' | 'repairman',
    cost: number,
    note: string,
    tutorialId?: string,
    photos?: PhotoProof[]
  ) => void
  getApplianceRecords: (applianceId: string) => MaintenanceRecord[]
  getLastTutorialForAppliance: (applianceId: string) => string | undefined

  addConsumable: (data: Omit<Consumable, 'id' | 'updatedAt'>) => void
  updateConsumable: (id: string, data: Partial<Omit<Consumable, 'id'>>) => void
  deleteConsumable: (id: string) => void
  adjustConsumableQuantity: (id: string, delta: number) => void
  setConsumableQuantity: (id: string, quantity: number) => void
  getLowStockConsumables: () => Consumable[]

  addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => void
  deleteProduct: (id: string) => void
  addPriceRecord: (productId: string, priceRecord: Omit<PriceRecord, 'id'>) => void
  getProductByConsumable: (consumable: Consumable) => Product | undefined
}

export const useStore = create<ApplianceStore>()(
  persist(
    (set, get) => ({
      appliances: [],
      records: [],
      consumables: DEFAULT_CONSUMABLES.map((c) => ({
        ...c,
        id: generateId(),
        updatedAt: formatDate(new Date()),
      })),
      products: DEFAULT_PRODUCTS.map((p) => ({
        ...p,
        id: generateId(),
        createdAt: formatDate(new Date()),
      })),

      addAppliance: (data) => {
        const nextDate = addMonths(data.lastMaintenanceDate, data.cycleMonths)
        const appliance: Appliance = {
          ...data,
          id: generateId(),
          nextMaintenanceDate: nextDate,
          icon: data.icon || APPLIANCE_TYPE_MAP[data.type]?.icon || 'Wrench',
        }
        set((state) => ({ appliances: [...state.appliances, appliance] }))
      },

      updateAppliance: (id, data) => {
        set((state) => ({
          appliances: state.appliances.map((a) => {
            if (a.id !== id) return a
            const updated = { ...a, ...data }
            if (data.lastMaintenanceDate || data.cycleMonths) {
              updated.nextMaintenanceDate = addMonths(
                updated.lastMaintenanceDate,
                updated.cycleMonths
              )
            }
            return updated
          }),
        }))
      },

      deleteAppliance: (id) => {
        set((state) => ({
          appliances: state.appliances.filter((a) => a.id !== id),
          records: state.records.filter((r) => r.applianceId !== id),
        }))
      },

      performMaintenance: (applianceId, operator, operatorType, cost, note, tutorialId, photos) => {
        const record: MaintenanceRecord = {
          id: generateId(),
          applianceId,
          date: formatDate(new Date()),
          operator,
          operatorType,
          cost,
          note,
          tutorialId,
          photos,
        }

        set((state) => {
          const appliance = state.appliances.find((a) => a.id === applianceId)
          if (!appliance) return state

          const nextDate = addMonths(
            formatDate(new Date()),
            appliance.cycleMonths
          )

          return {
            records: [...state.records, record],
            appliances: state.appliances.map((a) =>
              a.id === applianceId
                ? {
                    ...a,
                    lastMaintenanceDate: formatDate(new Date()),
                    nextMaintenanceDate: nextDate,
                  }
                : a
            ),
          }
        })
      },

      getApplianceRecords: (applianceId) => {
        return get()
          .records.filter((r) => r.applianceId === applianceId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getLastTutorialForAppliance: (applianceId) => {
        const records = get()
          .records.filter((r) => r.applianceId === applianceId && r.tutorialId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        return records.length > 0 ? records[0].tutorialId : undefined
      },

      addConsumable: (data) => {
        const consumable: Consumable = {
          ...data,
          id: generateId(),
          updatedAt: formatDate(new Date()),
        }
        set((state) => ({ consumables: [...state.consumables, consumable] }))
      },

      updateConsumable: (id, data) => {
        set((state) => ({
          consumables: state.consumables.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: formatDate(new Date()) }
              : c
          ),
        }))
      },

      deleteConsumable: (id) => {
        set((state) => ({
          consumables: state.consumables.filter((c) => c.id !== id),
        }))
      },

      adjustConsumableQuantity: (id, delta) => {
        set((state) => ({
          consumables: state.consumables.map((c) =>
            c.id === id
              ? {
                  ...c,
                  quantity: Math.max(0, c.quantity + delta),
                  updatedAt: formatDate(new Date()),
                }
              : c
          ),
        }))
      },

      setConsumableQuantity: (id, quantity) => {
        set((state) => ({
          consumables: state.consumables.map((c) =>
            c.id === id
              ? {
                  ...c,
                  quantity: Math.max(0, quantity),
                  updatedAt: formatDate(new Date()),
                }
              : c
          ),
        }))
      },

      getLowStockConsumables: () => {
        return get().consumables.filter((c) => c.quantity <= c.threshold)
      },

      addProduct: (data) => {
        const product: Product = {
          ...data,
          id: generateId(),
          createdAt: formatDate(new Date()),
        }
        set((state) => ({ products: [...state.products, product] }))
      },

      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      addPriceRecord: (productId, priceRecord) => {
        set((state) => {
          const products = state.products.map((p) => {
            if (p.id !== productId) return p
            const newRecord: PriceRecord = {
              ...priceRecord,
              id: generateId(),
            }
            const allRecords = [...p.priceRecords, newRecord].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            const lowest = allRecords.reduce(
              (min, r) => (r.price < min.price ? r : min),
              allRecords[0]
            )
            return {
              ...p,
              priceRecords: allRecords,
              currentPrice: priceRecord.price,
              lowestPrice: lowest.price,
              lowestPriceDate: lowest.date,
              lowestPricePlatform: lowest.platform,
            }
          })
          return { products }
        })
      },

      getProductByConsumable: (consumable) => {
        if (consumable.productId) {
          return get().products.find((p) => p.id === consumable.productId)
        }
        return get().products.find(
          (p) =>
            p.category === consumable.category &&
            (p.name.includes(consumable.name) || consumable.name.includes(p.name))
        )
      },
    }),
    {
      name: 'appliance-maintenance-store',
    }
  )
)

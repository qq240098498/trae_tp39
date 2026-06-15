import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appliance, MaintenanceRecord } from '@/types'
import { addMonths, formatDate, generateId } from '@/utils/date'
import { APPLIANCE_TYPE_MAP } from '@/constants/templates'

interface ApplianceStore {
  appliances: Appliance[]
  records: MaintenanceRecord[]

  addAppliance: (data: Omit<Appliance, 'id' | 'nextMaintenanceDate'>) => void
  updateAppliance: (id: string, data: Partial<Omit<Appliance, 'id'>>) => void
  deleteAppliance: (id: string) => void
  performMaintenance: (
    applianceId: string,
    operator: string,
    operatorType: 'self' | 'repairman',
    cost: number,
    note: string
  ) => void
  getApplianceRecords: (applianceId: string) => MaintenanceRecord[]
}

export const useStore = create<ApplianceStore>()(
  persist(
    (set, get) => ({
      appliances: [],
      records: [],

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

      performMaintenance: (applianceId, operator, operatorType, cost, note) => {
        const record: MaintenanceRecord = {
          id: generateId(),
          applianceId,
          date: formatDate(new Date()),
          operator,
          operatorType,
          cost,
          note,
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
    }),
    {
      name: 'appliance-maintenance-store',
    }
  )
)

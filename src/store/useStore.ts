import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appliance, MaintenanceRecord, PhotoProof, Room } from '@/types'
import { addMonths, formatDate, generateId } from '@/utils/date'
import { APPLIANCE_TYPE_MAP, ROOM_MAP } from '@/constants/templates'
import { TUTORIAL_MAP } from '@/constants/tutorials'

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
    note: string,
    tutorialId?: string,
    photos?: PhotoProof[]
  ) => void
  getApplianceRecords: (applianceId: string) => MaintenanceRecord[]
  getLastTutorialForAppliance: (applianceId: string) => string | undefined
  exportChecklist: () => string
  importChecklist: (json: string) => boolean
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
          room: data.room || 'living_room',
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

      exportChecklist: () => {
        const { appliances, records } = get()
        const groupedByRoom = appliances.reduce(
          (acc, a) => {
            const roomKey = a.room || 'other'
            if (!acc[roomKey]) acc[roomKey] = []
            acc[roomKey].push(a)
            return acc
          },
          {} as Record<string, Appliance[]>
        )
        const checklist = {
          exportDate: formatDate(new Date()),
          title: '全屋电器保养清单',
          rooms: Object.entries(groupedByRoom).map(([roomKey, roomAppliances]) => ({
            room: roomKey,
            roomLabel: ROOM_MAP[roomKey]?.label || '其他',
            appliances: roomAppliances.map((a) => {
              const template = APPLIANCE_TYPE_MAP[a.type]
              const applianceRecords = records
                .filter((r) => r.applianceId === a.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              return {
                name: a.name,
                type: a.type,
                typeLabel: template?.label || '其他',
                cycleMonths: a.cycleMonths,
                cycleDescription: a.cycleDescription,
                lastMaintenanceDate: a.lastMaintenanceDate,
                nextMaintenanceDate: a.nextMaintenanceDate,
                maintenanceCount: applianceRecords.length,
                totalCost: applianceRecords.reduce((s, r) => s + r.cost, 0),
              }
            }),
          })),
          totalAppliances: appliances.length,
          totalRecords: records.length,
          totalCost: records.reduce((s, r) => s + r.cost, 0),
        }
        return JSON.stringify(checklist, null, 2)
      },

      importChecklist: (json) => {
        try {
          const data = JSON.parse(json)
          if (!data.rooms || !Array.isArray(data.rooms)) return false
          const newAppliances: Appliance[] = []
          for (const room of data.rooms) {
            const roomKey = room.room as Room
            for (const item of room.appliances) {
              const lastDate = item.lastMaintenanceDate || formatDate(new Date())
              const cycleMonths = item.cycleMonths || 6
              newAppliances.push({
                id: generateId(),
                name: item.name,
                type: item.type,
                room: roomKey,
                icon: APPLIANCE_TYPE_MAP[item.type]?.icon || 'Wrench',
                lastMaintenanceDate: lastDate,
                cycleMonths,
                nextMaintenanceDate: addMonths(lastDate, cycleMonths),
                cycleDescription: item.cycleDescription || `每${cycleMonths}个月保养`,
              })
            }
          }
          set((state) => ({ appliances: [...state.appliances, ...newAppliances] }))
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'appliance-maintenance-store',
      version: 1,
      migrate: (persistedState: any) => {
        if (persistedState.appliances) {
          persistedState.appliances = persistedState.appliances.map((a: any) => ({
            ...a,
            room: a.room || 'living_room',
          }))
        }
        return persistedState
      },
    }
  )
)

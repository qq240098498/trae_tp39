export type ApplianceType =
  | 'air_conditioner'
  | 'washing_machine'
  | 'refrigerator'
  | 'range_hood'
  | 'water_heater'
  | 'water_purifier'
  | 'robot_vacuum'
  | 'other'

export interface Appliance {
  id: string
  name: string
  type: ApplianceType
  icon: string
  lastMaintenanceDate: string
  cycleMonths: number
  nextMaintenanceDate: string
  cycleDescription: string
}

export interface MaintenanceRecord {
  id: string
  applianceId: string
  date: string
  operator: string
  operatorType: 'self' | 'repairman'
  cost: number
  note: string
}

export interface ApplianceTemplate {
  type: ApplianceType
  label: string
  icon: string
  defaultCycleMonths: number
  cycleDescription: string
}

export type MaintenanceStatus = 'overdue' | 'warning' | 'safe'

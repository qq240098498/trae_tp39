export type Room = 'living_room' | 'kitchen' | 'bathroom' | 'bedroom' | 'other'

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
  room: Room
  icon: string
  lastMaintenanceDate: string
  cycleMonths: number
  nextMaintenanceDate: string
  cycleDescription: string
}

export interface ApplianceTemplate {
  type: ApplianceType
  label: string
  icon: string
  defaultCycleMonths: number
  cycleDescription: string
}

export type MaintenanceStatus = 'overdue' | 'warning' | 'safe'

export interface TutorialStep {
  id: string
  title: string
  description: string
  imageUrl?: string
  tips?: string
  warning?: string
}

export interface Tutorial {
  id: string
  title: string
  description: string
  applianceType: ApplianceType
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  thumbnailUrl?: string
  steps: TutorialStep[]
  tools?: string[]
  safetyNotes?: string[]
}

export interface PhotoProof {
  id: string
  dataUrl: string
  name: string
  size: number
  uploadedAt: string
}

export interface MaintenanceRecord {
  id: string
  applianceId: string
  date: string
  operator: string
  operatorType: 'self' | 'repairman'
  cost: number
  note: string
  tutorialId?: string
  photos?: PhotoProof[]
}

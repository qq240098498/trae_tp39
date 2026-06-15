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

export interface Consumable {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  threshold: number
  applianceId?: string
  productId?: string
  note?: string
  updatedAt: string
}

export interface PriceRecord {
  id: string
  date: string
  price: number
  platform: string
  note?: string
}

export interface Product {
  id: string
  name: string
  category: string
  brand?: string
  spec?: string
  imageUrl?: string
  lowestPrice: number
  lowestPriceDate: string
  lowestPricePlatform: string
  currentPrice?: number
  priceRecords: PriceRecord[]
  urls?: string[]
  note?: string
  createdAt: string
}

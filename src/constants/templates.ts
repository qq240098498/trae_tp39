import type { ApplianceTemplate, Room } from '@/types'

export const ROOMS: { key: Room; label: string; icon: string }[] = [
  { key: 'living_room', label: '客厅', icon: 'Sofa' },
  { key: 'kitchen', label: '厨房', icon: 'CookingPot' },
  { key: 'bathroom', label: '卫生间', icon: 'Bath' },
  { key: 'bedroom', label: '卧室', icon: 'Bed' },
  { key: 'other', label: '其他', icon: 'Home' },
]

export const ROOM_MAP = Object.fromEntries(
  ROOMS.map((r) => [r.key, r])
) as Record<string, { key: Room; label: string; icon: string }>

export const APPLIANCE_TEMPLATES: ApplianceTemplate[] = [
  {
    type: 'air_conditioner',
    label: '空调',
    icon: 'AirVent',
    defaultCycleMonths: 3,
    cycleDescription: '滤网每3个月清洗',
  },
  {
    type: 'washing_machine',
    label: '洗衣机',
    icon: 'WashingMachine',
    defaultCycleMonths: 6,
    cycleDescription: '内筒每6个月清洗',
  },
  {
    type: 'refrigerator',
    label: '冰箱',
    icon: 'Refrigerator',
    defaultCycleMonths: 6,
    cycleDescription: '内部每6个月清洁除霜',
  },
  {
    type: 'range_hood',
    label: '油烟机',
    icon: 'CookingPot',
    defaultCycleMonths: 3,
    cycleDescription: '滤网每3个月清洗',
  },
  {
    type: 'water_heater',
    label: '热水器',
    icon: 'Flame',
    defaultCycleMonths: 12,
    cycleDescription: '内胆每12个月清洗除垢',
  },
  {
    type: 'water_purifier',
    label: '净水器',
    icon: 'Droplets',
    defaultCycleMonths: 12,
    cycleDescription: '滤芯每12个月更换',
  },
  {
    type: 'robot_vacuum',
    label: '扫地机器人',
    icon: 'Bot',
    defaultCycleMonths: 3,
    cycleDescription: '滚刷尘盒每3个月清理',
  },
  {
    type: 'other',
    label: '其他',
    icon: 'Wrench',
    defaultCycleMonths: 6,
    cycleDescription: '每6个月保养',
  },
]

export const APPLIANCE_TYPE_MAP = Object.fromEntries(
  APPLIANCE_TEMPLATES.map((t) => [t.type, t])
) as Record<string, ApplianceTemplate>

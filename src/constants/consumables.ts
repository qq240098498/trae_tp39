import type { Consumable, Product } from '@/types'

export const CONSUMABLE_CATEGORIES = [
  { value: 'water_purifier', label: '净水器耗材', icon: 'Droplets' },
  { value: 'washing_machine', label: '洗衣机耗材', icon: 'WashingMachine' },
  { value: 'air_conditioner', label: '空调耗材', icon: 'AirVent' },
  { value: 'refrigerator', label: '冰箱耗材', icon: 'Refrigerator' },
  { value: 'range_hood', label: '油烟机耗材', icon: 'CookingPot' },
  { value: 'robot_vacuum', label: '扫地机器人耗材', icon: 'Bot' },
  { value: 'water_heater', label: '热水器耗材', icon: 'Flame' },
  { value: 'cleaning', label: '清洁用品', icon: 'Sparkles' },
  { value: 'other', label: '其他', icon: 'Package' },
] as const

export const CONSUMABLE_CATEGORY_MAP = Object.fromEntries(
  CONSUMABLE_CATEGORIES.map((c) => [c.value, c])
) as Record<string, (typeof CONSUMABLE_CATEGORIES)[number]>

export const CONSUMABLE_UNITS = ['个', '包', '盒', '瓶', '袋', '片', '卷', '套', '支', '块']

export const PLATFORMS = [
  { value: 'taobao', label: '淘宝' },
  { value: 'tmall', label: '天猫' },
  { value: 'jd', label: '京东' },
  { value: 'pdd', label: '拼多多' },
  { value: 'douyin', label: '抖音商城' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'suning', label: '苏宁易购' },
  { value: 'offline', label: '线下门店' },
  { value: 'other', label: '其他' },
]

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORMS.map((p) => [p.value, p.label])
) as Record<string, string>

export const DEFAULT_CONSUMABLES: Omit<Consumable, 'id' | 'updatedAt'>[] = [
  {
    name: '净水器滤芯（PP棉）',
    category: 'water_purifier',
    quantity: 1,
    unit: '个',
    threshold: 2,
  },
  {
    name: '洗衣机清洗剂',
    category: 'washing_machine',
    quantity: 2,
    unit: '包',
    threshold: 1,
  },
  {
    name: '扫地机器人边刷',
    category: 'robot_vacuum',
    quantity: 3,
    unit: '对',
    threshold: 1,
  },
]

export const DEFAULT_PRODUCTS: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: '净水器PP棉滤芯 通用10寸',
    category: 'water_purifier',
    brand: '某品牌',
    spec: '10寸 5微米',
    lowestPrice: 9.9,
    lowestPriceDate: '2026-01-15',
    lowestPricePlatform: 'pdd',
    currentPrice: 15.9,
    priceRecords: [
      { id: 'p1', date: '2025-11-01', price: 19.9, platform: 'tmall' },
      { id: 'p2', date: '2026-01-15', price: 9.9, platform: 'pdd', note: '百亿补贴活动' },
      { id: 'p3', date: '2026-03-20', price: 15.9, platform: 'jd' },
    ],
  },
  {
    name: '洗衣机槽清洁剂 除垢除菌',
    category: 'washing_machine',
    brand: '某品牌',
    spec: '125g*3包',
    lowestPrice: 8.8,
    lowestPriceDate: '2026-02-08',
    lowestPricePlatform: 'taobao',
    currentPrice: 12.8,
    priceRecords: [
      { id: 'p4', date: '2025-12-01', price: 15.8, platform: 'jd' },
      { id: 'p5', date: '2026-02-08', price: 8.8, platform: 'taobao', note: '年货节促销' },
    ],
  },
]

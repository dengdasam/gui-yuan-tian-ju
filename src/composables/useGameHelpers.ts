import type { Crop, FarmLand, InventoryItem } from '../types'
import { crops } from '../data/crops'

/** 根据 cropId 获取作物信息 */
export function getCropById(cropId: string): Crop | undefined {
  return crops.find(c => c.id === cropId)
}

/** 根据 cropId 获取作物名称 */
export function getCropName(cropId: string): string {
  const crop = crops.find(c => c.id === cropId)
  return crop?.name || cropId
}

/** 根据 cropId 获取作物图标 */
export function getCropIcon(cropId: string): string {
  const crop = crops.find(c => c.id === cropId)
  return crop?.icon || '🌱'
}

/** 格式化数字为中文铜钱表示 */
export function formatMoney(amount: number): string {
  if (amount >= 1000) {
    const guan = Math.floor(amount / 1000)
    const wen = amount % 1000
    return wen > 0 ? `${guan}贯${wen}文` : `${guan}贯`
  }
  return `${amount}文`
}

/** 格式化日期显示 */
export function formatDate(year: number, month: number, day: number): string {
  return `永安${year}年 ${month}月${day}日`
}

/** 检查物品是否可赠送 */
export function isGiftable(item: InventoryItem): boolean {
  return item.type === 'crop' || item.type === 'gift' || item.type === 'special'
}

/** 获取田地的种植进度百分比 */
export function getPlantProgress(land: FarmLand, currentDay: number): number {
  if (!land.crop || land.ready) return 100
  const crop = crops.find(c => c.id === land.crop)
  if (!crop) return 0
  const daysPlanted = currentDay - land.plantedDay
  return Math.min(100, Math.round((daysPlanted / crop.growthDays) * 100))
}

/** 检查作物是否可在此季节种植 */
export function canPlantInSeason(cropId: string, season: string): boolean {
  const crop = crops.find(c => c.id === cropId)
  if (!crop) return false
  return crop.season.includes('全季') || crop.season.includes(season as any)
}

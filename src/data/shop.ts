// ============================================
// 归园田居 - 商店物品数据
// ============================================
import type { ShopItem } from '../types'

export const shopItems: ShopItem[] = [

  // ==================== 种子类（与作物一一对应） ====================
  {
    id: 'shop_wheat_seed',
    name: '小麦种子',
    description: '春/秋可种，15天成熟，亩产5斤。面食之本。',
    category: '种子',
    basePrice: 20,
    icon: '🌾',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_rice_seed',
    name: '水稻种子',
    description: '夏/秋可种，20天成熟，亩产6斤。江南主食。',
    category: '种子',
    basePrice: 30,
    icon: '🌿',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_corn_seed',
    name: '玉米种子',
    description: '春/夏可种，12天成熟，亩产7斤。粗粮之王。',
    category: '种子',
    basePrice: 25,
    icon: '🌽',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_cabbage_seed',
    name: '白菜种子',
    description: '秋/冬可种，10天成熟，亩产8斤。家常蔬菜。',
    category: '种子',
    basePrice: 15,
    icon: '🥬',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_potato_seed',
    name: '土豆种子',
    description: '春/秋可种，18天成熟，亩产10斤。耐储存。',
    category: '种子',
    basePrice: 18,
    icon: '🥔',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_tea_seed',
    name: '茶树苗',
    description: '全年可种，25天成熟，亩产3斤。高档商品。',
    category: '种子',
    basePrice: 50,
    icon: '🍃',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_ginseng_seed',
    name: '人参种子',
    description: '全年可种，30天成熟，亩产1斤。名贵药材。',
    category: '种子',
    basePrice: 80,
    icon: '🌱',
    stock: -1,
    maxStock: -1
  },
  {
    id: 'shop_grape_seed',
    name: '葡萄苗',
    description: '春/夏可种，22天成熟，亩产4斤。可酿酒。',
    category: '种子',
    basePrice: 45,
    icon: '🍇',
    stock: -1,
    maxStock: -1
  },

  // ==================== 肥料类 ====================
  {
    id: 'shop_quick_fertilizer',
    name: '速效肥',
    description: '施用后作物生长加速2天。一袋可用一块田。',
    category: '肥料',
    basePrice: 50,
    icon: '🟤',
    stock: 10,
    maxStock: 10,
    effect: { type: 'fertilize', value: 2 }
  },
  {
    id: 'shop_super_fertilizer',
    name: '精肥',
    description: '施用后作物生长加速4天。道家炼丹术改良配方。',
    category: '肥料',
    basePrice: 100,
    icon: '🟫',
    stock: 5,
    maxStock: 5,
    effect: { type: 'fertilize', value: 4 },
    unlockCondition: '商店声望 ≥ 20'
  },
  {
    id: 'shop_compost',
    name: '堆肥',
    description: '作物收获后土壤增肥，品质+10。环保又省钱。',
    category: '肥料',
    basePrice: 30,
    icon: '🍂',
    stock: 8,
    maxStock: 8,
    effect: { type: 'fertilize', value: 0 }
  },

  // ==================== 工具类 ====================
  {
    id: 'shop_watering_tool',
    name: '竹筒浇水器',
    description: '自动浇水7天，省去每日浇水之劳。',
    category: '工具',
    basePrice: 200,
    icon: '🎋',
    stock: 3,
    maxStock: 3,
    effect: { type: 'auto_water', value: 7, duration: 7 }
  },
  {
    id: 'shop_golden_sickle',
    name: '金镰刀',
    description: '收获产量+50%。一次使用，专割一田。',
    category: '工具',
    basePrice: 150,
    icon: '🔪',
    stock: 2,
    maxStock: 2,
    effect: { type: 'yield_boost', value: 50 },
    unlockCondition: '田地等级 ≥ 2'
  },
  {
    id: 'shop_stamina_potion',
    name: '体力药剂',
    description: '恢复30点体力。云娘亲手调配的方子。',
    category: '工具',
    basePrice: 80,
    icon: '🧪',
    stock: 3,
    maxStock: 3,
    effect: { type: 'stamina_restore', value: 30 }
  },

  // ==================== 杂货类 ====================
  {
    id: 'shop_hemp_net',
    name: '麻绳网',
    description: '保护作物免受鸟雀啄食。减少意外损失。',
    category: '杂货',
    basePrice: 60,
    icon: '🪢',
    stock: 5,
    maxStock: 5
  },
  {
    id: 'shop_incense',
    name: '驱虫香',
    description: '点燃后驱赶害虫，作物品质+5。',
    category: '杂货',
    basePrice: 40,
    icon: '🕯️',
    stock: 6,
    maxStock: 6,
    seasonal: '夏'
  },
  {
    id: 'shop_straw_mat',
    name: '保温草席',
    description: '冬季覆盖作物，防冻保产。',
    category: '杂货',
    basePrice: 45,
    icon: '🪹',
    stock: 6,
    maxStock: 6,
    seasonal: '冬'
  },
  {
    id: 'shop_mooncake',
    name: '月饼礼盒',
    description: '中秋送礼佳品，送云娘好感+15。仅中秋期间有售。',
    category: '杂货',
    basePrice: 100,
    icon: '🥮',
    stock: 3,
    maxStock: 3,
    isLimited: true
  },
  {
    id: 'shop_firecracker',
    name: '鞭炮',
    description: '过年喜庆用，送小荷好感+10。仅年关期间有售。',
    category: '杂货',
    basePrice: 80,
    icon: '🧨',
    stock: 5,
    maxStock: 5,
    isLimited: true
  },
  {
    id: 'shop_grain_wine',
    name: '粮食酒',
    description: '桃源村自酿米酒，送老陈好感+8。',
    category: '杂货',
    basePrice: 60,
    icon: '🍶',
    stock: 8,
    maxStock: 8
  }
]

// ==================== 商店辅助函数 ====================

/** 根据季节筛选可售物品 */
export function getSeasonalShopItems(season: string): ShopItem[] {
  return shopItems.filter(item => {
    if (item.seasonal && item.seasonal !== season) return false
    if (item.isLimited) return false // 限时商品单独处理
    return true
  })
}

/** 获取限时商品（当前季节活动期间） */
export function getLimitedShopItems(month: number): ShopItem[] {
  const items: ShopItem[] = []
  // 月饼：8月15日前后（中秋）
  if (month === 8) {
    const mooncake = shopItems.find(i => i.id === 'shop_mooncake')
    if (mooncake) items.push(mooncake)
  }
  // 鞭炮：12月（年关）
  if (month === 12) {
    const firecracker = shopItems.find(i => i.id === 'shop_firecracker')
    if (firecracker) items.push(firecracker)
  }
  return items
}

/** 根据声望检查解锁 */
export function isItemUnlocked(item: ShopItem, reputation: number, farmLevel: number): boolean {
  if (!item.unlockCondition) return true
  if (item.unlockCondition.includes('声望') && reputation < 20) return false
  if (item.unlockCondition.includes('田地等级') && farmLevel < 2) return false
  return true
}

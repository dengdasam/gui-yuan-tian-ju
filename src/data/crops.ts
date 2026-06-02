import type { Crop } from '../types'

export const crops: Crop[] = [
  {
    id: 'wheat',
    name: '小麦',
    description: '最基础的粮食作物，耐寒耐旱，春种夏收或秋种夏收。',
    season: ['春', '秋'],
    growthDays: 5,
    buySeedPrice: 10,
    baseSellPrice: 25,
    yield: 20,
    icon: '🌾'
  },
  {
    id: 'rice',
    name: '水稻',
    description: '南方水田主打作物，需水较多，春种秋收。',
    season: ['春', '夏'],
    growthDays: 7,
    buySeedPrice: 15,
    baseSellPrice: 35,
    yield: 25,
    icon: '🍚'
  },
  {
    id: 'cabbage',
    name: '白菜',
    description: '四季可种，生长快，价格稳定。',
    season: ['全季'],
    growthDays: 3,
    buySeedPrice: 5,
    baseSellPrice: 15,
    yield: 15,
    icon: '🥬'
  },
  {
    id: 'tea',
    name: '茶叶',
    description: '终南山特产，品质极佳，商贾争购，但种植周期长。',
    season: ['春'],
    growthDays: 10,
    buySeedPrice: 30,
    baseSellPrice: 80,
    yield: 8,
    icon: '🍵'
  },
  {
    id: 'ginseng',
    name: '人参',
    description: '名贵药材，生长极慢，但价值连城。需夏秋种植。',
    season: ['夏', '秋'],
    growthDays: 15,
    buySeedPrice: 50,
    baseSellPrice: 200,
    yield: 3,
    icon: '🌿'
  },
  {
    id: 'cotton',
    name: '棉花',
    description: '纺织原料，春种秋收，与布商交易的热门商品。',
    season: ['春'],
    growthDays: 8,
    buySeedPrice: 12,
    baseSellPrice: 30,
    yield: 18,
    icon: '☁️'
  },
  {
    id: 'herb',
    name: '草药',
    description: '常用药材，药铺常年收购，价格随季节波动。',
    season: ['春', '夏', '秋'],
    growthDays: 4,
    buySeedPrice: 8,
    baseSellPrice: 22,
    yield: 10,
    icon: '🌱'
  },
  {
    id: 'grape',
    name: '葡萄',
    description: '可鲜食可酿酒，富商最爱，但需精心照料。',
    season: ['春'],
    growthDays: 12,
    buySeedPrice: 40,
    baseSellPrice: 90,
    yield: 12,
    icon: '🍇'
  }
]

export function getCropById(id: string): Crop | undefined {
  return crops.find(c => c.id === id)
}

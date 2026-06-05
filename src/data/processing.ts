import type { ProcessingRecipe } from '../types'

// ============================================
// 加工坊配方数据
// ============================================

export const processingRecipes: ProcessingRecipe[] = [
  // ---- 粮食加工 ----
  {
    id: 'mill_wheat',
    name: '磨面粉',
    description: '将小麦用石磨碾成精细面粉，是做面食的基础原料。',
    inputItemId: 'wheat',
    inputQuantity: 5,
    outputItemId: 'flour',
    outputName: '面粉',
    outputQuantity: 3,
    outputIcon: '🫓',
    processDays: 2,
    staminaCost: 10,
    valueMultiplier: 1.5,
    minFarmLevel: 1
  },
  {
    id: 'polish_rice',
    name: '碾精米',
    description: '用木砻去壳碾白，出的精米粒粒晶莹，身价倍增。',
    inputItemId: 'rice',
    inputQuantity: 5,
    outputItemId: 'polished_rice',
    outputName: '精米',
    outputQuantity: 3,
    outputIcon: '🍚',
    processDays: 2,
    staminaCost: 10,
    valueMultiplier: 1.4,
    minFarmLevel: 1
  },

  // ---- 蔬菜加工 ----
  {
    id: 'pickle_cabbage',
    name: '腌泡菜',
    description: '以盐水、花椒、姜片腌制白菜，酸甜爽口，城中酒楼争相收购。',
    inputItemId: 'cabbage',
    inputQuantity: 3,
    outputItemId: 'pickled_cabbage',
    outputName: '泡菜',
    outputQuantity: 2,
    outputIcon: '🥫',
    processDays: 3,
    staminaCost: 12,
    valueMultiplier: 1.8,
    minFarmLevel: 2,
    unlockCondition: '云娘好感 ≥ 30'
  },

  // ---- 茶叶精加工 ----
  {
    id: 'refine_tea',
    name: '炒制绿茶',
    description: '手工炒青，火候恰到好处，茶香四溢。李家商号常年收购。',
    inputItemId: 'tea',
    inputQuantity: 3,
    outputItemId: 'refined_tea',
    outputName: '精制绿茶',
    outputQuantity: 2,
    outputIcon: '🍵',
    processDays: 4,
    staminaCost: 18,
    valueMultiplier: 2.5,
    minFarmLevel: 3
  },
  {
    id: 'tea_brick',
    name: '压制茶砖',
    description: '将茶叶蒸软后压制成砖，便于长途贩运，茶马古道上的硬通货。',
    inputItemId: 'tea',
    inputQuantity: 5,
    outputItemId: 'tea_brick',
    outputName: '茶砖',
    outputQuantity: 2,
    outputIcon: '🧱',
    processDays: 7,
    staminaCost: 25,
    valueMultiplier: 3.0,
    minFarmLevel: 4,
    unlockCondition: '李明好感 ≥ 50'
  },

  // ---- 药材加工 ----
  {
    id: 'slice_ginseng',
    name: '切参片',
    description: '将人参洗净切片，阴干保存，药效不减而便于使用。',
    inputItemId: 'ginseng',
    inputQuantity: 1,
    outputItemId: 'ginseng_slices',
    outputName: '参片',
    outputQuantity: 3,
    outputIcon: '💊',
    processDays: 5,
    staminaCost: 20,
    valueMultiplier: 2.0,
    minFarmLevel: 3
  },
  {
    id: 'make_ointment',
    name: '制药膏',
    description: '将草药捣碎熬制，佐以蜂蜡成膏，是跌打损伤的良药。',
    inputItemId: 'herb',
    inputQuantity: 4,
    outputItemId: 'herbal_ointment',
    outputName: '药膏',
    outputQuantity: 2,
    outputIcon: '🧴',
    processDays: 3,
    staminaCost: 15,
    valueMultiplier: 2.0,
    minFarmLevel: 2,
    unlockCondition: '云娘好感 ≥ 40'
  },

  // ---- 纺织加工 ----
  {
    id: 'weave_cotton',
    name: '纺棉布',
    description: '轧花弹棉后纺纱织布，一匹好布抵得上十斤原棉。',
    inputItemId: 'cotton',
    inputQuantity: 5,
    outputItemId: 'cotton_cloth',
    outputName: '棉布',
    outputQuantity: 2,
    outputIcon: '🧵',
    processDays: 3,
    staminaCost: 14,
    valueMultiplier: 1.6,
    minFarmLevel: 2
  },

  // ---- 酿酒 ----
  {
    id: 'brew_wine',
    name: '酿葡萄酒',
    description: '选取饱满葡萄，入缸发酵数月，酿出的美酒价值不菲。',
    inputItemId: 'grape',
    inputQuantity: 6,
    outputItemId: 'grape_wine',
    outputName: '葡萄酒',
    outputQuantity: 2,
    outputIcon: '🍷',
    processDays: 10,
    staminaCost: 30,
    valueMultiplier: 3.0,
    minFarmLevel: 4,
    unlockCondition: '老陈好感 ≥ 40'
  },

  // ---- 快速加工 ----
  {
    id: 'dry_grape',
    name: '晒葡萄干',
    description: '将葡萄晾晒成干，甘甜可口，便于保存和携带。',
    inputItemId: 'grape',
    inputQuantity: 3,
    outputItemId: 'raisins',
    outputName: '葡萄干',
    outputQuantity: 2,
    outputIcon: '🫐',
    processDays: 2,
    staminaCost: 8,
    valueMultiplier: 1.5,
    minFarmLevel: 1
  }
]

export function getRecipeById(id: string): ProcessingRecipe | undefined {
  return processingRecipes.find(r => r.id === id)
}

export function getRecipesForItem(itemId: string): ProcessingRecipe[] {
  return processingRecipes.filter(r => r.inputItemId === itemId)
}

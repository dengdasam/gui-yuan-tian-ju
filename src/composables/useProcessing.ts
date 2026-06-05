import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { processingRecipes, getRecipeById } from '../data/processing'
import type { ProcessingRecipe } from '../types'

/**
 * 加工坊 UI 辅助工具
 * 核心状态在 game store 中管理（支持存档）
 */
export function useProcessing() {
  const store = useGameStore()

  // ---- 可用配方 ----
  const availableRecipes = computed(() => {
    return processingRecipes.filter(r => {
      // 等级要求
      if (store.player.farmLevel < r.minFarmLevel) return false
      // 解锁条件若有则已在 store 中检查
      if (r.unlockCondition && !store.processingState.unlockedRecipes.includes(r.id)) return false
      return true
    })
  })

  // ---- 检查原料是否充足 ----
  function hasIngredients(recipe: ProcessingRecipe): boolean {
    const item = store.player.inventory.find(i => i.itemId === recipe.inputItemId)
    return (item?.quantity || 0) >= recipe.inputQuantity
  }

  // ---- 检查体力是否够 ----
  function hasStamina(recipe: ProcessingRecipe): boolean {
    return store.player.stamina >= recipe.staminaCost
  }

  // ---- 能否开始加工 ----
  function canStart(recipe: ProcessingRecipe): boolean {
    if (!hasIngredients(recipe)) return false
    if (!hasStamina(recipe)) return false
    // 检查是否有空闲槽位
    const busy = store.processingState.slots.filter(s => s.status === 'processing')
    return busy.length < store.processingState.maxSlots
  }

  // ---- 获取空闲槽位 ----
  function getFreeSlot(): number | null {
    const slot = store.processingState.slots.find(s => s.status === 'idle')
    return slot ? slot.id : null
  }

  // ---- 计算进度百分比（基于总天数） ----
  function computeProgress(recipeDays: number, startDay: number, currentTotalDays: number): number {
    if (currentTotalDays <= startDay) return 0
    const elapsed = currentTotalDays - startDay
    return Math.min(100, Math.round((elapsed / recipeDays) * 100))
  }

  // ---- 获取配方 ----
  function getRecipe(id: string): ProcessingRecipe | undefined {
    return getRecipeById(id)
  }

  // ---- 检查解锁条件（供 store 使用） ----
  function checkUnlockCondition(recipe: ProcessingRecipe): boolean {
    if (!recipe.unlockCondition) return true
    // 解析 "云娘好感 ≥ 30" 格式
    const match = recipe.unlockCondition.match(/(.+)好感\s*[≥>=]\s*(\d+)/)
    if (match) {
      const npcName = match[1]
      const threshold = parseInt(match[2])
      const npc = store.npcs.find(n => n.name === npcName)
      return npc ? npc.affection >= threshold : false
    }
    return false
  }

  return {
    availableRecipes,
    hasIngredients,
    hasStamina,
    canStart,
    getFreeSlot,
    computeProgress,
    getRecipe,
    checkUnlockCondition,
  }
}

import { watch, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'

/**
 * 自动存档组合式函数
 * 每隔指定天数或用户操作后自动保存
 */
export function useAutoSave(intervalMinutes = 5) {
  const store = useGameStore()
  let timer: ReturnType<typeof setInterval> | null = null

  function startAutoSave() {
    if (timer) return
    timer = setInterval(() => {
      if (store.phase === 'playing') {
        store.saveGame(0, '自动存档')
      }
    }, intervalMinutes * 60 * 1000)
  }

  function stopAutoSave() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 监听阶段变化，自动保存
  watch(() => store.phase, (newPhase, oldPhase) => {
    if (newPhase === 'playing') {
      startAutoSave()
    } else {
      stopAutoSave()
    }
  }, { immediate: true })

  onUnmounted(() => {
    stopAutoSave()
  })

  return { startAutoSave, stopAutoSave }
}

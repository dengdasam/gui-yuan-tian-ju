<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import { useProcessing } from '../composables/useProcessing'

const store = useGameStore()
const { availableRecipes, hasIngredients, hasStamina, canStart, getFreeSlot } = useProcessing()
const selectedRecipe = ref<string | null>(null)

function startProcess(recipeId: string) {
  const slotId = getFreeSlot()
  if (slotId === null) return
  store.startProcessing(slotId, recipeId)
  selectedRecipe.value = null
}

function claim(slotId: number) {
  store.claimProcessed(slotId)
}

function upgradeSlot() {
  store.upgradeProcessingSlot()
}

function canUpgrade(): boolean {
  const costs = [0, 200, 500]
  const idx = store.processingState.maxSlots
  return idx < 3 && store.player.gold >= costs[idx]
}

function upgradeCost(): number {
  const costs = [0, 200, 500]
  return costs[store.processingState.maxSlots] || 0
}
</script>

<template>
  <div class="processing-root">
    <!-- 加工槽位 -->
    <div class="slots-section">
      <div class="section-header">
        <span>⚒️ 加工槽位</span>
        <button
          v-if="canUpgrade()"
          class="btn btn-tiny upgrade-btn"
          @click="upgradeSlot"
        >+ 升级 ({{ upgradeCost() }}文)</button>
      </div>
      <div class="slots-grid">
        <div
          v-for="slot in store.processingState.slots"
          :key="slot.id"
          class="slot-card"
          :class="{
            'slot-processing': slot.status === 'processing',
            'slot-done': slot.status === 'done',
          }"
        >
          <!-- 空闲 -->
          <div v-if="slot.status === 'idle'" class="slot-idle">
            <span class="slot-icon">🈳</span>
            <span class="slot-label">空闲</span>
          </div>

          <!-- 加工中 -->
          <div v-else-if="slot.status === 'processing'" class="slot-active">
            <span class="slot-icon">⚙️</span>
            <span class="slot-recipe-name">
              {{ availableRecipes.find(r => r.id === slot.recipeId)?.name || '加工中' }}
            </span>
            <div class="progress-bar-wrap">
              <div
                class="progress-bar-fill"
                :style="{ width: slot.progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ slot.progress }}%</span>
          </div>

          <!-- 完成 -->
          <div v-else class="slot-done-content">
            <span class="slot-icon">✅</span>
            <span class="slot-recipe-name">
              {{ availableRecipes.find(r => r.id === slot.recipeId)?.outputName || '成品' }}
            </span>
            <button class="btn btn-tiny claim-btn" @click="claim(slot.id)">
              领取
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 配方列表 -->
    <div class="recipes-section">
      <div class="section-header">📜 加工配方</div>

      <div class="no-recipes" v-if="availableRecipes.length === 0">
        <p>暂无可用的加工配方。</p>
        <p class="hint">提升田地等级或与村民增进好感来解锁新配方。</p>
      </div>

      <div
        v-for="recipe in availableRecipes"
        :key="recipe.id"
        class="recipe-card"
        :class="{ 'recipe-disabled': !canStart(recipe) }"
        @click="canStart(recipe) && startProcess(recipe.id)"
      >
        <div class="recipe-top">
          <span class="recipe-icon">{{ recipe.outputIcon }}</span>
          <div class="recipe-info">
            <div class="recipe-name">{{ recipe.name }}</div>
            <div class="recipe-desc">{{ recipe.description }}</div>
          </div>
          <div class="recipe-arrow" v-if="canStart(recipe)">▶</div>
        </div>
        <div class="recipe-meta">
          <span class="meta-item">
            📦 {{ recipe.outputIcon }}×{{ recipe.outputQuantity }}
            ← {{ recipe.inputQuantity }}原料
          </span>
          <span class="meta-item">⏱ {{ recipe.processDays }}天</span>
          <span class="meta-item">💪 {{ recipe.staminaCost }}体力</span>
          <span
            class="meta-item meta-warn"
            v-if="!hasIngredients(recipe)"
          >⚠️ 原料不足</span>
          <span
            class="meta-item meta-warn"
            v-else-if="!hasStamina(recipe)"
          >⚠️ 体力不足</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.processing-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
  max-height: 100%;
  overflow-y: auto;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: var(--ink);
  font-size: 13px;
  padding: 4px 0;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 4px;
}

/* 槽位 */
.slots-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.slot-card {
  flex: 1;
  min-width: 90px;
  border-radius: 8px;
  padding: 10px;
  border: 2px dashed var(--border-light);
  background: var(--paper);
  text-align: center;
  transition: all 0.25s;
}

.slot-processing {
  border-color: var(--gold-light);
  background: linear-gradient(135deg, #fdf8e8, #faf3d8);
}

.slot-done {
  border-color: #6abf6a;
  background: linear-gradient(135deg, #f0faf0, #e6f5e6);
  border-style: solid;
}

.slot-idle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--ink-muted);
  font-size: 12px;
}

.slot-icon { font-size: 22px; }

.slot-active, .slot-done-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.slot-recipe-name {
  font-size: 12px;
  color: var(--ink);
  font-weight: 500;
}

.progress-bar-wrap {
  width: 100%;
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #c8a45c, #d4b86a);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 11px;
  color: var(--ink-muted);
}

.claim-btn {
  background: linear-gradient(to bottom, #6abf6a, #4a9f4a);
  color: #fff;
  border: none;
  padding: 3px 14px;
}
.claim-btn:hover {
  background: linear-gradient(to bottom, #7ad07a, #5ab05a);
}

/* 配方 */
.recipes-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recipe-card {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  background: var(--paper);
  transition: all 0.2s;
}
.recipe-card:hover:not(.recipe-disabled) {
  border-color: var(--gold-light);
  background: linear-gradient(135deg, #fdf8e8, #fff);
  box-shadow: 0 2px 6px rgba(200, 164, 92, 0.15);
}
.recipe-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.recipe-top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.recipe-icon { font-size: 22px; flex-shrink: 0; }

.recipe-info { flex: 1; min-width: 0; }

.recipe-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.recipe-desc {
  font-size: 11px;
  color: var(--ink-muted);
  margin-top: 2px;
  line-height: 1.4;
}

.recipe-arrow {
  color: var(--gold);
  font-size: 12px;
  flex-shrink: 0;
  align-self: center;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.meta-item {
  font-size: 11px;
  color: var(--ink-muted);
  background: var(--bg-light);
  padding: 1px 6px;
  border-radius: 3px;
}

.meta-warn {
  color: #c34043;
  background: #fef0f0;
}

.no-recipes {
  text-align: center;
  padding: 20px 8px;
  color: var(--ink-muted);
  font-size: 12px;
}
.no-recipes .hint {
  margin-top: 4px;
  font-size: 11px;
  color: var(--gold-dark);
}

/* tiny buttons */
.btn-tiny {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--border-light);
  background: var(--paper);
  color: var(--ink);
  transition: all 0.2s;
}
.btn-tiny:hover {
  border-color: var(--gold);
  background: var(--gold-bg);
}

.upgrade-btn {
  border-color: var(--gold-light);
  color: var(--gold-dark);
}
</style>

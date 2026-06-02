<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import { crops } from '../data/crops'

const store = useGameStore()
const showPlant = ref(false)
const selectedLand = ref<number | null>(null)

function openPlant(landId: number) {
  selectedLand.value = landId
  showPlant.value = true
}

function doPlant(cropId: string) {
  if (selectedLand.value !== null) {
    store.plantCrop(selectedLand.value, cropId)
    showPlant.value = false
    selectedLand.value = null
  }
}

function doHarvest(landId: number) {
  store.harvestCrop(landId)
}

function getCropName(cropId: string | null) {
  if (!cropId) return ''
  return crops.find(c => c.id === cropId)?.name || cropId
}

function getCropIcon(cropId: string | null) {
  if (!cropId) return ''
  return crops.find(c => c.id === cropId)?.icon || ''
}

function availableCrops() {
  return crops.filter(c => {
    const seasonOk = c.season.includes('全季') || c.season.includes(store.date.season)
    return seasonOk
  })
}

function getLandProgress(land: typeof store.farmLands[0]) {
  if (!land.crop || land.ready) return 100
  const crop = crops.find(c => c.id === land.crop)
  if (!crop) return 0
  const daysPassed = store.totalDays - land.plantedDay
  return Math.min(100, Math.round((daysPassed / crop.growthDays) * 100))
}
</script>

<template>
  <div class="farm-panel panel">
    <div class="panel-header flex-between">
      <h3 class="panel-title">🌾 我的田地</h3>
      <span class="land-count">{{ store.plantedLands.length }}/{{ store.farmLands.length }} 块已种</span>
    </div>

    <!-- 田地列表 -->
    <div class="lands">
      <div
        v-for="land in store.farmLands"
        :key="land.id"
        class="land-item"
        :class="{ ready: land.ready, planted: land.crop && !land.ready }"
      >
        <div class="land-info">
          <span class="land-name">田 {{ land.id + 1 }}</span>
          <span v-if="land.crop" class="land-crop">
            {{ getCropIcon(land.crop) }} {{ getCropName(land.crop) }}
          </span>
          <span v-else class="land-empty">空闲</span>
        </div>

        <!-- 进度条 -->
        <div v-if="land.crop && !land.ready" class="progress-bar">
          <div class="progress-fill" :style="{ width: getLandProgress(land) + '%' }"></div>
          <span class="progress-text">{{ getLandProgress(land) }}%</span>
        </div>

        <div class="land-actions">
          <button v-if="!land.crop" class="btn btn-small" @click="openPlant(land.id)">
            种植
          </button>
          <button v-else-if="land.ready" class="btn btn-small btn-gold" @click="doHarvest(land.id)">
            收获
          </button>
          <div v-else class="growing-badge">生长中</div>
        </div>
      </div>
    </div>

    <!-- 种植弹窗 -->
    <div v-if="showPlant" class="plant-modal">
      <div class="plant-modal-bg" @click="showPlant = false"></div>
      <div class="plant-modal-content panel">
        <h4>选择作物种植</h4>
        <p class="modal-hint">当前季节：{{ store.seasonName }}</p>
        <div class="crop-list">
          <div
            v-for="crop in availableCrops()"
            :key="crop.id"
            class="crop-option card"
            @click="doPlant(crop.id)"
          >
            <span class="crop-icon">{{ crop.icon }}</span>
            <div class="crop-info">
              <span class="crop-name">{{ crop.name }}</span>
              <span class="crop-desc">种子 {{ crop.buySeedPrice }}文 | {{ crop.growthDays }}天成熟</span>
            </div>
          </div>
        </div>
        <button class="btn" @click="showPlant = false">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.farm-panel {
  position: relative;
}

.panel-header {
  margin-bottom: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.land-count {
  font-size: 12px;
  color: var(--text-muted);
}

.lands {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.land-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  background: var(--bg-paper);
  transition: all 0.2s ease;
}
.land-item.ready {
  border-color: var(--gold-light);
  background: linear-gradient(135deg, #fdf8e8, #faf3d0);
}
.land-item.planted {
  border-color: var(--green-light);
}

.land-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.land-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 36px;
}

.land-crop {
  font-size: 14px;
  color: var(--ink);
}

.land-empty {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
}

.progress-bar {
  position: relative;
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green-light), var(--green));
  border-radius: 3px;
  transition: width 0.5s ease;
}
.progress-text {
  display: none;
}

.land-actions {
  display: flex;
  justify-content: flex-end;
}

.growing-badge {
  font-size: 12px;
  color: var(--green);
  font-style: italic;
}

/* 种植弹窗 */
.plant-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.plant-modal-bg {
  position: absolute;
  inset: 0;
  background: rgba(44, 36, 22, 0.3);
  backdrop-filter: blur(2px);
}
.plant-modal-content {
  position: relative;
  width: 340px;
  max-height: 70vh;
  overflow-y: auto;
  z-index: 101;
}
.plant-modal-content h4 {
  font-size: 18px;
  margin-bottom: 4px;
}
.modal-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.crop-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.crop-option {
  display: flex;
  align-items: center;
  gap: 12px;
}
.crop-icon {
  font-size: 28px;
}
.crop-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.crop-name {
  font-weight: 600;
  font-size: 15px;
}
.crop-desc {
  font-size: 12px;
  color: var(--text-muted);
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { crops } from '../data/crops'
import { getCropName, getCropIcon, canPlantInSeason, getPlantProgress } from '../composables/useGameHelpers'

const store = useGameStore()
const showPlant = ref(false)
const showExpand = ref(false)
const selectedLand = ref<number | null>(null)
const showToolMenu = ref<number | null>(null)

const maxLands = 6

/** 背包中可对田使用的工具物品 */
const toolItems = computed(() =>
  store.player.inventory.filter(i => i.type === 'tool')
)
const expandCost = computed(() => {
  const currentCount = store.farmLands.length
  if (currentCount >= maxLands) return 0
  // 扩展费用逐级递增
  const costs = [0, 0, 0, 150, 250, 400] // 第4/5/6块田的价格
  return costs[currentCount] || 0
})

const canExpand = computed(() =>
  store.farmLands.length < maxLands && store.player.gold >= expandCost.value
)

function expandLand() {
  if (!canExpand.value) return
  store.expandLand()
  showExpand.value = false
}

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

function availableCrops() {
  return crops.filter(c => canPlantInSeason(c.id, store.date.season))
}

function getLandProgress(land: typeof store.farmLands[0]) {
  return getPlantProgress(land, store.totalDays)
}
</script>

<template>
  <div class="farm-panel panel">
    <div class="panel-header flex-between">
      <h3 class="panel-title">🌾 我的田地</h3>
      <div class="header-right">
        <span class="land-count">{{ store.plantedLands.length }}/{{ store.farmLands.length }} 块已种</span>
        <button
          v-if="store.farmLands.length < maxLands"
          class="btn btn-tiny"
          @click="showExpand = !showExpand"
        >+ 开垦</button>
      </div>
    </div>

    <!-- 扩展面板 -->
    <div v-if="showExpand" class="expand-card">
      <div class="expand-info">
        <span>开垦第{{ store.farmLands.length + 1 }}块田地</span>
        <span class="expand-cost">{{ expandCost }}文</span>
      </div>
      <button
        class="btn btn-small btn-gold"
        :disabled="!canExpand"
        @click="expandLand"
      >
        {{ canExpand ? '确认开垦' : store.player.gold < expandCost ? '铜钱不足' : '已满' }}
      </button>
      <button class="btn btn-small" @click="showExpand = false">取消</button>
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
          <!-- 工具使用入口 -->
          <button
            v-if="land.crop && toolItems.length > 0"
            class="btn btn-tiny btn-tool"
            @click="showToolMenu = showToolMenu === land.id ? null : land.id"
          >🔧</button>
        </div>

        <!-- 工具菜单 -->
        <div v-if="showToolMenu === land.id" class="tool-menu">
          <div v-for="item in toolItems" :key="item.itemId" class="tool-menu-item"
            @click="store.useShopItem(item.itemId, land.id); showToolMenu = null">
            <span>{{ item.icon }} {{ item.name }} ×{{ item.quantity }}</span>
            <span class="tool-use-label">使用 →</span>
          </div>
          <button class="btn btn-tiny" @click="showToolMenu = null" style="width:100%;margin-top:4px">关闭</button>
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
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
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

.btn-tiny {
  font-family: var(--font-body);
  font-size: 11px;
  padding: 2px 8px;
  background: var(--bg-paper);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-tiny:hover {
  border-color: var(--gold);
  color: var(--gold);
}
.btn-tool {
  font-size: 14px; padding: 2px 6px;
  background: #e0f2fe; border-color: #bae6fd; color: #0369a1;
}
.btn-tool:hover { background: #bae6fd; border-color: #7dd3fc; color: #0284c7; }

/* 工具菜单 */
.tool-menu {
  margin-top: 4px; padding: 6px;
  background: var(--bg-primary); border: 1px solid var(--border-light);
  border-radius: var(--radius);
}
.tool-menu-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 4px 8px; font-size: 12px; cursor: pointer;
  border-radius: 3px; transition: background 0.15s;
}
.tool-menu-item:hover { background: var(--bg-paper); color: var(--gold); }
.tool-use-label { font-size: 10px; color: var(--text-muted); }

/* 扩展卡片 */
.expand-card {
  padding: 10px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fef9e7, #fdf3c7);
  border: 1px solid var(--gold-light);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.expand-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: var(--ink);
}

.expand-cost {
  font-weight: 700;
  color: var(--gold);
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

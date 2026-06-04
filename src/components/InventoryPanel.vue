<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { formatMoney } from '../composables/useGameHelpers'

const store = useGameStore()

const activeTab = ref<'all' | 'seed' | 'crop' | 'gift' | 'special'>('all')
const selectedItem = ref<string | null>(null)

const filteredItems = computed(() => {
  if (activeTab.value === 'all') return store.player.inventory
  return store.player.inventory.filter(i => i.type === activeTab.value)
})

const itemCount = computed(() => store.player.inventory.reduce((sum, i) => sum + i.quantity, 0))

function getTypeLabel(type: string): string {
  const map: Record<string, string> = { seed: '种子', crop: '作物', gift: '礼物', special: '特殊', tool: '工具' }
  return map[type] || type
}

function getTypeColor(type: string): string {
  const map: Record<string, string> = { seed: '#5a9e6f', crop: '#c8a45c', gift: '#c34043', special: '#7c3aed', tool: '#6366f1' }
  return map[type] || '#999'
}

function useItem(itemId: string) {
  const item = store.player.inventory.find(i => i.itemId === itemId)
  if (!item) return

  if (item.type === 'seed') {
    // 种子使用：跳转到种田
    selectedItem.value = itemId
    store.addLog(`选中了【${item.name}】，前往田地进行种植。`, 'action')
  } else if (item.type === 'crop') {
    // 作物：直接出售
    store.sellItem(itemId, item.quantity)
  } else if (item.type === 'gift') {
    selectedItem.value = itemId
    store.addLog(`选中了【${item.name}】，可前往村中送给NPC。`, 'action')
  }
}

const tabItems: { key: typeof activeTab.value; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '🎒' },
  { key: 'seed', label: '种子', icon: '🌰' },
  { key: 'crop', label: '作物', icon: '🌾' },
  { key: 'gift', label: '礼物', icon: '🎁' },
  { key: 'special', label: '特殊', icon: '💎' }
]
</script>

<template>
  <div class="inventory-panel panel">
    <div class="panel-header">
      <h3 class="panel-title">🎒 背包</h3>
      <span class="item-count">{{ itemCount }}件物品</span>
    </div>

    <!-- 分类Tab -->
    <div class="tabs">
      <button
        v-for="tab in tabItems"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- 物品列表 -->
    <div class="item-list">
      <div v-if="filteredItems.length === 0" class="empty-state">
        {{ activeTab === 'all' ? '背包空空如也' : '该分类没有物品' }}
      </div>
      <div
        v-for="item in filteredItems"
        :key="item.itemId"
        class="item-card"
        :class="{ selected: selectedItem === item.itemId }"
        @click="useItem(item.itemId)"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-body">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-desc">{{ item.description }}</div>
        </div>
        <div class="item-right">
          <span class="item-qty">×{{ item.quantity }}</span>
          <span class="item-type-tag" :style="{ color: getTypeColor(item.type), borderColor: getTypeColor(item.type) }">
            {{ getTypeLabel(item.type) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 选中物品操作 -->
    <div v-if="selectedItem" class="item-actions">
      <span class="selected-label">已选中：{{ store.player.inventory.find(i => i.itemId === selectedItem)?.name }}</span>
      <button class="btn btn-small" @click="selectedItem = null">取消选择</button>
    </div>
  </div>
</template>

<style scoped>
.inventory-panel {
  display: flex;
  flex-direction: column;
  max-height: 420px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.item-count {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-primary);
  padding: 2px 10px;
  border-radius: 10px;
}

.tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 6px;
  overflow-x: auto;
}

.tab-btn {
  font-family: var(--font-body);
  font-size: 12px;
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn:hover { color: var(--ink); background: var(--bg-primary); }
.tab-btn.active { background: var(--ink); color: var(--text-inverse); }

.item-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  font-size: 13px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-paper);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}

.item-card:hover {
  border-color: var(--gold);
  transform: translateX(2px);
}

.item-card.selected {
  border-color: var(--gold);
  background: linear-gradient(135deg, #fef9e7, #fef3c7);
}

.item-icon {
  font-size: 28px;
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.item-desc {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.item-qty {
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
}

.item-type-tag {
  font-size: 10px;
  padding: 1px 6px;
  border: 1px solid;
  border-radius: 3px;
}

.item-actions {
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--bg-primary);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.selected-label {
  color: var(--ink);
  font-weight: 500;
}
</style>

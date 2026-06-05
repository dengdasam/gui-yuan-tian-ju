<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import StoryPanel from '../components/StoryPanel.vue'
import SceneCanvas from '../components/SceneCanvas.vue'
import FarmPanel from '../components/FarmPanel.vue'
import MarketPanel from '../components/MarketPanel.vue'
import NPCPanel from '../components/NPCPanel.vue'
import InventoryPanel from '../components/InventoryPanel.vue'
import StatusBar from '../components/StatusBar.vue'
import SeasonalEventDialog from '../components/SeasonalEventDialog.vue'
import SaveDialog from '../components/SaveDialog.vue'
import MiniGamePanel from '../components/MiniGamePanel.vue'

const store = useGameStore()
const showSaveDialog = ref(false)
const activeRightTab = ref<'farm' | 'market' | 'npc' | 'inventory'>('farm')
</script>

<template>
  <div class="game-screen">
    <!-- 顶栏：状态信息 -->
    <StatusBar @open-save="showSaveDialog = true" />

    <!-- 主体区域 -->
    <div class="game-main">
      <!-- 左侧：场景展示 + 故事面板 -->
      <div class="panel-left">
        <div class="panel-left-content">
          <SceneCanvas />
          <StoryPanel />
        </div>
      </div>

      <!-- 右侧：操作面板 -->
      <div class="panel-right">
        <!-- 快捷标签栏 -->
        <div class="quick-tabs">
          <button
            class="quick-tab"
            :class="{ active: activeRightTab === 'farm' }"
            @click="activeRightTab = 'farm'"
          >🌱 田地</button>
          <button
            class="quick-tab"
            :class="{ active: activeRightTab === 'market' }"
            @click="activeRightTab = 'market'"
          >🏪 集市</button>
          <button
            class="quick-tab"
            :class="{ active: activeRightTab === 'npc' }"
            @click="activeRightTab = 'npc'"
          >👥 村中</button>
          <button
            class="quick-tab"
            :class="{ active: activeRightTab === 'inventory' }"
            @click="activeRightTab = 'inventory'"
          >🎒 背包</button>
        </div>

        <div class="panel-content">
          <FarmPanel v-if="activeRightTab === 'farm'" />
          <MarketPanel v-if="activeRightTab === 'market'" />
          <NPCPanel v-if="activeRightTab === 'npc'" />
          <InventoryPanel v-if="activeRightTab === 'inventory'" />
        </div>
      </div>
    </div>

    <!-- 季节事件弹窗 -->
    <SeasonalEventDialog />
    <!-- 存档弹窗 -->
    <SaveDialog :show="showSaveDialog" @close="showSaveDialog = false" />
    <!-- 小游戏弹窗 -->
    <MiniGamePanel :show="store.miniGameSession.active" @close="store.endMiniGame()" />
  </div>
</template>

<style scoped>
.game-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.game-main {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 0 16px 16px;
  overflow: hidden;
  min-height: 0;
}

.panel-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.panel-right {
  width: 380px;
  min-width: 380px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.quick-tabs {
  display: flex;
  gap: 2px;
  padding: 4px;
  background: var(--bg-paper);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  margin-bottom: 8px;
}

.quick-tab {
  flex: 1;
  font-family: var(--font-body);
  font-size: 12px;
  padding: 6px 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-tab:hover {
  color: var(--ink);
  background: var(--bg-primary);
}

.quick-tab.active {
  background: var(--ink);
  color: var(--text-inverse);
  font-weight: 600;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
</style>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import StoryPanel from '../components/StoryPanel.vue'
import FarmPanel from '../components/FarmPanel.vue'
import MarketPanel from '../components/MarketPanel.vue'
import NPCPanel from '../components/NPCPanel.vue'
import StatusBar from '../components/StatusBar.vue'
import SeasonalEventDialog from '../components/SeasonalEventDialog.vue'

const store = useGameStore()
</script>

<template>
  <div class="game-screen">
    <!-- 顶栏：状态信息 -->
    <StatusBar />

    <!-- 主体区域 -->
    <div class="game-main">
      <!-- 左侧：剧情 / 故事面板 -->
      <div class="panel-left">
        <StoryPanel />
      </div>

      <!-- 右侧：操作面板 -->
      <div class="panel-right">
        <FarmPanel />
        <MarketPanel />
        <NPCPanel />
      </div>
    </div>

    <!-- 季节事件弹窗 -->
    <SeasonalEventDialog />
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
}

.panel-right {
  width: 360px;
  min-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
</style>

<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()
const emit = defineEmits<{ 'open-save': [] }>()
</script>

<template>
  <div class="status-bar">
    <div class="status-left">
      <div class="status-item date-display">
        <span class="season-icon">
          {{ store.date.season === '春' ? '🌸' : store.date.season === '夏' ? '☀️' : store.date.season === '秋' ? '🍂' : '❄️' }}
        </span>
        <span class="date-text">
          永安{{ store.date.year }}年 {{ store.date.month }}月{{ store.date.day }}日
        </span>
        <span class="weather-icon">
          {{ store.date.weather === '晴' ? '☀️' : store.date.weather === '阴' ? '☁️' : store.date.weather === '小雨' ? '🌧️' : store.date.weather === '大雨' ? '⛈️' : '❄️' }}
        </span>
        <span class="weather-text">{{ store.date.weather }}</span>
      </div>
    </div>

    <div class="status-right">
      <div class="status-item">
        <span class="status-icon">🪙</span>
        <span class="status-value gold">{{ store.player.gold }} 文</span>
      </div>
      <div class="status-item">
        <span class="status-icon">⚡</span>
        <span class="status-value" :class="{ low: store.player.stamina < 20 }">
          {{ store.player.stamina }}/{{ store.player.maxStamina }}
        </span>
      </div>
      <div class="status-item">
        <span class="status-icon">⭐</span>
        <span class="status-value">{{ store.player.fame }}</span>
      </div>
      <div class="status-item" v-if="store.player.businessReputation > 0">
        <span class="status-icon">💼</span>
        <span class="status-value business">{{ store.player.businessReputation }}</span>
      </div>
      <div class="status-item">
        <span class="status-icon">📊</span>
        <span class="status-value share">{{ store.player.marketShare }}%</span>
      </div>

      <button class="btn btn-small btn-save" @click="emit('open-save')">
        💾
      </button>
      <button class="btn btn-small" @click="store.advanceTime()">
        过一天
      </button>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  z-index: 10;
}

.status-left, .status-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.status-icon { font-size: 16px; }
.season-icon { font-size: 18px; }

.date-text {
  font-weight: 600;
  color: var(--ink);
}

.weather-text {
  font-size: 13px;
  color: var(--text-muted);
}

.status-value {
  font-weight: 600;
  color: var(--ink);
}

.status-value.gold { color: var(--gold); }
.status-value.business { color: var(--blue, #2563eb); }
.status-value.share { color: var(--text-secondary); }

.status-value.low {
  color: var(--red);
  animation: pulse 1s infinite;
}
</style>

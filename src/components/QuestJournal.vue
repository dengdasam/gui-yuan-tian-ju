<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const showCompleted = ref(false)

const activeEntries = computed(() =>
  store.questJournal.filter(e => !e.completed)
)
const completedEntries = computed(() =>
  store.questJournal.filter(e => e.completed)
)

const categoryLabel: Record<string, string> = {
  main: '📖 主线',
  side: '👤 支线',
  daily: '📋 日常',
  epic: '🌟 史诗',
}

const categoryColor: Record<string, string> = {
  main: '#eab308',
  side: '#3b82f6',
  daily: '#22c55e',
  epic: '#f59e0b',
}

function getCategoryIcon(cat: string) {
  return categoryLabel[cat] || cat
}

function getCategoryColor(cat: string) {
  return categoryColor[cat] || 'var(--gold)'
}
</script>

<template>
  <div class="quest-journal panel">
    <h3 class="panel-title">
      📋 任务日志
      <span v-if="store.questNotifications.length > 0" class="notif-badge">
        {{ store.questNotifications.length }}
      </span>
    </h3>

    <!-- 通知区域 -->
    <div v-if="store.questNotifications.length > 0" class="notif-area">
      <div v-for="(n, i) in store.questNotifications.slice(0, 3)" :key="i" class="notif-item"
        :class="n.type">
        <span class="notif-icon">{{ 
          n.type === 'quest_started' ? '📢' :
          n.type === 'quest_completed' ? '✅' : '📖'
        }}</span>
        <span class="notif-text">
          <strong>{{ n.questTitle }}</strong>
          <span v-if="n.npcName"> - {{ n.npcName }}</span>
          <br>
          <small>{{ n.message }}</small>
        </span>
        <button class="notif-close" @click="store.clearQuestNotification(i)">✕</button>
      </div>
    </div>

    <!-- 每日任务 -->
    <div v-if="store.dailyQuests.length > 0" class="daily-section">
      <div class="section-label">📋 今日任务</div>
      <div v-for="dq in store.dailyQuests" :key="dq.id" class="daily-card"
        :class="{ completed: dq.completed, claimed: dq.claimed }">
        <div class="daily-header">
          <span class="daily-title">{{ dq.title }}</span>
          <span class="daily-reward">💰 {{ dq.rewardGold }}文</span>
        </div>
        <div class="daily-desc">{{ dq.description }}</div>
        <div class="daily-flavor">💬 {{ dq.flavorText }}</div>
        <div class="daily-progress-bar">
          <div class="daily-progress-fill"
            :style="{ width: Math.min(100, dq.currentProgress / dq.targetQuantity * 100) + '%' }">
          </div>
        </div>
        <div class="daily-footer">
          <span class="daily-progress-text">
            {{ dq.currentProgress }}/{{ dq.targetQuantity }}
            <span v-if="dq.completed && !dq.claimed"> — 已完成！</span>
            <span v-if="dq.claimed"> — 已领取</span>
          </span>
          <button
            v-if="dq.completed && !dq.claimed"
            class="btn btn-small btn-gold claim-btn"
            @click="store.claimDailyQuest(dq.id)"
          >领取</button>
        </div>
      </div>
    </div>

    <!-- 活跃任务 -->
    <div class="active-section">
      <div class="section-header">
        <span class="section-label">📖 进行中</span>
        <span class="section-count">{{ activeEntries.length }} 个任务</span>
      </div>

      <div v-if="activeEntries.length === 0" class="empty-state">
        暂无进行中的任务。多与村民交谈，提高好感度来触发支线。
      </div>

      <div v-for="entry in activeEntries" :key="entry.questId" class="quest-card"
        :style="{ borderLeftColor: getCategoryColor(entry.category) }">
        <div class="quest-card-header">
          <span class="quest-category" :style="{ color: getCategoryColor(entry.category) }">
            {{ getCategoryIcon(entry.category) }}
          </span>
          <span class="quest-stage-badge">
            {{ entry.stage }}/{{ entry.maxStage }}
          </span>
        </div>
        <div class="quest-title">{{ entry.title }}</div>
        <div class="quest-desc">{{ entry.description }}</div>
        <div class="quest-progress-bar">
          <div class="quest-progress-fill"
            :style="{ width: entry.progressPercent + '%', background: getCategoryColor(entry.category) }">
          </div>
        </div>
        <div class="quest-progress-text">{{ entry.progress }}</div>

        <!-- 阶段列表 -->
        <div class="quest-stages">
          <div v-for="s in entry.stages" :key="s.stage" class="quest-stage-item"
            :class="{ done: s.done, current: s.stage === entry.stage }">
            <span class="stage-dot" :class="{ done: s.done, current: s.stage === entry.stage }"></span>
            <span class="stage-name">{{ s.title }}</span>
            <span v-if="s.done" class="stage-check">✓</span>
          </div>
        </div>

        <div class="quest-reward">🎁 {{ entry.reward }}</div>
      </div>
    </div>

    <!-- 已完成任务 -->
    <div class="completed-section" v-if="completedEntries.length > 0">
      <button class="toggle-completed-btn" @click="showCompleted = !showCompleted">
        {{ showCompleted ? '🔼 收起' : '🔽 展开' }} 已完成 ({{ completedEntries.length }})
      </button>
      <div v-if="showCompleted" class="completed-list">
        <div v-for="entry in completedEntries" :key="entry.questId" class="completed-card">
          <span class="completed-category" :style="{ color: getCategoryColor(entry.category) }">
            {{ getCategoryIcon(entry.category) }}
          </span>
          <span class="completed-title">{{ entry.title }}</span>
          <span class="completed-check">✅ 已完成</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quest-journal {
  display: flex; flex-direction: column; gap: 10px;
  max-height: 420px; overflow-y: auto;
}

.panel-title {
  font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 0;
  display: flex; align-items: center; gap: 8px;
}

.notif-badge {
  font-size: 10px; font-weight: 700;
  background: #ef4444; color: white;
  border-radius: 10px; padding: 1px 6px; min-width: 18px; text-align: center;
}

/* 通知 */
.notif-area { display: flex; flex-direction: column; gap: 4px; }
.notif-item {
  display: flex; align-items: flex-start; gap: 6px;
  padding: 6px 8px; border-radius: var(--radius);
  font-size: 11px; line-height: 1.5;
  animation: fadeIn 0.3s ease;
}
.notif-item.quest_started { background: #fefce8; border: 1px solid #fde68a; }
.notif-item.quest_completed { background: #f0fdf4; border: 1px solid #bbf7d0; }
.notif-item.quest_progress { background: #eff6ff; border: 1px solid #bfdbfe; }
.notif-icon { font-size: 14px; flex-shrink: 0; }
.notif-text { flex: 1; color: var(--text-primary); }
.notif-text small { color: var(--text-muted); }
.notif-close {
  background: none; border: none; cursor: pointer;
  font-size: 11px; color: var(--text-muted); padding: 2px;
}
.notif-close:hover { color: var(--red); }

/* 每日任务 */
.daily-section { display: flex; flex-direction: column; gap: 6px; }
.daily-card {
  padding: 8px; border: 1px solid var(--border-light);
  border-radius: var(--radius); background: var(--bg-primary);
  transition: opacity 0.3s;
}
.daily-card.claimed { opacity: 0.5; }
.daily-card.completed { border-color: var(--green); background: #f0fdf4; }
.daily-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
.daily-title { font-size: 13px; font-weight: 600; color: var(--ink); }
.daily-reward { font-size: 12px; color: var(--gold); font-weight: 600; }
.daily-desc { font-size: 11px; color: var(--text-secondary); margin-bottom: 2px; }
.daily-flavor { font-size: 10px; color: var(--text-muted); font-style: italic; margin-bottom: 4px; }
.daily-progress-bar { height: 4px; background: var(--border-light); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.daily-progress-fill { height: 100%; background: var(--green); border-radius: 2px; transition: width 0.5s; }
.daily-footer { display: flex; justify-content: space-between; align-items: center; }
.daily-progress-text { font-size: 10px; color: var(--text-muted); }
.claim-btn { padding: 2px 12px !important; font-size: 11px !important; }

/* 活跃任务 */
.active-section { display: flex; flex-direction: column; gap: 8px; }
.section-header, .section-label {
  font-size: 13px; font-weight: 700; color: var(--ink);
}
.section-header { display: flex; justify-content: space-between; align-items: center; }
.section-count { font-size: 11px; color: var(--text-muted); font-weight: 400; }

.empty-state {
  font-size: 12px; color: var(--text-muted); font-style: italic;
  text-align: center; padding: 16px 0;
}

.quest-card {
  padding: 10px; border: 1px solid var(--border-light);
  border-left: 3px solid var(--gold);
  border-radius: var(--radius); background: var(--bg-paper);
}
.quest-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.quest-category { font-size: 11px; font-weight: 600; }
.quest-stage-badge {
  font-size: 10px; padding: 1px 6px; background: var(--border-light);
  border-radius: 4px; color: var(--text-muted);
}
.quest-title { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.quest-desc { font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-bottom: 6px; }
.quest-progress-bar { height: 4px; background: var(--border-light); border-radius: 2px; overflow: hidden; margin-bottom: 2px; }
.quest-progress-fill { height: 100%; border-radius: 2px; transition: width 0.5s; }
.quest-progress-text { font-size: 10px; color: var(--text-muted); margin-bottom: 6px; }

/* 阶段列表 */
.quest-stages {
  display: flex; flex-direction: column; gap: 2px;
  margin-bottom: 6px; padding-left: 4px;
}
.quest-stage-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: var(--text-muted);
}
.quest-stage-item.done { color: var(--green); }
.quest-stage-item.current { color: var(--ink); font-weight: 600; }
.stage-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--border-light); flex-shrink: 0;
}
.stage-dot.done { background: var(--green); }
.stage-dot.current { background: var(--gold); box-shadow: 0 0 4px var(--gold); }
.stage-check { font-size: 10px; margin-left: auto; }
.stage-name { flex: 1; }

.quest-reward { font-size: 11px; color: var(--gold); font-weight: 500; }

/* 已完成 */
.completed-section { border-top: 1px solid var(--border-light); padding-top: 8px; }
.toggle-completed-btn {
  width: 100%; padding: 6px; background: none; border: 1px dashed var(--border-light);
  border-radius: var(--radius); font-size: 12px; color: var(--text-muted);
  cursor: pointer; font-family: var(--font-body);
}
.toggle-completed-btn:hover { border-color: var(--text-muted); color: var(--text-primary); }
.completed-list { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
.completed-card {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: var(--radius); font-size: 12px;
}
.completed-title { flex: 1; color: var(--text-primary); }
.completed-check { color: var(--green); font-size: 11px; }
</style>

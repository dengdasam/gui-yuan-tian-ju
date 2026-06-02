<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const selectedNPC = ref<string | null>(null)
const npcDialogue = ref('')
const showQuest = ref(false)

function talk(npcId: string) {
  selectedNPC.value = npcId
  npcDialogue.value = store.talkToNPC(npcId)
  showQuest.value = false
}

function gift(npcId: string) {
  const gifts = store.player.inventory.filter(i => i.type === 'crop')
  if (gifts.length === 0) {
    npcDialogue.value = '你身上没有可以送礼的物品。'
    return
  }
  const item = gifts[0]
  store.giveGift(npcId, item.itemId)
  npcDialogue.value = `送出了${item.name}。`
}

function toggleQuest(npcId: string) {
  showQuest.value = !showQuest.value
  selectedNPC.value = npcId
}

function getRelationColor(affection: number) {
  if (affection >= 60) return 'var(--green)'
  if (affection >= 30) return 'var(--blue)'
  if (affection >= 0) return 'var(--text-muted)'
  return 'var(--red)'
}

function getRelationLabel(affection: number) {
  if (affection >= 80) return '挚友'
  if (affection >= 60) return '好友'
  if (affection >= 30) return '相识'
  if (affection >= 0) return '路人'
  return '冷淡'
}
</script>

<template>
  <div class="npc-panel panel">
    <h3 class="panel-title">👥 村中人</h3>

    <div class="npc-list">
      <div
        v-for="npc in store.npcs"
        :key="npc.id"
        class="npc-item"
        :class="{ selected: selectedNPC === npc.id, expanded: showQuest && selectedNPC === npc.id }"
      >
        <div class="npc-main" @click="talk(npc.id)">
          <div class="npc-avatar">{{ npc.icon }}</div>
          <div class="npc-info">
            <div class="npc-name-row">
              <span class="npc-name">{{ npc.name }}</span>
              <span class="npc-title">{{ npc.title }}</span>
            </div>
            <div class="npc-relation-row">
              <div class="relation-bar" :style="{ width: Math.max(npc.affection, 0) + '%', background: getRelationColor(npc.affection) }"></div>
            </div>
            <div class="npc-meta">
              <span class="relation-label" :style="{ color: getRelationColor(npc.affection) }">
                {{ getRelationLabel(npc.affection) }} {{ npc.affection }}
              </span>
              <button
                v-if="npc.sideQuests.length > 0"
                class="quest-indicator"
                @click.stop="toggleQuest(npc.id)"
                :title="npc.sideQuests.find(q => q.stage > 0) ? '支线进行中' : '查看支线'"
              >
                {{ npc.sideQuests.some(q => q.stage > 0) ? '📖' : '🕮' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 支线面板 -->
        <div v-if="showQuest && selectedNPC === npc.id" class="quest-detail">
          <div v-for="quest in npc.sideQuests" :key="quest.id" class="quest-card">
            <div class="quest-header">
              <span class="quest-title">{{ quest.title }}</span>
              <span class="quest-stage">
                {{ quest.completed ? '✅ 已完成' : quest.stage > 0 ? `📖 第${quest.stage}/${quest.maxStage}阶段` : '🔒 未开启' }}
              </span>
            </div>
            <div class="quest-desc">{{ quest.description }}</div>
            <div v-if="quest.stage > 0 && !quest.completed" class="quest-progress">
              <div class="quest-stage-bar">
                <div
                  class="quest-stage-fill"
                  :style="{ width: (quest.stage / quest.maxStage * 100) + '%' }"
                ></div>
              </div>
              <div class="quest-stage-desc">
                当前：{{ quest.stages[quest.stage - 1]?.title || '进行中' }}
              </div>
              <div class="quest-threshold" v-if="quest.stage < quest.maxStage">
                下一阶段需要好感度：{{ quest.affectionThreshold[quest.stage] || '?' }}
                <span v-if="npc.affection >= (quest.affectionThreshold[quest.stage] || 999)" class="threshold-met">✓ 已满足</span>
                <span v-else class="threshold-pending">（当前 {{ npc.affection }}）</span>
              </div>
            </div>
            <div v-if="quest.completed" class="quest-reward">🎁 {{ quest.reward }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- NPC 对话气泡 -->
    <div v-if="npcDialogue && selectedNPC && !showQuest" class="npc-dialogue">
      <span class="dialogue-avatar">{{ store.npcs.find(n => n.id === selectedNPC)?.icon }}</span>
      <span class="dialogue-text">{{ npcDialogue }}</span>
      <button
        v-if="store.npcs.find(n => n.id === selectedNPC)?.met"
        class="btn btn-small"
        style="margin-top:6px;width:100%"
        @click="gift(selectedNPC!)"
      >送礼 🎁</button>
    </div>
  </div>
</template>

<style scoped>
.npc-panel { display: flex; flex-direction: column; }

.panel-title { font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 8px; }

.npc-list { display: flex; flex-direction: column; gap: 6px; max-height: 340px; overflow-y: auto; }

.npc-item {
  border: 1px solid transparent;
  border-radius: var(--radius);
  transition: all 0.2s ease;
  background: var(--bg-paper);
  overflow: hidden;
}
.npc-item:hover, .npc-item.selected { border-color: var(--gold-light); background: linear-gradient(135deg, #fdf8e8, #faf6ee); }
.npc-item.expanded { padding-bottom: 8px; }

.npc-main {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; cursor: pointer;
}

.npc-avatar { font-size: 24px; }
.npc-info { flex: 1; min-width: 0; }

.npc-name-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.npc-name { font-weight: 600; font-size: 14px; color: var(--ink); }
.npc-title { font-size: 11px; color: var(--text-muted); background: var(--border-light); padding: 1px 6px; border-radius: 3px; }

.npc-relation-row { height: 4px; background: var(--border-light); border-radius: 2px; overflow: hidden; margin-bottom: 2px; }
.relation-bar { height: 100%; border-radius: 2px; transition: width 0.5s ease; }

.npc-meta { display: flex; align-items: center; justify-content: space-between; }
.relation-label { font-size: 11px; }

.quest-indicator {
  background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 4px;
  border-radius: 4px; transition: background 0.2s;
}
.quest-indicator:hover { background: var(--border-light); }

/* 支线详情 */
.quest-detail {
  padding: 0 10px 8px;
  border-top: 1px solid var(--border-light);
  margin-top: 4px;
}

.quest-card {
  padding: 8px 0;
}
.quest-card + .quest-card { border-top: 1px dashed var(--border-light); margin-top: 6px; padding-top: 6px; }

.quest-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.quest-title { font-weight: 600; font-size: 13px; color: var(--ink); }
.quest-stage { font-size: 11px; color: var(--text-muted); }

.quest-desc { font-size: 11px; color: var(--text-secondary); margin-bottom: 6px; }

.quest-progress { margin-top: 4px; }
.quest-stage-bar { height: 4px; background: var(--border-light); border-radius: 2px; overflow: hidden; }
.quest-stage-fill { height: 100%; background: var(--gold); border-radius: 2px; transition: width 0.5s; }
.quest-stage-desc { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

.quest-threshold { font-size: 10px; color: var(--text-muted); margin-top: 4px; }
.threshold-met { color: var(--green); }
.threshold-pending { color: var(--red); }

.quest-reward { font-size: 11px; color: var(--gold); font-weight: 500; margin-top: 4px; }

/* NPC 对话气泡 */
.npc-dialogue {
  margin-top: 10px; padding: 10px;
  background: linear-gradient(135deg, #fdf8e8, #faf6ee);
  border: 1px solid var(--gold-light);
  border-radius: var(--radius);
  display: flex; flex-direction: column;
  animation: fadeIn 0.3s ease;
}
.dialogue-avatar { font-size: 20px; margin-bottom: 4px; }
.dialogue-text { font-size: 13px; color: var(--text-primary); line-height: 1.6; }
</style>

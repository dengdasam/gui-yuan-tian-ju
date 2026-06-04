<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const currentNodeIdx = ref(0)

const currentEventNode = computed(() => {
  if (!store.activeSeasonalEvent) return null
  const nodes = store.activeSeasonalEvent.nodes
  if (currentNodeIdx.value >= nodes.length) return null
  return nodes[currentNodeIdx.value]
})

function nextNode() {
  const node = currentEventNode.value
  if (!node) return

  // 触发进入效果
  if (node.onEnter) {
    node.onEnter.forEach(e => store.applyEffect(e))
  }

  // 如果有下一个节点
  const nodes = store.activeSeasonalEvent!.nodes
  if (currentNodeIdx.value < nodes.length - 1) {
    currentNodeIdx.value += 1
  } else {
    store.completeSeasonalEvent()
    currentNodeIdx.value = 0
  }
}

function makeChoice(nextNodeId: string, effects?: { type: string; target?: string; value: number }[]) {
  // 先应用选择效果
  if (effects) {
    effects.forEach(e => {
      store.applyEffect(e)
    })
  }
  // 如果 nextNodeId 有指定，跳转到对应节点
  if (nextNodeId) {
    const nodes = store.activeSeasonalEvent!.nodes
    const targetIdx = nodes.findIndex(n => n.id === nextNodeId)
    if (targetIdx !== -1) {
      currentNodeIdx.value = targetIdx
      // 对新节点应用 onEnter 效果
      const targetNode = nodes[targetIdx]
      if (targetNode.onEnter) {
        targetNode.onEnter.forEach(e => store.applyEffect(e))
      }
    } else {
      nextNode()
    }
  } else {
    nextNode()
  }
}

function close() {
  store.skipSeasonalEvent()
  currentNodeIdx.value = 0
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.showSeasonalDialog && store.activeSeasonalEvent" class="event-overlay">
      <div class="event-dialog">
        <!-- 头部 -->
        <div class="event-header">
          <span class="event-season">
            {{ store.activeSeasonalEvent.season === '春' ? '🌸' : store.activeSeasonalEvent.season === '夏' ? '☀️' : store.activeSeasonalEvent.season === '秋' ? '🍂' : '❄️' }}
          </span>
          <span class="event-title">{{ store.activeSeasonalEvent.title }}</span>
          <button class="event-close" @click="close">✕</button>
        </div>

        <!-- 对话内容 -->
        <div class="event-body">
          <div v-if="currentEventNode" class="event-content">
            <div v-if="currentEventNode.background" class="event-scene">
              {{ currentEventNode.background }}
            </div>

            <!-- 对话行 -->
            <div class="event-dialogues">
              <div
                v-for="(line, idx) in currentEventNode.dialogue"
                :key="idx"
                class="dialogue-line"
                :class="{ player: !line.speaker, narration: line.speaker === '旁白' }"
              >
                <span v-if="line.speaker && line.speaker !== '旁白'" class="speaker-name">{{ line.speaker }}</span>
                <span class="line-content">{{ line.content }}</span>
              </div>
            </div>

            <!-- 选项 -->
            <div v-if="currentEventNode.choices && currentEventNode.choices.length > 0" class="event-choices">
              <button
                v-for="(choice, idx) in currentEventNode.choices"
                :key="idx"
                class="choice-btn"
                @click="makeChoice(choice.next, choice.effects)"
              >
                {{ choice.text }}
              </button>
            </div>
          </div>
        </div>

        <!-- 底部操作：仅当无选择项时显示 -->
        <div v-if="!currentEventNode?.choices?.length" class="event-footer">
          <button class="btn" @click="nextNode">
            继续
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.event-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.event-dialog {
  width: 560px;
  max-width: 90vw;
  max-height: 80vh;
  background: linear-gradient(180deg, #fdf8e8, #faf6ee, #f5eed9);
  border: 2px solid var(--gold-light);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.event-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #d4a84b, #c49a3c);
  color: white;
}

.event-season { font-size: 24px; }
.event-title { font-size: 18px; font-weight: 700; flex: 1; }

.event-close {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.event-close:hover { background: rgba(255,255,255,0.4); }

.event-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.event-content { }

.event-scene {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
  padding: 8px 12px;
  background: var(--bg-paper);
  border-radius: var(--radius);
  border-left: 3px solid var(--gold-light);
  font-style: italic;
}

.event-dialogues {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialogue-line {
  font-size: 14px;
  line-height: 1.8;
  padding: 8px 12px;
  border-radius: 8px;
  background: white;
}

.dialogue-line.narration {
  background: transparent;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  padding: 4px 12px;
}

.dialogue-line.player {
  background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
  border-left: 3px solid var(--green);
}

.speaker-name {
  font-weight: 700;
  color: var(--gold);
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
}

.line-content {
  color: var(--text-primary);
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.choice-btn {
  font-family: var(--font-body);
  font-size: 14px;
  padding: 10px 16px;
  border: 2px solid var(--gold-light);
  background: white;
  color: var(--ink);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.choice-btn:hover {
  background: linear-gradient(135deg, #fdf8e8, #faf6ee);
  border-color: var(--gold);
  transform: translateX(4px);
}

.event-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
}

.event-footer .btn {
  padding: 8px 24px;
  font-size: 14px;
}
</style>

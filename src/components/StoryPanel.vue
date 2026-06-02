<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

const node = computed(() => store.currentStoryNode)

const hasChoices = computed(() => {
  return node.value?.choices && node.value.choices.length > 0
})

const hasNext = computed(() => {
  return node.value?.next && !hasChoices.value
})

function handleChoice(choice: { text: string; next: string; effects?: any[] }) {
  if (choice.effects) {
    choice.effects.forEach((e: any) => store.applyEffect(e))
  }
  store.goToNode(choice.next)
}

function handleContinue() {
  if (node.value?.next) {
    store.goToNode(node.value.next)
  }
}
</script>

<template>
  <div class="story-panel panel">
    <!-- 场景标题 -->
    <div class="scene-header" v-if="node?.background">
      <span class="scene-icon">🏔️</span>
      <span class="scene-text">{{ node.background }}</span>
    </div>

    <!-- 剧情文本区 -->
    <div class="story-content" ref="contentRef">
      <!-- 对话列表 -->
      <div
        v-for="(line, i) in store.dialogueHistory"
        :key="i"
        class="dialogue-line fade-in"
        :class="{
          'is-narrator': line.speaker === '旁白',
          'is-player': !line.speaker || line.speaker === '你',
          'is-npc': line.speaker && line.speaker !== '旁白' && line.speaker !== '你'
        }"
      >
        <span v-if="line.speaker && line.speaker !== '旁白' && line.speaker !== '你'" class="speaker-tag">
          {{ line.speaker }}
        </span>
        <span class="dialogue-text">{{ line.content }}</span>
      </div>

      <!-- 空状态 -->
      <div v-if="store.dialogueHistory.length === 0" class="empty-story">
        <p>故事即将展开……</p>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="story-actions">
      <!-- 选择分支 -->
      <div v-if="hasChoices" class="choices">
        <button
          v-for="(choice, i) in node!.choices"
          :key="i"
          class="btn choice-btn fade-in"
          :style="{ animationDelay: `${i * 0.15}s` }"
          @click="handleChoice(choice)"
        >
          {{ choice.text }}
        </button>
      </div>

      <!-- 继续 -->
      <button v-else-if="hasNext" class="btn btn-primary continue-btn" @click="handleContinue">
        继续 ▸
      </button>
    </div>
  </div>
</template>

<style scoped>
.story-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scene-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-muted);
}
.scene-icon { font-size: 18px; }
.scene-text { font-style: italic; }

.story-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  min-height: 200px;
  max-height: calc(100vh - 300px);
}

.dialogue-line {
  margin-bottom: 14px;
  line-height: 1.8;
  animation: fadeIn 0.4s ease forwards;
}

.dialogue-line.is-narrator {
  text-align: center;
  padding: 12px 40px;
  color: var(--text-muted);
  font-style: italic;
  font-size: 14px;
  letter-spacing: 1px;
  border-top: 1px dashed var(--border-light);
  border-bottom: 1px dashed var(--border-light);
  margin: 16px 0;
}

.dialogue-line.is-player .dialogue-text {
  background: linear-gradient(135deg, #e8f0e3, #dce8d4);
  padding: 10px 14px;
  border-radius: var(--radius);
  display: inline-block;
  color: var(--ink);
}

.dialogue-line.is-npc .dialogue-text {
  color: var(--text-primary);
}

.speaker-tag {
  display: inline-block;
  background: var(--ink);
  color: var(--text-inverse);
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 4px;
  margin-right: 8px;
  font-weight: 600;
}

.dialogue-text {
  font-size: 15px;
  line-height: 1.9;
}

.empty-story {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  font-style: italic;
}

.story-actions {
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choice-btn {
  text-align: left;
  padding: 12px 16px;
  font-size: 15px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--ink);
  font-family: var(--font-body);
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
}
.choice-btn:hover {
  background: var(--ink);
  color: var(--text-inverse);
  border-color: var(--ink);
  transform: translateX(4px);
}

.continue-btn {
  align-self: center;
  min-width: 140px;
}
</style>

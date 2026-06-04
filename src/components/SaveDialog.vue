<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const saves = ref(store.getAllSaves())
const savingSlot = ref<number | null>(null)

function refreshSaves() {
  saves.value = store.getAllSaves()
}

function handleSave(slot: number) {
  savingSlot.value = slot
  store.saveGame(slot)
  refreshSaves()
  setTimeout(() => { savingSlot.value = null }, 1500)
}

function handleLoad(slot: number) {
  const success = store.loadGame(slot)
  if (success) {
    emit('close')
  }
}

function handleDelete(slot: number) {
  if (confirm('确定要删除这个存档吗？此操作不可撤销。')) {
    store.deleteSave(slot)
    refreshSaves()
  }
}

function getSaveInfo(slot: number) {
  return saves.value.find(s => s.slot === slot)
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

refreshSaves()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="save-overlay" @click.self="emit('close')">
      <div class="save-dialog">
        <div class="save-header">
          <h2>📜 存档管理</h2>
          <button class="save-close" @click="emit('close')">✕</button>
        </div>

        <div class="save-body">
          <div class="save-hint">游戏进度会自动保存到本地浏览器。你有 3 个存档槽位。</div>

          <div
            v-for="slot in 3"
            :key="slot"
            class="save-slot"
            :class="{ filled: !!getSaveInfo(slot), saving: savingSlot === slot }"
          >
            <div class="slot-header">
              <span class="slot-number">槽位 {{ slot }}</span>
              <span v-if="savingSlot === slot" class="slot-saving">保存中...</span>
            </div>

            <div v-if="getSaveInfo(slot)" class="slot-info">
              <div class="slot-name">{{ getSaveInfo(slot)!.name }}</div>
              <div class="slot-meta">
                第 {{ getSaveInfo(slot)!.day }} 天 · {{ formatTime(getSaveInfo(slot)!.timestamp) }}
              </div>
            </div>
            <div v-else class="slot-empty">
              —— 空 ——
            </div>

            <div class="slot-actions">
              <button class="btn btn-small btn-save" @click="handleSave(slot)">
                💾 保存
              </button>
              <button
                v-if="getSaveInfo(slot)"
                class="btn btn-small btn-load"
                @click="handleLoad(slot)"
              >
                📂 读取
              </button>
              <button
                v-if="getSaveInfo(slot)"
                class="btn btn-small btn-delete"
                @click="handleDelete(slot)"
              >
                🗑 删除
              </button>
            </div>
          </div>
        </div>

        <div class="save-footer">
          <button class="btn btn-primary" @click="emit('close')">关闭</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.save-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.save-dialog {
  width: 480px;
  max-width: 90vw;
  max-height: 80vh;
  background: linear-gradient(180deg, #fdf8e8, #faf6ee, #f5eed9);
  border: 2px solid var(--gold-light);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.save-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #5a9e6f, #4a8e5f);
  color: white;
}

.save-header h2 {
  margin: 0;
  font-size: 18px;
  font-family: var(--font-heading);
}

.save-close {
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
}
.save-close:hover { background: rgba(255,255,255,0.4); }

.save-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.save-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
  padding: 8px 12px;
  background: var(--bg-paper);
  border-radius: 6px;
  border-left: 3px solid var(--gold-light);
}

.save-slot {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  background: white;
  transition: all 0.2s;
}
.save-slot.filled { border-color: var(--gold-light); }
.save-slot.saving { border-color: var(--green); background: linear-gradient(135deg, #e8f5e9, #f1f8e9); }

.slot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.slot-number {
  font-weight: 600;
  font-size: 14px;
  color: var(--ink);
}

.slot-saving {
  font-size: 12px;
  color: var(--green);
  animation: pulse 1s infinite;
}

.slot-info {
  margin-bottom: 8px;
}

.slot-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.slot-meta {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.slot-empty {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 8px;
}

.slot-actions {
  display: flex;
  gap: 6px;
}

.btn-save { background: var(--green); color: white; border-color: var(--green); }
.btn-save:hover { background: #4a8e5f; }
.btn-load { background: var(--gold); color: white; border-color: var(--gold); }
.btn-load:hover { background: #b8934a; }
.btn-delete { background: transparent; color: var(--red); border-color: var(--red); }
.btn-delete:hover { background: var(--red); color: white; }

.save-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 8px 24px;
  font-size: 14px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>

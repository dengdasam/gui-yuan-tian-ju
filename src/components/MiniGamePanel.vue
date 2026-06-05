<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useGameStore } from '../stores/game'
import { useGomoku } from '../composables/useGomoku'
import type { NPC } from '../types'

const store = useGameStore()
const { state, BOARD_SIZE, isGameOver, isPlayerTurn, placePiece, aiMove, undoMove, resetBoard, resetAll } = useGomoku()

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const opponent = ref<NPC | null>(null)
const boardCells = ref<{ row: number; col: number }[]>([])
const hoverCell = ref<{ row: number; col: number } | null>(null)
const showResult = ref(false)
const resultMessage = ref('')

// 延迟 AI 落子（让玩家看到自己的落子）
let aiTimer: ReturnType<typeof setTimeout> | null = null

function initBoard() {
  boardCells.value = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      boardCells.value.push({ row: r, col: c })
    }
  }
}

function handleCellClick(row: number, col: number) {
  if (!isPlayerTurn.value) return
  const placed = placePiece(row, col)
  if (placed && state.status === 'playing') {
    // AI 稍微延迟落子
    aiTimer = setTimeout(() => {
      aiMove()
      checkGameEnd()
      aiTimer = null
    }, 300)
  } else if (placed) {
    checkGameEnd()
  }
}

function checkGameEnd() {
  if (state.status === 'player_win') {
    resultMessage.value = `🎉 你赢了！${opponent.value?.name || ''}拱手认输。`
    showResult.value = true
    applyReward('win')
  } else if (state.status === 'ai_win') {
    resultMessage.value = `${opponent.value?.name || '对手'}赢了……再试一局？`
    showResult.value = true
  } else if (state.status === 'draw') {
    resultMessage.value = '棋盘已满，握手言和。'
    showResult.value = true
  }
}

function applyReward(outcome: 'win' | 'lose' | 'draw') {
  const npcId = store.miniGameSession?.opponentNpcId
  if (!npcId) return
  if (outcome === 'win') {
    store.applyEffect({ type: 'affection', target: npcId, value: 5 })
    store.applyEffect({ type: 'gold', value: 20 })
    store.addLog(`与${getNpcName(npcId)}对弈获胜！好感+5，铜钱+20`, 'action')
  }
}

function getNpcName(id: string): string {
  return store.npcs.find(n => n.id === id)?.name || id
}

function handleUndo() {
  if (state.moveHistory.length < 2) return
  undoMove()
}

function handleNewGame() {
  resetBoard()
  showResult.value = false
}

function handleResign() {
  state.status = 'ai_win'
  state.aiScore++
  resultMessage.value = '你弃子认输了。'
  showResult.value = true
}

function handleClose() {
  if (aiTimer) clearTimeout(aiTimer)
  showResult.value = false
  resetAll()
  emit('close')
}

function getCellClass(row: number, col: number) {
  const classes: string[] = []
  if (state.board[row][col] === 1) classes.push('stone-black')
  if (state.board[row][col] === 2) classes.push('stone-white')
  if (state.lastMove?.row === row && state.lastMove?.col === col) classes.push('last-move')
  return classes
}

function isStarPoint(row: number, col: number): boolean {
  const stars = [3, 7, 11]
  return stars.includes(row) && stars.includes(col)
}

watch(() => store.miniGameSession?.opponentNpcId, (npcId) => {
  if (npcId) {
    opponent.value = store.npcs.find(n => n.id === npcId) || null
  }
}, { immediate: true })

onMounted(() => {
  initBoard()
  if (store.miniGameSession?.opponentNpcId) {
    opponent.value = store.npcs.find(n => n.id === store.miniGameSession!.opponentNpcId!) || null
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="mini-game-overlay">
      <div class="mini-game-panel">
        <!-- 顶部：对手信息 + 计分 -->
        <div class="game-header">
          <div class="opponent-info" v-if="opponent">
            <span class="opponent-avatar">{{ opponent.icon }}</span>
            <div class="opponent-detail">
              <span class="opponent-name">{{ opponent.name }}</span>
              <span class="opponent-title">{{ opponent.title }}</span>
            </div>
          </div>
          <div class="score-area">
            <div class="score-block player-score">
              <span class="score-label">你</span>
              <span class="score-value">{{ state.playerScore }}</span>
            </div>
            <span class="score-vs">:</span>
            <div class="score-block ai-score">
              <span class="score-label">{{ opponent?.name?.charAt(0) || '?' }}</span>
              <span class="score-value">{{ state.aiScore }}</span>
            </div>
          </div>
        </div>

        <!-- 回合提示 -->
        <div class="turn-indicator">
          <span v-if="state.status === 'playing' && state.currentPlayer === 1" class="turn-text your-turn">
            ⬤ 轮到你了——请落子
          </span>
          <span v-else-if="state.status === 'playing'" class="turn-text ai-thinking">
            ◯ {{ opponent?.name || '对手' }}思考中……
          </span>
          <span v-else class="turn-text game-over-text">
            ⚫ 对局结束
          </span>
        </div>

        <!-- 棋盘 -->
        <div class="board-wrapper">
          <div class="board-container">
            <!-- 星位 -->
            <div
              v-for="cell in boardCells.filter(c => isStarPoint(c.row, c.col))"
              :key="'star-' + cell.row + '-' + cell.col"
              class="star-point"
              :style="{
                left: ((cell.col + 0.5) / BOARD_SIZE * 100) + '%',
                top: ((cell.row + 0.5) / BOARD_SIZE * 100) + '%',
              }"
            ></div>
            <!-- 格子 -->
            <div
              v-for="cell in boardCells"
              :key="cell.row + '-' + cell.col"
              class="cell"
              :class="getCellClass(cell.row, cell.col)"
              :style="{
                left: ((cell.col + 0.5) / BOARD_SIZE * 100) + '%',
                top: ((cell.row + 0.5) / BOARD_SIZE * 100) + '%',
              }"
              @click="handleCellClick(cell.row, cell.col)"
              @mouseenter="hoverCell = cell"
              @mouseleave="hoverCell = null"
            >
              <!-- 悬停预览 -->
              <div
                v-if="state.board[cell.row][cell.col] === 0
                  && hoverCell?.row === cell.row
                  && hoverCell?.col === cell.col
                  && isPlayerTurn"
                class="hover-preview"
              ></div>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="game-footer">
          <button class="game-btn" @click="handleUndo" :disabled="state.moveHistory.length < 2 || isGameOver">
            ↩ 悔棋
          </button>
          <button class="game-btn danger" @click="handleResign" :disabled="isGameOver">
            🏳 弃子认输
          </button>
          <button class="game-btn primary" @click="handleNewGame">
            🔄 再来一局
          </button>
          <button class="game-btn" @click="handleClose">
            🚪 离开
          </button>
        </div>

        <!-- 结果弹窗 -->
        <Teleport to="body">
          <div v-if="showResult" class="result-overlay" @click.self="showResult = false">
            <div class="result-dialog" :class="{
              win: state.status === 'player_win',
              lose: state.status === 'ai_win',
            }">
              <div class="result-emoji">
                {{ state.status === 'player_win' ? '🎉' : state.status === 'ai_win' ? '😔' : '🤝' }}
              </div>
              <div class="result-text">{{ resultMessage }}</div>
              <div class="result-buttons">
                <button class="game-btn primary" @click="handleNewGame(); showResult = false">
                  🔄 再来一局
                </button>
                <button class="game-btn" @click="handleClose(); showResult = false">
                  🚪 离开
                </button>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mini-game-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 16, 8, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-game-panel {
  background: linear-gradient(135deg, #fdf8ec 0%, #f5ecdc 50%, #ede0cc 100%);
  border: 3px solid var(--gold-light);
  border-radius: 16px;
  padding: 24px;
  max-width: 620px;
  width: 95vw;
  box-shadow:
    0 8px 40px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.4);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 顶部 */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.opponent-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opponent-avatar {
  font-size: 32px;
}

.opponent-detail {
  display: flex;
  flex-direction: column;
}

.opponent-name {
  font-weight: 700;
  font-size: 16px;
  color: var(--ink);
}

.opponent-title {
  font-size: 12px;
  color: var(--text-muted);
}

.score-area {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-paper);
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.score-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  font-size: 10px;
  color: var(--text-muted);
}

.score-value {
  font-size: 22px;
  font-weight: 700;
}

.player-score .score-value {
  color: var(--ink);
}

.ai-score .score-value {
  color: var(--red);
}

.score-vs {
  font-size: 20px;
  color: var(--text-muted);
  margin: 0 2px;
}

/* 回合提示 */
.turn-indicator {
  text-align: center;
  padding: 4px 0;
}

.turn-text {
  font-size: 14px;
  font-weight: 500;
}

.your-turn {
  color: var(--ink);
  animation: pulse 1.5s ease-in-out infinite;
}

.ai-thinking {
  color: var(--text-muted);
}

.game-over-text {
  color: var(--red);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 棋盘 */
.board-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.board-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  background:
    linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: calc(100% / 15) calc(100% / 15);
  background-color: #dcb468;
  border: 3px solid #8B6914;
  border-radius: 4px;
  box-shadow:
    inset 0 2px 8px rgba(0,0,0,0.1),
    0 4px 16px rgba(0,0,0,0.2);
}

/* 星位 */
.star-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #5a4a2a;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
}

/* 单元格 */
.cell {
  position: absolute;
  width: calc(100% / 15);
  height: calc(100% / 15);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell:hover {
  z-index: 3;
}

/* 悬停预览 */
.hover-preview {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: rgba(30, 25, 15, 0.2);
  transition: all 0.15s;
}

/* 黑子 */
.stone-black {
  width: 88%;
  height: 88%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #4a4a4a 0%, #1a1a1a 60%, #0a0a0a 100%);
  box-shadow:
    2px 2px 4px rgba(0,0,0,0.4),
    inset 0 1px 2px rgba(255,255,255,0.1);
  pointer-events: none;
  position: absolute;
}

.stone-white {
  width: 88%;
  height: 88%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, #f0ede0 50%, #d4cfc0 100%);
  box-shadow:
    2px 2px 4px rgba(0,0,0,0.2),
    inset 0 1px 2px rgba(255,255,255,0.8);
  border: 1px solid #c0b898;
  pointer-events: none;
  position: absolute;
}

/* 最后落子标记 */
.last-move::after {
  content: '';
  position: absolute;
  width: 15%;
  height: 15%;
  background: var(--red);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
}

/* 底部操作 */
.game-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.game-btn {
  padding: 8px 18px;
  font-family: var(--font-body);
  font-size: 13px;
  background: linear-gradient(to bottom, #fff, #f0e8d8);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s;
}

.game-btn:hover:not(:disabled) {
  background: linear-gradient(to bottom, #fff, #e8dcc0);
  border-color: var(--gold-light);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.game-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.game-btn.primary {
  background: linear-gradient(to bottom, var(--ink), #3a3220);
  color: #f0e8d8;
  border-color: var(--ink);
}

.game-btn.primary:hover:not(:disabled) {
  background: linear-gradient(to bottom, #4a4030, var(--ink));
}

.game-btn.danger:hover:not(:disabled) {
  background: linear-gradient(to bottom, #fff5f5, #fdd);
  border-color: var(--red);
  color: var(--red);
}

/* 结果弹窗 */
.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-dialog {
  background: linear-gradient(135deg, #fdf8ec, #f5ecdc);
  border: 2px solid var(--gold-light);
  border-radius: 16px;
  padding: 32px 40px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.3);
  max-width: 360px;
  animation: scaleIn 0.3s ease;
}

.result-dialog.win {
  border-color: #c8a45c;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.result-dialog.lose {
  background: linear-gradient(135deg, #fdf8ec, #f0e8d8);
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.result-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.result-text {
  font-size: 16px;
  color: var(--ink);
  line-height: 1.6;
  margin-bottom: 20px;
}

.result-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>

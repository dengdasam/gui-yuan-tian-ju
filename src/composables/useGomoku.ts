import { reactive, computed } from 'vue'
import type { GomokuState, GomokuStone, GomokuMove, GomokuStatus } from '../types'

const BOARD_SIZE = 15

function createEmptyBoard(): GomokuStone[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0 as GomokuStone)
  )
}

function cloneBoard(board: GomokuStone[][]): GomokuStone[][] {
  return board.map(row => [...row])
}

// ---- 胜负判定 ----
const DIRECTIONS = [
  [0, 1],   // 水平
  [1, 0],   // 垂直
  [1, 1],   // 对角线↘
  [1, -1],  // 对角线↙
]

function checkWinAt(board: GomokuStone[][], row: number, col: number): boolean {
  const stone = board[row][col]
  if (stone === 0) return false
  for (const [dr, dc] of DIRECTIONS) {
    let count = 1
    // 正方向
    let r = row + dr, c = col + dc
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === stone) {
      count++; r += dr; c += dc
    }
    // 反方向
    r = row - dr; c = col - dc
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === stone) {
      count++; r -= dr; c -= dc
    }
    if (count >= 5) return true
  }
  return false
}

function isBoardFull(board: GomokuStone[][]): boolean {
  for (const row of board) {
    if (row.includes(0)) return false
  }
  return true
}

// ---- AI 评估 ----

/**
 * 评估某个单元格对指定玩家的价值（单方向）
 * 返回连子数 + 开放端数 的模式描述
 */
function evaluateDirection(
  board: GomokuStone[][],
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: GomokuStone
): { count: number; openEnds: number } {
  let count = 1
  let openEnds = 0

  let r = row + dr, c = col + dc
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++; r += dr; c += dc
  }
  if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === 0) {
    openEnds++
  }

  r = row - dr; c = col - dc
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++; r -= dr; c -= dc
  }
  if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === 0) {
    openEnds++
  }

  return { count, openEnds }
}

function patternScore(count: number, openEnds: number): number {
  if (count >= 5) return 100000
  if (openEnds === 0) return 0 // 死棋无价值
  if (count === 4) {
    if (openEnds === 2) return 50000  // 活四
    if (openEnds === 1) return 5000   // 冲四
  }
  if (count === 3) {
    if (openEnds === 2) return 5000   // 活三
    if (openEnds === 1) return 500    // 眠三
  }
  if (count === 2) {
    if (openEnds === 2) return 500    // 活二
    if (openEnds === 1) return 50     // 眠二
  }
  if (count === 1) {
    if (openEnds === 2) return 50
    if (openEnds === 1) return 10
  }
  return 0
}

function evaluatePosition(
  board: GomokuStone[][],
  row: number,
  col: number,
  player: GomokuStone
): number {
  let score = 0
  for (const [dr, dc] of DIRECTIONS) {
    const { count, openEnds } = evaluateDirection(board, row, col, dr, dc, player)
    score += patternScore(count, openEnds)
  }
  return score
}

/**
 * AI 选择一个最佳落子位置
 * 策略：攻击分(权重1.0) + 防守分(权重1.05，优先堵玩家)
 */
function aiFindBestMove(board: GomokuStone[][]): { row: number; col: number } | null {
  const candidates: { row: number; col: number; score: number }[] = []

  // 收集候选区域（已有棋子周围2格范围）
  const nearSet = new Set<string>()
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === 0) {
              nearSet.add(`${nr},${nc}`)
            }
          }
        }
      }
    }
  }

  // 如果没有棋子，下天元
  if (nearSet.size === 0) {
    return { row: 7, col: 7 }
  }

  for (const key of nearSet) {
    const [r, c] = key.split(',').map(Number)
    const attackScore = evaluatePosition(board, r, c, 2)  // AI 进攻
    const defenseScore = evaluatePosition(board, r, c, 1)  // 堵玩家
    const totalScore = attackScore + defenseScore * 1.05
    candidates.push({ row: r, col: c, score: totalScore })
  }

  // 按分数降序排序
  candidates.sort((a, b) => b.score - a.score)

  // 如果有必杀（活四/五连），直接下
  if (candidates.length > 0 && candidates[0].score >= 50000) {
    return { row: candidates[0].row, col: candidates[0].col }
  }

  // 在前 8 个最高分中随机选择，增加棋风变化
  const topN = Math.min(8, candidates.length)
  const pick = candidates[Math.floor(Math.random() * topN)]
  return { row: pick.row, col: pick.col }
}

// ==================== Composable ====================

export function useGomoku() {
  const state = reactive<GomokuState>({
    board: createEmptyBoard(),
    currentPlayer: 1,
    status: 'playing',
    moveHistory: [],
    playerScore: 0,
    aiScore: 0,
    lastMove: null,
  })

  const isGameOver = computed(() => state.status !== 'playing')
  const isPlayerTurn = computed(() => state.currentPlayer === 1 && state.status === 'playing')
  const moveCount = computed(() => state.moveHistory.length)

  /** 玩家落子 */
  function placePiece(row: number, col: number): boolean {
    if (state.status !== 'playing') return false
    if (state.currentPlayer !== 1) return false
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false
    if (state.board[row][col] !== 0) return false

    state.board[row][col] = 1
    state.lastMove = { row, col }
    state.moveHistory.push({ row, col, stone: 1 })

    if (checkWinAt(state.board, row, col)) {
      state.status = 'player_win'
      state.playerScore++
      return true
    }
    if (isBoardFull(state.board)) {
      state.status = 'draw'
      return true
    }

    state.currentPlayer = 2
    return true
  }

  /** AI 落子 */
  function aiMove(): boolean {
    if (state.status !== 'playing') return false
    if (state.currentPlayer !== 2) return false

    const best = aiFindBestMove(state.board)
    if (!best) {
      // 无空位
      state.status = 'draw'
      return false
    }

    state.board[best.row][best.col] = 2
    state.lastMove = { row: best.row, col: best.col }
    state.moveHistory.push({ row: best.row, col: best.col, stone: 2 })

    if (checkWinAt(state.board, best.row, best.col)) {
      state.status = 'ai_win'
      state.aiScore++
      return true
    }
    if (isBoardFull(state.board)) {
      state.status = 'draw'
      return true
    }

    state.currentPlayer = 1
    return true
  }

  /** 悔棋（撤回玩家和AI各一手） */
  function undoMove(): boolean {
    if (state.status !== 'playing') return false
    if (state.moveHistory.length < 2) return false

    // 撤回AI
    const aiLast = state.moveHistory.pop()!
    state.board[aiLast.row][aiLast.col] = 0
    // 撤回玩家
    const playerLast = state.moveHistory.pop()!
    state.board[playerLast.row][playerLast.col] = 0

    state.currentPlayer = 1
    state.lastMove = state.moveHistory.length > 0
      ? { row: state.moveHistory[state.moveHistory.length - 1].row, col: state.moveHistory[state.moveHistory.length - 1].col }
      : null
    return true
  }

  /** 重置棋盘 */
  function resetBoard() {
    state.board = createEmptyBoard()
    state.currentPlayer = 1
    state.status = 'playing'
    state.moveHistory = []
    state.lastMove = null
  }

  /** 完全重置（含比分） */
  function resetAll() {
    resetBoard()
    state.playerScore = 0
    state.aiScore = 0
  }

  return {
    state,
    BOARD_SIZE,
    isGameOver,
    isPlayerTurn,
    moveCount,
    placePiece,
    aiMove,
    undoMove,
    resetBoard,
    resetAll,
  }
}

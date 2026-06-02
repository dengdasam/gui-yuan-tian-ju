// ============================================
// 归园田居 - 核心类型定义
// ============================================

// ---- 时间系统 ----
export type Season = '春' | '夏' | '秋' | '冬'
export type TimeOfDay = '清晨' | '上午' | '午后' | '傍晚' | '深夜'
export type Weather = '晴' | '阴' | '小雨' | '大雨' | '雪'

export interface GameDate {
  year: number
  month: number
  day: number
  season: Season
  timeOfDay: TimeOfDay
  weather: Weather
}

// ---- 玩家 ----
export interface Player {
  name: string
  gold: number          // 铜钱
  stamina: number       // 体力 0-100
  maxStamina: number
  fame: number          // 声望
  farmLevel: number     // 田地等级
  skills: Skill[]
  inventory: InventoryItem[]
  // 商战相关
  chamberRole: 'none' | 'member' | 'elder' | 'chairman'
  businessReputation: number  // 商业信誉 0-100
  marketShare: number         // 市场份额百分比
  allianceIds: string[]       // 盟友ID列表
}

export interface Skill {
  id: string
  name: string
  level: number
  exp: number
}

// ---- 作物与经营 ----
export type CropSeason = Season | '全季'

export interface Crop {
  id: string
  name: string
  description: string
  season: CropSeason[]
  growthDays: number
  buySeedPrice: number
  baseSellPrice: number
  yield: number         // 单块田产量
  icon: string          // emoji
}

export interface FarmLand {
  id: number
  crop: string | null   // crop id
  plantedDay: number    // 种植日（从第1天起算）
  watered: boolean
  fertilized: boolean
  quality: number       // 0-100，影响产量
  ready: boolean        // 是否可收获
}

export interface InventoryItem {
  itemId: string
  name: string
  type: 'seed' | 'crop' | 'tool' | 'gift' | 'special'
  quantity: number
  description: string
  icon: string
}

// ---- 市场与商战 ----
export interface MarketPrice {
  cropId: string
  price: number
  trend: 'up' | 'down' | 'stable'
  demand: 'low' | 'normal' | 'high'
}

export interface Competitor {
  id: string
  name: string
  title?: string
  description: string
  wealth: number
  relationship: number   // -100~100 关系
  style: 'cooperative' | 'aggressive' | 'neutral'
  active: boolean
  lastAction: string
  // 商战属性
  marketShare: number
  allied: boolean
  voteWeight: number     // 商会投票权重
}

// ---- 商会系统 ----
export type VoteStatus = 'proposed' | 'voting' | 'passed' | 'rejected'
export type VoteType = 'price_control' | 'trade_route' | 'member_expel' | 'tax_policy' | 'monopoly_break'

export interface ChamberVote {
  id: string
  title: string
  description: string
  type: VoteType
  status: VoteStatus
  proposerId: string
  yesVotes: number
  noVotes: number
  totalVotes: number
  votes: ChamberVoter[]
  triggerDay: number
  resolveDay: number
  resultDescription: {
    passed: string
    rejected: string
  }
}

export interface ChamberVoter {
  competitorId: string
  voted: boolean
  vote: 'yes' | 'no' | null
}

// ---- 价格战系统 ----
export interface PriceWar {
  id: string
  active: boolean
  cropId: string
  initiatorId: string
  startDay: number
  currentDay: number
  maxDays: number
  basePrice: number
  currentPrice: number
  minPrice: number
  dailyDrop: number
  participants: PriceWarParticipant[]
  winner: string | null
}

export interface PriceWarParticipant {
  competitorId: string
  stamina: number       // 资金耐力 0-100
  goldSpent: number
  surrendered: boolean
}

// ---- 截货事件 ----
export type CargoStatus = 'preparing' | 'in_transit' | 'intercepted' | 'delivered' | 'failed'

export interface CargoEvent {
  id: string
  title: string
  description: string
  route: string
  cargoType: string
  value: number
  status: CargoStatus
  departureDay: number
  arrivalDay: number
  escortStrength: number    // 护送力量
  threatLevel: number       // 威胁等级
  saboteurId: string | null // 截货者
  outcome: string
}

// ---- 季节事件 ----
export interface SeasonalEvent {
  id: string
  title: string
  season: Season
  month: number           // 触发月份
  dayRange: [number, number]  // 触发日期范围
  description: string
  greeting: string
  type: 'festival' | 'competition' | 'assembly' | 'disaster' | 'special'
  nodes: StoryNode[]
  startNode: string
  rewards: Effect[]
  repeatable: boolean
  completed: boolean
}

// ---- 敌对行动 ----
export interface HostileAction {
  id: string
  type: 'price_cut' | 'cargo_intercept' | 'rumor' | 'buyout' | 'bribe'
  title: string
  description: string
  initiatorId: string
  triggerDay: number
  choices: Choice[]
}

export interface BusinessEvent {
  id: string
  title: string
  description: string
  choices: Choice[]
  condition?: (state: any) => boolean
  triggerDay?: number
}

// ---- NPC 系统 ----
export type NPCRole = '村民' | '商人' | '官员' | '旅人' | '家人'

export interface NPC {
  id: string
  name: string
  title: string
  role: NPCRole
  description: string
  affection: number       // 好感度 0-100
  met: boolean
  questCompleted: string[]
  dailyDialogues: string[]
  specialEvents: NPCEvent[]
  giftPreferences: string[]  // 喜欢的礼物 itemId
  icon: string
  // 支线
  sideQuests: NPCSideQuest[]
}

export interface NPCSideQuest {
  id: string
  title: string
  description: string
  stage: number           // 当前阶段 0=未开始
  maxStage: number
  affectionThreshold: number[]  // 每阶段好感门槛
  stages: NPCSideQuestStage[]
  completed: boolean
  reward: string
}

export interface NPCSideQuestStage {
  stage: number
  title: string
  description: string
  dialogueLines: DialogueLine[]
  choices?: Choice[]
  effects: Effect[]
}

export interface NPCEvent {
  id: string
  title: string
  condition: (state: any) => boolean
  dialogue: DialogueLine[]
  choices: Choice[]
}

// ---- 故事引擎 ----
export interface DialogueLine {
  speaker: string        // NPC name 或 '旁白' 或 '' (玩家)
  content: string
  emotion?: string       // 表情: 'happy' 'sad' 'angry' 'surprised' 'neutral'
}

export interface Choice {
  text: string
  next: string           // 下一节点 ID
  condition?: (state: any) => boolean
  effects?: Effect[]
  visible?: boolean
}

export interface Effect {
  type: 'gold' | 'stamina' | 'affection' | 'fame' | 'item' | 'skill' | 'unlock' | 'business_rep' | 'market_share' | 'alliance'
  target?: string        // NPC id 或 item id
  value: number
}

export interface StoryNode {
  id: string
  type: 'dialogue' | 'narration' | 'choice' | 'event' | 'system'
  dialogue?: DialogueLine[]
  choices?: Choice[]
  background?: string    // 场景描述
  onEnter?: Effect[]
  next?: string          // 默认下一节点
  condition?: (state: any) => boolean  // 显示条件
}

export interface Chapter {
  id: string
  title: string
  subtitle: string
  startNode: string
  description: string
  unlockCondition?: (state: any) => boolean
}

// ---- 全局游戏状态 ----
export interface GameState {
  phase: 'title' | 'playing' | 'paused'
  date: GameDate
  totalDays: number
  player: Player
  farmLands: FarmLand[]
  npcs: NPC[]
  market: MarketPrice[]
  competitors: Competitor[]
  currentChapter: string
  currentNode: string
  dialogueHistory: { speaker: string; content: string }[]
  flags: Record<string, boolean>
  log: GameLogEntry[]
  // 商战
  chamberVotes: ChamberVote[]
  priceWar: PriceWar | null
  cargoEvents: CargoEvent[]
  hostileActions: HostileAction[]
  // 季节事件
  seasonalEvents: SeasonalEvent[]
}

export interface GameLogEntry {
  day: number
  timeOfDay: TimeOfDay
  type: 'action' | 'story' | 'system' | 'market' | 'business' | 'festival'
  message: string
}

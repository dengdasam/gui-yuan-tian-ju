import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  GameState, Player, GameDate, FarmLand, NPC, MarketPrice,
  Competitor, TimeOfDay, Weather, Season, Crop, InventoryItem,
  ChamberVote, ChamberVoter, PriceWar, PriceWarParticipant,
  CargoEvent, HostileAction, SeasonalEvent, MiniGameSession, ProcessingState
} from '../types'
import { storyNodes, chapters } from '../data/story'
import { npcs as initialNPCs } from '../data/npcs'
import { crops } from '../data/crops'
import { competitors as initialCompetitors } from '../data/competitors'
import { processingRecipes } from '../data/processing'
import { seasonalEvents } from '../data/seasonal-events'
import { getActiveSeasonalEvent } from '../data/seasonal-events'

export const useGameStore = defineStore('game', () => {
  // ========== 状态 ==========
  const phase = ref<'title' | 'playing' | 'paused'>('title')
  const totalDays = ref(1)
  const currentNode = ref('prologue_start')
  const currentChapter = ref('prologue')
  const dialogueHistory = ref<{ speaker: string; content: string }[]>([])
  const flags = ref<Record<string, boolean>>({})
  const log = ref<{ day: number; timeOfDay: TimeOfDay; type: string; message: string }[]>([])
  const completedSeasonalEvents = ref<string[]>([])

  // 时间
  const date = ref<GameDate>({
    year: 7, month: 3, day: 1, season: '春', timeOfDay: '清晨' as TimeOfDay, weather: '晴'
  })

  // 玩家
  const player = ref<Player>({
    name: '书生',
    gold: 100,
    stamina: 80,
    maxStamina: 100,
    fame: 0,
    farmLevel: 1,
    skills: [],
    inventory: [],
    chamberRole: 'none',
    businessReputation: 0,
    marketShare: 5,
    allianceIds: []
  })

  // 田地（3块）
  const farmLands = ref<FarmLand[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      crop: null,
      plantedDay: 0,
      watered: false,
      fertilized: false,
      quality: 50,
      ready: false
    }))
  )

  // NPC
  const npcs = ref<NPC[]>(JSON.parse(JSON.stringify(initialNPCs)))

  // 市场
  const market = ref<MarketPrice[]>(
    crops.map(c => ({
      cropId: c.id,
      price: c.baseSellPrice,
      trend: 'stable' as const,
      demand: 'normal' as const
    }))
  )

  // 竞争对手
  const competitors = ref<Competitor[]>(JSON.parse(JSON.stringify(initialCompetitors)))

  // ---- 商战系统 ----
  const chamberVotes = ref<ChamberVote[]>([])
  const priceWar = ref<PriceWar | null>(null)
  const cargoEvents = ref<CargoEvent[]>([])
  const hostileActions = ref<HostileAction[]>([])
  const activeSeasonalEvent = ref<SeasonalEvent | null>(null)
  const showSeasonalDialog = ref(false)

  // 小游戏
  const miniGameSession = ref<MiniGameSession>({
    active: false,
    gameType: null,
    opponentNpcId: null,
    gomoku: null,
  })

  // 加工坊
  const processingState = ref<ProcessingState>({
    slots: [
      { id: 0, status: 'idle', recipeId: null, startDay: 0, progress: 0 },
    ],
    maxSlots: 1,
    unlockedRecipes: [],
  })

  // ========== 计算属性 ==========
  const currentStoryNode = computed(() => storyNodes[currentNode.value] || null)

  const seasonName = computed(() => date.value.season)
  const timeOfDayName = computed(() => date.value.timeOfDay)
  const weatherName = computed(() => date.value.weather)

  const npcsInVillage = computed(() => npcs.value.filter(n => n.met))

  const plantedLands = computed(() => farmLands.value.filter(l => l.crop !== null))

  const activeChamberVote = computed(() =>
    chamberVotes.value.find(v => v.status === 'voting') || null
  )

  const activePriceWar = computed(() => priceWar.value?.active ? priceWar.value : null)

  const pendingCargoEvents = computed(() =>
    cargoEvents.value.filter(c => c.status === 'preparing' || c.status === 'in_transit')
  )

  // ========== 方法 ==========

  // ---- 时间推进 ----
  function advanceTime() {
    date.value.day += 1

    if (date.value.day > 30) {
      date.value.day = 1
      date.value.month += 1
    }

    const m = date.value.month
    if (m <= 3) date.value.season = '春'
    else if (m <= 6) date.value.season = '夏'
    else if (m <= 9) date.value.season = '秋'
    else date.value.season = '冬'

    if (m > 12) {
      date.value.month = 1
      date.value.year += 1
    }

    // 随机天气
    const weathers: Weather[] = ['晴', '晴', '晴', '阴', '小雨']
    if (date.value.season === '冬') weathers.push('雪')
    date.value.weather = weathers[Math.floor(Math.random() * weathers.length)]

    // 体力恢复
    player.value.stamina = Math.min(
      player.value.maxStamina,
      player.value.stamina + 10
    )

    // 作物生长
    farmLands.value.forEach(land => {
      if (land.crop && !land.ready) {
        const crop = crops.find(c => c.id === land.crop)
        if (crop) {
          const daysPlanted = totalDays.value - land.plantedDay
          if (daysPlanted >= crop.growthDays) {
            land.ready = true
            addLog(`【${crop.name}】成熟了，可以收获！`, 'action')
          }
        }
      }
    })

    // 市场波动
    updateMarket()

    // 商战系统推进
    advanceBusinessWar()

    // 加工坊推进
    advanceProcessing()
    checkRecipeUnlocks()

    // 季节事件检查
    checkSeasonalEvent()

    // 章节过渡触发
    checkPendingChapterStart()

    totalDays.value += 1
  }

  // ---- 市场更新 ----
  function updateMarket() {
    market.value.forEach(m => {
      const r = Math.random()
      if (r < 0.3) {
        m.trend = 'up'
        m.price = Math.round(m.price * (1 + Math.random() * 0.2))
      } else if (r < 0.6) {
        m.trend = 'down'
        m.price = Math.round(m.price * (1 - Math.random() * 0.15))
      } else {
        m.trend = 'stable'
      }
      const crop = crops.find(c => c.id === m.cropId)
      const basePrice = crop ? crop.baseSellPrice : m.price
      m.demand = m.price > basePrice * 1.2 ? 'high' : m.price < basePrice * 0.8 ? 'low' : 'normal'
    })
  }

  // ---- 种植 ----
  function plantCrop(landId: number, cropId: string) {
    const land = farmLands.value.find(l => l.id === landId)
    const crop = crops.find(c => c.id === cropId)
    if (!land || !crop) return false

    const seasonOk = crop.season.includes('全季') || crop.season.includes(date.value.season)
    if (!seasonOk) {
      addLog(`${crop.name}不适合在${date.value.season}季种植。`, 'action')
      return false
    }

    if (player.value.stamina < 10) {
      addLog('体力不足，无法耕种。', 'action')
      return false
    }

    // 检查种子或购买
    const seedKey = `${cropId}_seed`
    const seedItem = player.value.inventory.find(i => i.itemId === seedKey)
    if (seedItem && seedItem.quantity > 0) {
      seedItem.quantity -= 1
    } else {
      if (player.value.gold < crop.buySeedPrice) {
        addLog('铜钱不够，买不起种子。', 'action')
        return false
      }
      player.value.gold -= crop.buySeedPrice
    }

    land.crop = cropId
    land.plantedDay = totalDays.value
    land.watered = true
    land.ready = false
    player.value.stamina -= 10
    addLog(`种下了【${crop.name}】，预计${crop.growthDays}天后成熟。`, 'action')
    return true
  }

  // ---- 收获 ----
  function harvestCrop(landId: number) {
    const land = farmLands.value.find(l => l.id === landId)
    if (!land || !land.crop || !land.ready) return false

    const crop = crops.find(c => c.id === land.crop)
    if (!crop) return false

    const mp = market.value.find(m => m.cropId === land.crop)
    const price = mp ? mp.price : crop.baseSellPrice

    const existItem = player.value.inventory.find(i => i.itemId === land.crop)
    if (existItem) {
      existItem.quantity += crop.yield
    } else {
      player.value.inventory.push({
        itemId: land.crop,
        name: crop.name,
        type: 'crop',
        quantity: crop.yield,
        description: crop.description,
        icon: crop.icon
      })
    }

    addLog(`收获了【${crop.name}】×${crop.yield}，当前市价 ${price}文/斤。`, 'action')

    land.crop = null
    land.ready = false
    land.watered = false
    land.fertilized = false
    player.value.stamina -= 10

    // 检查是否触发运货事件
    checkShipmentTrigger(crop.id, crop.yield)

    return true
  }

  // ---- 开垦新田 ----
  function expandLand() {
    const MAX_LANDS = 6
    const costs = [0, 0, 0, 150, 250, 400] // 第4/5/6块田的价格
    const currentCount = farmLands.value.length
    if (currentCount >= MAX_LANDS) return false

    const cost = costs[currentCount] || 0
    if (player.value.gold < cost) return false

    player.value.gold -= cost
    const newId = currentCount
    farmLands.value.push({
      id: newId,
      crop: null,
      plantedDay: 0,
      watered: false,
      fertilized: false,
      quality: 50,
      ready: false
    })
    addLog(`开垦了第${newId + 1}块田地！花费${cost}文铜钱。`, 'action')
    return true
  }

  // ---- 出售 ----
  function sellItem(itemId: string, quantity: number) {
    const item = player.value.inventory.find(i => i.itemId === itemId)
    if (!item || item.quantity < quantity) return false

    const mp = market.value.find(m => m.cropId === itemId)
    const price = mp ? mp.price : 10
    const total = price * quantity

    item.quantity -= quantity
    player.value.gold += total
    addLog(`出售了【${item.name}】×${quantity}，获得 ${total} 文铜钱。`, 'action')

    player.value.inventory = player.value.inventory.filter(i => i.quantity > 0)
    return true
  }

  // ---- 购买种子 ----
  function buySeed(cropId: string, quantity: number = 1) {
    const crop = crops.find(c => c.id === cropId)
    if (!crop) return false

    const totalCost = crop.buySeedPrice * quantity
    if (player.value.gold < totalCost) {
      addLog('铜钱不够。', 'action')
      return false
    }

    player.value.gold -= totalCost

    const seedKey = `${cropId}_seed`
    const existItem = player.value.inventory.find(i => i.itemId === seedKey)
    if (existItem) {
      existItem.quantity += quantity
    } else {
      player.value.inventory.push({
        itemId: seedKey,
        name: `${crop.name}种子`,
        type: 'seed',
        quantity,
        description: `${crop.name}的种子，${crop.season.join('/')}季可种植。`,
        icon: '🌰'
      })
    }

    addLog(`购买了【${crop.name}种子】×${quantity}，花费 ${totalCost} 文。`, 'action')
    return true
  }

  // ---- NPC 交互 ----
  function talkToNPC(npcId: string): string {
    const npc = npcs.value.find(n => n.id === npcId)
    if (!npc) return ''

    if (!npc.met) {
      npc.met = true
      addLog(`结识了【${npc.name}】——${npc.title}。`, 'action')
    }

    // 检查支线触发
    checkSideQuestTrigger(npc)

    const dialogues = npc.dailyDialogues
    const d = dialogues[Math.floor(Math.random() * dialogues.length)]
    addLog(`与【${npc.name}】交谈：${d}`, 'action')
    return d
  }

  function giveGift(npcId: string, itemId: string): boolean {
    const npc = npcs.value.find(n => n.id === npcId)
    const item = player.value.inventory.find(i => i.itemId === itemId)
    if (!npc || !item || item.quantity < 1) return false

    item.quantity -= 1
    player.value.inventory = player.value.inventory.filter(i => i.quantity > 0)

    const liked = npc.giftPreferences.some(pref =>
      itemId.includes(pref.replace('_seed', ''))
    )
    const affectionChange = liked ? 10 : 3

    npc.affection = Math.min(100, npc.affection + affectionChange)
    addLog(`送给【${npc.name}】${item.name}。${liked ? '对方很喜欢！' : '对方收下了。'}好感度+${affectionChange}`, 'action')

    // 检查支线触发
    checkSideQuestTrigger(npc)

    return true
  }

  // ---- NPC 支线检查 ----
  function checkSideQuestTrigger(npc: NPC) {
    npc.sideQuests.forEach(sq => {
      if (sq.completed) return
      // 找到当前应触发但未触发的阶段
      const currentStage = sq.stages.find(s => s.stage === sq.stage + 1)
      if (!currentStage) return
      const threshold = sq.affectionThreshold[sq.stage] || 999
      if (npc.affection >= threshold && sq.stage < sq.maxStage) {
        // 触发支线！
        sq.stage += 1
        const stage = sq.stages.find(s => s.stage === sq.stage)
        if (stage) {
          addLog(`【${sq.title}】第${sq.stage}阶段：${stage.title}`, 'story')
          stage.effects.forEach(e => applyEffect(e))
          // 将对话注入故事面板
          stage.dialogueLines.forEach(d => {
            dialogueHistory.value.push({
              speaker: d.speaker || '你',
              content: d.content
            })
          })
        }
        if (sq.stage >= sq.maxStage) {
          sq.completed = true
          addLog(`【${sq.title}】完成！${sq.reward}`, 'story')
        }
      }
    })
  }

  // ---- 章节过渡检测 ----
  const chapterTransitions: Record<string, string> = {
    'ch1_end_chapter': 'chapter2',
    'ch2_end_chapter': 'chapter3',
    'ch3_end_chapter': 'epilogue',
    'epilogue_credits': 'epilogue'
  }

  const chapterStartNodes: Record<string, string> = {
    'chapter2': 'ch2_intro',
    'chapter3': 'ch3_intro',
    'epilogue': 'epilogue_intro'
  }

  function checkChapterTransition() {
    const nextChapter = chapterTransitions[currentNode.value]
    if (nextChapter) {
      currentChapter.value = nextChapter
      const startNode = chapterStartNodes[nextChapter]
      if (startNode) {
        // 延迟到下一个游戏日触发新章节
        flags.value[`${nextChapter}_pending`] = true
      }
    }
  }

  function checkPendingChapterStart() {
    for (const chapterId of ['chapter2', 'chapter3', 'epilogue']) {
      const flagKey = `${chapterId}_pending`
      if (flags.value[flagKey]) {
        const startNode = chapterStartNodes[chapterId]
        if (startNode && currentNode.value !== startNode) {
          flags.value[flagKey] = false
          addLog(`【${chapterId === 'epilogue' ? '尾章' : chapterId === 'chapter3' ? '第三章' : '第二章'}】开启！`, 'story')
          goToNode(startNode)
        }
        break
      }
    }
  }

  // ---- 故事推进 ----
  function goToNode(nodeId: string) {
    if (!storyNodes[nodeId]) return

    currentNode.value = nodeId
    const node = storyNodes[nodeId]

    // 检查条件
    if (node.condition) {
      try {
        const conditionMet = node.condition({
          player: player.value,
          date: date.value,
          flags: flags.value,
          npcs: npcs.value,
          farmLands: farmLands.value,
          currentNode: currentNode.value,
          totalDays: totalDays.value,
          market: market.value,
          competitors: competitors.value
        })
        if (!conditionMet) {
          // 条件不满足，跳转到默认下一个节点
          if (node.next) {
            goToNode(node.next)
          }
          return
        }
      } catch (e) {
        console.warn(`故事节点 ${nodeId} 条件检查失败:`, e)
      }
    }

    // 触发进入效果
    if (node.onEnter) {
      node.onEnter.forEach(e => applyEffect(e))
    }

    // 记录对话
    if (node.dialogue) {
      node.dialogue.forEach(d => {
        dialogueHistory.value.push({
          speaker: d.speaker || '你',
          content: d.content
        })
      })
    }

    // 检测章节过渡
    checkChapterTransition()

    // 如果没有对话和选择，自动推进
    if (!node.dialogue && !node.choices && node.next) {
      goToNode(node.next)
    }
  }

  function applyEffect(effect: { type: string; target?: string; value: number }) {
    switch (effect.type) {
      case 'gold':
        player.value.gold += effect.value
        break
      case 'stamina':
        player.value.stamina = Math.min(player.value.maxStamina, player.value.stamina + effect.value)
        break
      case 'affection':
        if (effect.target) {
          const npc = npcs.value.find(n => n.id === effect.target)
          if (npc) npc.affection = Math.min(100, Math.max(-100, npc.affection + effect.value))
        }
        break
      case 'fame':
        player.value.fame += effect.value
        break
      case 'business_rep':
        player.value.businessReputation += effect.value
        break
      case 'market_share':
        player.value.marketShare += effect.value
        break
      case 'alliance':
        if (effect.target && !player.value.allianceIds.includes(effect.target)) {
          player.value.allianceIds.push(effect.target)
          const comp = competitors.value.find(c => c.id === effect.target)
          if (comp) comp.allied = true
        }
        break
      case 'item':
        if (effect.target) {
          const crop = crops.find(c => c.id === effect.target)
          const seedKey = `${effect.target}`
          const existItem = player.value.inventory.find(i => i.itemId === seedKey)
          if (existItem) {
            existItem.quantity += effect.value
          } else {
            player.value.inventory.push({
              itemId: seedKey,
              name: crop ? `${crop.name}种子` : effect.target,
              type: 'seed',
              quantity: effect.value,
              description: '',
              icon: '🌰'
            })
          }
        }
        break
      case 'skill':
        if (effect.target) {
          const existSkill = player.value.skills.find(s => s.id === effect.target)
          if (existSkill) {
            existSkill.level += 1
          } else {
            player.value.skills.push({ id: effect.target, name: effect.target, level: 1, exp: 0 })
          }
        }
        break
    }
  }

  // ========== 商战系统 ==========

  // ---- 商会投票 ----
  function initiateChamberVote(vote: Omit<ChamberVote, 'votes' | 'yesVotes' | 'noVotes' | 'totalVotes'>) {
    const voters: ChamberVoter[] = competitors.value
      .filter(c => c.active)
      .map(c => ({
        competitorId: c.id,
        voted: false,
        vote: null
      }))

    const newVote: ChamberVote = {
      ...vote,
      votes: voters,
      yesVotes: 0,
      noVotes: 0,
      totalVotes: voters.reduce((sum, v) => {
        const comp = competitors.value.find(c => c.id === v.competitorId)
        return sum + (comp?.voteWeight || 1)
      }, 0)
    }

    chamberVotes.value.push(newVote)
    addLog(`【商会】提案"${vote.title}"已发起，等待投票。`, 'business')

    // AI投票将在下一次时间推进时自动处理
    newVote.resolveDay = totalDays.value + 1
  }

  function castVote(voteId: string, competitorId: string, vote: 'yes' | 'no') {
    const cv = chamberVotes.value.find(v => v.id === voteId)
    if (!cv || cv.status !== 'voting') return

    const voter = cv.votes.find(v => v.competitorId === competitorId)
    if (!voter || voter.voted) return

    voter.voted = true
    voter.vote = vote
    const comp = competitors.value.find(c => c.id === competitorId)
    const weight = comp?.voteWeight || 1

    if (vote === 'yes') cv.yesVotes += weight
    else cv.noVotes += weight
  }

  function resolveChamberVote(voteId: string) {
    const cv = chamberVotes.value.find(v => v.id === voteId)
    if (!cv || cv.status !== 'voting') return

    resolveChamberVoteInternal(cv)
  }

  function resolveChamberVoteInternal(cv: ChamberVote) {

    // 你方自动投赞成
    castVote(cv.id, 'zhangsifang', 'yes')
    if (player.value.allianceIds.includes('liming')) {
      castVote(cv.id, 'liming', 'yes')
    }

    // 王员外及其附庸投反对
    castVote(cv.id, 'wangyuanwai', 'no')

    // 中立派随机
    if (Math.random() > 0.5) {
      competitors.value.filter(c => c.style === 'neutral' && c.active).forEach(c => {
        castVote(cv.id, c.id, 'yes')
      })
    }

    // 判定结果
    const passed = cv.yesVotes > cv.noVotes
    cv.status = passed ? 'passed' : 'rejected'

    const resultMsg = passed ? cv.resultDescription.passed : cv.resultDescription.rejected
    addLog(`【商会投票结果】${cv.title} —— ${passed ? '通过！' : '被否决。'}${resultMsg}`, 'business')

    if (passed) {
      player.value.businessReputation += 10
      player.value.marketShare += 5
    }
  }

  // ---- 价格战 ----
  function startPriceWar(cropId: string, initiatorId: string) {
    const crop = crops.find(c => c.id === cropId)
    if (!crop) return

    const participants: PriceWarParticipant[] = competitors.value
      .filter(c => c.active)
      .map(c => ({
        competitorId: c.id,
        stamina: 100,
        goldSpent: 0,
        surrendered: false
      }))

    priceWar.value = {
      id: `pw_${totalDays.value}`,
      active: true,
      cropId,
      initiatorId,
      startDay: totalDays.value,
      currentDay: totalDays.value,
      maxDays: 30,
      basePrice: market.value.find(m => m.cropId === cropId)?.price || crop.baseSellPrice,
      currentPrice: crop.baseSellPrice,
      minPrice: Math.round(crop.baseSellPrice * 0.3),
      dailyDrop: Math.round(crop.baseSellPrice * 0.02),
      participants,
      winner: null
    }

    const initiator = competitors.value.find(c => c.id === initiatorId)
    addLog(`【价格战】${initiator?.name}发起了${crop.name}价格战！价格将在30天内持续下跌。`, 'business')
  }

  function advancePriceWar() {
    if (!priceWar.value?.active) return

    const pw = priceWar.value
    pw.currentDay += 1

    // 价格持续下降
    pw.currentPrice = Math.max(pw.minPrice, pw.currentPrice - pw.dailyDrop)

    // 更新市场价格
    const mp = market.value.find(m => m.cropId === pw.cropId)
    if (mp) mp.price = pw.currentPrice

    // 参与者消耗资金耐力
    pw.participants.forEach(p => {
      if (!p.surrendered) {
        p.stamina -= Math.random() * 5 + 1
        p.goldSpent += 10
        if (p.stamina <= 0) {
          p.surrendered = true
          const comp = competitors.value.find(c => c.id === p.competitorId)
          addLog(`${comp?.name}在价格战中资金耗尽，被迫退出。`, 'business')
        }
      }
    })

    // 检查结束条件
    const activeParticipants = pw.participants.filter(p => !p.surrendered)
    if (activeParticipants.length <= 1 || pw.currentDay - pw.startDay >= pw.maxDays) {
      endPriceWar()
    }
  }

  function endPriceWar() {
    if (!priceWar.value) return

    const pw = priceWar.value
    pw.active = false

    const survivors = pw.participants.filter(p => !p.surrendered)
    if (survivors.length === 1) {
      pw.winner = survivors[0].competitorId
      const winner = competitors.value.find(c => c.id === pw.winner)
      addLog(`【价格战结束】${winner?.name}赢得了价格战！`, 'business')

      if (pw.winner !== 'wangyuanwai') {
        player.value.marketShare += 10
        player.value.businessReputation += 15
      }
    } else {
      addLog('【价格战结束】双方耗尽，价格战无疾而终。', 'business')
    }

    // 价格恢复
    const mp = market.value.find(m => m.cropId === pw.cropId)
    if (mp) {
      const crop = crops.find(c => c.id === pw.cropId)
      if (crop) mp.price = crop.baseSellPrice
    }
  }

  // ---- 截货事件 ----
  function triggerCargoIntercept(targetCargoId: string, saboteurId: string) {
    const cargo = cargoEvents.value.find(c => c.id === targetCargoId)
    if (!cargo || cargo.status !== 'in_transit') return

    cargo.status = 'intercepted'
    cargo.saboteurId = saboteurId

    const saboteur = competitors.value.find(c => c.id === saboteurId)
    addLog(`【紧急】${saboteur?.name}截获了你的货物！${cargo.title}被拦截在${cargo.route}。`, 'business')

    // 创建敌对行动记录
    hostileActions.value.push({
      id: `ha_${totalDays.value}`,
      type: 'cargo_intercept',
      title: `${saboteur?.name}截获了你的货物`,
      description: `你的${cargo.cargoType}在${cargo.route}被${saboteur?.name}的人截获。货物价值${cargo.value}文。`,
      initiatorId: saboteurId,
      triggerDay: totalDays.value,
      choices: [
        {
          text: '带人夺回货物（消耗体力，可能受伤）',
          next: '',
          effects: [
            { type: 'stamina', value: -30 },
            { type: 'affection', target: 'madaotou', value: 10 }
          ]
        },
        {
          text: '报官处理（消耗铜钱，需要时间）',
          next: '',
          effects: [
            { type: 'gold', value: -80 },
            { type: 'fame', value: 5 }
          ]
        },
        {
          text: '放弃这批货，重新组织货源',
          next: '',
          effects: [
            { type: 'gold', value: -cargo.value }
          ]
        }
      ]
    })
  }

  function resolveCargoIntercept(cargoId: string, outcome: 'retrieved' | 'lost' | 'replaced') {
    const cargo = cargoEvents.value.find(c => c.id === cargoId)
    if (!cargo) return

    switch (outcome) {
      case 'retrieved':
        cargo.status = 'delivered'
        cargo.outcome = '货物被成功夺回并送达'
        player.value.gold += cargo.value
        addLog(`夺回了被截货物！获得${cargo.value}文。`, 'business')
        break
      case 'lost':
        cargo.status = 'failed'
        cargo.outcome = '货物永久损失'
        addLog(`货物损失，亏损${cargo.value}文。`, 'business')
        break
      case 'replaced':
        cargo.status = 'delivered'
        cargo.outcome = '重新组织货源后送达'
        player.value.gold += Math.round(cargo.value * 0.6)
        addLog(`用新货替代，获得${Math.round(cargo.value * 0.6)}文。`, 'business')
        break
    }
  }

  // ---- 运货触发 ----
  function checkShipmentTrigger(cropId: string, quantity: number) {
    // 如果收了茶叶且剧情推进到合适阶段，创建运货事件
    if (cropId === 'tea' && currentNode.value === 'ch1_prep_phase' && !flags.value['first_shipment_done']) {
      flags.value['first_shipment_done'] = true

      cargoEvents.value.push({
        id: `cargo_first_tea`,
        title: '首批茶叶运货',
        description: '200斤桃源春茶运往襄州——这是打破王员外垄断的关键一役。',
        route: '鹰嘴崖小道 → 襄州茶市',
        cargoType: '茶叶',
        value: 120,
        status: 'preparing',
        departureDay: totalDays.value + 1,
        arrivalDay: totalDays.value + 6,
        escortStrength: 3,
        threatLevel: 5,
        saboteurId: null,
        outcome: ''
      })
      addLog('【商路】首批茶叶准备就绪，马刀头正在组织镖队。', 'business')
    }
  }

  // ---- 商战日常推进 ----
  function advanceBusinessWar() {
    // 处理待投票的商会提案
    chamberVotes.value.forEach(cv => {
      if (cv.status === 'voting' && totalDays.value >= cv.resolveDay) {
        resolveChamberVoteInternal(cv)
      }
    })

    // 价格战推进
    if (priceWar.value?.active) {
      advancePriceWar()
    }

    // 运货推进
    cargoEvents.value.forEach(cargo => {
      if (cargo.status === 'preparing' && totalDays.value >= cargo.departureDay) {
        cargo.status = 'in_transit'
        addLog(`【商路】${cargo.title}已出发，预计${cargo.arrivalDay - totalDays.value}天后到达。`, 'business')
      }
      if (cargo.status === 'in_transit' && totalDays.value >= cargo.arrivalDay) {
        // 有概率被截
        if (cargo.threatLevel > 0 && Math.random() < cargo.threatLevel / 20) {
          triggerCargoIntercept(cargo.id, 'wangyuanwai')
        } else {
          cargo.status = 'delivered'
          cargo.outcome = '货物安全送达'
          player.value.gold += cargo.value
          player.value.businessReputation += 5
          addLog(`【商路】${cargo.title}安全送达！获得${cargo.value}文。`, 'business')
        }
      }
    })

    // 王员外随机反击
    if (player.value.marketShare > 15 && Math.random() < 0.05) {
      const actions: ('price_cut' | 'rumor' | 'bribe')[] = ['price_cut', 'rumor', 'bribe']
      const action = actions[Math.floor(Math.random() * actions.length)]

      switch (action) {
        case 'price_cut':
          if (!priceWar.value?.active) {
            const targetCrops = ['tea', 'wheat', 'rice']
            const target = targetCrops[Math.floor(Math.random() * targetCrops.length)]
            startPriceWar(target, 'wangyuanwai')
          }
          break
        case 'rumor':
          player.value.businessReputation = Math.max(0, player.value.businessReputation - 5)
          addLog('【商战】王员外散布谣言，你的商业信誉受损。', 'business')
          break
        case 'bribe':
          player.value.gold = Math.max(0, player.value.gold - 30)
          addLog('【商战】王员外贿赂官府，你的部分商路被查封，损失30文。', 'business')
          break
      }
    }
  }

  // ========== 季节事件 ==========
  function checkSeasonalEvent() {
    const evt = getActiveSeasonalEvent(
      date.value.season,
      date.value.month,
      date.value.day,
      completedSeasonalEvents.value
    )

    if (evt && !activeSeasonalEvent.value) {
      activeSeasonalEvent.value = evt
      showSeasonalDialog.value = true
      addLog(`【节气】${evt.greeting}`, 'festival')
    }
  }

  function completeSeasonalEvent() {
    if (!activeSeasonalEvent.value) return

    const evt = activeSeasonalEvent.value
    evt.completed = true
    completedSeasonalEvents.value.push(evt.id)

    // 发放奖励
    evt.rewards.forEach(r => applyEffect(r))

    activeSeasonalEvent.value = null
    showSeasonalDialog.value = false
    // 不再调用 advanceTime()，避免季节事件完成后双重推进时间
  }

  function skipSeasonalEvent() {
    activeSeasonalEvent.value = null
    showSeasonalDialog.value = false
  }

  // ========== 小游戏 ==========
  function challengeNPC(npcId: string, gameType: 'gomoku') {
    miniGameSession.value = {
      active: true,
      gameType,
      opponentNpcId: npcId,
      gomoku: null,
    }
    addLog(`向${getNPCName(npcId)}发起对弈邀请。`, 'action')
  }

  function endMiniGame() {
    miniGameSession.value = {
      active: false,
      gameType: null,
      opponentNpcId: null,
      gomoku: null,
    }
  }

  // ========== 加工坊 ==========
  function advanceProcessing() {
    processingState.value.slots.forEach(slot => {
      if (slot.status !== 'processing' || !slot.recipeId) return
      const recipe = processingRecipes.find(r => r.id === slot.recipeId)
      if (!recipe) return
      const elapsed = totalDays.value - slot.startDay
      slot.progress = Math.min(100, Math.round((elapsed / recipe.processDays) * 100))
      if (slot.progress >= 100) {
        slot.status = 'done'
        addLog(`【${recipe.outputName}】加工完成！`, 'action')
      }
    })
  }

  function startProcessing(slotId: number, recipeId: string): boolean {
    const recipe = processingRecipes.find(r => r.id === recipeId)
    if (!recipe) return false

    // 检查原料
    const invItem = player.value.inventory.find(i => i.itemId === recipe.inputItemId)
    if (!invItem || invItem.quantity < recipe.inputQuantity) {
      addLog(`原料不足，需要${recipe.inputQuantity}个${invItem?.name || recipe.inputItemId}。`, 'action')
      return false
    }

    // 检查体力
    if (player.value.stamina < recipe.staminaCost) {
      addLog(`体力不足，需要${recipe.staminaCost}点体力。`, 'action')
      return false
    }

    // 检查槽位
    const slot = processingState.value.slots.find(s => s.id === slotId)
    if (!slot || slot.status !== 'idle') return false

    // 扣原料
    invItem.quantity -= recipe.inputQuantity
    if (invItem.quantity <= 0) {
      player.value.inventory = player.value.inventory.filter(i => i.itemId !== recipe.inputItemId)
    }

    // 扣体力
    player.value.stamina -= recipe.staminaCost

    // 启动加工
    slot.status = 'processing'
    slot.recipeId = recipeId
    slot.startDay = totalDays.value
    slot.progress = 0

    addLog(`开始加工【${recipe.name}】，预计${recipe.processDays}天后完成。`, 'action')
    return true
  }

  function claimProcessed(slotId: number): boolean {
    const slot = processingState.value.slots.find(s => s.id === slotId)
    if (!slot || slot.status !== 'done' || !slot.recipeId) return false

    const recipe = processingRecipes.find(r => r.id === slot.recipeId)
    if (!recipe) return false

    // 添加成品到背包
    const existing = player.value.inventory.find(i => i.itemId === recipe!.outputItemId)
    if (existing) {
      existing.quantity += recipe!.outputQuantity
    } else {
      player.value.inventory.push({
        itemId: recipe!.outputItemId,
        name: recipe!.outputName,
        type: 'processed',
        quantity: recipe!.outputQuantity,
        description: recipe!.description,
        icon: recipe!.outputIcon,
      })
    }

    // 重置槽位
    slot.status = 'idle'
    slot.recipeId = null
    slot.startDay = 0
    slot.progress = 0

    addLog(`领取了【${recipe!.outputName}】×${recipe!.outputQuantity}！`, 'action')
    return true
  }

  function upgradeProcessingSlot(): boolean {
    const MAX_SLOTS = 3
    const costs = [0, 200, 500] // 第2/3个槽位的价格
    const currentCount = processingState.value.maxSlots
    if (currentCount >= MAX_SLOTS) return false

    const cost = costs[currentCount]
    if (player.value.gold < cost) {
      addLog(`铜钱不足，升级加工槽位需要${cost}文。`, 'action')
      return false
    }

    player.value.gold -= cost
    const newId = processingState.value.slots.length
    processingState.value.slots.push({
      id: newId,
      status: 'idle',
      recipeId: null,
      startDay: 0,
      progress: 0,
    })
    processingState.value.maxSlots += 1
    addLog(`加工槽位已升级至${processingState.value.maxSlots}个！花费${cost}文铜钱。`, 'action')
    return true
  }

  function checkRecipeUnlocks() {
    processingRecipes.forEach(recipe => {
      if (processingState.value.unlockedRecipes.includes(recipe.id)) return
      if (player.value.farmLevel < recipe.minFarmLevel) return
      if (recipe.unlockCondition) {
        const match = recipe.unlockCondition.match(/(.+)好感\s*[≥>=]\s*(\d+)/)
        if (match) {
          const npcName = match[1]
          const threshold = parseInt(match[2])
          const npc = npcs.value.find(n => n.name === npcName)
          if (!npc || npc.affection < threshold) return
        }
      }
      processingState.value.unlockedRecipes.push(recipe.id)
      addLog(`解锁了新的加工配方：【${recipe.name}】！`, 'system')
    })
  }

  function getNPCName(id: string): string {
    return npcs.value.find(n => n.id === id)?.name || id
  }

  // ---- 日志 ----
  function addLog(msg: string, type: string = 'action') {
    log.value.unshift({
      day: totalDays.value,
      timeOfDay: date.value.timeOfDay,
      type,
      message: msg
    })
  }

  // ---- 新游戏 ----
  function newGame() {
    phase.value = 'playing'
    totalDays.value = 1
    currentNode.value = 'prologue_start'
    dialogueHistory.value = []
    log.value = []
    flags.value = {}
    completedSeasonalEvents.value = []
    player.value = {
      name: '书生',
      gold: 100,
      stamina: 80,
      maxStamina: 100,
      fame: 0,
      farmLevel: 1,
      skills: [],
      inventory: [],
      chamberRole: 'none',
      businessReputation: 0,
      marketShare: 5,
      allianceIds: []
    }
    date.value = { year: 7, month: 3, day: 1, season: '春', timeOfDay: '清晨', weather: '晴' }
    farmLands.value = Array.from({ length: 3 }, (_, i) => ({
      id: i, crop: null, plantedDay: 0, watered: false, fertilized: false, quality: 50, ready: false
    }))
    npcs.value = JSON.parse(JSON.stringify(initialNPCs))
    market.value = crops.map(c => ({
      cropId: c.id, price: c.baseSellPrice, trend: 'stable' as const, demand: 'normal' as const
    }))
    // 加工品市场价
    const processedMarketEntries = [
      { id: 'flour', base: 38 }, { id: 'polished_rice', base: 49 },
      { id: 'pickled_cabbage', base: 27 }, { id: 'refined_tea', base: 200 },
      { id: 'tea_brick', base: 240 }, { id: 'ginseng_slices', base: 400 },
      { id: 'herbal_ointment', base: 44 }, { id: 'cotton_cloth', base: 48 },
      { id: 'grape_wine', base: 270 }, { id: 'raisins', base: 68 },
    ]
    processedMarketEntries.forEach(p => {
      market.value.push({
        cropId: p.id, price: p.base, trend: 'stable' as const, demand: 'normal' as const
      })
    })
    competitors.value = JSON.parse(JSON.stringify(initialCompetitors))
    chamberVotes.value = []
    priceWar.value = null
    cargoEvents.value = []
    hostileActions.value = []
    activeSeasonalEvent.value = null
    showSeasonalDialog.value = false

    player.value.inventory.push({
      itemId: 'wheat_seed', name: '小麦种子', type: 'seed', quantity: 5,
      description: '老陈给的种子', icon: '🌰'
    })

    goToNode('prologue_start')
  }

  // ---- 存档系统 ----
  const SAVE_KEY_PREFIX = 'guiyuan_save_'

  interface SaveData {
    version: number
    timestamp: number
    slotName: string
    phase: 'title' | 'playing' | 'paused'
    totalDays: number
    currentNode: string
    currentChapter: string
    dialogueHistory: { speaker: string; content: string }[]
    flags: Record<string, boolean>
    log: { day: number; timeOfDay: TimeOfDay; type: string; message: string }[]
    date: GameDate
    player: Player
    farmLands: FarmLand[]
    npcs: NPC[]
    market: MarketPrice[]
    competitors: Competitor[]
    chamberVotes: ChamberVote[]
    priceWar: PriceWar | null
    cargoEvents: CargoEvent[]
    hostileActions: HostileAction[]
    completedSeasonalEvents: string[]
    processingState: ProcessingState
  }

  function getSaveData(): SaveData {
    return {
      version: 1,
      timestamp: Date.now(),
      slotName: '',
      phase: phase.value,
      totalDays: totalDays.value,
      currentNode: currentNode.value,
      currentChapter: currentChapter.value,
      dialogueHistory: JSON.parse(JSON.stringify(dialogueHistory.value)),
      flags: JSON.parse(JSON.stringify(flags.value)),
      log: JSON.parse(JSON.stringify(log.value)),
      date: JSON.parse(JSON.stringify(date.value)),
      player: JSON.parse(JSON.stringify(player.value)),
      farmLands: JSON.parse(JSON.stringify(farmLands.value)),
      npcs: JSON.parse(JSON.stringify(npcs.value)),
      market: JSON.parse(JSON.stringify(market.value)),
      competitors: JSON.parse(JSON.stringify(competitors.value)),
      chamberVotes: JSON.parse(JSON.stringify(chamberVotes.value)),
      priceWar: priceWar.value ? JSON.parse(JSON.stringify(priceWar.value)) : null,
      cargoEvents: JSON.parse(JSON.stringify(cargoEvents.value)),
      hostileActions: JSON.parse(JSON.stringify(hostileActions.value)),
      completedSeasonalEvents: JSON.parse(JSON.stringify(completedSeasonalEvents.value)),
      processingState: JSON.parse(JSON.stringify(processingState.value)),
    }
  }

  function saveGame(slot: number, slotName?: string): boolean {
    try {
      const data = getSaveData()
      data.slotName = slotName || `存档 ${slot}`
      const key = `${SAVE_KEY_PREFIX}${slot}`
      localStorage.setItem(key, JSON.stringify(data))
      addLog(`游戏已保存到槽位 ${slot}。`, 'system')
      return true
    } catch (e) {
      console.error('存档失败:', e)
      addLog('存档失败，请检查浏览器存储空间。', 'system')
      return false
    }
  }

  function loadSaveData(slot: number): SaveData | null {
    try {
      const key = `${SAVE_KEY_PREFIX}${slot}`
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw) as SaveData
    } catch {
      return null
    }
  }

  function loadGame(slot: number): boolean {
    const data = loadSaveData(slot)
    if (!data) {
      addLog(`存档槽位 ${slot} 为空。`, 'system')
      return false
    }

    phase.value = data.phase
    totalDays.value = data.totalDays
    currentNode.value = data.currentNode
    currentChapter.value = data.currentChapter
    dialogueHistory.value = data.dialogueHistory
    flags.value = data.flags
    log.value = data.log
    date.value = data.date
    player.value = data.player
    farmLands.value = data.farmLands
    npcs.value = data.npcs
    market.value = data.market
    competitors.value = data.competitors
    chamberVotes.value = data.chamberVotes
    priceWar.value = data.priceWar
    cargoEvents.value = data.cargoEvents
    hostileActions.value = data.hostileActions
    completedSeasonalEvents.value = data.completedSeasonalEvents
    activeSeasonalEvent.value = null
    showSeasonalDialog.value = false
    if (data.processingState) processingState.value = data.processingState

    addLog(`已从槽位 ${slot} 读取存档。`, 'system')
    return true
  }

  function deleteSave(slot: number): boolean {
    try {
      const key = `${SAVE_KEY_PREFIX}${slot}`
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }

  function getAllSaves(): { slot: number; name: string; timestamp: number; day: number }[] {
    const saves: { slot: number; name: string; timestamp: number; day: number }[] = []
    for (let i = 1; i <= 3; i++) {
      const data = loadSaveData(i)
      if (data) {
        saves.push({
          slot: i,
          name: data.slotName,
          timestamp: data.timestamp,
          day: data.totalDays
        })
      }
    }
    return saves
  }

  return {
    // state
    phase, totalDays, currentNode, currentChapter,
    dialogueHistory, flags, log, date, player,
    farmLands, npcs, market, competitors,
    chamberVotes, priceWar, cargoEvents, hostileActions,
    activeSeasonalEvent, showSeasonalDialog, completedSeasonalEvents,
    miniGameSession,
    processingState,
    // computed
    currentStoryNode, seasonName, timeOfDayName, weatherName,
    npcsInVillage, plantedLands, activeChamberVote, activePriceWar,
    pendingCargoEvents,
    // actions
    advanceTime, plantCrop, harvestCrop, expandLand, sellItem, buySeed,
    talkToNPC, giveGift, goToNode, newGame, addLog, applyEffect,
    // save
    saveGame, loadGame, deleteSave, getAllSaves,
    // business
    initiateChamberVote, castVote, resolveChamberVote,
    startPriceWar, endPriceWar,
    triggerCargoIntercept, resolveCargoIntercept,
    advanceBusinessWar,
    // seasonal
    checkSeasonalEvent, completeSeasonalEvent, skipSeasonalEvent,
    // mini-game
    challengeNPC, endMiniGame,
    // processing
    startProcessing, claimProcessed, upgradeProcessingSlot,
  }
})

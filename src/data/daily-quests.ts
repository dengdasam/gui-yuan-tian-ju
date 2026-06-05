import type { DailyQuest } from '../types'

/**
 * 每日任务池 — 在 advanceTime 中每日随机抽取 3 个
 * 完成任务获得铜钱 + 额外奖励
 */
export const dailyQuestPool: Omit<DailyQuest, 'currentProgress' | 'completed' | 'claimed'>[] = [
  // ============ 收获类 ============
  {
    id: 'dq_harvest_wheat',
    title: '麦浪滚滚',
    description: '收获一次小麦',
    flavorText: '老陈念叨着：今年面粉该涨价了，多存点麦子准没错。',
    type: 'harvest',
    targetId: 'wheat',
    targetQuantity: 1,
    reward: { type: 'gold', value: 25 },
    rewardGold: 25,
  },
  {
    id: 'dq_harvest_rice',
    title: '稻花香里',
    description: '收获一次水稻',
    flavorText: '云娘说村里的米快用完了，药膳需要上好的新米。',
    type: 'harvest',
    targetId: 'rice',
    targetQuantity: 1,
    reward: { type: 'gold', value: 25 },
    rewardGold: 25,
  },
  {
    id: 'dq_harvest_tea',
    title: '采茶时节',
    description: '收获一次茶叶',
    flavorText: '李明说京城那边催得紧，今年的春茶供不应求。',
    type: 'harvest',
    targetId: 'tea',
    targetQuantity: 1,
    reward: { type: 'gold', value: 30 },
    rewardGold: 30,
  },
  {
    id: 'dq_harvest_ginseng',
    title: '寻参记',
    description: '收获一次人参',
    flavorText: '云娘接了一个疑难病人，急需上好人参入药。',
    type: 'harvest',
    targetId: 'ginseng',
    targetQuantity: 1,
    reward: { type: 'gold', value: 40 },
    rewardGold: 40,
  },

  // ============ 交谈类 ============
  {
    id: 'dq_talk_laochen',
    title: '村长的故事',
    description: '与老陈交谈一次',
    flavorText: '老陈今天心情不错，坐在茶馆门口晒太阳——正是听他讲故事的好时候。',
    type: 'talk',
    targetId: 'laochen',
    targetQuantity: 1,
    reward: { type: 'affection', value: 5 },
    rewardGold: 15,
  },
  {
    id: 'dq_talk_yunniang',
    title: '药铺问诊',
    description: '与云娘交谈一次',
    flavorText: '云娘托人带话，说新到了一批药材想让你帮忙看看品相。',
    type: 'talk',
    targetId: 'yunniang',
    targetQuantity: 1,
    reward: { type: 'affection', value: 5 },
    rewardGold: 15,
  },
  {
    id: 'dq_talk_xiaohe',
    title: '小荷的功课',
    description: '与小荷交谈一次',
    flavorText: '小荷捧着课本在田边等你——她有好多问题要问你。',
    type: 'talk',
    targetId: 'xiaohe',
    targetQuantity: 1,
    reward: { type: 'affection', value: 5 },
    rewardGold: 15,
  },

  // ============ 交付类 ============
  {
    id: 'dq_deliver_cabbage',
    title: '食堂供菜',
    description: '出售 3 个白菜',
    flavorText: '村里办喜事，张婶临时接了个大单——需要大量白菜。',
    type: 'deliver',
    targetId: 'cabbage',
    targetQuantity: 3,
    reward: { type: 'gold', value: 20 },
    rewardGold: 35,
  },
  {
    id: 'dq_deliver_potato',
    title: '屯粮过冬',
    description: '出售 2 个土豆',
    flavorText: '马刀头要押一趟长镖，想在村里采购些耐放的干粮。',
    type: 'deliver',
    targetId: 'potato',
    targetQuantity: 2,
    reward: { type: 'gold', value: 20 },
    rewardGold: 30,
  },

  // ============ 消费类 ============
  {
    id: 'dq_spend_market',
    title: '集市采买',
    description: '在商店消费 50 文',
    flavorText: '村里杂货铺进了新货，老板娘说今天有特价。',
    type: 'spend',
    targetId: 'shop',
    targetQuantity: 50,
    reward: { type: 'gold', value: 15 },
    rewardGold: 15,
  },

  // ============ 加工类 ============
  {
    id: 'dq_craft_flour',
    title: '磨坊开工',
    description: '在加工坊加工一次（任意配方）',
    flavorText: '村口的石磨闲了好几天，老陈说你该多利用加工坊。',
    type: 'craft',
    targetId: 'any_processing',
    targetQuantity: 1,
    reward: { type: 'gold', value: 20 },
    rewardGold: 20,
  },
]

/**
 * 每日随机抽取 3 个不重复任务
 */
export function generateDailyQuests(existingIds: string[] = []): DailyQuest[] {
  const available = dailyQuestPool.filter(q => !existingIds.includes(q.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map(q => ({
    ...q,
    currentProgress: 0,
    completed: false,
    claimed: false,
  }))
}

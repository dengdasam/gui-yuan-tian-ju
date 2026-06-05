import type { QuestJournalEntry } from '../types'

/**
 * 「桃源盛典」— 跨 NPC 史诗任务链
 *
 * 触发条件：章节 ≥ 第二章、老陈好感 ≥ 50、云娘好感 ≥ 40
 * 5个阶段，涉及老陈/云娘/李明/马刀头/张四方
 *
 * 故事线：老陈提出举办桃源村第一届"春茶市集"，
 * 联合全村力量打造终南山最大的春季集市，吸引各地商贾和文人雅士。
 */
export const EPIC_QUEST_TEMPLATE: Omit<QuestJournalEntry, 'acceptedDay'> = {
  questId: 'epic_taoyuan_festival',
  title: '桃源盛典',
  description: '老陈提议举办桃源村第一届春茶市集——联合全村之力，打造终南山最大的春季盛会。',
  category: 'epic',
  stage: 0,
  maxStage: 5,
  progress: '未开始',
  progressPercent: 0,
  completed: false,
  reward: '特殊称号「桃源之主」、声望+25、解锁"年度市集"永久功能（每年春季自动举办，额外收入）',
  stages: [
    { stage: 1, title: '联合村中', done: false },
    { stage: 2, title: '筹备物资', done: false },
    { stage: 3, title: '打通商路', done: false },
    { stage: 4, title: '盛典开幕', done: false },
    { stage: 5, title: '桃源流芳', done: false },
  ],
}

/**
 * 史诗任务阶段定义 — 每个阶段需要玩家主动完成特定条件
 */
export const EPIC_QUEST_STAGES = [
  {
    stage: 1,
    title: '联合村中',
    goal: '与老陈、云娘、李明都交谈一次（说服他们参与市集）',
    requirement: {
      npcTalks: ['laochen', 'yunniang', 'liming'],
    },
    dialogueOnAccept: [
      { speaker: '老陈', content: '书生啊，我想了很久——桃源村不能只靠种地。我们有好茶、好药、好人，该让山外的人知道。', emotion: 'neutral' },
      { speaker: '老陈', content: '我打算办一届"春茶市集"。把附近的商贩、文人、茶客都请来。但光靠我一个人不成的……', emotion: 'neutral' },
      { speaker: '', content: '老陈，我来帮你。我们分头去说服云娘和李明——药和茶，是市集的两大支柱。', emotion: 'neutral' },
      { speaker: '老陈', content: '（拍大腿）好！我就知道你小子靠得住。去跟云娘、李明说说，看看他们愿不愿意出把力。', emotion: 'happy' },
    ],
    onCompleteEffects: [
      { type: 'affection', target: 'laochen', value: 10 },
      { type: 'fame', value: 5 },
    ],
  },
  {
    stage: 2,
    title: '筹备物资',
    goal: '储备：10个茶叶 + 5个药材（人参或草药） + 100文资金',
    requirement: {
      items: { tea: 10, ginseng: 5 },
      gold: 100,
    },
    dialogueOnAccept: [
      { speaker: '云娘', content: '市集的主意不错。我可以准备一批药膏和草药包——不过需要足够的药材。', emotion: 'neutral' },
      { speaker: '李明', content: '茶叶我这边能出五斤，但还不够。你得多种些茶，另外我那份古法炒茶也得备上。', emotion: 'neutral' },
      { speaker: '', content: '明白了——种茶、采药、筹钱。我这就去准备。', emotion: 'neutral' },
    ],
    onCompleteEffects: [
      { type: 'affection', target: 'yunniang', value: 10 },
      { type: 'affection', target: 'liming', value: 10 },
      { type: 'business_rep', value: 5 },
    ],
  },
  {
    stage: 3,
    title: '打通商路',
    goal: '与马刀头交谈，委托威远镖局护送市集货物；在商会发起一次投票（确保商路畅通）',
    requirement: {
      npcTalks: ['madaotou'],
      chamberVote: true,
    },
    dialogueOnAccept: [
      { speaker: '马刀头', content: '什么？春茶市集？哈哈——这趟镖我接了！从襄州到京城，沿途的商贾我都熟，帮你把请帖送出去。', emotion: 'happy' },
      { speaker: '', content: '不过商会那边得通过——王员外的人可能找麻烦。', emotion: 'neutral' },
      { speaker: '马刀头', content: '怕什么！把老陈和云娘拉到商会投票，咱们人多。再说——王员外还欠着你的救命之恩呢。', emotion: 'neutral' },
    ],
    onCompleteEffects: [
      { type: 'affection', target: 'madaotou', value: 15 },
      { type: 'business_rep', value: 10 },
    ],
  },
  {
    stage: 4,
    title: '盛典开幕',
    goal: '市集开幕日！自动触发剧情（需要在4阶段达成后次日自动触发）',
    requirement: {},
    dialogueOnAccept: [
      { speaker: '旁白', content: '春茶市集开幕了。终南山下从未如此热闹——来自三州十六县的商贾、文人、茶客挤满了桃源村的打谷场。', emotion: 'neutral' },
      { speaker: '老陈', content: '（穿上了压箱底的新长衫，站在台上）欢迎各位来到桃源村第一届春茶市集！', emotion: 'happy' },
      { speaker: '旁白', content: '云娘的药铺前排起了长队，李明的茗香茶庄一天卖出了半年的量，马刀头的镖局揽到了五笔新生意。', emotion: 'neutral' },
      { speaker: '王员外', content: '（低声）小子……你这市集办得不错。以后每年都办吧，我帮你联系襄州商会的渠道。', emotion: 'neutral' },
      { speaker: '', content: '（独白）从流放至此的落魄书生，到如今张罗百人盛会。桃源村——已经不只是一个落脚的地方了。', emotion: 'happy' },
    ],
    onCompleteEffects: [
      { type: 'fame', value: 15 },
      { type: 'gold', value: 200 },
      { type: 'affection', target: 'laochen', value: 15 },
      { type: 'affection', target: 'yunniang', value: 10 },
      { type: 'business_rep', value: 15 },
    ],
  },
  {
    stage: 5,
    title: '桃源流芳',
    goal: '市集圆满结束，桃源村声名远播。',
    requirement: {},
    dialogueOnAccept: [
      { speaker: '旁白', content: '春茶市集结束后，桃源村的名字传遍了终南山南北。有文人专程跑来，只为喝一杯"终南春露"；有药商远道而来，只为买云娘亲手调制的药膏。', emotion: 'neutral' },
      { speaker: '老陈', content: '（看着人来人往的村口）我这辈子做过最对的事——就是收留了你这个书生。', emotion: 'happy' },
      { speaker: '', content: '老陈，不是我改变了桃源村——是桃源村收留了我。', emotion: 'neutral' },
      { speaker: '旁白', content: '【桃源盛典·完】从今往后，每年春季桃源村都会举办春茶市集。这一传统，将在此后的数百年间代代相传。', emotion: 'neutral' },
    ],
    onCompleteEffects: [
      { type: 'fame', value: 25 },
      { type: 'gold', value: 300 },
      { type: 'business_rep', value: 20 },
      { type: 'market_share', value: 10 },
    ],
  },
]

/**
 * 获取史诗任务某阶段的对话
 */
export function getEpicStageDialogue(stage: number) {
  const s = EPIC_QUEST_STAGES.find(s => s.stage === stage)
  return s?.dialogueOnAccept || []
}

/**
 * 获取史诗任务某阶段的完成效果
 */
export function getEpicStageEffects(stage: number) {
  const s = EPIC_QUEST_STAGES.find(s => s.stage === stage)
  return s?.onCompleteEffects || []
}

/**
 * 获取史诗任务某阶段的目标描述
 */
export function getEpicStageGoal(stage: number): string {
  const s = EPIC_QUEST_STAGES.find(s => s.stage === stage)
  return s?.goal || ''
}

/**
 * 获取史诗任务某阶段的需求
 */
export function getEpicStageRequirement(stage: number) {
  const s = EPIC_QUEST_STAGES.find(s => s.stage === stage)
  return s?.requirement || {}
}

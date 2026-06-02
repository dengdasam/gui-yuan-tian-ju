import type { NPC } from '../types'

export const npcs: NPC[] = [
  {
    id: 'yunniang',
    name: '云娘',
    title: '药铺掌柜',
    role: '村民',
    description: '终南山下唯一的药铺掌柜，年约三十，医术精湛，为人温和。独居在村东头，种着一片药圃。据说她曾是京城名医之女，因故隐居于桃源村。',
    affection: 30,
    met: false,
    questCompleted: [],
    dailyDialogues: [
      '今儿天不错，适合采药。',
      '你的草药种得如何了？有什么不懂的可以来问我。',
      '最近村里来了些陌生人，小心些。'
    ],
    specialEvents: [],
    giftPreferences: ['herb_seed', 'tea_seed'],
    icon: '👩‍⚕️',
    sideQuests: [
      {
        id: 'yunniang_past',
        title: '云娘的身世',
        description: '云娘从不提自己的过去。那些紧闭的抽屉里，藏着什么秘密？',
        stage: 0,
        maxStage: 5,
        affectionThreshold: [20, 35, 50, 65, 80],
        completed: false,
        reward: '获得"京城医案"特殊物品，解锁高级药材种植配方',
        stages: [
          {
            stage: 1,
            title: '初识疑云',
            description: '你在帮云娘搬药材时，无意中看到柜子里有一个精美的药匣，上面刻着"太医院"三个字。',
            dialogueLines: [
              { speaker: '旁白', content: '你帮云娘搬药材时，无意中瞥见角落里一个精致的紫檀木药匣。', emotion: 'neutral' },
              { speaker: '', content: '云娘，这个药匣……上面刻的是"太医院"？', emotion: 'surprised' },
              { speaker: '云娘', content: '（迅速收起药匣，神色慌乱）没……没什么。一个旧物而已。', emotion: 'surprised' },
              { speaker: '旁白', content: '云娘匆匆把药匣锁进了柜子。你注意到她的手在微微发抖。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '不再追问，但默默记在心里',
                next: '',
                effects: [
                  { type: 'affection', target: 'yunniang', value: 5 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'yunniang', value: 5 }
            ]
          },
          {
            stage: 2,
            title: '太医院旧事',
            description: '马刀头从京城带来消息：二十年前太医院出了一桩大案——首席御医云鹤年因开错药方被处斩，满门抄斩，唯有一女不知所踪。',
            dialogueLines: [
              { speaker: '马刀头', content: '京城那边有个老案子——二十年前太医院御医云鹤年，说是在太后药里下毒……', emotion: 'neutral' },
              { speaker: '马刀头', content: '不过江湖上都说，他是被冤枉的。真正下手的是当时的院判，为了夺首席之位。', emotion: 'neutral' },
              { speaker: '', content: '云鹤年……云娘……难道她就是当年那个失踪的女儿？', emotion: 'surprised' },
              { speaker: '马刀头', content: '这事你可别到处说。京城那边虽然换了人，但翻案还是大事。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '找个合适的时机，小心地告诉云娘你知道了她的身世',
                next: '',
                effects: [
                  { type: 'affection', target: 'yunniang', value: 10 }
                ]
              },
              {
                text: '先保密，暗中多了解此事',
                next: '',
                effects: [
                  { type: 'affection', target: 'madaotou', value: 5 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'madaotou', value: 10 }
            ]
          },
          {
            stage: 3,
            title: '心结初解',
            description: '一个月圆之夜，云娘独自坐在药圃里，对着父亲的药匣落泪。你轻轻走过去。',
            dialogueLines: [
              { speaker: '云娘', content: '（没有回头）你都知道了？马刀头那张嘴……', emotion: 'sad' },
              { speaker: '', content: '只听说了一些。云娘，二十年前的冤案——你想不想翻？', emotion: 'neutral' },
              { speaker: '云娘', content: '（苦笑）翻？怎么翻？京城太医院，那是通天的衙门。', emotion: 'sad' },
              { speaker: '', content: '一步一步来。先从终南山开始——用你的医术，救一方百姓，让人们记住云家医术才是正道。', emotion: 'neutral' },
              { speaker: '云娘', content: '（抬头看你，眼里有泪光）你这个书生……怎么总有办法让人振作。', emotion: 'surprised' }
            ],
            choices: [
              {
                text: '我们一起来，让桃源村成为云家医术重新发源的地方',
                next: '',
                effects: [
                  { type: 'affection', target: 'yunniang', value: 20 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'yunniang', value: 15 }
            ]
          },
          {
            stage: 4,
            title: '父亲的医案',
            description: '云娘终于打开了父亲留下的医案。里面记录了云鹤年毕生的医术心得和那桩冤案的真相。',
            dialogueLines: [
              { speaker: '云娘', content: '（翻开泛黄的医案）这是我父亲的手迹……他在最后几页写下了那天的真相。', emotion: 'sad' },
              { speaker: '云娘', content: '他没有下毒。相反，他发现太后的药里被人加了东西，正在查——然后就被栽赃了。', emotion: 'angry' },
              { speaker: '', content: '这是证据。虽然晚了二十年，但真相永远不会过期。', emotion: 'neutral' },
              { speaker: '云娘', content: '（握紧医案）你说得对。不是为了翻案——是为了让父亲的医术能传下去。', emotion: 'neutral' },
              { speaker: '云娘', content: '这份医案里有一百多个药方。你懂草药种植，我教你——我们可以把这些药方变成现实。', emotion: 'happy' }
            ],
            choices: [
              {
                text: '接受云娘的传授："我们一起让云家医术发扬光大。"',
                next: '',
                effects: [
                  { type: 'skill', target: 'herb_farming', value: 2 },
                  { type: 'skill', target: 'medicine', value: 1 }
                ]
              }
            ],
            effects: [
              { type: 'skill', target: 'herb_farming', value: 1 },
              { type: 'affection', target: 'yunniang', value: 10 }
            ]
          },
          {
            stage: 5,
            title: '薪火相传',
            description: '云娘决定在桃源村开设义诊堂，免费为十里八乡的穷人看病。你帮她张罗了一切。',
            dialogueLines: [
              { speaker: '旁白', content: '义诊堂开张那天，十里八乡来了上百人。云娘忙了整整一天，却笑容满面。', emotion: 'neutral' },
              { speaker: '云娘', content: '（坐在门槛上，疲惫但开心）我父亲要是看到今天……一定会高兴的。', emotion: 'happy' },
              { speaker: '', content: '云家医术，从终南山重新开始了。', emotion: 'neutral' },
              { speaker: '云娘', content: '（微笑）谢谢你。要不是你这书生多管闲事，我今天大概还是把自己锁在药铺里。', emotion: 'happy' },
              { speaker: '旁白', content: '【云娘的身世·完】云娘解开了心结，云家医术在桃源村生根发芽。', emotion: 'neutral' }
            ],
            effects: [
              { type: 'fame', value: 20 },
              { type: 'affection', target: 'yunniang', value: 20 },
              { type: 'business_rep', value: 10 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'laochen',
    name: '老陈',
    title: '村长',
    role: '村民',
    description: '桃源村的老村长，六十出头，满脸皱纹透着岁月痕迹。年轻时走南闯北，见过大世面，如今安于田园。他是第一个接纳你进村的人。',
    affection: 40,
    met: false,
    questCompleted: [],
    dailyDialogues: [
      '这桃源村啊，看着平静，底下可热闹着呢。',
      '你那份田，好好侍弄，比在外头强。',
      '王员外又派人来收租了，得想个法子。'
    ],
    specialEvents: [],
    giftPreferences: ['tea_seed', 'wheat_seed'],
    icon: '👴',
    sideQuests: []
  },
  {
    id: 'xiaohe',
    name: '小荷',
    title: '村中少女',
    role: '村民',
    description: '十六岁的农家少女，活泼开朗，是村里唯一识字的姑娘。父母早逝，跟着祖母长大。对山外的世界充满好奇，常缠着你讲外面的故事。',
    affection: 20,
    met: false,
    questCompleted: [],
    dailyDialogues: [
      '公子，山外头是什么样的？',
      '我今天又学会了十个字！',
      '云娘说我可以去药铺帮忙了，好开心！'
    ],
    specialEvents: [],
    giftPreferences: ['grape_seed', 'cotton_seed'],
    icon: '👧',
    sideQuests: [
      {
        id: 'xiaohe_study',
        title: '小荷的求学路',
        description: '小荷天资聪颖，但桃源村没有学堂。她想学更多的东西，你能帮她吗？',
        stage: 0,
        maxStage: 5,
        affectionThreshold: [15, 30, 45, 60, 80],
        completed: false,
        reward: '小荷成长为村里的"女先生"，解锁特殊助手（帮忙管理账目）',
        stages: [
          {
            stage: 1,
            title: '求学的渴望',
            description: '小荷在田埂上找到了你，拿着一本破旧的三字经，问了你很多问题。',
            dialogueLines: [
              { speaker: '小荷', content: '公子公子！这个字念什么？"人之初，性本善"后面是什么？', emotion: 'happy' },
              { speaker: '', content: '后面是"性相近，习相远。"小荷，你想学更多吗？', emotion: 'neutral' },
              { speaker: '小荷', content: '想！可是村里没有先生……祖母说认得名字就够了，女孩子不用读太多书。', emotion: 'sad' },
              { speaker: '', content: '谁说的？我教你。每天来田边一个时辰，我干活你背书。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '从今天开始，你就是我的学生了！',
                next: '',
                effects: [
                  { type: 'affection', target: 'xiaohe', value: 15 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'xiaohe', value: 10 }
            ]
          },
          {
            stage: 2,
            title: '算术之趣',
            description: '小荷学了三字经和千字文后，对算术产生了浓厚兴趣。你发现她在算账方面很有天赋。',
            dialogueLines: [
              { speaker: '小荷', content: '公子你看！我算出来了——三亩田种小麦，每亩收三百斤，市价十五文，能卖多少？一万三千五百文！', emotion: 'happy' },
              { speaker: '', content: '（惊讶）你这算得比我还快。小荷，你是个算术天才！', emotion: 'surprised' },
              { speaker: '小荷', content: '真的吗？那我能帮你算商会的账吗？我听说王员外的人总在账目上动手脚。', emotion: 'neutral' },
              { speaker: '', content: '（大笑）行啊！等你学会了珠算，你就是我们商会的账房先生。', emotion: 'happy' }
            ],
            choices: [
              {
                text: '把算盘送给小荷，正式教她珠算',
                next: '',
                effects: [
                  { type: 'affection', target: 'xiaohe', value: 15 },
                  { type: 'gold', value: -30 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'xiaohe', value: 10 }
            ]
          },
          {
            stage: 3,
            title: '学医入门',
            description: '小荷跟云娘学医，天赋惊人，两个月就认全了三百种药材。',
            dialogueLines: [
              { speaker: '云娘', content: '小荷这孩子……我教什么她学什么。上个月教她切脉，她现在已经能分辨八种脉象了。', emotion: 'surprised' },
              { speaker: '小荷', content: '我想以后当大夫！给村里人看病，不用跑几十里路去镇上。', emotion: 'happy' },
              { speaker: '', content: '好啊。云娘是名医之后，你跟她学，将来一定能成。', emotion: 'neutral' },
              { speaker: '小荷', content: '可是我祖母说要给我许人家了……她说不读书了。', emotion: 'sad' }
            ],
            choices: [
              {
                text: '去找小荷的祖母谈谈："小荷是百里挑一的好苗子，别耽误了她。"',
                next: '',
                effects: [
                  { type: 'affection', target: 'xiaohe', value: 15 },
                  { type: 'fame', value: 3 }
                ]
              },
              {
                text: '让小荷自己跟祖母说，鼓励她勇敢表达',
                next: '',
                effects: [
                  { type: 'affection', target: 'xiaohe', value: 10 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'xiaohe', value: 10 },
              { type: 'affection', target: 'yunniang', value: 5 }
            ]
          },
          {
            stage: 4,
            title: '县城考试',
            description: '县城医馆举办学徒考试，你和云娘鼓励小荷去参加。',
            dialogueLines: [
              { speaker: '旁白', content: '小荷第一次走出终南山。她穿着一件新做的蓝布衫，背着云娘送的小药箱，紧张极了。', emotion: 'neutral' },
              { speaker: '小荷', content: '公子……我怕。县城好大，人好多，我怕考不好……', emotion: 'sad' },
              { speaker: '', content: '（拍拍她的肩）怕什么。你是我教出来的，是云娘带出来的。他们考的东西，你都会。', emotion: 'neutral' },
              { speaker: '旁白', content: '考试结束后三天，喜报传来——小荷以第一名的成绩被县医馆录取为学徒！', emotion: 'neutral' },
              { speaker: '小荷', content: '（哭着跑过来）公子！我考上了！全县第一名！祖母同意了，说以后再也不拦我了！', emotion: 'happy' }
            ],
            choices: [
              {
                text: '为小荷感到骄傲，鼓励她在医馆继续努力',
                next: '',
                effects: [
                  { type: 'affection', target: 'xiaohe', value: 20 }
                ]
              }
            ],
            effects: [
              { type: 'affection', target: 'xiaohe', value: 15 },
              { type: 'fame', value: 10 }
            ]
          },
          {
            stage: 5,
            title: '桃源村的女先生',
            description: '小荷学成归来，在桃源村开设了第一间学堂、第一间医馆分堂。',
            dialogueLines: [
              { speaker: '旁白', content: '小荷回来了。她不再是那个只会追着你问"山外头什么样"的小女孩了。', emotion: 'neutral' },
              { speaker: '小荷', content: '（站在新学堂前）公子，我把学堂和医馆都开起来了。上午教书，下午看病。', emotion: 'happy' },
              { speaker: '', content: '（感慨）当年教你认字的时候，我可没想到你能走到这一步。', emotion: 'neutral' },
              { speaker: '小荷', content: '（笑）没有你，我现在应该是个只会洗衣做饭的农家媳妇吧。谢谢你，公子。', emotion: 'happy' },
              { speaker: '旁白', content: '【小荷的求学路·完】小荷成为桃源村第一位女先生兼女大夫。她还能帮你管理商会账目，识别王员外势力的虚假账本。', emotion: 'neutral' }
            ],
            effects: [
              { type: 'fame', value: 20 },
              { type: 'affection', target: 'xiaohe', value: 20 },
              { type: 'business_rep', value: 15 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'wangyuanwai',
    name: '王员外',
    title: '富商',
    role: '商人',
    description: '镇上首富，四十余岁，精明干练。掌控着桃源村及周边几个村落的粮食收购渠道。对桃源村的茶叶觊觎已久，是你商战中最主要的对手。',
    affection: -10,
    met: false,
    questCompleted: [],
    dailyDialogues: [
      '这村里的好茶，总得有人帮他们卖。',
      '年轻人，经商不是种地，要讲手腕。',
      '我的商队遍布三州十六县，你的茶叶只能卖给我。'
    ],
    specialEvents: [],
    giftPreferences: ['ginseng_seed', 'grape_seed'],
    icon: '🎩',
    sideQuests: []
  },
  {
    id: 'madaotou',
    name: '马刀头',
    title: '镖局镖头',
    role: '旅人',
    description: '威远镖局的镖头，五大三粗，豪爽仗义。常年押镖路过桃源村，与老陈是旧相识。消息灵通，知道各州县物价行情。',
    affection: 15,
    met: false,
    questCompleted: [],
    dailyDialogues: [
      '这趟镖走的是丝绸，京城那边价格涨了三成！',
      '王员外那人，你得防着点。',
      '下次路过给你带点江南的种子，那边有好东西。'
    ],
    specialEvents: [],
    giftPreferences: ['rice_seed'],
    icon: '🥷',
    sideQuests: []
  },
  {
    id: 'liming',
    name: '李明',
    title: '同行茶商',
    role: '商人',
    description: '县城来的年轻茶商，家境殷实，为人诚恳。也想在桃源村发展茶叶生意，但不敢与王员外正面竞争。可以成为你的盟友——也可能成为另一个对手。',
    affection: 0,
    met: false,
    questCompleted: [],
    dailyDialogues: [
      '桃源村的茶叶品质确实一流，就是销路被垄断了。',
      '你我联手，或许能打破王员外的垄断。',
      '京城有位大主顾对这边的茶叶很感兴趣……'
    ],
    specialEvents: [],
    giftPreferences: ['tea_seed', 'ginseng_seed'],
    icon: '🧑‍💼',
    sideQuests: []
  }
]

export function getNPCById(id: string): NPC | undefined {
  return npcs.find(n => n.id === id)
}

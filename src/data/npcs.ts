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
    sideQuests: [
      {
        id: 'laochen_legacy',
        title: '老陈的心愿',
        description: '老陈年纪大了，他一直想在退休前为村子做最后一件事。',
        stage: 0,
        maxStage: 3,
        affectionThreshold: [30, 50, 70],
        completed: false,
        reward: '桃源村茶馆建成，解锁"品茶会"特殊功能',
        stages: [
          {
            stage: 1,
            title: '村长的担忧',
            description: '老陈找到你，叹了口气——村里的年轻人都往城里跑，他担心桃源村会渐渐空了。',
            dialogueLines: [
              { speaker: '老陈', content: '书生啊，你看这些年轻人，一个个都说要去襄州城打工。村里的田谁来种？', emotion: 'sad' },
              { speaker: '', content: '老陈，只要村子有发展，年轻人会回来的。', emotion: 'neutral' },
              { speaker: '老陈', content: '发展？怎么发展？我这把年纪了，还能做什么？', emotion: 'neutral' },
              { speaker: '', content: '您不用做什么——您只要给我们讲讲以前的故事就好。桃源村的历史，就是最好的招牌。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '请老陈讲桃源村的历史故事',
                next: '',
                effects: [{ type: 'affection', target: 'laochen', value: 10 }]
              }
            ],
            effects: [{ type: 'affection', target: 'laochen', value: 5 }]
          },
          {
            stage: 2,
            title: '桃源往事',
            description: '老陈翻出一本泛黄的村志，给你讲了桃源村的来历——原来这里曾是前朝遗民隐居之地。',
            dialogueLines: [
              { speaker: '老陈', content: '这上面记着呢——前朝末年，一群不愿意降的工匠逃到了这里。', emotion: 'neutral' },
              { speaker: '老陈', content: '他们带来了制茶的手艺、酿酒的秘方。后来人慢慢散了，手艺也失传了大半。', emotion: 'sad' },
              { speaker: '', content: '老陈，这就是我们要找的东西！古法茶艺——桃源村的独门绝技！', emotion: 'happy' },
              { speaker: '老陈', content: '你是说……靠这个吸引人来？', emotion: 'surprised' }
            ],
            choices: [
              {
                text: '我们建一个茶馆，专做古法茶！',
                next: '',
                effects: [{ type: 'affection', target: 'laochen', value: 15 }, { type: 'business_rep', value: 5 }]
              }
            ],
            effects: [{ type: 'affection', target: 'laochen', value: 10 }, { type: 'skill', target: 'tea_history', value: 1 }]
          },
          {
            stage: 3,
            title: '桃源茶馆',
            description: '在村口建起了一座古色古香的茶馆，老陈每天坐在门口泡茶讲古。',
            dialogueLines: [
              { speaker: '旁白', content: '桃源茶馆开张了。老陈坐在门口，给来往的茶客讲桃源村的故事。', emotion: 'neutral' },
              { speaker: '老陈', content: '这帮年轻人，听我讲故事听得都不想走了。还有两个从襄州来的，说要留下来学制茶！', emotion: 'happy' },
              { speaker: '', content: '你看，村子不会空的。', emotion: 'neutral' },
              { speaker: '老陈', content: '我这辈子总算给村里留下了点什么。谢谢你，书生。', emotion: 'happy' }
            ],
            effects: [
              { type: 'fame', value: 15 }, { type: 'affection', target: 'laochen', value: 20 },
              { type: 'business_rep', value: 10 }, { type: 'market_share', value: 5 }
            ]
          }
        ]
      }
    ]
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
    sideQuests: [
      {
        id: 'wang_redemption',
        title: '王员外的转变',
        description: '如果能化解与王员外的恩怨，他会成为一个强大的盟友。',
        stage: 0,
        maxStage: 3,
        affectionThreshold: [30, 50, 70],
        completed: false,
        reward: '王员外成为盟友，解锁特殊商路和价格保护',
        stages: [
          {
            stage: 1,
            title: '意外的善举',
            description: '王员外病倒了，他的管家偷偷来找云娘。你得知后，主动帮忙。',
            dialogueLines: [
              { speaker: '旁白', content: '王员外的管家慌慌张张跑到药铺——王员外病重，镇上的大夫都请遍了，没人治得好。', emotion: 'neutral' },
              { speaker: '云娘', content: '是积劳成疾加上肝火旺盛。我能治，但他得静养一个月。', emotion: 'neutral' },
              { speaker: '', content: '（沉思）云娘，你去给他看看吧。虽然我们是对手，但人命关天。', emotion: 'neutral' },
              { speaker: '云娘', content: '（意外）你倒大度。行，我去。', emotion: 'surprised' }
            ],
            choices: [
              {
                text: '让云娘全力医治王员外',
                next: '',
                effects: [{ type: 'affection', target: 'wangyuanwai', value: 20 }, { type: 'affection', target: 'yunniang', value: 5 }]
              }
            ],
            effects: [{ type: 'affection', target: 'wangyuanwai', value: 10 }]
          },
          {
            stage: 2,
            title: '病榻上的对话',
            description: '王员外病好后，主动来找你。他看起来憔悴了很多。',
            dialogueLines: [
              { speaker: '王员外', content: '（神色疲惫）听说……是你让云娘来救我的。', emotion: 'neutral' },
              { speaker: '', content: '生意归生意，人命归人命。', emotion: 'neutral' },
              { speaker: '王员外', content: '（苦笑）我做了二十年生意，从没人这么对我。你知道吗，当年你叔父——也是这么对我的。', emotion: 'sad' },
              { speaker: '王员外', content: '他是我最好的朋友，直到那次商会上我出卖了他……我这些年不是恨你，是恨我自己。', emotion: 'sad' }
            ],
            choices: [
              {
                text: '过去的就过去了。我们可以重新开始。',
                next: '',
                effects: [{ type: 'affection', target: 'wangyuanwai', value: 25 }]
              }
            ],
            effects: [{ type: 'affection', target: 'wangyuanwai', value: 15 }]
          },
          {
            stage: 3,
            title: '化敌为友',
            description: '王员外正式退出垄断，把他的商路资源分享给你。曾经的对手，变成了忘年交。',
            dialogueLines: [
              { speaker: '王员外', content: '（拿出一叠地契和商路图）这些都是我这些年攒下的。你拿着，比我拿着有用。', emotion: 'neutral' },
              { speaker: '', content: '王员外，这些太贵重了。', emotion: 'surprised' },
              { speaker: '王员外', content: '（摇头）不贵重。我这辈子赚了很多钱，但没有一个真正的朋友。你叔父是一个，你也是。', emotion: 'sad' },
              { speaker: '旁白', content: '【王员外的转变·完】曾经的敌人变成了最可靠的盟友。', emotion: 'neutral' }
            ],
            effects: [
              { type: 'affection', target: 'wangyuanwai', value: 30 }, { type: 'business_rep', value: 20 },
              { type: 'market_share', value: 10 }, { type: 'gold', value: 200 }
            ]
          }
        ]
      }
    ]
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
    sideQuests: [
      {
        id: 'madaotou_escort',
        title: '镖行天下',
        description: '马刀头的威远镖局近来生意惨淡。你能帮他开辟新的商路吗？',
        stage: 0,
        maxStage: 3,
        affectionThreshold: [25, 45, 65],
        completed: false,
        reward: '解锁"快速运货"功能，商路不再被截货',
        stages: [
          {
            stage: 1,
            title: '镖局的困境',
            description: '马刀头在茶棚里闷闷不乐——威远镖局最近被襄州的大镖局抢了不少生意。',
            dialogueLines: [
              { speaker: '马刀头', content: '唉……这碗酒喝着都不香了。襄州那个"四海镖局"，背后有沈万金撑腰，把我们的生意全抢了。', emotion: 'sad' },
              { speaker: '', content: '马大哥，别灰心。你们的优势在于熟悉山路——那些大镖局只走官道。', emotion: 'neutral' },
              { speaker: '马刀头', content: '话是这么说……但没生意就是没生意。兄弟们都快揭不开锅了。', emotion: 'sad' },
              { speaker: '', content: '那正好——我们桃源茶社需要稳定的运力。以后茶叶都交给你们走，按趟结钱。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '与威远镖局签订长期运货协议',
                next: '',
                effects: [{ type: 'affection', target: 'madaotou', value: 15 }, { type: 'gold', value: -50 }]
              }
            ],
            effects: [{ type: 'affection', target: 'madaotou', value: 10 }]
          },
          {
            stage: 2,
            title: '开辟新路线',
            description: '马刀头带着兄弟们探出了三条绕过襄州关卡的山路。',
            dialogueLines: [
              { speaker: '马刀头', content: '（摊开一张羊皮地图）书生你看——这三条路，都是我们兄弟一步步走出来的！', emotion: 'happy' },
              { speaker: '马刀头', content: '第一条走鹰嘴崖，第二条翻翠屏山，第三条沿着溪谷——沈万金的人一条都守不到！', emotion: 'happy' },
              { speaker: '', content: '太好了！有了这些路线，我们的货再也不用看襄州商会的脸色了。', emotion: 'happy' },
              { speaker: '马刀头', content: '不过有件事——走山路骡马损耗大，得添置些新骡子。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '出钱帮镖局添置骡马',
                next: '',
                effects: [{ type: 'affection', target: 'madaotou', value: 15 }, { type: 'gold', value: -80 }]
              }
            ],
            effects: [{ type: 'affection', target: 'madaotou', value: 10 }, { type: 'business_rep', value: 5 }]
          },
          {
            stage: 3,
            title: '威远镖局·重生',
            description: '威远镖局成了终南山一带最可靠的镖局，马刀头意气风发。',
            dialogueLines: [
              { speaker: '马刀头', content: '（哈哈大笑）书生！这个月我们走了十二趟镖，趟趟安全！兄弟们都领了双倍工钱！', emotion: 'happy' },
              { speaker: '', content: '恭喜马大哥。以后我们的茶叶、药材、粮食，都交给你们。', emotion: 'neutral' },
              { speaker: '马刀头', content: '那是自然。谁敢截你的货，就是跟我马某人过不去！', emotion: 'happy' },
              { speaker: '旁白', content: '【镖行天下·完】威远镖局重振雄风，你的货物从此有了最可靠的保障。', emotion: 'neutral' }
            ],
            effects: [
              { type: 'fame', value: 10 }, { type: 'affection', target: 'madaotou', value: 20 },
              { type: 'business_rep', value: 10 }, { type: 'market_share', value: 5 }
            ]
          }
        ]
      }
    ]
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
    sideQuests: [
      {
        id: 'liming_tea_master',
        title: '茶道传承',
        description: '李明一直想恢复父亲留下的"茗香茶庄"的招牌，成为终南山最顶级的茶师。',
        stage: 0,
        maxStage: 3,
        affectionThreshold: [20, 40, 60],
        completed: false,
        reward: '解锁"顶级茶品"制作，茶叶售价提升30%',
        stages: [
          {
            stage: 1,
            title: '父亲的遗愿',
            description: '李明带你去了他家的老茶庄——已经破败，但墙上还挂着"茗香第一"的匾额。',
            dialogueLines: [
              { speaker: '李明', content: '（摸着旧匾额）我父亲在世时，茗香茶庄是终南山下最好的茶庄。', emotion: 'sad' },
              { speaker: '李明', content: '他有一套独门的炒茶手艺——火候、手法、时间，都有讲究。可惜他只传了我一半就走了。', emotion: 'sad' },
              { speaker: '', content: '那另一半呢？', emotion: 'neutral' },
              { speaker: '李明', content: '（苦笑）在他留下的笔记里。但我看不懂——他用的全是暗语。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '我们一起研究笔记，一定要把茗香茶庄的招牌重新立起来',
                next: '',
                effects: [{ type: 'affection', target: 'liming', value: 15 }]
              }
            ],
            effects: [{ type: 'affection', target: 'liming', value: 10 }]
          },
          {
            stage: 2,
            title: '破解茶经',
            description: '你和李明花了一个月时间，结合云娘的药材知识和老陈的村志，终于破解了李父的炒茶秘方。',
            dialogueLines: [
              { speaker: '李明', content: '（兴奋地）原来如此！我父亲把火候用草药的"文火武火"来描述，难怪我看不懂！', emotion: 'happy' },
              { speaker: '云娘', content: '你父亲真是奇才。把茶经和药经结合，前无古人。', emotion: 'surprised' },
              { speaker: '', content: '那现在，让我们试试——用古法炒一批茶。', emotion: 'neutral' },
              { speaker: '旁白', content: '第一锅古法茶出炉时，茶香飘满了整个村子。', emotion: 'neutral' }
            ],
            choices: [
              {
                text: '这茶……和以前完全不一样！',
                next: '',
                effects: [{ type: 'affection', target: 'liming', value: 20 }, { type: 'skill', target: 'tea_mastery', value: 1 }]
              }
            ],
            effects: [{ type: 'affection', target: 'liming', value: 10 }, { type: 'business_rep', value: 10 }]
          },
          {
            stage: 3,
            title: '茗香再现',
            description: '茗香茶庄重新开张，用古法制作的"终南春露"茶一炮而红，京城茶商争相订购。',
            dialogueLines: [
              { speaker: '旁白', content: '茗香茶庄重新开张。李明穿着他父亲当年的长衫，站在门口迎接八方来客。', emotion: 'neutral' },
              { speaker: '李明', content: '（眼眶湿润）父亲，您看到了吗？茗香的招牌又亮起来了。', emotion: 'happy' },
              { speaker: '', content: '（拍拍他的肩）这是你父亲传下来的手艺，也是你自己拼出来的。', emotion: 'neutral' },
              { speaker: '李明', content: '没有你，我一个人做不到。以后茗香茶庄和桃源茶社，永为一家。', emotion: 'happy' }
            ],
            effects: [
              { type: 'fame', value: 20 }, { type: 'affection', target: 'liming', value: 25 },
              { type: 'business_rep', value: 15 }, { type: 'market_share', value: 10 }, { type: 'gold', value: 150 }
            ]
          }
        ]
      }
    ]
  }
]

export function getNPCById(id: string): NPC | undefined {
  return npcs.find(n => n.id === id)
}

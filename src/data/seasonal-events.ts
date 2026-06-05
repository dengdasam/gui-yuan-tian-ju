import type { SeasonalEvent } from '../types'

// ============================================
// 季节性特殊事件
// ============================================
export const seasonalEvents: SeasonalEvent[] = [
  // ==================== 春耕节 ====================
  {
    id: 'spring_festival',
    title: '春耕节',
    season: '春',
    month: 3,
    dayRange: [10, 20],
    description: '桃源村一年一度的春耕庆典，全村齐聚祈求丰收。',
    greeting: '春风拂面，万物复苏。今天是春耕节，村里张灯结彩，处处洋溢着节日的气氛。',
    type: 'festival',
    startNode: 'spring_fest_start',
    repeatable: true,
    completed: false,
    nodes: [
      {
        id: 'spring_fest_start',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '天刚蒙蒙亮，村里就热闹起来了。孩子们跑来跑去，大人们在田埂上插着彩旗。', emotion: 'neutral' },
          { speaker: '老陈', content: '今天是春耕节！按老规矩，先祭土地，再比种田，晚上全村喝酒！', emotion: 'happy' }
        ],
        onEnter: [],
        next: 'spring_fest_ritual'
      },
      {
        id: 'spring_fest_ritual',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '老陈带领全村人来到土地庙前，摆上三牲祭品。', emotion: 'neutral' },
          { speaker: '老陈', content: '土地公公保佑，今年风调雨顺，五谷丰登！', emotion: 'neutral' },
          { speaker: '旁白', content: '你跟着村民们一起躬身行礼。虽然不是读书人熟悉的仪式，但你感受到了久违的归属感。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'stamina', value: 10 },
          { type: 'fame', value: 5 }
        ],
        choices: [
          {
            text: '参加播种比赛！',
            next: 'spring_fest_contest',
            effects: [
              { type: 'fame', value: 5 }
            ]
          },
          {
            text: '帮忙准备百家宴',
            next: 'spring_fest_feast',
            effects: [
              { type: 'affection', target: 'laochen', value: 10 }
            ]
          },
          {
            text: '跟云娘去采春药',
            next: 'spring_fest_herb',
            effects: [
              { type: 'affection', target: 'yunniang', value: 10 }
            ]
          }
        ]
      },
      {
        id: 'spring_fest_contest',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '播种比赛开始了！老陈当裁判，三声锣响，参赛者比谁在香烧完之前翻的地最多。', emotion: 'neutral' },
          { speaker: '旁白', content: '你虽然是个书生，但几个月的农活也不是白干的。你一鼓作气，翻了两垄地——虽然没拿第一，但得了第三名！', emotion: 'neutral' },
          { speaker: '老陈', content: '好小子！进步不小嘛。奖品——一袋上等水稻种子！', emotion: 'happy' }
        ],
        onEnter: [
          { type: 'stamina', value: -15 },
          { type: 'item', target: 'rice_seed', value: 3 },
          { type: 'fame', value: 5 }
        ],
        next: 'spring_fest_end'
      },
      {
        id: 'spring_fest_feast',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '你帮着村里的婶子们洗菜、切肉、烧火。虽然辛苦，但大家说说笑笑，其乐融融。', emotion: 'neutral' },
          { speaker: '老陈', content: '这后生不错！不嫌脏不嫌累，比那些只会念书的秀才强多了。', emotion: 'happy' },
          { speaker: '旁白', content: '晚上的百家宴上，你被安排坐在老陈身边——这是很高的礼遇。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'affection', target: 'laochen', value: 15 },
          { type: 'fame', value: 3 },
          { type: 'stamina', value: 15 }
        ],
        next: 'spring_fest_end'
      },
      {
        id: 'spring_fest_herb',
        type: 'dialogue',
        dialogue: [
          { speaker: '云娘', content: '春耕节最适合采药了。刚翻过的地旁边，有些草药冒头最快。', emotion: 'neutral' },
          { speaker: '', content: '云娘真是懂得多。教我吗？', emotion: 'neutral' },
          { speaker: '云娘', content: '（微笑）自然。你看这株——早春的蒲公英根，清热解毒。这株是地丁，能治痈肿。', emotion: 'happy' },
          { speaker: '旁白', content: '你跟着云娘采了一个下午的药，学到了不少药材知识。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'affection', target: 'yunniang', value: 15 },
          { type: 'skill', target: 'herb_farming', value: 1 },
          { type: 'item', target: 'herb_seed', value: 2 }
        ],
        next: 'spring_fest_end'
      },
      {
        id: 'spring_fest_end',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '夜幕下，篝火燃起，全村人围坐在一起喝酒、唱歌、讲笑话。', emotion: 'neutral' },
          { speaker: '旁白', content: '小荷跳了一支舞，老陈唱了一段古老的农耕歌谣，云娘难得地露出了笑容。', emotion: 'neutral' },
          { speaker: '', content: '（独白）以前在京城，过年过节只觉得孤独。今日在这里，虽在异乡，却有家的感觉。', emotion: 'happy' },
          { speaker: '旁白', content: '【春耕节·完】所有作物本季生长速度+1天。', emotion: 'neutral' }
        ]
      }
    ],
    rewards: [
      { type: 'fame', value: 10 },
      { type: 'stamina', value: 20 }
    ]
  },

  // ==================== 秋收祭 ====================
  {
    id: 'autumn_festival',
    title: '秋收祭',
    season: '秋',
    month: 9,
    dayRange: [15, 25],
    description: '秋收时节，桃源村举行盛大的收成比赛和感恩祭祀。',
    greeting: '金风送爽，稻谷飘香。一年的辛勤耕耘，到了收获的时候了。',
    type: 'festival',
    startNode: 'autumn_fest_start',
    repeatable: true,
    completed: false,
    nodes: [
      {
        id: 'autumn_fest_start',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '秋风起，稻穗黄。桃源村迎来了一年中最喜悦的时节——秋收。', emotion: 'neutral' },
          { speaker: '老陈', content: '秋收祭有两件大事——收成比赛和谢天宴。你今年收成如何？', emotion: 'happy' },
          { speaker: '旁白', content: '人们喜气洋洋地忙碌着，打谷场上堆满了金黄的稻谷。', emotion: 'neutral' }
        ],
        choices: [
          {
            text: '参加收成比赛，秀出你的成果！',
            next: 'autumn_fest_contest',
            effects: []
          },
          {
            text: '帮助村里老人收粮食',
            next: 'autumn_fest_help',
            effects: [
              { type: 'affection', target: 'laochen', value: 15 }
            ]
          },
          {
            text: '把丰收的喜悦分享给云娘和小荷',
            next: 'autumn_fest_share',
            effects: [
              { type: 'affection', target: 'yunniang', value: 10 },
              { type: 'affection', target: 'xiaohe', value: 10 }
            ]
          }
        ]
      },
      {
        id: 'autumn_fest_contest',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '收成比赛在打谷场进行。村民们把自家最好的作物摆出来——南瓜、稻谷、玉米、茶叶。', emotion: 'neutral' },
          { speaker: '老陈', content: '（挨个品鉴）嗯……你这份茶叶，色泽翠绿，香气清雅。品质上乘！', emotion: 'happy' },
          { speaker: '旁白', content: '你的茶叶获得了"最佳品质奖"！王员外看到这一幕，脸色铁青——自从商会改革后，桃源村的茶叶品质跃居全镇第一。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'fame', value: 10 },
          { type: 'business_rep', value: 10 },
          { type: 'gold', value: 50 }
        ],
        next: 'autumn_fest_end'
      },
      {
        id: 'autumn_fest_help',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '你没有参加比赛，而是去帮村里几个老人收割庄稼。', emotion: 'neutral' },
          { speaker: '旁白', content: '虽然累得腰酸背痛，但老人们感激的眼神让你觉得一切都值了。', emotion: 'neutral' },
          { speaker: '老陈', content: '（拍你的肩膀）好样的！我当年收留你的时候没看错人。', emotion: 'happy' }
        ],
        onEnter: [
          { type: 'affection', target: 'laochen', value: 20 },
          { type: 'stamina', value: -15 },
          { type: 'fame', value: 5 }
        ],
        next: 'autumn_fest_end'
      },
      {
        id: 'autumn_fest_share',
        type: 'dialogue',
        dialogue: [
          { speaker: '', content: '云娘，这是新采的茶叶，给你泡药茶用。小荷，这一篮果子给你。', emotion: 'neutral' },
          { speaker: '云娘', content: '（接过茶叶，闻了闻）上好的春茶，你留着自己卖多好。', emotion: 'surprised' },
          { speaker: '', content: '再好的茶也得有人喝才有滋味。我一个人也喝不完。', emotion: 'neutral' },
          { speaker: '小荷', content: '公子你真好！等我会打算盘了，帮你去商会算账！', emotion: 'happy' }
        ],
        onEnter: [
          { type: 'affection', target: 'yunniang', value: 15 },
          { type: 'affection', target: 'xiaohe', value: 15 }
        ],
        next: 'autumn_fest_end'
      },
      {
        id: 'autumn_fest_end',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '晚上，全村人摆出最丰盛的饭菜，在月光下举行谢天宴。', emotion: 'neutral' },
          { speaker: '旁白', content: '你坐在人群中间，看着一张张笑脸，忽然觉得——这比中举更让人满足。', emotion: 'neutral' },
          { speaker: '旁白', content: '【秋收祭·完】所有库存作物当前出售价+20%。', emotion: 'neutral' }
        ]
      }
    ],
    rewards: [
      { type: 'gold', value: 100 },
      { type: 'fame', value: 10 }
    ]
  },

  // ==================== 端午节 ====================
  {
    id: 'duanwu_fest',
    title: '端午节',
    season: '夏',
    month: 5,
    dayRange: [1, 10],
    description: '五月端阳，龙舟竞渡、粽子飘香，桃源村举办传统端午庆典。',
    greeting: '艾叶飘香，粽情满满。五月初五端午节，村里处处飘着粽叶的清香味儿。',
    type: 'festival',
    startNode: 'duanwu_start',
    repeatable: true,
    completed: false,
    nodes: [
      {
        id: 'duanwu_start',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '五月初五，暑气渐浓。桃源村的小河边，人们已经在忙碌着——插艾草、挂菖蒲，空气中弥漫着粽叶特有的清香。', emotion: 'neutral' },
          { speaker: '老陈', content: '端午节到啦！今年的龙舟赛，咱村要和河对岸的柳家村比划比划。你可得来助威！', emotion: 'happy' },
          { speaker: '云娘', content: '（端着一个竹篮）我采了些艾叶和菖蒲，祛病驱邪。粽叶也泡好了，就等包粽子了。', emotion: 'neutral' }
        ],
        onEnter: [],
        next: 'duanwu_choice'
      },
      {
        id: 'duanwu_choice',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '端午活动已经热闹起来了，你打算……', emotion: 'neutral' }
        ],
        choices: [
          {
            text: '参加龙舟赛，与柳家村一决高下！',
            next: 'duanwu_race',
            effects: [
              { type: 'stamina', value: -10 },
              { type: 'fame', value: 5 }
            ]
          },
          {
            text: '帮云娘包粽子，与村里人分享',
            next: 'duanwu_zongzi',
            effects: [
              { type: 'affection', target: 'yunniang', value: 10 }
            ]
          },
          {
            text: '挂艾草菖蒲，为村民祈福祛病',
            next: 'duanwu_mugwort',
            effects: [
              { type: 'affection', target: 'laochen', value: 8 }
            ]
          }
        ]
      },
      {
        id: 'duanwu_race',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '锣鼓喧天，你加入了桃源村的龙舟队。二十个壮汉一起发力，龙舟如箭一般劈开水面。', emotion: 'neutral' },
          { speaker: '旁白', content: '柳家村的龙舟一度领先半个船身——但老陈亲自擂鼓，你拼尽全力划桨，最后十丈桃源村反超了！', emotion: 'neutral' },
          { speaker: '老陈', content: '（满头大汗，拍你肩膀）好！今年的彩头——一坛雄黄酒、三斤腌肉，归你们了！', emotion: 'happy' },
          { speaker: '小荷', content: '公子好厉害！刚才好多人都在喊你的名字！', emotion: 'happy' }
        ],
        onEnter: [
          { type: 'stamina', value: -15 },
          { type: 'fame', value: 15 },
          { type: 'gold', value: 30 }
        ],
        next: 'duanwu_end'
      },
      {
        id: 'duanwu_zongzi',
        type: 'dialogue',
        dialogue: [
          { speaker: '云娘', content: '粽叶要这样折——折成漏斗状，放糯米、红豆、腌肉，再盖上一层米，最后用绳子绑紧。', emotion: 'neutral' },
          { speaker: '', content: '（笨手笨脚地包着）这个角总是漏米……', emotion: 'neutral' },
          { speaker: '云娘', content: '（轻笑）你呀，手劲太大了。包粽子和采药一样，都要轻柔。', emotion: 'happy' },
          { speaker: '旁白', content: '在云娘耐心指导下，你的粽子从"四不像"变成了有模有样。你俩包了满满一大锅，分给了全村的老人和小孩。', emotion: 'neutral' },
          { speaker: '小荷', content: '（嚼着粽子）云姐姐和公子包的粽子最好吃了！', emotion: 'happy' }
        ],
        onEnter: [
          { type: 'affection', target: 'yunniang', value: 18 },
          { type: 'affection', target: 'xiaohe', value: 8 },
          { type: 'stamina', value: 10 },
          { type: 'fame', value: 5 }
        ],
        next: 'duanwu_end'
      },
      {
        id: 'duanwu_mugwort',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '你和老陈带着几个年轻人，挨家挨户地在门楣上插艾草、挂菖蒲。', emotion: 'neutral' },
          { speaker: '旁白', content: '"艾草驱邪，菖蒲如剑——这是古人留下的规矩。你们这些读书人可能觉得迷信，但村民们信这个，日子才过得踏实。"老陈一边忙活一边唠叨。', emotion: 'neutral' },
          { speaker: '', content: '老陈，我不觉得是迷信。这是心意——为家人、为乡邻祈福的心意。', emotion: 'neutral' },
          { speaker: '老陈', content: '（愣了一下，然后笑）说得对！就是你小子有学问。', emotion: 'happy' },
          { speaker: '旁白', content: '到了黄昏，整个桃源村都笼罩在艾草的清香中。老人们笑着说，今年一定有福佑。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'affection', target: 'laochen', value: 15 },
          { type: 'fame', value: 8 },
          { type: 'stamina', value: -5 },
          { type: 'skill', target: 'herb_farming', value: 1 }
        ],
        next: 'duanwu_end'
      },
      {
        id: 'duanwu_end',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '夜幕降临，村民们聚在河边放河灯。一盏盏莲灯载着心愿顺水漂去。', emotion: 'neutral' },
          { speaker: '', content: '（独白）流放那年端午，我独坐江边，只觉得屈原投江也是解脱。今日再临端阳——有粽香、有龙舟、有人相伴。原来节日不是形式，是人间的热乎气儿。', emotion: 'happy' },
          { speaker: '旁白', content: '【端午节·完】所有作物本周生长速度+2天，村民好感度额外+3。', emotion: 'neutral' }
        ]
      }
    ],
    rewards: [
      { type: 'gold', value: 50 },
      { type: 'stamina', value: 20 },
      { type: 'fame', value: 5 }
    ]
  },

  // ==================== 年关 ====================
  {
    id: 'new_year',
    title: '年关',
    season: '冬',
    month: 12,
    dayRange: [20, 30],
    description: '岁末年关，辞旧迎新。桃源村沉浸在喜庆的节日气氛中，家家户户贴春联、办年货、守岁团圆。',
    greeting: '瑞雪兆丰年，爆竹声声近。年关将至，桃源村处处张灯结彩，年味儿越来越浓了。',
    type: 'festival',
    startNode: 'newyear_start',
    repeatable: true,
    completed: false,
    nodes: [
      {
        id: 'newyear_start',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '岁末冬深，大雪封山。但桃源村里却热闹非凡——家家户户杀年猪、蒸年糕，到处都是喜庆的红色。', emotion: 'neutral' },
          { speaker: '老陈', content: '哈哈哈——年关到了！城里人叫"除夕"，咱庄户人叫"过年"。这一年到头——你辛苦了。', emotion: 'happy' },
          { speaker: '云娘', content: '（捧着一叠红纸）我给你裁了些春联纸。你的字好，帮村里写几副吧。', emotion: 'neutral' },
          { speaker: '小荷', content: '公子公子，今年过年我们能放烟花吗？', emotion: 'happy' }
        ],
        onEnter: [],
        next: 'newyear_choice'
      },
      {
        id: 'newyear_choice',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '年关活动五花八门——你打算怎么过这个年？', emotion: 'neutral' }
        ],
        choices: [
          {
            text: '挥毫写春联，为全村题福字',
            next: 'newyear_couplet',
            effects: [
              { type: 'fame', value: 8 }
            ]
          },
          {
            text: '置办年货，给村民准备新年礼物',
            next: 'newyear_goods',
            effects: [
              { type: 'gold', value: -80 }
            ]
          },
          {
            text: '守岁团聚，与云娘小荷一起包饺子',
            next: 'newyear_reunion',
            effects: [
              { type: 'affection', target: 'yunniang', value: 10 },
              { type: 'affection', target: 'xiaohe', value: 10 }
            ]
          }
        ]
      },
      {
        id: 'newyear_couplet',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '你在村口的大槐树下摆开桌子，研墨铺纸。云娘帮你裁纸，小荷帮你递笔——俨然一副"书童"模样。', emotion: 'neutral' },
          { speaker: '旁白', content: '村里人排着队来请你写春联——"五谷丰登""六畜兴旺""福寿安康"，你根据每户的情况即兴题联，字迹端庄，意头吉利。', emotion: 'neutral' },
          { speaker: '老陈', content: '（拿着自己的春联，眯眼看了又看）"耕云种月山居乐，煮酒烹茶客来勤"。嘿嘿，我是个粗人，但就这几个字，画得真好看！', emotion: 'happy' },
          { speaker: '旁白', content: '一下午写了三十多副春联。手冻得通红，但听到村民的笑声，值了。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'fame', value: 15 },
          { type: 'affection', target: 'yunniang', value: 8 },
          { type: 'stamina', value: -10 }
        ],
        next: 'newyear_end'
      },
      {
        id: 'newyear_goods',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '你赶在年关前去了一趟镇上。买了红烛、鞭炮、干果、蜜饯、还有几匹新布。', emotion: 'neutral' },
          { speaker: '旁白', content: '回来后，你把礼物分给村里人——老陈一件新棉袄，云娘一盒上等蜜饯，小荷一匹红绸布，张婶几斤干果。', emotion: 'neutral' },
          { speaker: '张四方', content: '哎哟，这怎么好意思。公子你一个人在异乡，还想着给我们买东西……', emotion: 'surprised' },
          { speaker: '', content: '张婶，您做的腌菜我吃了一整年。这点心意算什么。', emotion: 'neutral' },
          { speaker: '旁白', content: '虽然花了些铜钱，但看到大家脸上的笑容——这是最划算的买卖。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'affection', target: 'laochen', value: 12 },
          { type: 'affection', target: 'yunniang', value: 12 },
          { type: 'affection', target: 'xiaohe', value: 12 },
          { type: 'fame', value: 10 }
        ],
        next: 'newyear_end'
      },
      {
        id: 'newyear_reunion',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '除夕夜，你和云娘、小荷在屋里包饺子。小荷擀皮，你剁馅，云娘负责包——分工默契，其乐融融。', emotion: 'neutral' },
          { speaker: '小荷', content: '公子包的这个饺子好丑呀！不过没事，云姐姐说了——丑饺子代表好运。', emotion: 'happy' },
          { speaker: '云娘', content: '（抿嘴轻笑）我小时候过年——都是一个人。后来来了桃源村，也只有病人做伴。今年是第一次有人一起包饺子。', emotion: 'neutral' },
          { speaker: '', content: '（看着她）以后每年都一起包。', emotion: 'neutral' },
          { speaker: '旁白', content: '云娘低下头，脸微微发红。窗外传来阵阵爆竹声——新年到了。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'affection', target: 'yunniang', value: 22 },
          { type: 'affection', target: 'xiaohe', value: 15 },
          { type: 'stamina', value: 30 }
        ],
        next: 'newyear_end'
      },
      {
        id: 'newyear_end',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '子时已过，爆竹声中一岁除。村民们聚在打谷场上相互拜年，小孩子们嬉戏追逐。', emotion: 'neutral' },
          { speaker: '老陈', content: '（举着一碗米酒）来！为我们桃源村——干一碗！新年好收成！', emotion: 'happy' },
          { speaker: '', content: '（独白）自幼父母双亡，考中进士后又遭流放。以为这辈子不会再知道"家"是什么。今夜围炉守岁，看窗外的红灯笼——原来家，就是有愿意为你包饺子的人。', emotion: 'happy' },
          { speaker: '旁白', content: '【年关·完】新年到来，全体力回复，额外获得50文压岁钱。明年一切都会更好。', emotion: 'neutral' }
        ]
      }
    ],
    rewards: [
      { type: 'gold', value: 50 },
      { type: 'stamina', value: 40 },
      { type: 'fame', value: 10 }
    ]
  },

  // ==================== 商人集会 ====================
  {
    id: 'merchant_assembly',
    title: '商人集会',
    season: '秋',
    month: 10,
    dayRange: [1, 10],
    description: '襄州、县城、周边各镇的商人齐聚桃源镇，这是收购与交易的最佳时机。',
    greeting: '桃源镇一年一度的商人集会开幕了！四面八方的商贾汇聚于此，正是买卖的大好时机。',
    type: 'assembly',
    startNode: 'assembly_start',
    repeatable: true,
    completed: false,
    nodes: [
      {
        id: 'assembly_start',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '镇上的主街一夜之间变成了集市。襄州的布商、县城的粮商、江南的茶商……各路人马齐聚桃源镇。', emotion: 'neutral' },
          { speaker: '李明', content: '这是今年最大的商机了！襄州商会的会长亲自来了——如果能拿下他的订单，我们的茶叶就能直供京城！', emotion: 'neutral' },
          { speaker: '张四方', content: '别忘了还有拍卖会。去年有人用一只青花瓷换了一条商路——这可不是普通集市。', emotion: 'happy' }
        ],
        choices: [
          {
            text: '拜访襄州商会会长，争取大订单',
            next: 'assembly_big_deal',
            effects: [
              { type: 'business_rep', value: 5 }
            ]
          },
          {
            text: '参加拍卖会，竞标稀有种子',
            next: 'assembly_auction',
            effects: []
          },
          {
            text: '摆摊出售你的特产',
            next: 'assembly_stall',
            effects: []
          }
        ]
      },
      {
        id: 'assembly_big_deal',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '你精心准备了样品——桃源春茶、终南人参、手工药茶——来到襄州商会会长的临时会馆。', emotion: 'neutral' },
          { speaker: '会长', content: '桃源村的茶叶，我早有耳闻。品质确实不错——但数量够不够？我每年要两千斤。', emotion: 'neutral' },
          { speaker: '', content: '今年不够，但明年、后年——我们能供得上。而且只供精品，不供大路货。', emotion: 'neutral' },
          { speaker: '会长', content: '（抽雪茄，沉思）有胆识。我先订五百斤试水。如果市场反应好——两千斤合同，三年长约。', emotion: 'happy' }
        ],
        onEnter: [
          { type: 'business_rep', value: 20 },
          { type: 'gold', value: 200 },
          { type: 'market_share', value: 15 }
        ],
        next: 'assembly_end'
      },
      {
        id: 'assembly_auction',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '拍卖会在镇上的老戏台举行。各色奇珍异物轮番登场——', emotion: 'neutral' },
          { speaker: '旁白', content: '"下一件——岭南荔枝种苗！据说种出来的荔枝，一颗值一两银子！起拍价——五十文！"', emotion: 'neutral' },
          { speaker: '旁白', content: '你用一百文拍下了这件稀罕物。虽然桃源村种荔枝未必合适，但这个价买到手，稳赚不赔。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'gold', value: -100 },
          { type: 'item', target: 'grape_seed', value: 5 },
          { type: 'fame', value: 3 }
        ],
        next: 'assembly_end'
      },
      {
        id: 'assembly_stall',
        type: 'dialogue',
        dialogue: [
          { speaker: '旁白', content: '你支了个小摊，把自家种的茶叶、药草和杂粮摆了出来。', emotion: 'neutral' },
          { speaker: '路人甲', content: '这茶叶不错啊！多少钱？', emotion: 'neutral' },
          { speaker: '', content: '五十文一斤。自家种的终南山茶，保好喝。', emotion: 'neutral' },
          { speaker: '旁白', content: '一天下来，你的摊位成了集市的亮点之一。虽然赚的不多，但让很多人记住了"桃源茶"这个名字。', emotion: 'neutral' }
        ],
        onEnter: [
          { type: 'gold', value: 80 },
          { type: 'fame', value: 5 },
          { type: 'business_rep', value: 5 }
        ],
        next: 'assembly_end'
      },
      {
        id: 'assembly_end',
        type: 'narration',
        dialogue: [
          { speaker: '旁白', content: '三天的商人集会结束了。有人满载而归，有人结识了新伙伴。', emotion: 'neutral' },
          { speaker: '旁白', content: '而你——桃源村的代表——在这个商贸盛会上留下了自己的印记。', emotion: 'neutral' },
          { speaker: '旁白', content: '【商人集会·完】市场交易将持续三天的高活跃状态。', emotion: 'neutral' }
        ]
      }
    ],
    rewards: [
      { type: 'gold', value: 80 },
      { type: 'business_rep', value: 10 }
    ]
  }
]

// 获取当前日期可能触发的季节事件
export function getActiveSeasonalEvent(
  season: '春' | '夏' | '秋' | '冬',
  month: number,
  day: number,
  completedEvents: string[]
): SeasonalEvent | null {
  return seasonalEvents.find(event => {
    if (!event.repeatable && completedEvents.includes(event.id)) return false
    if (event.season !== season) return false
    if (event.month !== month) return false
    if (day < event.dayRange[0] || day > event.dayRange[1]) return false
    return true
  }) || null
}

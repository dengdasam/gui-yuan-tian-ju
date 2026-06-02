import type { StoryNode, Chapter } from '../types'

// ============================================
// 序章：归去来兮
// ============================================
export const storyNodes: Record<string, StoryNode> = {
  // ---- 开场 ----
  prologue_start: {
    id: 'prologue_start',
    type: 'narration',
    background: '大梁永安七年，春。你——一位屡试不第的落榜书生，带着一身疲惫和几卷残书，离开了京城。',
    dialogue: [
      { speaker: '旁白', content: '京城三月，春雨如丝。你在贡院门外站了许久，榜上依旧没有你的名字。', emotion: 'neutral' },
      { speaker: '旁白', content: '十年寒窗，三赴科举。这一次，你连乡试都没过。', emotion: 'neutral' },
      { speaker: '旁白', content: '身上的盘缠所剩无几，你决定离开这个不属于你的地方。一路向西，走走停停，直到——', emotion: 'neutral' }
    ],
    next: 'prologue_mountain'
  },
  prologue_mountain: {
    id: 'prologue_mountain',
    type: 'dialogue',
    background: '终南山脚下，桃花盛开的小路。远处炊烟袅袅，一个村庄隐在山水之间。',
    dialogue: [
      { speaker: '旁白', content: '翻过最后一道山梁，你看到了一个被桃林环绕的村庄。', emotion: 'neutral' },
      { speaker: '旁白', content: '村口的石碑上刻着三个字——"桃源村"。', emotion: 'neutral' },
      { speaker: '', content: '（疲惫地驻足）这地方……倒像是世外桃源。', emotion: 'neutral' }
    ],
    next: 'prologue_meet_chen'
  },
  prologue_meet_chen: {
    id: 'prologue_meet_chen',
    type: 'dialogue',
    background: '村口老槐树下，一位老者正坐在石凳上晒太阳。',
    dialogue: [
      { speaker: '老陈', content: '哟，哪来的后生？这荒山野岭的，可不是赶考的路。', emotion: 'surprised' },
      { speaker: '', content: '老丈有礼。在下……不赶考了。路过此地，想找个落脚的地方。', emotion: 'neutral' },
      { speaker: '老陈', content: '不赶考了？哈哈，也好。这科举啊，跟种地一样，有时候不是你不努力，是地不行。', emotion: 'happy' },
      { speaker: '老陈', content: '老夫姓陈，这桃源村的村长。你要是不嫌弃，村西头有间空屋，还有几亩荒地，你拿去住，拿去种。', emotion: 'happy' }
    ],
    choices: [
      {
        text: '感激不尽！我愿意留下来，学学种地。',
        next: 'prologue_accept',
        effects: [
          { type: 'affection', target: 'laochen', value: 10 },
          { type: 'fame', value: 0 }
        ]
      },
      {
        text: '种地？我可是一介书生……不过，眼下也无处可去。',
        next: 'prologue_reluctant',
        effects: [
          { type: 'affection', target: 'laochen', value: 5 },
          { type: 'stamina', value: -5 }
        ]
      }
    ]
  },
  prologue_accept: {
    id: 'prologue_accept',
    type: 'dialogue',
    dialogue: [
      { speaker: '老陈', content: '好！爽快！老夫就喜欢这样的年轻人。跟我来。', emotion: 'happy' },
      { speaker: '旁白', content: '老陈带你穿过村子，村民们好奇地打量着你这个外来人。', emotion: 'neutral' },
      { speaker: '旁白', content: '村西头，一间土坯房，三亩荒地。房子虽旧，收拾收拾也能住人。', emotion: 'neutral' }
    ],
    next: 'prologue_new_home'
  },
  prologue_reluctant: {
    id: 'prologue_reluctant',
    type: 'dialogue',
    dialogue: [
      { speaker: '老陈', content: '（笑）书生也好，农夫也罢。肚子饿了都得吃饭。跟我来吧。', emotion: 'happy' },
      { speaker: '旁白', content: '你跟着老陈，心里五味杂陈。但环顾四周——青山如黛，溪水潺潺，桃花纷飞。', emotion: 'neutral' },
      { speaker: '', content: '（自言自语）也罢，先安顿下来再说。', emotion: 'neutral' }
    ],
    next: 'prologue_new_home'
  },
  prologue_new_home: {
    id: 'prologue_new_home',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '就这样，你在桃源村安了家。三亩荒地便是你新生活的开始。', emotion: 'neutral' },
      { speaker: '旁白', content: '老陈给了你一袋小麦种子和一把旧锄头。"先种点粮食，填饱肚子再说。"', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'item', target: 'wheat_seed', value: 5 },
      { type: 'gold', value: 50 },
      { type: 'unlock', value: 1 }
    ],
    next: 'prologue_tutorial_start'
  },
  // ---- 教程 ----
  prologue_tutorial_start: {
    id: 'prologue_tutorial_start',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '【系统提示】欢迎来到归园田居。你现在有三亩田地和一些小麦种子。' },
      { speaker: '旁白', content: '点击"田地"可以种植作物；点击"市场"可以买卖物资；点击"村中"可以与人交流。' }
    ],
    choices: [
      { text: '先去田里看看', next: 'prologue_go_farm' },
      { text: '先去村里转转', next: 'prologue_go_village' }
    ]
  },
  prologue_go_farm: {
    id: 'prologue_go_farm',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '你来到自己的田边。三亩地虽然荒着，但土壤黑油油的，看起来是块好地。' },
      { speaker: '旁白', content: '你拿出小麦种子，学着记忆中农夫的样子，开始播种。' }
    ],
    next: 'prologue_end'
  },
  prologue_go_village: {
    id: 'prologue_go_village',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '村里不算大，几十户人家。路上碰到一个蹦蹦跳跳的少女。' },
      { speaker: '小荷', content: '你就是新来的书生？哇，真的穿长衫诶！山外头是什么样的？', emotion: 'happy' },
      { speaker: '', content: '（被问得一愣）呃……有很多人，很多房子。', emotion: 'surprised' },
      { speaker: '小荷', content: '改天给我好好讲讲！我叫小荷，村东头的。', emotion: 'happy' }
    ],
    onEnter: [
      { type: 'affection', target: 'xiaohe', value: 10 }
    ],
    next: 'prologue_end'
  },
  prologue_end: {
    id: 'prologue_end',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '夜幕降临，你站在田埂上，望着满天星斗。' },
      { speaker: '旁白', content: '这里没有京城的喧嚣，没有考场的压抑。只有虫鸣、清风，和一份踏实的疲惫。' },
      { speaker: '', content: '（轻笑）也许老陈说的是对的。', emotion: 'happy' },
      { speaker: '旁白', content: '——第一章·春耕——', emotion: 'neutral' }
    ],
    next: 'ch1_intro'
  },

  // ============================================
  // 第一章：春耕 —— 商战序章
  // ============================================
  ch1_intro: {
    id: 'ch1_intro',
    type: 'narration',
    background: '春日的桃源村，万物复苏。',
    dialogue: [
      { speaker: '旁白', content: '春天真正地来了。你在桃源村的第一个播种季。', emotion: 'neutral' },
      { speaker: '旁白', content: '田里的小麦刚冒出嫩芽，一切都在向好——但麻烦也悄悄临近。', emotion: 'neutral' }
    ],
    next: 'ch1_wang_visit'
  },
  ch1_wang_visit: {
    id: 'ch1_wang_visit',
    type: 'dialogue',
    background: '村口，一辆华丽的马车停下，走下一个锦衣华服的中年人。',
    dialogue: [
      { speaker: '旁白', content: '这天，一辆装饰华丽的马车停在了村口。', emotion: 'neutral' },
      { speaker: '王员外', content: '老陈呢？叫他出来。今年的茶叶，我要全部收了。', emotion: 'neutral' },
      { speaker: '老陈', content: '王员外，您这价压得太低了。村里这些种茶的，辛辛苦苦一年，您一两茶才给二十文……', emotion: 'neutral' },
      { speaker: '王员外', content: '（冷笑）嫌低？你们可以自己去城里卖嘛。不过我提醒你，去城里的路，不太平。', emotion: 'angry' }
    ],
    choices: [
      {
        text: '站出来说话：茶叶的品质好，自然该有个公道价格。',
        next: 'ch1_stand_up',
        effects: [
          { type: 'affection', target: 'laochen', value: 15 },
          { type: 'affection', target: 'wangyuanwai', value: -20 },
          { type: 'fame', value: 5 },
          { type: 'business_rep', value: 10 }
        ]
      },
      {
        text: '先观察，不急着出头。',
        next: 'ch1_observe',
        effects: [
          { type: 'affection', target: 'wangyuanwai', value: -5 }
        ]
      }
    ]
  },
  ch1_stand_up: {
    id: 'ch1_stand_up',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '王员外，在下虽是新来的，但也懂一个道理——好货不愁卖。桃源村的茶叶，值更多。', emotion: 'neutral' },
      { speaker: '王员外', content: '（打量你）哦？你就是那个落榜书生？呵呵，你懂什么叫生意吗？', emotion: 'neutral' },
      { speaker: '', content: '不懂。但我知道，垄断不是生意，是欺负人。', emotion: 'neutral' },
      { speaker: '王员外', content: '（眯眼）有意思。咱们走着瞧。', emotion: 'angry' }
    ],
    onEnter: [
      { type: 'unlock', value: 1 }
    ],
    next: 'ch1_after_wang'
  },
  ch1_observe: {
    id: 'ch1_observe',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '你决定先不插手。王员外和老陈争论了一番，最终不欢而散。', emotion: 'neutral' },
      { speaker: '旁白', content: '但你注意到，王员外临走时冷冷地扫了你一眼。', emotion: 'neutral' }
    ],
    next: 'ch1_after_wang'
  },
  ch1_after_wang: {
    id: 'ch1_after_wang',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '王员外的到来让村里气氛紧张起来。种茶的村民忧心忡忡。', emotion: 'neutral' },
      { speaker: '旁白', content: '老陈找到你，叹了口气。', emotion: 'neutral' },
      { speaker: '老陈', content: '你也看到了。这王员外这些年把持着周边的销路，我们种的茶，种的人参，都只能低价卖给他。', emotion: 'neutral' },
      { speaker: '旁白', content: '你想到了云娘——她的药铺需要药材；想到了马刀头——他说过京城物价。也许，破局之法就在其中。', emotion: 'neutral' }
    ],
    next: 'ch1_open_world'
  },
  ch1_open_world: {
    id: 'ch1_open_world',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '【系统提示】第一章主线开启：你需要想办法打破王员外的市场垄断。' },
      { speaker: '旁白', content: '提示：提升茶叶/人参品质，联合其他NPC，开拓新的销售渠道。' },
      { speaker: '旁白', content: '同时，别忘了经营你的田地——没有经济基础，一切都是空谈。' }
    ],
    choices: [
      { text: '去拜访云娘，请教药材种植', next: 'ch1_visit_yunniang' },
      { text: '先回田里干活，攒些本钱', next: 'ch1_farm_first' }
    ]
  },
  ch1_visit_yunniang: {
    id: 'ch1_visit_yunniang',
    type: 'dialogue',
    background: '村东头，云娘的小药铺，药香扑鼻。',
    dialogue: [
      { speaker: '旁白', content: '你来到云娘的药铺。她正在晾晒草药，手法娴熟。', emotion: 'neutral' },
      { speaker: '云娘', content: '新来的书生？听说你和王员外杠上了？', emotion: 'surprised' },
      { speaker: '', content: '只是说了几句公道话。云娘，你这里的药材……', emotion: 'neutral' },
      { speaker: '云娘', content: '（微笑）你想种药材？好眼光。终南山的水土，种的药比别处好。我教你。', emotion: 'neutral' },
      { speaker: '云娘', content: '但有个条件——收获时，优先卖给我。价格比王员外公道。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'affection', target: 'yunniang', value: 15 },
      { type: 'item', target: 'herb_seed', value: 3 },
      { type: 'skill', target: 'herb_farming', value: 1 }
    ],
    next: 'ch1_open_end'
  },
  ch1_farm_first: {
    id: 'ch1_farm_first',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '你回到田里，卷起袖子干了起来。翻土、播种、浇水，虽然生疏，但很认真。', emotion: 'neutral' },
      { speaker: '旁白', content: '一天下来腰酸背痛，但看着整理好的田地，心里很踏实。', emotion: 'neutral' },
      { speaker: '', content: '种地比读书累多了……但也比读书实在。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'stamina', value: -20 },
      { type: 'gold', value: 10 }
    ],
    next: 'ch1_open_end'
  },
  ch1_open_end: {
    id: 'ch1_open_end',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '你在桃源村的新生活正式开始了。三亩田地等着你去耕耘，村里的人们等着你去认识，而王员外——这个盘踞在周边商路上的富商——也盯上了你。', emotion: 'neutral' },
      { speaker: '旁白', content: '路还很长，但你已经迈出了第一步。', emotion: 'neutral' },
      { speaker: '旁白', content: '【第一章·春耕 —— 已开启】', emotion: 'neutral' }
    ]
  },

  // ============================================
  // 商战主线 A：王员外的茶叶垄断反击战
  // ============================================
  ch1_wang_monopoly: {
    id: 'ch1_wang_monopoly',
    type: 'event',
    background: '桃源村茶田——王员外的马车再次出现',
    dialogue: [
      { speaker: '旁白', content: '几日后，王员外果然再次来访。这一次，他带来了二十辆牛车和一份契约。', emotion: 'neutral' },
      { speaker: '王员外', content: '老陈，这是今年的收购契约。全村春茶，一两十四文，签字吧。', emotion: 'neutral' },
      { speaker: '老陈', content: '十四文？！比去年还少了六文！王员外，你这是要把我们往死路上逼啊。', emotion: 'angry' },
      { speaker: '王员外', content: '（淡淡地）你签不签？不签的话，我保证你们的茶叶一斤都出不了这终南山。', emotion: 'neutral' },
      { speaker: '旁白', content: '王员外瞥了你一眼——他在试探你的反应。', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '撕掉契约："这契约不公平，我们不签！"',
        next: 'ch1_tear_contract',
        effects: [
          { type: 'affection', target: 'wangyuanwai', value: -30 },
          { type: 'affection', target: 'laochen', value: 20 },
          { type: 'fame', value: 10 },
          { type: 'business_rep', value: 15 }
        ]
      },
      {
        text: '提出谈判："王员外，我们各退一步，十八文如何？"',
        next: 'ch1_negotiate',
        effects: [
          { type: 'affection', target: 'wangyuanwai', value: -10 },
          { type: 'business_rep', value: 5 }
        ]
      },
      {
        text: '暗中调查：表面答应，私下寻找其他买家',
        next: 'ch1_investigate',
        effects: [
          { type: 'business_rep', value: 5 }
        ]
      }
    ]
  },

  // 撕契约分支
  ch1_tear_contract: {
    id: 'ch1_tear_contract',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '（上前两步，拿起契约，当着王员外的面将它撕成两半）', emotion: 'angry' },
      { speaker: '王员外', content: '（脸色一变）你……你疯了？', emotion: 'angry' },
      { speaker: '', content: '桃源村的茶叶值多少，该由市场决定，不由你一人说了算。', emotion: 'neutral' },
      { speaker: '王员外', content: '（阴沉地）好，很好。年轻人有骨气。我倒要看看，没有我的商路，你们的茶叶能卖给谁。', emotion: 'angry' },
      { speaker: '旁白', content: '王员外拂袖而去。村里人议论纷纷——有人佩服你的勇气，也有人担心因此惹祸。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'gold', value: -20 }
    ],
    next: 'ch1_liming_arrives'
  },

  // 谈判分支
  ch1_negotiate: {
    id: 'ch1_negotiate',
    type: 'dialogue',
    dialogue: [
      { speaker: '王员外', content: '（冷笑）十八文？你当我的银子是天上掉下来的？十六文，不能再多了。', emotion: 'neutral' },
      { speaker: '', content: '那就十六文——但契约里要加上一条：明年价格随行就市，不得低于市价八成。', emotion: 'neutral' },
      { speaker: '王员外', content: '（沉默片刻）……有意思。行，这条我加。', emotion: 'surprised' },
      { speaker: '旁白', content: '虽然价格仍不理想，但你为村里争取到了一个保障条款。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'business_rep', value: 10 },
      { type: 'gold', value: 30 }
    ],
    next: 'ch1_liming_arrives'
  },

  // 暗中调查分支
  ch1_investigate: {
    id: 'ch1_investigate',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '（对老陈低声）先稳住他。我去县城跑一趟，找找别的路子。', emotion: 'neutral' },
      { speaker: '老陈', content: '（低声）好主意。路上小心，王员外的人可能在盯着。', emotion: 'neutral' },
      { speaker: '旁白', content: '你决定不和王员外正面冲突，先摸清市场情况。', emotion: 'neutral' }
    ],
    next: 'ch1_liming_arrives'
  },

  // ---- 李明联盟线 ----
  ch1_liming_arrives: {
    id: 'ch1_liming_arrives',
    type: 'dialogue',
    background: '村口茶亭，一个穿青衫的年轻人正在喝茶',
    dialogue: [
      { speaker: '旁白', content: '几天后，村口茶亭来了一个陌生的年轻人。他穿着青布长衫，举止斯文，不像普通商人。', emotion: 'neutral' },
      { speaker: '李明', content: '在下李明，县城茗香茶庄的。听闻桃源村的茶叶被王员外压价，特来看看。', emotion: 'neutral' },
      { speaker: '', content: '李兄也是茶商？那正好。我们正在找新的销路。', emotion: 'neutral' },
      { speaker: '李明', content: '（苦笑）不敢瞒你。我确实想收桃源村的茶，但王员外放话——谁敢跟桃源村做生意，就别想在终南三县混下去。', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '告诉他你的计划："我们联手，绕开王员外的商路。"',
        next: 'ch1_liming_ally',
        effects: [
          { type: 'affection', target: 'liming', value: 15 },
          { type: 'alliance', target: 'liming', value: 1 }
        ]
      },
      {
        text: '先试探他的诚意："李兄为何愿意冒险来桃源村？"',
        next: 'ch1_liming_test',
        effects: [
          { type: 'affection', target: 'liming', value: 5 }
        ]
      }
    ]
  },

  ch1_liming_ally: {
    id: 'ch1_liming_ally',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '王员外把持的是官道。但我知道马刀头的镖局走的是另一条路——翻过鹰嘴崖，直通襄州。', emotion: 'neutral' },
      { speaker: '李明', content: '（眼睛一亮）鹰嘴崖古道？那条路荒废多年了……不过如果镖局肯走，确实可以绕过王员外的关卡。', emotion: 'surprised' },
      { speaker: '', content: '你出收购资金，我负责组织货源，马刀头走镖——三方能赢。', emotion: 'neutral' },
      { speaker: '李明', content: '（沉思片刻，伸出手）好！赌一把。我出五百两，先收第一批春茶。但有个条件——', emotion: 'neutral' },
      { speaker: '李明', content: '茶叶的品质我必须亲自验。王员外收茶不挑，我做的是精品，只收最好的。', emotion: 'neutral' },
      { speaker: '旁白', content: '李明终于下定决心与你结盟。一场商战，即将拉开序幕。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'alliance', target: 'liming', value: 1 },
      { type: 'business_rep', value: 10 },
      { type: 'gold', value: 50 }
    ],
    next: 'ch1_madaotou_clue'
  },

  ch1_liming_test: {
    id: 'ch1_liming_test',
    type: 'dialogue',
    dialogue: [
      { speaker: '李明', content: '（放下茶杯）说实话，我父亲当年也是被王员外挤垮的。我们李明茶庄，曾经也是终南山下数一数二的。', emotion: 'sad' },
      { speaker: '李明', content: '后来王员外勾结官府，垄断茶引，我父亲气病交加，走了。我是咽不下这口气。', emotion: 'angry' },
      { speaker: '', content: '明白了。那我们就不是做生意——是报仇。', emotion: 'neutral' },
      { speaker: '李明', content: '（苦笑）报仇也要本钱。我的茶庄现在是王小二过年，一年不如一年。不过——', emotion: 'neutral' },
      { speaker: '李明', content: '我手里还有一个京城大主顾的联系方式。只要货好，他不看茶引。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'affection', target: 'liming', value: 10 },
      { type: 'unlock', value: 1 }
    ],
    next: 'ch1_madaotou_clue'
  },

  // ---- 马刀头暗线 ----
  ch1_madaotou_clue: {
    id: 'ch1_madaotou_clue',
    type: 'dialogue',
    background: '村外官道旁的茶棚——镖队歇脚处',
    dialogue: [
      { speaker: '旁白', content: '你来到村外茶棚。马刀头的镖队刚歇下来，他正端着海碗喝茶。', emotion: 'neutral' },
      { speaker: '马刀头', content: '哟，书生！听说你把王员外的契约撕了？胆儿不小啊！', emotion: 'happy' },
      { speaker: '', content: '马大哥，我想请你帮个忙。走一趟襄州，带一批茶叶。', emotion: 'neutral' },
      { speaker: '马刀头', content: '（放下碗）鹰嘴崖那条路？那条路不好走，但也不是走不了。问题不是路——', emotion: 'neutral' },
      { speaker: '马刀头', content: '问题是王员外的人在鹰嘴崖下头设了卡子。说是"护路"，其实是拦路。', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '请你探探那条路，看有没有绕过去的法子。',
        next: 'ch1_madaotou_scout',
        effects: [
          { type: 'affection', target: 'madaotou', value: 10 },
          { type: 'gold', value: -30 }
        ]
      },
      {
        text: '直接闯过去不行吗？你们镖局还怕几个拦路的？',
        next: 'ch1_madaotou_direct',
        effects: [
          { type: 'affection', target: 'madaotou', value: -5 }
        ]
      }
    ]
  },

  ch1_madaotou_scout: {
    id: 'ch1_madaotou_scout',
    type: 'dialogue',
    dialogue: [
      { speaker: '马刀头', content: '（笑）聪明。我让我兄弟扮成采药的去探了探——鹰嘴崖西边有条羊肠小道，王员外的人没守那边。', emotion: 'happy' },
      { speaker: '马刀头', content: '不过那条路只能走人，不能走大车。你这茶叶要用骡子驮，一趟最多两百斤。', emotion: 'neutral' },
      { speaker: '', content: '两百斤也够了。第一批茶先试试路，以后再做打算。', emotion: 'neutral' },
      { speaker: '马刀头', content: '成！老规矩，货到付钱。不过有言在先——要是王员外的人拦路，你们可得另外加钱。', emotion: 'happy' }
    ],
    onEnter: [
      { type: 'affection', target: 'madaotou', value: 15 },
      { type: 'unlock', value: 1 },
      { type: 'business_rep', value: 5 }
    ],
    next: 'ch1_escort_plan'
  },

  ch1_madaotou_direct: {
    id: 'ch1_madaotou_direct',
    type: 'dialogue',
    dialogue: [
      { speaker: '马刀头', content: '（皱眉）书生，不是我怕事。干我们这行的，白刀子进红刀子出不怕。怕的是官府——', emotion: 'neutral' },
      { speaker: '马刀头', content: '王员外手里有茶引，他那卡子是县衙批的。硬闯的话，他报官说我们"走私"，我这镖局都得关门。', emotion: 'neutral' },
      { speaker: '', content: '（恍然）原来如此……那看来必须另寻出路了。', emotion: 'surprised' },
      { speaker: '马刀头', content: '我探过一条小路，鹰嘴崖西边。虽然难走，但王员外的人没守那边。你要信我，咱们走小路。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'affection', target: 'madaotou', value: 5 }
    ],
    next: 'ch1_escort_plan'
  },

  ch1_escort_plan: {
    id: 'ch1_escort_plan',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '三条线汇聚：李明的资金、马刀头的小路、桃源村的茶叶。', emotion: 'neutral' },
      { speaker: '旁白', content: '你需要尽快准备第一批茶叶货源，同时提防王员外的反击——他不会坐视你们打破他的垄断。', emotion: 'neutral' },
      { speaker: '旁白', content: '【商战系统已激活】商会投票、价格战、截货事件将在后续触发。', emotion: 'neutral' }
    ],
    choices: [
      { text: '前往商会，发起打破垄断的提案', next: 'ch1_chamber_form' },
      { text: '先回田里，积累资本再说', next: 'ch1_prep_phase' }
    ]
  },

  // ---- 商会投票线 ----
  ch1_chamber_form: {
    id: 'ch1_chamber_form',
    type: 'event',
    background: '桃源镇商会会馆——一座青砖大院',
    dialogue: [
      { speaker: '旁白', content: '你第一次踏入桃源镇商会。大堂里坐了七八个商人，王员外坐在主位，正与旁人谈笑。', emotion: 'neutral' },
      { speaker: '王员外', content: '（看到你，笑容收了收）哟，这不是桃源村那位……种地的书生吗？来商会做什么？', emotion: 'neutral' },
      { speaker: '', content: '我代表桃源村的茶农，向商会提一个提案——取消单一收购制，开放自由交易。', emotion: 'neutral' },
      { speaker: '王员外', content: '（放下茶杯）自由交易？年轻人，你知道商会为什么要统一收购吗？是为了维持市价稳定！', emotion: 'angry' },
      { speaker: '张四方', content: '（插话）我倒想听听这位书生怎么说。王员外，你稳的是你的价吧？', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '据理力争："王员外，你的一两茶二十文收，转手在襄州卖八十文——这不叫稳定市价，这叫剥削！"',
        next: 'ch1_chamber_debate',
        effects: [
          { type: 'affection', target: 'wangyuanwai', value: -20 },
          { type: 'fame', value: 10 },
          { type: 'business_rep', value: 10 }
        ]
      },
      {
        text: '拉拢中间派：先与张四方私下沟通，获取更多支持',
        next: 'ch1_chamber_ally_zhang',
        effects: [
          { type: 'affection', target: 'zhangsifang', value: 15 },
          { type: 'business_rep', value: 5 }
        ]
      }
    ]
  },

  ch1_chamber_debate: {
    id: 'ch1_chamber_debate',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '你的话在堂中引起一阵骚动。几个小商人开始交头接耳。', emotion: 'neutral' },
      { speaker: '王员外', content: '（拍桌）放肆！你一个外来人，懂什么茶叶生意？', emotion: 'angry' },
      { speaker: '张四方', content: '（站起身）我倒是觉得他说的有道理。咱们这些做小生意的，早就被王员外压得喘不过气了。', emotion: 'neutral' },
      { speaker: '旁白', content: '张四方站到了你这边。王员外脸色铁青。', emotion: 'neutral' },
      { speaker: '王员外', content: '好！那就投票表决！我倒要看看，在座的谁愿意为一介书生得罪我！', emotion: 'angry' }
    ],
    onEnter: [
      { type: 'alliance', target: 'zhangsifang', value: 1 },
      { type: 'business_rep', value: 10 }
    ],
    next: 'ch1_vote_start'
  },

  ch1_chamber_ally_zhang: {
    id: 'ch1_chamber_ally_zhang',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '（会后私下找到张四方）张老板，我看你刚才想说话。', emotion: 'neutral' },
      { speaker: '张四方', content: '（叹气）我早就想说了。我做的粮油生意，王员外收了我们两年的保护费。', emotion: 'angry' },
      { speaker: '张四方', content: '但没人敢出头。今天你敢来，我佩服你。投票的时候，我站你这边。', emotion: 'neutral' },
      { speaker: '', content: '多谢张老板。打破垄断，对你对我对所有人都好。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'alliance', target: 'zhangsifang', value: 1 },
      { type: 'business_rep', value: 8 }
    ],
    next: 'ch1_vote_start'
  },

  ch1_vote_start: {
    id: 'ch1_vote_start',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '【商会投票】关于"取消单一收购制、开放自由交易"的提案进入表决。', emotion: 'neutral' },
      { speaker: '旁白', content: '你需要五票通过。目前：你+李明+张四方=3票。王员外+其附庸=3票。还有两位中间商人待拉拢。', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '拜访中间商人赵记茶莊，说服他投赞成票',
        next: 'ch1_vote_persuade_1',
        effects: [
          { type: 'gold', value: -40 }
        ]
      },
      {
        text: '以未来合作利益为筹码，联合其他小商贩',
        next: 'ch1_vote_persuade_2',
        effects: [
          { type: 'business_rep', value: 5 }
        ]
      }
    ]
  },

  ch1_vote_persuade_1: {
    id: 'ch1_vote_persuade_1',
    type: 'dialogue',
    dialogue: [
      { speaker: '赵掌柜', content: '说实话，我也怕王员外。但我更怕一辈子被人卡着脖子做生意。', emotion: 'neutral' },
      { speaker: '赵掌柜', content: '你那茶叶要是能送出去，我赵记茶莊的茶也能跟着走。这笔账我算得清。', emotion: 'neutral' },
      { speaker: '', content: '那就请赵掌柜投出你的一票。', emotion: 'neutral' },
      { speaker: '赵掌柜', content: '（点头）投了！', emotion: 'happy' }
    ],
    onEnter: [
      { type: 'business_rep', value: 5 }
    ],
    next: 'ch1_vote_result'
  },

  ch1_vote_persuade_2: {
    id: 'ch1_vote_persuade_2',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '你在茶棚召集了几个小商贩，提出了一个大胆的想法——成立独立商会，与王员外分庭抗礼。', emotion: 'neutral' },
      { speaker: '旁白', content: '几个常年被压榨的小商人被你的话打动，纷纷表示愿意在投票中支持你。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'business_rep', value: 8 },
      { type: 'fame', value: 5 }
    ],
    next: 'ch1_vote_result'
  },

  ch1_vote_result: {
    id: 'ch1_vote_result',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '投票结果出来了——5比3，你的提案通过！商会将取消单一收购制，允许自由交易。', emotion: 'neutral' },
      { speaker: '旁白', content: '王员外当场摔了茶杯，扬长而去。但商会决定已经不可逆转。', emotion: 'neutral' },
      { speaker: '旁白', content: '不过你清楚——商会投票只是开始。王员外绝不会善罢甘休，接下来的商战会更激烈。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'business_rep', value: 20 },
      { type: 'fame', value: 15 },
      { type: 'market_share', value: 10 }
    ],
    next: 'ch1_prep_phase'
  },

  // ---- 准备阶段 ----
  ch1_prep_phase: {
    id: 'ch1_prep_phase',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '【第一章推进中】你现在可以自由行动，准备第一批茶叶货源。', emotion: 'neutral' },
      { speaker: '旁白', content: '关键指标：至少种植并收获50斤茶叶才能触发首批运货事件。', emotion: 'neutral' },
      { speaker: '旁白', content: '同时关注市场和商会动态——王员外的反击随时可能到来。', emotion: 'neutral' }
    ]
  },

  // ---- 首次茶叶出货 ----
  ch1_first_shipment: {
    id: 'ch1_first_shipment',
    type: 'event',
    background: '桃源村晒茶场——马刀头的镖队已整装待发',
    dialogue: [
      { speaker: '旁白', content: '茶叶准备好了。马刀头的镖队停在晒茶场，六匹骡子，驮着两百斤桃源春茶。', emotion: 'neutral' },
      { speaker: '李明', content: '京城那位主顾已经打了招呼。这批茶到了襄州，直接转水路北上，十天到京城。', emotion: 'neutral' },
      { speaker: '马刀头', content: '路线都探好了。夜里出发，走鹰嘴崖小道，天亮前就能出终南山地界。', emotion: 'neutral' },
      { speaker: '旁白', content: '但就在这时，村口放哨的小伙子跑了过来——', emotion: 'neutral' },
      { speaker: '', content: '不好了！王员外的人在村外设了卡，说要检查所有出村货物！', emotion: 'surprised' }
    ],
    choices: [
      {
        text: '让马刀头马上出发，趁夜色从小路走',
        next: 'ch1_shipment_escape',
        effects: [
          { type: 'affection', target: 'madaotou', value: 10 },
          { type: 'business_rep', value: 5 }
        ]
      },
      {
        text: '你去村口拖延王员外的人，给镖队争取时间',
        next: 'ch1_shipment_delay',
        effects: [
          { type: 'fame', value: 10 },
          { type: 'affection', target: 'wangyuanwai', value: -30 }
        ]
      },
      {
        text: '正面交锋：带村民直接与王员外理论',
        next: 'ch1_shipment_confront',
        effects: [
          { type: 'affection', target: 'laochen', value: 15 },
          { type: 'fame', value: 15 },
          { type: 'business_rep', value: 10 }
        ]
      }
    ]
  },

  ch1_shipment_escape: {
    id: 'ch1_shipment_escape',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '马刀头点头，带着镖队悄然消失在山路中。', emotion: 'neutral' },
      { speaker: '旁白', content: '王员外的人在村口等了两个时辰，什么都没查到，悻悻离去。', emotion: 'neutral' },
      { speaker: '旁白', content: '五天后，马刀头带着襄州茶市的回执回来了——两百斤春茶卖了三千二百文，是王员外收购价的三倍！', emotion: 'neutral' },
      { speaker: '马刀头', content: '而且京城的买家很满意，说以后有多少要多少！', emotion: 'happy' }
    ],
    onEnter: [
      { type: 'gold', value: 120 },
      { type: 'business_rep', value: 15 },
      { type: 'market_share', value: 5 }
    ],
    next: 'ch1_wang_counter'
  },

  ch1_shipment_delay: {
    id: 'ch1_shipment_delay',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '（走到村口）几位大哥，夜都深了还守在这儿？辛苦辛苦。来来来，喝碗热茶。', emotion: 'neutral' },
      { speaker: '旁白', content: '你陪王员外的人在村口喝了一个时辰的茶，聊天气聊收成，就是不提茶叶。', emotion: 'neutral' },
      { speaker: '旁白', content: '等你回到村里，镖队早已翻过了鹰嘴崖。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'gold', value: 100 },
      { type: 'business_rep', value: 5 }
    ],
    next: 'ch1_wang_counter'
  },

  ch1_shipment_confront: {
    id: 'ch1_shipment_confront',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '（带着老陈和几个年轻村民走到村口）王员外，大晚上的来查货？手续呢？', emotion: 'neutral' },
      { speaker: '王员外', content: '（坐在马车里，冷冷地）我怀疑你们走私茶叶。', emotion: 'angry' },
      { speaker: '老陈', content: '走私？放屁！桃源村种自己的茶，卖自己的货，天经地义！', emotion: 'angry' },
      { speaker: '旁白', content: '两边对峙。但你提前通知了马刀头，镖队早已从山后小路出发了。', emotion: 'neutral' },
      { speaker: '王员外', content: '（沉默良久）你们会后悔的。', emotion: 'angry' }
    ],
    onEnter: [
      { type: 'gold', value: 80 },
      { type: 'affection', target: 'laochen', value: 20 },
      { type: 'fame', value: 20 },
      { type: 'affection', target: 'wangyuanwai', value: -40 }
    ],
    next: 'ch1_wang_counter'
  },

  // ---- 王员外反击：价格战 ----
  ch1_wang_counter: {
    id: 'ch1_wang_counter',
    type: 'event',
    background: '商会公告板前——围满了人',
    dialogue: [
      { speaker: '旁白', content: '你的茶叶成功卖到襄州的消息很快传开了。但随之而来的，是王员外的激烈反击。', emotion: 'neutral' },
      { speaker: '旁白', content: '商会公告：王员外宣布，即日起他的茶叶售价降至十五文一斤——远远低于成本价。', emotion: 'neutral' },
      { speaker: '张四方', content: '（急匆匆赶来）不好，王员外这是要打价格战！他资本雄厚，能亏一年；咱们撑不了两个月。', emotion: 'surprised' },
      { speaker: '李明', content: '（面色凝重）他要把我们拖垮，然后再回到垄断的老路……', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '不跟他打价格战——提高品质，走精品路线',
        next: 'ch1_price_war_quality',
        effects: [
          { type: 'business_rep', value: 10 }
        ]
      },
      {
        text: '联合李明张四方，集资对抗价格战',
        next: 'ch1_price_war_fight',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'alliance', target: 'liming', value: 1 }
        ]
      },
      {
        text: '开辟第三条出路：找官府备案，注册桃源茶商标',
        next: 'ch1_price_war_official',
        effects: [
          { type: 'fame', value: 10 }
        ]
      }
    ]
  },

  ch1_price_war_quality: {
    id: 'ch1_price_war_quality',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '王员外降价是他的事。咱们的茶品质好，襄州那边认的是品质，不是价格。', emotion: 'neutral' },
      { speaker: '李明', content: '（恍然）说得对！京城的买家要的是顶级春茶，越贵他越要。王员外降价，反而把低端市场让给我们了。', emotion: 'happy' },
      { speaker: '旁白', content: '你们决定不走价格战，而是主攻精品茶叶，专供高端市场。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'business_rep', value: 12 },
      { type: 'skill', target: 'tea_quality', value: 1 }
    ],
    next: 'ch1_tea_war_victory'
  },

  ch1_price_war_fight: {
    id: 'ch1_price_war_fight',
    type: 'dialogue',
    dialogue: [
      { speaker: '张四方', content: '我出两百两。李明你出多少？', emotion: 'neutral' },
      { speaker: '李明', content: '三百两。咱们凑起来，跟王员外打三个月，等他的老主顾动摇。', emotion: 'neutral' },
      { speaker: '旁白', content: '三方集资，正面迎战。这是一场豪赌。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'gold', value: 100 },
      { type: 'business_rep', value: 5 }
    ],
    next: 'ch1_tea_war_victory'
  },

  ch1_price_war_official: {
    id: 'ch1_price_war_official',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '我去县城找县丞。桃源村的茶叶品质独特，可以申请地理标识。有了官府背书，王员外就没法垄断了。', emotion: 'neutral' },
      { speaker: '李明', content: '好主意！不过官场那套，你一个书生……', emotion: 'surprised' },
      { speaker: '', content: '（微笑）别忘了我也是读过十年书的人。写状子，我熟。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'fame', value: 15 },
      { type: 'business_rep', value: 8 }
    ],
    next: 'ch1_tea_war_victory'
  },

  ch1_tea_war_victory: {
    id: 'ch1_tea_war_victory',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '两个月后——桃源村的茶叶在襄州打开了市场。品质口碑加上李明的人脉，订单纷至沓来。', emotion: 'neutral' },
      { speaker: '旁白', content: '王员外的价格战没有拖垮你，反而让他自己的利润大幅缩水。他的几个老主顾开始动摇——毕竟，低价的茶叶品质也确实差。', emotion: 'neutral' },
      { speaker: '旁白', content: '更关键的是——商会里支持你的人越来越多。王员外的垄断，正在一块块松动。', emotion: 'neutral' },
      { speaker: '旁白', content: '但你知道——野兽在濒死时，才最危险。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'business_rep', value: 25 },
      { type: 'market_share', value: 15 },
      { type: 'fame', value: 10 }
    ],
    next: 'ch1_cargo_intercept'
  },

  // ---- 截货事件 ----
  ch1_cargo_intercept: {
    id: 'ch1_cargo_intercept',
    type: 'event',
    background: '鹰嘴崖山道——深夜',
    dialogue: [
      { speaker: '旁白', content: '深夜，一阵急促的敲门声打破了桃源村的宁静。', emotion: 'neutral' },
      { speaker: '马刀头', content: '（浑身是泥）出事了！王员外的人在鹰嘴崖设伏，截了我们的第二批货！', emotion: 'angry' },
      { speaker: '马刀头', content: '三百斤茶叶全没了。他们还打伤了两个镖师。', emotion: 'angry' },
      { speaker: '李明', content: '（脸色煞白）那三百斤是京城大主顾的订单……如果违约，我们不光赔钱，连信誉都没了。', emotion: 'surprised' }
    ],
    choices: [
      {
        text: '带人去鹰嘴崖，直接要回货物',
        next: 'ch1_cargo_retrieve',
        effects: [
          { type: 'affection', target: 'madaotou', value: 15 },
          { type: 'stamina', value: -20 }
        ]
      },
      {
        text: '报官处理——这是明抢，官府必须管',
        next: 'ch1_cargo_report',
        effects: [
          { type: 'fame', value: 5 },
          { type: 'gold', value: -50 }
        ]
      },
      {
        text: '智取：用假消息诱开截货者，再从小路运新货',
        next: 'ch1_cargo_smart',
        effects: [
          { type: 'business_rep', value: 10 },
          { type: 'affection', target: 'liming', value: 10 }
        ]
      }
    ]
  },

  ch1_cargo_retrieve: {
    id: 'ch1_cargo_retrieve',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '你和马刀头带着一队镖师和村民，连夜赶到鹰嘴崖。', emotion: 'neutral' },
      { speaker: '旁白', content: '王员外的人没想到你们来得这么快。一场混战后，他们丢下货物逃散了。', emotion: 'neutral' },
      { speaker: '马刀头', content: '（擦了擦脸上的血）货追回来了大半。但我们这样硬碰硬不是长久之计。', emotion: 'neutral' },
      { speaker: '', content: '你说得对。下次不能这么冒险了。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'gold', value: -30 },
      { type: 'affection', target: 'madaotou', value: 20 }
    ],
    next: 'ch1_showdown_prep'
  },

  ch1_cargo_report: {
    id: 'ch1_cargo_report',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '你写了一封状子，附上商会投票记录和证人证言，亲自送到了县衙。', emotion: 'neutral' },
      { speaker: '旁白', content: '县丞看完状子，叹了口气——王员外在县衙有人，这个案子很难办。', emotion: 'neutral' },
      { speaker: '旁白', content: '不过状子一递，王员外至少在明面上不敢再派人拦路了。他改为用商业手段。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'fame', value: 8 },
      { type: 'business_rep', value: 5 }
    ],
    next: 'ch1_showdown_prep'
  },

  ch1_cargo_smart: {
    id: 'ch1_cargo_smart',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '你放出假消息——说新一批茶叶打算走官道。王员外的人果然去官道设伏。', emotion: 'neutral' },
      { speaker: '旁白', content: '与此同时，真正的货悄悄走鹰嘴崖小路，成功运到了襄州。', emotion: 'neutral' },
      { speaker: '', content: '（独白）兵不厌诈。王员外大概忘了，计谋这东西，读书人也懂。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'business_rep', value: 15 },
      { type: 'gold', value: 80 }
    ],
    next: 'ch1_showdown_prep'
  },

  // ---- 终局：与王员外的最后对决 ----
  ch1_showdown_prep: {
    id: 'ch1_showdown_prep',
    type: 'system',
    dialogue: [
      { speaker: '旁白', content: '商战到了最后阶段。王员外伤筋动骨，但百足之虫死而不僵。', emotion: 'neutral' },
      { speaker: '旁白', content: '接下来是你的选择——如何终结这场商战？', emotion: 'neutral' }
    ],
    choices: [
      {
        text: '商会弹劾：发起提案，剥夺王员外商会理事资格',
        next: 'ch1_showdown_vote',
        effects: []
      },
      {
        text: '商业收购：联合李明，收购王员外麾下茶莊',
        next: 'ch1_showdown_buyout',
        effects: []
      },
      {
        text: '和解谈判：给王员外一个体面退出的机会',
        next: 'ch1_showdown_peace',
        effects: []
      }
    ]
  },

  ch1_showdown_vote: {
    id: 'ch1_showdown_vote',
    type: 'dialogue',
    dialogue: [
      { speaker: '旁白', content: '商会大会上，你提交了弹劾王员外的提案。', emotion: 'neutral' },
      { speaker: '', content: '王员外利用单一收购制盘剥茶农多年，如今又以价格战扰乱市场秩序——我提议，撤销其商会理事资格。', emotion: 'neutral' },
      { speaker: '旁白', content: '投票开始。出乎意料的是——连王员外以前的跟班都投了赞成票。', emotion: 'neutral' },
      { speaker: '旁白', content: '最终票数：7比1。王员外被逐出商会。', emotion: 'neutral' },
      { speaker: '王员外', content: '（缓缓起身）……你们以为赢了吗？没有我王某人，桃源镇的茶叶迟早被襄州商会吞并。等着瞧。', emotion: 'angry' }
    ],
    onEnter: [
      { type: 'business_rep', value: 30 },
      { type: 'fame', value: 25 },
      { type: 'market_share', value: 20 }
    ],
    next: 'ch1_end_chapter'
  },

  ch1_showdown_buyout: {
    id: 'ch1_showdown_buyout',
    type: 'dialogue',
    dialogue: [
      { speaker: '李明', content: '（看着账本）王员外名下有三间茶莊、两个仓库。如果我们能拿下来——', emotion: 'neutral' },
      { speaker: '', content: '他现在资金链紧张。我们出价，只看他卖不卖。', emotion: 'neutral' },
      { speaker: '旁白', content: '谈判很艰难。但最终，王员外不得不接受现实——他卖掉了茶莊，退出终南山茶叶市场。', emotion: 'neutral' },
      { speaker: '旁白', content: '李明茗香茶庄与桃源村茶叶正式合并，成立"终南茶社"。你成为了三大股东之一。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'gold', value: 200 },
      { type: 'business_rep', value: 25 },
      { type: 'market_share', value: 25 }
    ],
    next: 'ch1_end_chapter'
  },

  ch1_showdown_peace: {
    id: 'ch1_showdown_peace',
    type: 'dialogue',
    dialogue: [
      { speaker: '', content: '（独自前往王员外府邸）王员外，我来不是跟你斗的。', emotion: 'neutral' },
      { speaker: '王员外', content: '（疲惫地）那你来做什么？看我笑话？', emotion: 'neutral' },
      { speaker: '', content: '你的商路、你的人脉，都是宝贵的。与其斗得两败俱伤，不如——合作。', emotion: 'neutral' },
      { speaker: '王员外', content: '（沉默良久）……我王某人做了二十年生意，你是第一个打赢了我还肯坐下来跟我谈合作的。', emotion: 'surprised' },
      { speaker: '旁白', content: '最终，王员外保留了他的茶莊，但放弃了垄断权。桃源村茶叶通过他的商路销往远方，他则从收购商变成了合作伙伴。', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'affection', target: 'wangyuanwai', value: 40 },
      { type: 'business_rep', value: 20 },
      { type: 'alliance', target: 'wangyuanwai', value: 1 }
    ],
    next: 'ch1_end_chapter'
  },

  ch1_end_chapter: {
    id: 'ch1_end_chapter',
    type: 'narration',
    dialogue: [
      { speaker: '旁白', content: '就这样，你——一个落榜书生——在桃源村站稳了脚跟。', emotion: 'neutral' },
      { speaker: '旁白', content: '你的三亩田地生机勃勃，你的茶叶打开了销路，你的朋友遍布桃源镇。', emotion: 'neutral' },
      { speaker: '旁白', content: '但你知道，这只是开始。终南山外，还有更大的世界在等你。', emotion: 'neutral' },
      { speaker: '旁白', content: '——第一章·春耕·完——', emotion: 'neutral' },
      { speaker: '旁白', content: '【提示】继续经营你的田地和商路，季节特殊事件即将到来！', emotion: 'neutral' }
    ],
    onEnter: [
      { type: 'gold', value: 50 },
      { type: 'fame', value: 20 },
      { type: 'unlock', value: 2 }
    ]
  }
}

// ============================================
// 章节定义
// ============================================
export const chapters: Chapter[] = [
  {
    id: 'prologue',
    title: '序章',
    subtitle: '归去来兮',
    startNode: 'prologue_start',
    description: '落榜书生，归隐桃源'
  },
  {
    id: 'chapter1',
    title: '第一章',
    subtitle: '春耕',
    startNode: 'ch1_intro',
    description: '春天来了，麻烦也来了'
  }
]

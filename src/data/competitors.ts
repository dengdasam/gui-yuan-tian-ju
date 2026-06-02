import type { Competitor } from '../types'

export const competitors: Competitor[] = [
  {
    id: 'wangyuanwai',
    name: '王员外',
    title: '终南首富',
    description: '镇上首富，掌控周边粮食和茶叶收购渠道。手段强硬，不择手段。拥有三条商路和两个官府批文。',
    wealth: 5000,
    relationship: -10,
    style: 'aggressive',
    active: true,
    lastAction: '试图低价收购桃源村茶叶',
    marketShare: 45,
    allied: false,
    voteWeight: 3
  },
  {
    id: 'liming',
    name: '李明',
    title: '茶商',
    description: '县城茶商，年轻有为，但不敢得罪王员外。家族茶庄有百年历史，如今衰落，渴望复兴。',
    wealth: 1500,
    relationship: 0,
    style: 'cooperative',
    active: true,
    lastAction: '观望桃源村局势',
    marketShare: 10,
    allied: false,
    voteWeight: 1
  },
  {
    id: 'zhangsifang',
    name: '张四方',
    title: '粮油商',
    description: '邻镇粮油商人，经营范围广，与王员外有旧怨。为人豪爽，重情义。',
    wealth: 3000,
    relationship: 0,
    style: 'neutral',
    active: false,
    lastAction: '（尚未接触）',
    marketShare: 15,
    allied: false,
    voteWeight: 1
  },
  {
    id: 'zhaopuzi',
    name: '赵掌柜',
    title: '赵记茶莊',
    description: '赵记茶莊的掌柜，年过五十，为人谨慎。他的茶莊虽然不大，但在品质方面口碑极好。',
    wealth: 800,
    relationship: 0,
    style: 'cooperative',
    active: false,
    lastAction: '（尚未接触）',
    marketShare: 5,
    allied: false,
    voteWeight: 1
  },
  {
    id: 'xiangzhoushanghui',
    name: '襄州商会',
    title: '襄州商会会长',
    description: '襄州最大的商会，会长位高权重。如果能争取到他们的订单，整个终南山市场格局都将改变。',
    wealth: 20000,
    relationship: 0,
    style: 'neutral',
    active: false,
    lastAction: '（尚未接触）',
    marketShare: 25,
    allied: false,
    voteWeight: 5
  }
]

# 🎮 归园田居 — 古风田园经营+商战文字游戏

## 项目概览

| 维度 | 说明 |
|------|------|
| **游戏名称** | 归园田居 |
| **类型** | 古风叙事冒险 + 田园经营 + 商海博弈 |
| **平台** | Web 网页（响应式） |
| **技术栈** | Vue 3 + TypeScript + Vite + Pinia + Vue Router |
| **状态** | 3章剧情完成，6个NPC，商战系统，季节事件系统，localStorage存档 |

## 快速开始

```bash
npm install
npm run dev    # 开发模式
npm run build  # 生产构建
```

## 已实现系统

- **剧情系统**：序章至第三章，80+故事节点，分支叙事
- **经营系统**：6块田地，8种作物，浇水/施肥/收获
- **商战系统**：商会投票、价格战、截货事件、敌对行动
- **NPC 系统**：6位角色，好感度、送礼、支线任务
- **时间系统**：永安年号、四季节气、日夜交替、天气变化
- **季节事件**：春耕/秋收等特殊事件
- **存档系统**：3槽位 localStorage 完整存档

## 项目结构

```
src/
├── data/          # 游戏数据（剧情/NPC/作物/竞争对手/季节事件）
├── stores/        # Pinia 状态管理
├── components/    # 9个游戏组件
├── views/         # 标题画面 + 游戏主界面
├── composables/   # 工具函数
├── types/         # TypeScript 类型定义
└── router/        # 路由配置
```

## 修复记录

| # | Bug | 日期 |
|---|-----|------|
| 1 | resolveChamberVoteInternal voteId 未定义 | 2026-06-02 |
| 2 | SeasonalEventDialog 有选择时仍显示继续按钮 | 2026-06-02 |
| 3 | SceneCanvas Math.random() 元素闪烁 | 2026-06-02 |
| 4 | completeSeasonalEvent 多余 advanceTime() | 2026-06-02 |
| 5 | FarmPanel 直接修改 store 状态 | 2026-06-02 |

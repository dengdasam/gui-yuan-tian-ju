<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import { crops } from '../data/crops'

const store = useGameStore()
const activeTab = ref<'market' | 'sell' | 'competitors' | 'chamber'>('market')

function getCropName(id: string) {
  return crops.find(c => c.id === id)?.name || id
}

function getCropIcon(id: string) {
  return crops.find(c => c.id === id)?.icon || ''
}
</script>

<template>
  <div class="market-panel panel">
    <h3 class="panel-title">🏪 集市交易</h3>

    <!-- Tab 切换 -->
    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'market' }" @click="activeTab = 'market'">行情</button>
      <button class="tab-btn" :class="{ active: activeTab === 'sell' }" @click="activeTab = 'sell'">出售</button>
      <button class="tab-btn" :class="{ active: activeTab === 'competitors' }" @click="activeTab = 'competitors'">商界</button>
      <button class="tab-btn" :class="{ active: activeTab === 'chamber' }" @click="activeTab = 'chamber'">
        商会
        <span v-if="store.activeChamberVote" class="badge">●</span>
      </button>
    </div>

    <!-- 行情 Tab -->
    <div v-if="activeTab === 'market'" class="tab-content">
      <div class="market-list">
        <div v-for="item in store.market" :key="item.cropId" class="market-item">
          <span class="market-icon">{{ getCropIcon(item.cropId) }}</span>
          <span class="market-name">{{ getCropName(item.cropId) }}</span>
          <span class="market-price">{{ item.price }}文</span>
          <span class="market-trend" :class="item.trend">
            {{ item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→' }}
          </span>
        </div>
      </div>

      <!-- 价格战警示 -->
      <div v-if="store.activePriceWar" class="price-war-alert">
        <div class="alert-icon">⚔️</div>
        <div class="alert-content">
          <div class="alert-title">价格战进行中！</div>
          <div class="alert-desc">
            {{ getCropName(store.activePriceWar.cropId) }}价格已跌至 {{ store.activePriceWar.currentPrice }}文
          </div>
          <div class="alert-progress">
            <div class="alert-bar" :style="{ width: (store.activePriceWar.currentDay - store.activePriceWar.startDay) / store.activePriceWar.maxDays * 100 + '%' }"></div>
          </div>
        </div>
      </div>

      <button class="btn btn-small" style="width:100%;margin-top:8px" @click="store.advanceTime()">
        刷新行情（过一天）
      </button>
    </div>

    <!-- 出售 Tab -->
    <div v-if="activeTab === 'sell'" class="tab-content">
      <div v-if="store.player.inventory.filter(i => i.type === 'crop').length === 0" class="empty-state">
        背包里还没有可出售的农产品
      </div>
      <div v-else class="inventory-list">
        <div
          v-for="item in store.player.inventory.filter(i => i.type === 'crop')"
          :key="item.itemId"
          class="inv-item"
        >
          <span class="inv-icon">{{ item.icon }}</span>
          <div class="inv-info">
            <span class="inv-name">{{ item.name }} ×{{ item.quantity }}</span>
            <span class="inv-price">
              市价 {{ store.market.find(m => m.cropId === item.itemId)?.price || '?' }} 文/斤
            </span>
          </div>
          <button class="btn btn-small btn-gold" @click="store.sellItem(item.itemId, item.quantity)">全卖</button>
        </div>
      </div>
    </div>

    <!-- 商界 Tab -->
    <div v-if="activeTab === 'competitors'" class="tab-content">
      <div class="comp-summary">
        <span>你的份额：{{ store.player.marketShare }}%</span>
        <span>商业信誉：{{ store.player.businessReputation }}</span>
      </div>
      <div v-for="comp in store.competitors" :key="comp.id" class="comp-item">
        <div class="comp-header">
          <span class="comp-name">{{ comp.name }}</span>
          <span class="comp-title-tag">{{ comp.title || '' }}</span>
          <span class="comp-relation" :class="{ friendly: comp.relationship > 20, hostile: comp.relationship < -20, allied: comp.allied }">
            {{ comp.allied ? '🤝 盟友' : comp.relationship > 20 ? '友好' : comp.relationship < -20 ? '敌对' : '中立' }}
          </span>
        </div>
        <div class="comp-stats">
          <span class="comp-wealth">💰 {{ comp.wealth }}贯</span>
          <span class="comp-share">📊 份额{{ comp.marketShare }}%</span>
          <span class="comp-votes">🗳 {{ comp.voteWeight }}票</span>
        </div>
        <div class="comp-desc">{{ comp.description }}</div>
        <div class="comp-action" v-if="comp.lastAction">📌 {{ comp.lastAction }}</div>
      </div>
    </div>

    <!-- 商会 Tab -->
    <div v-if="activeTab === 'chamber'" class="tab-content">
      <!-- 活跃投票 -->
      <div v-if="store.activeChamberVote" class="chamber-vote-card">
        <div class="vote-header">
          <span class="vote-badge">投票中</span>
          <span class="vote-type">{{ store.activeChamberVote.type === 'monopoly_break' ? '打破垄断' : store.activeChamberVote.type === 'price_control' ? '价格管控' : store.activeChamberVote.type === 'trade_route' ? '商路开放' : '一般提案' }}</span>
        </div>
        <div class="vote-title">{{ store.activeChamberVote.title }}</div>
        <div class="vote-desc">{{ store.activeChamberVote.description }}</div>
        <div class="vote-progress">
          <div class="vote-bar-container">
            <div class="vote-bar yes" :style="{ width: (store.activeChamberVote.yesVotes / store.activeChamberVote.totalVotes * 100) + '%' }"></div>
          </div>
          <div class="vote-counts">
            <span class="vote-yes">赞成 {{ store.activeChamberVote.yesVotes }}</span>
            <span class="vote-no">反对 {{ store.activeChamberVote.noVotes }}</span>
            <span class="vote-total">共 {{ store.activeChamberVote.totalVotes }} 票</span>
          </div>
        </div>
        <div class="vote-voters">
          <div v-for="voter in store.activeChamberVote.votes" :key="voter.competitorId" class="voter-row">
            <span class="voter-name">{{ store.competitors.find(c => c.id === voter.competitorId)?.name || voter.competitorId }}</span>
            <span class="voter-status" :class="{ yes: voter.vote === 'yes', no: voter.vote === 'no', pending: !voter.voted }">
              {{ voter.vote === 'yes' ? '✓' : voter.vote === 'no' ? '✗' : '⋯' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 过往投票 -->
      <div v-if="store.chamberVotes.filter(v => v.status !== 'voting').length > 0" class="past-votes">
        <div class="section-label">过往决议</div>
        <div v-for="vote in store.chamberVotes.filter(v => v.status !== 'voting')" :key="vote.id" class="past-vote-item">
          <span class="past-icon">{{ vote.status === 'passed' ? '✅' : '❌' }}</span>
          <span class="past-title">{{ vote.title }}</span>
          <span class="past-result">{{ vote.status === 'passed' ? '通过' : '否决' }}</span>
        </div>
      </div>

      <div v-if="!store.activeChamberVote && store.chamberVotes.filter(v => v.status !== 'voting').length === 0" class="empty-state">
        暂无商会活动。推进主线剧情以开启商会系统。
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-panel { display: flex; flex-direction: column; }

.panel-title {
  font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 8px;
}

.tabs {
  display: flex; gap: 4px; margin-bottom: 10px;
  border-bottom: 1px solid var(--border-light); padding-bottom: 8px;
}

.tab-btn {
  font-family: var(--font-body); font-size: 13px; padding: 4px 12px;
  border: none; background: transparent; color: var(--text-muted);
  cursor: pointer; border-radius: 4px; transition: all 0.2s; position: relative;
}
.tab-btn:hover { color: var(--ink); }
.tab-btn.active { background: var(--ink); color: var(--text-inverse); }

.badge {
  color: var(--red); font-size: 8px; position: absolute; top: -2px; right: 4px;
  animation: pulse 1.5s infinite;
}

.tab-content { max-height: 260px; overflow-y: auto; }

.market-list { display: flex; flex-direction: column; gap: 4px; }
.market-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: 4px; font-size: 13px;
}
.market-icon { font-size: 16px; }
.market-name { flex: 1; color: var(--text-primary); }
.market-price { font-weight: 600; color: var(--gold); min-width: 48px; text-align: right; }
.market-trend { font-size: 14px; }
.market-trend.up { color: var(--red); }
.market-trend.down { color: var(--green); }
.market-trend.stable { color: var(--text-muted); }

.price-war-alert {
  margin-top: 8px; padding: 10px; background: linear-gradient(135deg, #fef2f2, #fff7ed);
  border: 1px solid var(--red-light); border-radius: var(--radius); display: flex; gap: 8px;
}
.alert-icon { font-size: 20px; }
.alert-content { flex: 1; }
.alert-title { font-size: 13px; font-weight: 700; color: var(--red); }
.alert-desc { font-size: 12px; color: var(--text-secondary); margin: 2px 0; }
.alert-progress { height: 4px; background: var(--border-light); border-radius: 2px; margin-top: 4px; }
.alert-bar { height: 100%; background: var(--red); border-radius: 2px; transition: width 0.5s; }

.empty-state { padding: 20px; text-align: center; color: var(--text-muted); font-style: italic; font-size: 13px; }

.inventory-list { display: flex; flex-direction: column; gap: 6px; }
.inv-item {
  display: flex; align-items: center; gap: 8px; padding: 8px;
  border: 1px solid var(--border-light); border-radius: var(--radius); background: var(--bg-paper);
}
.inv-icon { font-size: 20px; }
.inv-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.inv-name { font-size: 14px; font-weight: 600; }
.inv-price { font-size: 12px; color: var(--text-muted); }

.comp-summary {
  display: flex; justify-content: space-between; padding: 8px;
  background: var(--bg-primary); border-radius: var(--radius);
  font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;
}

.comp-item { padding: 8px 0; border-bottom: 1px solid var(--border-light); }
.comp-item:last-child { border-bottom: none; }
.comp-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.comp-name { font-weight: 600; font-size: 14px; }
.comp-title-tag { font-size: 10px; color: var(--text-muted); background: var(--border-light); padding: 1px 6px; border-radius: 3px; }
.comp-relation { font-size: 11px; padding: 1px 8px; border-radius: 4px; background: var(--border-light); }
.comp-relation.friendly { background: var(--green-light); color: var(--green); }
.comp-relation.hostile { background: var(--red-light); color: var(--red); }
.comp-relation.allied { background: var(--blue-light, #e0f2fe); color: #2563eb; }
.comp-stats { display: flex; gap: 12px; font-size: 11px; color: var(--text-muted); margin-bottom: 2px; }
.comp-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.comp-action { font-size: 11px; color: var(--text-secondary); font-style: italic; }

/* 商会投票卡片 */
.chamber-vote-card {
  padding: 12px; background: linear-gradient(135deg, #f0f9ff, #faf5ff);
  border: 1px solid var(--blue-light, #bae6fd); border-radius: var(--radius);
}
.vote-header { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.vote-badge {
  font-size: 11px; padding: 2px 8px; border-radius: 4px;
  background: var(--blue-light, #dbeafe); color: #1d4ed8; font-weight: 600;
}
.vote-type { font-size: 12px; color: var(--text-muted); }
.vote-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.vote-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; }

.vote-progress { margin-bottom: 10px; }
.vote-bar-container { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.vote-bar.yes { height: 100%; background: var(--green); border-radius: 4px; transition: width 0.5s; }
.vote-counts { display: flex; justify-content: space-between; margin-top: 4px; font-size: 11px; }
.vote-yes { color: var(--green); }
.vote-no { color: var(--red); }
.vote-total { color: var(--text-muted); }

.vote-voters { display: flex; flex-direction: column; gap: 4px; }
.voter-row { display: flex; justify-content: space-between; font-size: 12px; }
.voter-name { color: var(--text-primary); }
.voter-status { font-weight: 600; }
.voter-status.yes { color: var(--green); }
.voter-status.no { color: var(--red); }
.voter-status.pending { color: var(--text-muted); animation: pulse 1.5s infinite; }

.past-votes { margin-top: 10px; }
.section-label {
  font-size: 12px; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; margin-bottom: 6px;
}
.past-vote-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 0;
  border-bottom: 1px solid var(--border-light); font-size: 13px;
}
.past-icon { font-size: 14px; }
.past-title { flex: 1; color: var(--text-primary); }
.past-result { font-size: 11px; color: var(--text-muted); }
</style>

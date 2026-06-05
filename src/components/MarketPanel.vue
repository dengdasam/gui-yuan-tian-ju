<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { getCropName, getCropIcon, formatMoney } from '../composables/useGameHelpers'
import type { ShopItemCategory } from '../types'

const store = useGameStore()
const activeTab = ref<'shop' | 'market' | 'sell' | 'competitors' | 'chamber'>('shop')
const shopFilter = ref<ShopItemCategory | '全部'>('全部')
const buyQty = ref<Record<string, number>>({})

function getQty(itemId: string): number {
  return buyQty.value[itemId] || 1
}
function incQty(itemId: string) {
  buyQty.value[itemId] = Math.min(99, getQty(itemId) + 1)
}
function decQty(itemId: string) {
  buyQty.value[itemId] = Math.max(1, getQty(itemId) - 1)
}

const filteredShopItems = computed(() => {
  const items = store.getAvailableShopItems()
  if (shopFilter.value === '全部') return items
  return items.filter(i => i.category === shopFilter.value)
})

function getItemPrice(item: any): { original: number; current: number; discount: number } {
  const deal = store.shopState.dailyDeals.find((d: any) => d.itemId === item.id)
  const repDiscount = store.shopState.discountLevel * 3
  let price = item.basePrice
  let dealPct = 0
  if (deal) {
    dealPct = deal.discount
    price = Math.floor(price * (1 - dealPct / 100))
  }
  price = Math.floor(price * (1 - repDiscount / 100))
  return { original: item.basePrice, current: price, discount: dealPct || repDiscount }
}
</script>

<template>
  <div class="market-panel panel">
    <h3 class="panel-title">🏪 集市交易</h3>

    <!-- Tab 切换 -->
    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'shop' }" @click="activeTab = 'shop'">
        商店
        <span v-if="store.shopState.dailyDeals.length > 0" class="badge deal-badge">惠</span>
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'market' }" @click="activeTab = 'market'">行情</button>
      <button class="tab-btn" :class="{ active: activeTab === 'sell' }" @click="activeTab = 'sell'">出售</button>
      <button class="tab-btn" :class="{ active: activeTab === 'competitors' }" @click="activeTab = 'competitors'">商界</button>
      <button class="tab-btn" :class="{ active: activeTab === 'chamber' }" @click="activeTab = 'chamber'">
        商会
        <span v-if="store.activeChamberVote" class="badge">●</span>
      </button>
    </div>

    <!-- ==================== 商店 Tab ==================== -->
    <div v-if="activeTab === 'shop'" class="tab-content">
      <!-- 声望条 -->
      <div class="shop-rep-bar">
        <div class="rep-label">
          <span>🏅 商店声望</span>
          <span class="rep-value">Lv.{{ store.shopState.discountLevel }} ({{ store.shopState.discountLevel * 3 }}%折扣)</span>
        </div>
        <div class="rep-progress">
          <div class="rep-fill" :style="{ width: (store.shopState.reputation % 20) / 20 * 100 + '%' }"></div>
        </div>
        <div class="rep-detail">累计消费 {{ store.shopState.totalSpent }} 文 · 声望 {{ store.shopState.reputation }}/100</div>
      </div>

      <!-- 每日特价 -->
      <div v-if="store.shopState.dailyDeals.length > 0" class="deals-section">
        <div class="deals-label">🔥 今日特价</div>
        <div class="deals-list">
          <div v-for="deal in store.shopState.dailyDeals" :key="deal.itemId" class="deal-tag">
            <span>{{ store.shopState.dailyDeals.find((d: any) => d.itemId === deal.itemId)?.discount || deal.discount }}%OFF · 剩{{ deal.remainingDays }}天</span>
          </div>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="shop-categories">
        <button
          v-for="cat in (['全部', '种子', '肥料', '工具', '杂货'] as const)"
          :key="cat"
          class="cat-btn"
          :class="{ active: shopFilter === cat }"
          @click="shopFilter = cat"
        >{{ cat }}</button>
      </div>

      <!-- 商品列表 -->
      <div class="shop-grid" v-if="filteredShopItems.length > 0">
        <div v-for="item in filteredShopItems" :key="item.id" class="shop-card"
          :class="{ locked: !store.getAvailableShopItems().find((i: any) => i.id === item.id) }">
          <div class="shop-card-icon">{{ item.icon }}</div>
          <div class="shop-card-info">
            <div class="shop-card-name">{{ item.name }}</div>
            <div class="shop-card-desc">{{ item.description }}</div>
            <div class="shop-card-bottom">
              <div class="shop-card-price">
                <span v-if="getItemPrice(item).discount > 0" class="price-original">{{ item.basePrice }}文</span>
                <span class="price-current" :class="{ discounted: getItemPrice(item).discount > 0 }">
                  {{ getItemPrice(item).current }}文
                </span>
              </div>
              <div class="shop-card-stock" v-if="item.stock !== -1">
                库存 {{ item.stock }}
              </div>
              <div class="shop-card-stock unlimited" v-else>无限</div>
            </div>
            <!-- 购买区 -->
            <div class="shop-card-buy">
              <div class="qty-control">
                <button class="qty-btn" @click="decQty(item.id)">−</button>
                <span class="qty-num">{{ getQty(item.id) }}</span>
                <button class="qty-btn" @click="incQty(item.id)">+</button>
              </div>
              <button class="btn btn-small btn-gold buy-btn"
                @click="store.buyShopItem(item.id, getQty(item.id))">
                购买 {{ getItemPrice(item).current * getQty(item.id) }}文
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">该分类下暂无商品</div>

      <!-- 我的背包物品（可使用） -->
      <div class="my-tools-section" v-if="store.player.inventory.filter(i => i.type === 'tool').length > 0">
        <div class="section-label">🎒 我的工具物品</div>
        <div v-for="item in store.player.inventory.filter(i => i.type === 'tool')" :key="item.itemId" class="tool-item">
          <span class="tool-icon">{{ item.icon }}</span>
          <span class="tool-name">{{ item.name }} ×{{ item.quantity }}</span>
          <button class="btn btn-small btn-use"
            @click="store.useShopItem(item.itemId, undefined)">
            使用
          </button>
        </div>
        <div class="tool-hint">💡 选择特定田地请在「🌱 田地」面板使用物品</div>
      </div>
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

/* ===== 商店 Tab 样式 ===== */
.shop-rep-bar {
  padding: 8px 10px; background: linear-gradient(135deg, #fefce8, #fef9c3);
  border: 1px solid #fde68a; border-radius: var(--radius); margin-bottom: 10px;
}
.rep-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
.rep-label span:first-child { font-weight: 600; color: var(--ink); }
.rep-value { color: #b45309; font-weight: 600; }
.rep-progress { height: 6px; background: #fef3c7; border-radius: 3px; overflow: hidden; margin-bottom: 2px; }
.rep-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #d97706); border-radius: 3px; transition: width 0.5s; }
.rep-detail { font-size: 10px; color: var(--text-muted); }

.deals-section { margin-bottom: 8px; }
.deals-label { font-size: 12px; font-weight: 700; color: #dc2626; margin-bottom: 4px; }
.deals-list { display: flex; gap: 6px; flex-wrap: wrap; }
.deal-tag {
  font-size: 10px; padding: 2px 8px; background: #fef2f2; color: #dc2626;
  border: 1px solid #fecaca; border-radius: 4px; font-weight: 600;
}

.shop-categories { display: flex; gap: 4px; margin-bottom: 10px; }
.cat-btn {
  font-family: var(--font-body); font-size: 12px; padding: 3px 10px;
  border: 1px solid var(--border-light); background: transparent;
  color: var(--text-muted); cursor: pointer; border-radius: 4px; transition: all 0.2s;
}
.cat-btn:hover { color: var(--ink); border-color: var(--text-muted); }
.cat-btn.active { background: var(--ink); color: var(--text-inverse); border-color: var(--ink); }

.deal-badge {
  position: absolute; top: -2px; right: 4px;
  font-size: 9px; color: #dc2626; font-weight: 700;
  animation: pulse 2s infinite;
}

.shop-grid { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.shop-card {
  display: flex; gap: 10px; padding: 10px;
  border: 1px solid var(--border-light); border-radius: var(--radius);
  background: var(--bg-paper); transition: all 0.2s;
}
.shop-card:hover { border-color: var(--gold); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.shop-card.locked { opacity: 0.4; pointer-events: none; }
.shop-card-icon { font-size: 28px; min-width: 36px; display: flex; align-items: flex-start; justify-content: center; padding-top: 2px; }
.shop-card-info { flex: 1; min-width: 0; }
.shop-card-name { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.shop-card-desc { font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-bottom: 6px; }
.shop-card-bottom { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.shop-card-price { display: flex; align-items: baseline; gap: 4px; }
.price-original { font-size: 11px; color: var(--text-muted); text-decoration: line-through; }
.price-current { font-size: 15px; font-weight: 700; color: var(--gold); }
.price-current.discounted { color: #dc2626; }
.shop-card-stock { font-size: 11px; color: var(--text-muted); }
.shop-card-stock.unlimited { color: var(--green); }
.shop-card-buy { display: flex; align-items: center; gap: 8px; }
.qty-control { display: flex; align-items: center; gap: 0; border: 1px solid var(--border-light); border-radius: 4px; overflow: hidden; }
.qty-btn {
  width: 24px; height: 24px; border: none; background: var(--bg-primary);
  color: var(--text-primary); font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.qty-btn:hover { background: var(--border-light); }
.qty-num {
  width: 28px; text-align: center; font-size: 13px; font-weight: 600;
  color: var(--ink); border-left: 1px solid var(--border-light); border-right: 1px solid var(--border-light);
}
.buy-btn { flex: 1; font-size: 12px !important; white-space: nowrap; }

.my-tools-section { margin-top: 12px; border-top: 1px solid var(--border-light); padding-top: 10px; }
.tool-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px;
  border: 1px solid var(--border-light); border-radius: var(--radius);
  margin-bottom: 4px; background: var(--bg-primary);
}
.tool-icon { font-size: 18px; }
.tool-name { flex: 1; font-size: 13px; color: var(--text-primary); }
.btn-use {
  background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
  padding: 3px 12px !important;
}
.btn-use:hover { background: #bae6fd; }
.tool-hint { font-size: 10px; color: var(--text-muted); margin-top: 4px; text-align: center; font-style: italic; }
</style>

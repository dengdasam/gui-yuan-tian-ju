<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const store = useGameStore()

function startGame() {
  store.newGame()
  router.push('/game')
}
</script>

<template>
  <div class="title-screen">
    <!-- 背景装饰 -->
    <div class="bg-decor">
      <div class="mountain mountain-1"></div>
      <div class="mountain mountain-2"></div>
      <div class="mountain mountain-3"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <!-- 主内容 -->
    <div class="title-content">
      <div class="title-decoration">
        <span class="line"></span>
        <span class="dot">◆</span>
        <span class="line"></span>
      </div>

      <h1 class="game-title">归园田居</h1>
      <p class="game-subtitle">种豆南山下，草盛豆苗稀</p>

      <p class="game-desc">
        你是一介落榜书生，厌倦了京城繁华与科举沉浮，<br />
        回到终南山下的桃源村，开始一段田园生活。<br />
        种田、经商、结交友人——在这片桃花源中，<br />
        你将找到属于自己的一方天地。
      </p>

      <div class="title-actions">
        <button class="btn btn-gold btn-start" @click="startGame">
          开始新游戏
        </button>
      </div>

      <p class="title-footer">
        温馨治愈 · 田园经营 · 商海博弈
      </p>
    </div>
  </div>
</template>

<style scoped>
.title-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    180deg,
    #e8e4d8 0%,
    #f0ece0 30%,
    #f5f0e8 60%,
    #e8e0d0 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景山水 */
.bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.mountain {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
}
.mountain-1 {
  left: 10%;
  border-left: 120px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 200px solid rgba(139, 126, 102, 0.12);
}
.mountain-2 {
  left: 35%;
  border-left: 150px solid transparent;
  border-right: 130px solid transparent;
  border-bottom: 260px solid rgba(139, 126, 102, 0.08);
}
.mountain-3 {
  right: 15%;
  border-left: 100px solid transparent;
  border-right: 140px solid transparent;
  border-bottom: 180px solid rgba(139, 126, 102, 0.1);
}
.cloud {
  position: absolute;
  width: 80px;
  height: 30px;
  background: rgba(255,255,255,0.6);
  border-radius: 50px;
}
.cloud::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 25px;
  background: rgba(255,255,255,0.5);
  border-radius: 50px;
  top: -10px;
  left: 15px;
}
.cloud-1 { top: 15%; left: 20%; animation: floatCloud 8s ease-in-out infinite; }
.cloud-2 { top: 25%; right: 25%; animation: floatCloud 10s ease-in-out infinite 2s; }
.cloud-3 { top: 10%; left: 50%; animation: floatCloud 12s ease-in-out infinite 5s; }

@keyframes floatCloud {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30px); }
}

/* 标题 */
.title-content {
  position: relative;
  z-index: 10;
  text-align: center;
  animation: slideUp 1.2s ease forwards;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}
.title-decoration .line {
  width: 60px;
  height: 1px;
  background: var(--gold);
}
.title-decoration .dot {
  color: var(--gold);
  font-size: 12px;
}

.game-title {
  font-family: var(--font-calligraphy);
  font-size: 72px;
  color: var(--ink);
  margin-bottom: 8px;
  letter-spacing: 12px;
  font-weight: normal;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
}

.game-subtitle {
  font-family: var(--font-calligraphy);
  font-size: 22px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  letter-spacing: 4px;
}

.game-desc {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 2;
  margin-bottom: 40px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.title-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-start {
  font-family: var(--font-calligraphy);
  font-size: 24px;
  padding: 14px 60px;
  letter-spacing: 6px;
}

.title-footer {
  margin-top: 48px;
  font-size: 13px;
  color: var(--text-light);
  letter-spacing: 4px;
}
</style>

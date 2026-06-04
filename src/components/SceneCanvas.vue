<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

const sceneConfig = computed(() => {
  const season = store.date.season
  const weather = store.date.weather

  const configs: Record<string, { sky: string; ground: string; elements: string[]; mood: string }> = {
    '春-晴': {
      sky: 'linear-gradient(180deg, #87CEEB 0%, #B8E4F0 40%, #D4E8C2 100%)',
      ground: '#7CB342',
      elements: ['🌸', '🌿', '🦋', '🌳', '🌸'],
      mood: '春风拂面，桃花盛开'
    },
    '春-阴': {
      sky: 'linear-gradient(180deg, #B0BEC5 0%, #CFD8DC 60%, #C8D6A0 100%)',
      ground: '#689F38',
      elements: ['🌿', '🌧', '🌱', '🌳'],
      mood: '春雨如丝，万物生长'
    },
    '春-小雨': {
      sky: 'linear-gradient(180deg, #90A4AE 0%, #B0BEC5 50%, #A8C878 100%)',
      ground: '#558B2F',
      elements: ['🌧', '🌧', '🌱', '🌿', '☂️'],
      mood: '细雨润物，生机盎然'
    },
    '夏-晴': {
      sky: 'linear-gradient(180deg, #4FC3F7 0%, #81D4FA 40%, #AED581 100%)',
      ground: '#8BC34A',
      elements: ['🌾', '🌻', '🐦', '🌳', '☀️'],
      mood: '蝉鸣如织，烈日当空'
    },
    '夏-阴': {
      sky: 'linear-gradient(180deg, #78909C 0%, #90A4AE 60%, #9CCC65 100%)',
      ground: '#7CB342',
      elements: ['🌾', '🌿', '🌳', '⛅'],
      mood: '闷热的午后，云层厚重'
    },
    '夏-小雨': {
      sky: 'linear-gradient(180deg, #607D8B 0%, #90A4AE 50%, #8BC34A 100%)',
      ground: '#689F38',
      elements: ['🌧', '🌾', '🌿', '🐸'],
      mood: '夏雨忽至，稻田欢歌'
    },
    '秋-晴': {
      sky: 'linear-gradient(180deg, #FFCC80 0%, #FFE0B2 40%, #D4A574 100%)',
      ground: '#C8A96E',
      elements: ['🍂', '🌾', '🍁', '🎃', '🍂'],
      mood: '金风送爽，硕果累累'
    },
    '秋-阴': {
      sky: 'linear-gradient(180deg, #BCAAA4 0%, #D7CCC8 60%, #BFA075 100%)',
      ground: '#B8956A',
      elements: ['🍂', '🌾', '🍁', '🌬'],
      mood: '秋风萧瑟，落叶纷飞'
    },
    '秋-小雨': {
      sky: 'linear-gradient(180deg, #A1887F 0%, #BCAAA4 50%, #B8956A 100%)',
      ground: '#A0784C',
      elements: ['🌧', '🍂', '🍁', '☂️'],
      mood: '秋雨绵绵，添衣御寒'
    },
    '冬-晴': {
      sky: 'linear-gradient(180deg, #B3E5FC 0%, #E1F5FE 40%, #F5F5F5 100%)',
      ground: '#ECEFF1',
      elements: ['❄️', '🏔', '⛄', '🌲', '❄️'],
      mood: '白雪皑皑，银装素裹'
    },
    '冬-阴': {
      sky: 'linear-gradient(180deg, #90A4AE 0%, #B0BEC5 60%, #E0E0E0 100%)',
      ground: '#CFD8DC',
      elements: ['🌲', '❄️', '🌬', '🏔'],
      mood: '朔风凛冽，大雪将至'
    },
    '冬-雪': {
      sky: 'linear-gradient(180deg, #78909C 0%, #B0BEC5 40%, #F5F5F5 100%)',
      ground: '#ECEFF1',
      elements: ['❄️', '❄️', '⛄', '🌲', '❄️', '❄️'],
      mood: '瑞雪纷飞，兆丰年'
    }
  }

  const key = `${season}-${weather}`
  return configs[key] || configs['春-晴']
})

const sceneClass = computed(() => {
  if (sceneConfig.value.mood.includes('雨')) return 'raining'
  if (sceneConfig.value.mood.includes('雪')) return 'snowing'
  return ''
})
</script>

<template>
  <div class="scene-canvas" :style="{ background: sceneConfig.sky }" :class="sceneClass">
    <!-- 云层 -->
    <div class="clouds">
      <div class="cloud cloud-1">☁️</div>
      <div class="cloud cloud-2">☁️</div>
      <div class="cloud cloud-3">⛅</div>
    </div>

    <!-- 场景元素 -->
    <div class="scene-elements">
      <span
        v-for="(el, i) in sceneConfig.elements"
        :key="i"
        class="scene-el"
        :style="{
          left: (15 + i * 16 + Math.sin(i * 1.5) * 10) + '%',
          bottom: (15 + Math.cos(i * 0.8) * 12) + '%',
          fontSize: (22 + ((i * 7 + 3) % 11)) + 'px',
          animationDelay: (i * 0.3) + 's'
        }"
      >{{ el }}</span>
    </div>

    <!-- 地面 -->
    <div class="ground" :style="{ background: sceneConfig.ground }">
      <div class="ground-texture"></div>
    </div>

    <!-- 田地示意 -->
    <div class="farm-rows">
      <div class="farm-row" v-for="i in 3" :key="i" :style="{ animationDelay: i * 0.2 + 's' }"></div>
    </div>

    <!-- 房子 -->
    <div class="house">
      <div class="house-roof"></div>
      <div class="house-body">
        <div class="house-door"></div>
        <div class="house-window"></div>
      </div>
    </div>

    <!-- 场景氛围文字 -->
    <div class="scene-mood">{{ sceneConfig.mood }}</div>

    <!-- 雨滴动画 -->
    <div v-if="sceneClass === 'raining'" class="rain-drops">
      <div class="rain-drop" v-for="i in 12" :key="'r'+i" :style="{ left: (i * 8) + '%', animationDelay: (i * 0.15) + 's' }"></div>
    </div>

    <!-- 雪花动画 -->
    <div v-if="sceneClass === 'snowing'" class="snow-flakes">
      <div class="snow-flake" v-for="i in 15" :key="'s'+i" :style="{ left: (i * 7) + '%', animationDelay: (i * 0.4) + 's' }">❄</div>
    </div>
  </div>
</template>

<style scoped>
.scene-canvas {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: var(--radius);
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: 8px;
}

/* 云层动画 */
.clouds { position: absolute; top: 0; left: 0; right: 0; height: 60px; }
.cloud {
  position: absolute;
  font-size: 30px;
  opacity: 0.7;
  animation: drift 20s linear infinite;
}
.cloud-1 { top: 5px; left: -10%; animation-duration: 25s; font-size: 36px; }
.cloud-2 { top: 20px; left: 30%; animation-duration: 30s; font-size: 28px; }
.cloud-3 { top: 8px; left: 60%; animation-duration: 22s; font-size: 24px; }

@keyframes drift {
  from { transform: translateX(-100px); }
  to { transform: translateX(calc(100vw + 200px)); }
}

/* 场景元素 */
.scene-elements { position: absolute; inset: 0; }
.scene-el {
  position: absolute;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* 地面 */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  transition: background 1s ease;
}
.ground-texture {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 8px,
    rgba(255,255,255,0.03) 8px,
    rgba(255,255,255,0.03) 10px
  );
}

/* 田地 */
.farm-rows {
  position: absolute;
  bottom: 25%;
  left: 10%;
  right: 50%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.farm-row {
  height: 8px;
  background: rgba(139, 195, 74, 0.5);
  border-radius: 2px;
  animation: grow-row 2s ease-in-out infinite alternate;
}
.farm-row:nth-child(1) { width: 80%; }
.farm-row:nth-child(2) { width: 90%; }
.farm-row:nth-child(3) { width: 70%; }

@keyframes grow-row {
  from { transform: scaleX(0.9); opacity: 0.5; }
  to { transform: scaleX(1); opacity: 0.7; }
}

/* 草庐 */
.house {
  position: absolute;
  bottom: 25%;
  right: 15%;
  width: 60px;
}
.house-roof {
  width: 0;
  height: 0;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 25px solid #8D6E63;
  margin-left: -5px;
}
.house-body {
  background: #D7CCC8;
  border-radius: 2px;
  padding: 6px 8px;
  height: 32px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.house-door {
  width: 12px;
  height: 18px;
  background: #5D4037;
  border-radius: 2px 2px 0 0;
}
.house-window {
  width: 10px;
  height: 10px;
  background: #81D4FA;
  border: 1px solid #5D4037;
  border-radius: 1px;
}

/* 氛围文字 */
.scene-mood {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  font-style: italic;
  letter-spacing: 2px;
}

/* 雨滴 */
.rain-drops { position: absolute; inset: 0; pointer-events: none; }
.rain-drop {
  position: absolute;
  top: -20px;
  width: 1px;
  height: 15px;
  background: rgba(255,255,255,0.4);
  animation: rain-fall 0.8s linear infinite;
}
@keyframes rain-fall {
  from { transform: translateY(-20px); opacity: 0; }
  20% { opacity: 1; }
  to { transform: translateY(220px); opacity: 0; }
}

/* 雪花 */
.snow-flakes { position: absolute; inset: 0; pointer-events: none; }
.snow-flake {
  position: absolute;
  top: -20px;
  font-size: 12px;
  animation: snow-fall 4s linear infinite;
  opacity: 0.8;
}
@keyframes snow-fall {
  from { transform: translateY(-20px) rotate(0deg); }
  to { transform: translateY(220px) rotate(360deg); }
}
</style>

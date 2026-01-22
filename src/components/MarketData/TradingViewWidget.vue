<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const props = defineProps<{
  symbol?: string
  interval?: string
  theme?: 'light' | 'dark'
  height?: string
  config?: any
}>()

const container = ref<HTMLElement>()
let script: HTMLScriptElement | null = null

onMounted(() => {
  if (!container.value) return

  // Create script element
  script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
  script.type = 'text/javascript'
  script.async = true
  
  // Use config if provided, otherwise use default props
  const widgetConfig = props.config || {
    "allow_symbol_change": true,
    "calendar": false,
    "details": false,
    "hide_side_toolbar": false,
    "hide_top_toolbar": false,
    "hide_legend": false,
    "hide_volume": true,
    "hotlist": false,
    "interval": props.interval || "D",
    "locale": "en",
    "save_image": true,
    "style": "1",
    "symbol": props.symbol || "NASDAQ:AAPL",
    "theme": props.theme || "dark",
    "timezone": "Etc/UTC",
    "backgroundColor": props.theme === 'light' ? "#ffffff" : "#131722",
    "gridColor": props.theme === 'light' ? "rgba(42, 46, 57, 0.1)" : "rgba(242, 242, 242, 0.06)",
    "watchlist": [],
    "withdateranges": false,
    "compareSymbols": [],
    "studies": [],
    "autosize": true
  }
  
  script.innerHTML = JSON.stringify(widgetConfig)

  container.value.appendChild(script)
})

onUnmounted(() => {
  if (script && container.value) {
    container.value.removeChild(script)
  }
})
</script>

<template>
  <div class="tradingview-widget-container" ref="container" :style="{ height: height || '400px' }">
    <div class="tradingview-widget-container__widget" :style="{ height: props.config ? '100%' : 'calc(100% - 32px)' }"></div>
    <div v-if="!props.config" class="tradingview-widget-copyright text-xs text-center mt-2 opacity-60">
      <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="blue-text">Chart by TradingView</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.tradingview-widget-container {
  width: 100%;
}

.tradingview-widget-copyright {
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  font-family: 'Trebuchet MS', Arial, sans-serif;
  color: #9db2bd;
}

.tradingview-widget-copyright .blue-text {
  color: #2962FF;
}
</style>

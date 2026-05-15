<script setup lang="ts">
import { ref, computed } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import {
  COMMODITY_MARKET_CONFIG,
  getMarketRowsByPriceKey,
  formatVolumeMt,
  type ReferenceCommodityKey,
} from '../../data/gcxReferenceMarkets'

const props = defineProps<{
  commodityKey: ReferenceCommodityKey
}>()

const config = computed(() => COMMODITY_MARKET_CONFIG[props.commodityKey])

const hasVarieties = computed(() => (config.value.varieties?.length ?? 0) > 0)

const activeVarietyId = ref(config.value.varieties?.[0]?.id ?? '')

const activeVariety = computed(() =>
  config.value.varieties?.find((v) => v.id === activeVarietyId.value)
)

const marketRows = computed(() => {
  if (hasVarieties.value && activeVariety.value) {
    return getMarketRowsByPriceKey(activeVariety.value.priceKey)
  }
  if (config.value.singlePriceKey) {
    return getMarketRowsByPriceKey(config.value.singlePriceKey)
  }
  return []
})

const tableTitle = computed(() => {
  if (hasVarieties.value && activeVariety.value) {
    return activeVariety.value.tableTitle
  }
  return config.value.singleTableTitle ?? 'By location'
})
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h4
        class="text-3xl font-bold mb-2"
        :class="isDarkMode ? 'text-white' : 'text-slate-900'"
      >
        {{ config.title }}
      </h4>
      <p class="text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
        Trading activity by delivery centre
      </p>
    </div>

    <div v-if="hasVarieties" class="flex flex-wrap justify-center gap-2">
      <button
        v-for="tab in config.varieties"
        :key="tab.id"
        type="button"
        class="px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300"
        :class="
          activeVarietyId === tab.id
            ? 'bg-yellow-500 text-black shadow-lg scale-105'
            : isDarkMode
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
        "
        @click="activeVarietyId = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      class="rounded-2xl shadow-2xl overflow-hidden"
      :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'"
    >
      <div class="p-6">
        <h5
          class="text-xl font-bold mb-6"
          :class="isDarkMode ? 'text-white' : 'text-slate-900'"
        >
          {{ tableTitle }}
        </h5>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b" :class="isDarkMode ? 'border-slate-600' : 'border-gray-200'">
              <tr>
                <th
                  class="text-left py-3 px-3 font-semibold"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
                >
                  Delivery Centre
                </th>
                <th
                  class="text-right py-3 px-3 font-semibold"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
                >
                  Volume Traded
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDarkMode ? 'divide-slate-600' : 'divide-gray-200'">
              <tr
                v-for="row in marketRows"
                :key="row.deliveryCentre"
                class="transition-colors"
                :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'"
              >
                <td class="py-4 px-3">
                  <span
                    class="font-medium"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                  >
                    {{ row.deliveryCentre }}
                  </span>
                </td>
                <td class="py-4 px-3 text-right">
                  <span
                    class="font-semibold tabular-nums"
                    :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                  >
                    {{ formatVolumeMt(row.volumeTradedMt) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p
          v-if="marketRows.length === 0"
          class="text-center py-8 text-sm"
          :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
        >
          No locations listed for this market.
        </p>
      </div>
    </div>
  </div>
</template>

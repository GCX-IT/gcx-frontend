<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-4 animate-fade-in">
          GCX Scroll Animations Showcase
        </h1>
        <p class="text-xl text-slate-300">
          Scroll down to see all animation types in action
        </p>
      </div>

      <!-- Animation Showcase Grid -->
      <div class="space-y-16">
        <!-- Fade In -->
        <AnimationShowcase
          title="Fade In"
          description="Element fades in from transparent to opaque"
          animation-type="fade-in"
          code="useScrollAnimation({ animationType: 'fade-in' })"
        />

        <!-- Slide Up -->
        <AnimationShowcase
          title="Slide Up"
          description="Element slides up while fading in"
          animation-type="slide-up"
          code="useScrollAnimation({ animationType: 'slide-up' })"
        />

        <!-- Slide Down -->
        <AnimationShowcase
          title="Slide Down"
          description="Element slides down while fading in"
          animation-type="slide-down"
          code="useScrollAnimation({ animationType: 'slide-down' })"
        />

        <!-- Slide Left -->
        <AnimationShowcase
          title="Slide Left"
          description="Element slides from right to left"
          animation-type="slide-left"
          code="useScrollAnimation({ animationType: 'slide-left' })"
        />

        <!-- Slide Right -->
        <AnimationShowcase
          title="Slide Right"
          description="Element slides from left to right"
          animation-type="slide-right"
          code="useScrollAnimation({ animationType: 'slide-right' })"
        />

        <!-- Scale Up -->
        <AnimationShowcase
          title="Scale Up"
          description="Element grows from 90% to 100% scale"
          animation-type="scale-up"
          code="useScrollAnimation({ animationType: 'scale-up' })"
        />

        <!-- Rotate -->
        <AnimationShowcase
          title="Rotate"
          description="Element rotates from -12° to 0°"
          animation-type="rotate"
          code="useScrollAnimation({ animationType: 'rotate' })"
        />

        <!-- Blur In -->
        <AnimationShowcase
          title="Blur In"
          description="Element comes into focus from blur"
          animation-type="blur-in"
          code="useScrollAnimation({ animationType: 'blur-in' })"
        />

        <!-- Flip In -->
        <AnimationShowcase
          title="Flip In"
          description="Element flips in on Y-axis"
          animation-type="flip-in"
          code="useScrollAnimation({ animationType: 'flip-in' })"
        />

        <!-- Stagger Example -->
        <div ref="staggerSection.element" :class="staggerSection.animationClasses">
          <div class="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 class="text-3xl font-bold mb-4">Stagger Animation</h2>
            <p class="text-slate-300 mb-8">
              Items appear with cascading delay for dynamic effect
            </p>
            
            <div ref="staggerContainer.container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(item, i) in staggerItems"
                :key="i"
                :class="staggerContainer.getItemClasses(i)"
                class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-center font-bold text-lg"
              >
                Item {{ i + 1 }}
              </div>
            </div>

            <pre class="bg-slate-900 rounded p-4 mt-8 text-sm overflow-x-auto">
<code>const stagger = useStaggerAnimation(3, {{
  animationType: 'scale-up',
  baseDelay: 0,
  itemDelay: 150
}})</code>
            </pre>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-16 text-center text-slate-400">
        <p>✨ All animations are GPU-accelerated and mobile-friendly</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation, useStaggerAnimation } from '@/composables/useScrollAnimation'

const AnimationShowcase = defineAsyncComponent(() =>
  import('./AnimationShowcaseCard.vue')
)

const staggerSection = useScrollAnimation({
  animationType: 'fade-in',
  duration: 800,
  threshold: 0.2
})

const staggerContainer = useStaggerAnimation(3, {
  animationType: 'scale-up',
  duration: 700,
  baseDelay: 100,
  itemDelay: 150,
  threshold: 0.2
})

const staggerItems = ref([1, 2, 3])
</script>

<style scoped>
/* Optional: Add custom scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
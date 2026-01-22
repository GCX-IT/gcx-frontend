<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { isDarkMode } from '../../utils/darkMode'
import { getImageUrl } from '../../utils/imageUrl'

interface Post {
  id: number
  title: string
  slug: string
  image: string
  featured_image?: string
}

interface Props {
  posts: Post[]
  currentPostId?: number
}

const props = defineProps<Props>()
const router = useRouter()

// Get last 5 posts with featured images (excluding current post)
const sliderPosts = computed(() => {
  return props.posts
    .filter(post => {
      const hasImage = (post.featured_image || post.image) && post.image !== '/trading.jpg'
      const isNotCurrent = !props.currentPostId || post.id !== props.currentPostId
      return hasImage && isNotCurrent
    })
    .slice(0, 5)
    .map(post => ({
      ...post,
      image: post.featured_image ? getImageUrl(post.featured_image) : (post.image ? getImageUrl(post.image) : '/trading.jpg'),
      slug: post.slug || post.id.toString()
    }))
})

const currentSlide = ref(0)
const autoplayInterval = ref<NodeJS.Timeout | null>(null)
const autoplayDelay = 5000 // 5 seconds

// Auto-advance slides
const startAutoplay = () => {
  if (sliderPosts.value.length <= 1) return
  
  autoplayInterval.value = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % sliderPosts.value.length
  }, autoplayDelay)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  stopAutoplay()
  startAutoplay()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % sliderPosts.value.length
  stopAutoplay()
  startAutoplay()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + sliderPosts.value.length) % sliderPosts.value.length
  stopAutoplay()
  startAutoplay()
}

const goToPost = (post: Post) => {
  router.push(`/blog/${post.slug || post.id}`)
}

onMounted(() => {
  if (sliderPosts.value.length > 1) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="relative h-[600px] lg:h-[700px] overflow-hidden">
    <!-- Slider Container -->
    <div class="relative w-full h-full">
      <div
        v-for="(post, index) in sliderPosts"
        :key="post.id"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img 
            :src="post.image" 
            :alt="post.title" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0" :class="isDarkMode ? 'bg-slate-900/70' : 'bg-black/50'"></div>
        </div>

        <!-- Slide Content -->
        <div class="relative z-20 h-full flex items-center">
          <div class="max-w-[1600px] mx-auto px-4 w-full">
            <div class="max-w-4xl mx-auto text-center">
              <h2 class="text-3xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                {{ post.title }}
              </h2>
              <button
                @click="goToPost(post)"
                class="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Read Article
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="sliderPosts.length > 1"
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
      aria-label="Previous slide"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <button
      v-if="sliderPosts.length > 1"
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
      aria-label="Next slide"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Slide Indicators -->
    <div
      v-if="sliderPosts.length > 1"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2"
    >
      <button
        v-for="(post, index) in sliderPosts"
        :key="post.id"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all duration-200"
        :class="index === currentSlide ? 'bg-yellow-500 w-8' : 'bg-white/50 hover:bg-white/70'"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions */
.transition-opacity {
  transition-property: opacity;
}
</style>

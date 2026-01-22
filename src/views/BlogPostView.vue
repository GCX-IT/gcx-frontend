<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import { useBlog } from '../composables/useBlog'
import { getImageUrl } from '../utils/imageUrl'
import Footer from '../components/Footer.vue'
import BlogHeroSlider from '../components/Blog/BlogHeroSlider.vue'

const route = useRoute()
const { t } = useI18n()
const router = useRouter()

const { posts, fetchPublicPosts, isLoading } = useBlog()
const currentPost = ref(null)
const allPosts = ref([])

// Load all posts and find current post
const loadPosts = async () => {
  try {
    await fetchPublicPosts()
    
    if (posts.value && posts.value.length > 0) {
      // Transform API posts
      allPosts.value = posts.value.map(post => {
        // Handle tags
        let postTags = []
        if (post.tags) {
          if (typeof post.tags === 'string') {
            try {
              postTags = JSON.parse(post.tags)
            } catch {
              postTags = (post.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          } else if (Array.isArray(post.tags)) {
            postTags = post.tags
          }
        }
        
        // Handle date
        let postDate
        try {
          const dateToUse = post.published_at || post.created_at
          postDate = new Date(dateToUse).toISOString().split('T')[0]
        } catch {
          postDate = new Date().toISOString().split('T')[0]
        }
        
        // Handle author - could be string or object
        let authorName = 'GCX Team'
        if (post.author) {
          if (typeof post.author === 'string') {
            authorName = post.author
          } else if (typeof post.author === 'object' && post.author.name) {
            authorName = post.author.name
          }
        }
        
        return {
          id: post.id,
          title: post.title || 'Untitled Post',
          excerpt: post.excerpt || post.content?.replace(/<[^>]*>/g, ' ').trim().substring(0, 160) + '...' || 'No excerpt available',
          content: post.content || '<p>No content available</p>',
          author: authorName,
          date: postDate,
          image: post.featured_image ? getImageUrl(post.featured_image) : '/trading.jpg',
          tags: postTags,
          featured: false,
          readTime: Math.ceil((post.content?.replace(/<[^>]*>/g, ' ').trim().split(' ').length || 0) / 200) + ' min read',
          slug: post.slug || post.id.toString()
        }
      })
      
      // Find current post by slug or ID
      const param = route.params.slug as string
      currentPost.value = allPosts.value.find(post => 
        post.slug === param || post.id.toString() === param
      )
      
      if (!currentPost.value) {
        router.push('/blog')
      }
    }
  } catch (error) {
    console.error('Failed to load blog post:', error)
    router.push('/blog')
  }
}

const relatedPosts = computed(() => {
  if (!currentPost.value) return []
  return allPosts.value
    .filter(post => post.id !== currentPost.value.id)
    .slice(0, 3)
})

const recentPosts = computed(() => {
  return allPosts.value.slice(0, 5)
})

// Get posts with featured images for slider (last 5, excluding current)
const sliderPosts = computed(() => {
  return allPosts.value
    .filter(post => {
      const hasImage = post.image && post.image !== '/trading.jpg'
      const isNotCurrent = post.id !== currentPost.value?.id
      return hasImage && isNotCurrent
    })
    .slice(0, 5)
})

const categories = computed(() => {
  const allTags = allPosts.value.flatMap(post => post.tags)
  return [...new Set(allTags)]
})

const archives = computed(() => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months.slice(0, 6).map((month, index) => ({
    month,
    year: 2025,
    count: Math.floor(Math.random() * 5) + 1
  }))
})

onMounted(loadPosts)

const goBack = () => {
  router.push('/blog')
}

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: currentPost.value?.title,
      text: currentPost.value?.excerpt,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }
}
</script>

<template>
  <div v-if="currentPost" class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Slider Section -->
    <BlogHeroSlider 
      :posts="sliderPosts" 
      :current-post-id="currentPost.id"
    />

    <!-- Post Header Section -->
    <section class="relative py-12 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
      <div class="max-w-[1600px] mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Back Button -->
          <button
            @click="goBack"
            class="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all duration-200"
            :class="isDarkMode ? 'bg-slate-800/80 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>
          
          <!-- Post Meta -->
          <div class="mb-6">
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <span class="text-sm font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                {{ currentPost.author }}
              </span>
              <span class="text-slate-400">•</span>
              <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ new Date(currentPost.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}
              </span>
              <span class="text-slate-400">•</span>
              <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ currentPost.readTime }}
              </span>
            </div>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in currentPost.tags"
                :key="tag"
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Title -->
          <h1 class="text-4xl lg:text-5xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ currentPost.title }}
          </h1>
          
          <!-- Excerpt -->
          <p class="text-xl mb-8" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ currentPost.excerpt }}
          </p>
          
          <!-- Share Button -->
          <button
            @click="sharePost"
            class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Post
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content with Sidebar -->
    <section class="py-24 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="max-w-[1600px] mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Featured Image (if exists) -->
            <div v-if="currentPost.image && currentPost.image !== '/trading.jpg'" class="mb-12">
              <div class="relative rounded-2xl overflow-hidden shadow-2xl border-4" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
                <img 
                  :src="currentPost.image" 
                  :alt="currentPost.title" 
                  class="w-full h-auto object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            <!-- Article Content -->
            <article class="prose prose-lg max-w-none" :class="isDarkMode ? 'prose-invert' : ''">
              <div v-html="currentPost.content" class="text-lg leading-relaxed"></div>
            </article>
            
            <!-- Author Bio -->
            <div class="mt-16 p-8 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xl font-bold">
                  {{ currentPost.author.charAt(0) }}
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ currentPost.author }}
                  </h3>
                  <p class="text-base" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    Expert contributor to GCX insights and analysis. Specializing in agricultural markets, trading technology, and sustainable development.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Professional Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Search Bar -->
              <div class="bg-black rounded-lg p-4">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Search for..."
                    class="w-full px-4 py-3 text-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all bg-white text-black placeholder-gray-500"
                  />
                  <button class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-black text-white text-xs rounded transition-colors hover:bg-gray-800">
                    Search
                  </button>
                </div>
              </div>

              <!-- Recent Posts -->
              <div class="bg-black rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-center py-3 px-4">
                  LATEST NEWS
                </div>
                <div class="p-4 space-y-3">
                  <router-link
                    v-for="post in recentPosts"
                    :key="post.id"
                    :to="`/blog/${post.id}`"
                    class="block text-sm text-white transition-colors hover:text-yellow-400 leading-relaxed"
                  >
                    {{ post.title }}
                  </router-link>
                </div>
              </div>

              <!-- Categories -->
              <div class="bg-black rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-center py-3 px-4">
                  CATEGORIES
                </div>
                <div class="p-4 space-y-2">
                  <div
                    v-for="category in categories"
                    :key="category"
                    class="text-sm text-white cursor-pointer transition-colors hover:text-yellow-400"
                  >
                    {{ category }}
                  </div>
                </div>
              </div>

              <!-- Archives -->
              <div class="bg-black rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-center py-3 px-4">
                  ARCHIVES
                </div>
                <div class="p-4 space-y-2">
                  <div
                    v-for="archive in archives"
                    :key="`${archive.month}-${archive.year}`"
                    class="text-sm text-white cursor-pointer transition-colors hover:text-yellow-400"
                  >
                    {{ archive.month }} {{ archive.year }}
                  </div>
                </div>
              </div>

              <!-- Apply Now Button -->
              <div class="text-center">
                <button class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Posts -->
    <section class="py-24 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
      <div class="max-w-[1600px] mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold mb-12 text-center" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Related Posts
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <router-link
              v-for="post in relatedPosts"
              :key="post.id"
              :to="`/blog/${post.id}`"
              class="group block transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden"
              :class="isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'"
            >
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="p-6">
                <div class="mb-4">
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                    {{ post.author }} • {{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </span>
                </div>
                <h3 class="text-xl font-bold mb-3 group-hover:text-yellow-500 transition-colors" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ post.title }}
                </h3>
                <p class="mb-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ post.excerpt }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<style scoped>
.prose {
  color: inherit;
}

.prose h2 {
  color: inherit;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose p {
  color: inherit;
  margin-bottom: 1.5rem;
}

.prose ul {
  color: inherit;
}

.prose li {
  color: inherit;
}

.prose strong {
  color: inherit;
  font-weight: 600;
}
</style> 
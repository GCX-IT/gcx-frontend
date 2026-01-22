<script setup lang="ts">
import { computed } from 'vue'
import { isDarkMode } from '../../utils/darkMode'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  image: string
  tags: string[]
  featured: boolean
  slug?: string
}

interface Props {
  posts: BlogPost[]
}

const props = defineProps<Props>()

// Show first post as featured, then next 3 as recent
// No need to filter by featured flag - just use first 4 posts
</script>

<template>
  <section class="py-20 lg:py-28 transition-colors duration-300 relative overflow-hidden" :class="isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-white via-slate-50 to-white'">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative max-w-[1600px] mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-block px-4 py-2 rounded-full mb-4" :class="isDarkMode ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'">
          <span class="text-sm font-semibold">Latest Updates</span>
        </div>
        <h2 class="text-4xl lg:text-5xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Recent Blog Posts
        </h2>
        <p class="text-lg max-w-2xl mx-auto" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Stay updated with the latest insights, news, and stories from GCX
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Featured Post (First Post) -->
        <router-link 
          v-if="posts.length > 0"
          :to="`/blog/${posts[0].slug || posts[0].id}`"
          class="lg:col-span-2 group"
        >
          <div class="flex flex-col lg:flex-row gap-8 p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-yellow-500/50' : 'bg-white border-slate-200 hover:border-yellow-500/50 shadow-xl'">
            <div class="relative lg:w-2/3 h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl">
              <img 
                :src="posts[0].image" 
                :alt="posts[0].title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="(e) => (e.target as HTMLImageElement).src = '/trading.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </div>
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{ posts[0].author.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-sm font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                    {{ posts[0].author }}
                  </p>
                  <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                    {{ new Date(posts[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                  </p>
                </div>
              </div>
              <h3 class="text-3xl lg:text-4xl font-bold mb-4 group-hover:text-yellow-500 transition-colors" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ posts[0].title }}
              </h3>
              <p class="text-lg mb-6 leading-relaxed line-clamp-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ posts[0].excerpt }}
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in posts[0].tags.slice(0, 3)"
                  :key="tag"
                  class="px-3 py-1 rounded-full text-sm font-medium border"
                  :class="isDarkMode ? 'bg-slate-700/50 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-700 border-slate-200'"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-600 font-semibold transition-colors group-hover:gap-3">
                Read Full Article
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>
        
        <!-- Recent Posts Grid - Show 2 posts (1 featured + 2 recent = 3 total) -->
        <router-link 
          v-for="post in posts.slice(1, 3)" 
          :key="post.id"
          :to="`/blog/${post.slug || post.id}`"
          class="group"
        >
          <div class="h-full p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-yellow-500/50' : 'bg-white border-slate-200 hover:border-yellow-500/50 shadow-lg'">
            <div class="relative h-56 rounded-xl overflow-hidden mb-6 shadow-xl">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="(e) => (e.target as HTMLImageElement).src = '/trading.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ post.author.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-xs font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                  {{ post.author }}
                </p>
                <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                </p>
              </div>
            </div>
            <h4 class="text-xl font-bold mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ post.title }}
            </h4>
            <p class="mb-4 leading-relaxed line-clamp-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              {{ post.excerpt }}
            </p>
            <div class="flex items-center justify-between pt-4 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in post.tags.slice(0, 2)"
                  :key="tag"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'"
                >
                  {{ tag }}
                </span>
              </div>
              <span class="text-yellow-500 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Read
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

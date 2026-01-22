<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '@/utils/darkMode'
import BlogPostsList from '@/components/CMS/BlogPostsList.vue'
import BlogEditor from '@/components/CMS/BlogEditor.vue'
import type { BlogPost } from '@/types/cms'

const currentView = ref<'list' | 'create' | 'edit'>('list')
const { t } = useI18n()
const currentPost = ref<BlogPost | null>(null)

const showPostsList = () => {
  currentView.value = 'list'
  currentPost.value = null
}

const showCreatePost = () => {
  currentView.value = 'create'
  currentPost.value = null
}

const showEditPost = (post: BlogPost) => {
  currentView.value = 'edit'
  currentPost.value = post
}

const handlePostSaved = (post: BlogPost) => {
  showPostsList()
}

const handlePostDeleted = (postId: number) => {
  showPostsList()
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <div class="container mx-auto px-6 py-8">
      
      <!-- Posts List View -->
      <BlogPostsList
        v-if="currentView === 'list'"
        @create="showCreatePost"
        @edit="showEditPost"
      />

      <!-- Create Post View -->
      <BlogEditor
        v-else-if="currentView === 'create'"
        :is-editing="false"
        @save="handlePostSaved"
        @cancel="showPostsList"
      />

      <!-- Edit Post View -->
      <BlogEditor
        v-else-if="currentView === 'edit'"
        :post="currentPost"
        :is-editing="true"
        @save="handlePostSaved"
        @cancel="showPostsList"
        @delete="handlePostDeleted"
      />

    </div>
  </div>
</template>

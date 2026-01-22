<script setup lang="ts">
import { ref } from 'vue'
import PagesList from '../components/CMS/PagesList.vue'
import PageEditor from '../components/CMS/PageEditor.vue'

interface Page {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published' | 'private' | 'archived'
  author: {
    name: string
  }
  created_at: string
  updated_at: string
  published_at?: string
}

// State
const currentView = ref<'list' | 'editor'>('list')
const editingPage = ref<Page | null>(null)
const isCreating = ref(false)

// Methods
const handleEdit = (page: Page) => {
  editingPage.value = page
  isCreating.value = false
  currentView.value = 'editor'
}

const handleCreate = () => {
  editingPage.value = null
  isCreating.value = true
  currentView.value = 'editor'
}

const handleSaved = (page: Page) => {
  // Return to list view
  currentView.value = 'list'
  editingPage.value = null
  isCreating.value = false
}

const handleCancelled = () => {
  // Return to list view
  currentView.value = 'list'
  editingPage.value = null
  isCreating.value = false
}
</script>

<template>
  <div>
    <!-- Pages List View -->
    <PagesList
      v-if="currentView === 'list'"
      @edit="handleEdit"
      @create="handleCreate"
    />
    
    <!-- Page Editor View -->
    <PageEditor
      v-else-if="currentView === 'editor'"
      :page="editingPage"
      :is-editing="!isCreating"
      @saved="handleSaved"
      @cancelled="handleCancelled"
    />
  </div>
</template>

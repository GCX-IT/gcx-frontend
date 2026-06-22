<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { backupAPI, type BackupFile } from '../../services/api'
import { isDarkMode } from '../../utils/darkMode'

const backups = ref<BackupFile[]>([])
const loading = ref(false)
const creating = ref(false)
const error = ref('')
const success = ref('')

const loadBackups = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await backupAPI.list()
    backups.value = (res.data as any) || []
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to load backups'
  } finally {
    loading.value = false
  }
}

const createBackup = async () => {
  creating.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await backupAPI.create()
    const f = res.data as any
    success.value = `Backup created: ${f.filename} (${formatSize(f.size)})`
    await loadBackups()
  } catch (e: any) {
    error.value = e.response?.data?.details || e.response?.data?.error || 'Backup failed'
  } finally {
    creating.value = false
  }
}

const download = async (file: BackupFile) => {
  try {
    const res = await backupAPI.download(file.filename)
    const url = window.URL.createObjectURL(new Blob([res.data as any]))
    const a = document.createElement('a')
    a.href = url
    a.download = file.filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (e: any) {
    error.value = 'Download failed'
  }
}

const formatSize = (bytes: number): string => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
  return `${n.toFixed(1)} ${units[i]}`
}

const formatDate = (s: string): string => {
  try { return new Date(s).toLocaleString() } catch { return s }
}

onMounted(loadBackups)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Database Backups</h1>
        <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Create a snapshot of the database and download it for safekeeping.
        </p>
      </div>
      <button @click="createBackup" :disabled="creating"
        class="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
        <span v-if="creating" class="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
        {{ creating ? 'Creating…' : 'Create backup' }}
      </button>
    </div>

    <!-- Alerts -->
    <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm break-words">{{ error }}</div>
    <div v-if="success" class="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{{ success }}</div>

    <!-- List -->
    <div class="rounded-xl border overflow-hidden" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
      <table class="w-full text-sm">
        <thead :class="isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'">
          <tr>
            <th class="text-left font-medium px-4 py-3">File</th>
            <th class="text-left font-medium px-4 py-3">Size</th>
            <th class="text-left font-medium px-4 py-3">Created</th>
            <th class="text-right font-medium px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody :class="isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'">
          <tr v-if="loading"><td colspan="4" class="px-4 py-6 text-center text-slate-500">Loading…</td></tr>
          <tr v-else-if="backups.length === 0"><td colspan="4" class="px-4 py-6 text-center text-slate-500">No backups yet. Click “Create backup”.</td></tr>
          <tr v-for="b in backups" :key="b.filename" class="border-t" :class="isDarkMode ? 'border-slate-800' : 'border-slate-100'">
            <td class="px-4 py-3 font-mono text-xs">{{ b.filename }}</td>
            <td class="px-4 py-3">{{ formatSize(b.size) }}</td>
            <td class="px-4 py-3">{{ formatDate(b.created_at) }}</td>
            <td class="px-4 py-3 text-right">
              <button @click="download(b)" class="text-xs font-medium px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-black">
                Download
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-4 text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">
      Backups are stored on the server in the <code>backups/</code> folder. Download important ones and keep a copy off-server.
    </p>
  </div>
</template>

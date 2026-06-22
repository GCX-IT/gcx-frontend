<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usersAPI } from '../../services/api'
import { useAuth } from '../../composables/useAuth'
import { isDarkMode } from '../../utils/darkMode'
import type { User } from '../../types/cms'

const { user: currentUser } = useAuth()

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const ROLES = ['admin', 'blogger', 'user', 'trader', 'premium']

// Add-user form
const showForm = ref(false)
const form = ref({ name: '', email: '', role: 'blogger' })
const saving = ref(false)

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await usersAPI.getUsers()
    users.value = (res.data as any) || []
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const flash = (msg: string) => {
  success.value = msg
  setTimeout(() => (success.value = ''), 3000)
}

const createUser = async () => {
  if (!form.value.name || !form.value.email) return
  saving.value = true
  error.value = ''
  try {
    await usersAPI.createUser(form.value as any)
    flash(`User "${form.value.name}" created. A welcome email was sent.`)
    form.value = { name: '', email: '', role: 'blogger' }
    showForm.value = false
    await loadUsers()
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to create user'
  } finally {
    saving.value = false
  }
}

const changeRole = async (u: User, role: string) => {
  try {
    await usersAPI.updateUser(u.id, { role } as any)
    u.role = role as any
    flash(`Role updated for ${u.name}`)
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to update role'
    await loadUsers()
  }
}

const toggleActive = async (u: User) => {
  try {
    const res = await usersAPI.updateUser(u.id, { is_active: !u.is_active } as any)
    u.is_active = (res.data as any).is_active
    flash(`${u.name} is now ${u.is_active ? 'active' : 'disabled'}`)
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to update status'
  }
}

const removeUser = async (u: User) => {
  if (!confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`)) return
  try {
    await usersAPI.deleteUser(u.id)
    users.value = users.value.filter(x => x.id !== u.id)
    flash(`${u.name} deleted`)
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Failed to delete user'
  }
}

const isSelf = (u: User) => currentUser.value?.id === u.id

onMounted(loadUsers)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">User Management</h1>
        <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Create staff accounts and assign roles. New users sign in with an emailed code.
        </p>
      </div>
      <button @click="showForm = !showForm"
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-colors">
        {{ showForm ? 'Close' : '+ Add user' }}
      </button>
    </div>

    <!-- Alerts -->
    <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>
    <div v-if="success" class="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{{ success }}</div>

    <!-- Add form -->
    <div v-if="showForm" class="mb-6 p-5 rounded-xl border"
         :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Name</label>
          <input v-model="form.name" type="text" placeholder="Full name"
            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Email</label>
          <input v-model="form.email" type="email" placeholder="name@gcx.com.gh"
            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Role</label>
          <select v-model="form.role"
            class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'">
            <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button @click="createUser" :disabled="saving"
          class="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-medium py-2 px-5 rounded-lg transition-colors">
          {{ saving ? 'Creating…' : 'Create user' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
      <table class="w-full text-sm">
        <thead :class="isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'">
          <tr>
            <th class="text-left font-medium px-4 py-3">Name</th>
            <th class="text-left font-medium px-4 py-3">Email</th>
            <th class="text-left font-medium px-4 py-3">Role</th>
            <th class="text-left font-medium px-4 py-3">Status</th>
            <th class="text-right font-medium px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody :class="isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'">
          <tr v-if="loading"><td colspan="5" class="px-4 py-6 text-center text-slate-500">Loading…</td></tr>
          <tr v-else-if="users.length === 0"><td colspan="5" class="px-4 py-6 text-center text-slate-500">No users yet.</td></tr>
          <tr v-for="u in users" :key="u.id" class="border-t" :class="isDarkMode ? 'border-slate-800' : 'border-slate-100'">
            <td class="px-4 py-3 font-medium">
              {{ u.name }}
              <span v-if="isSelf(u)" class="ml-1 text-xs text-yellow-500">(you)</span>
            </td>
            <td class="px-4 py-3">{{ u.email }}</td>
            <td class="px-4 py-3">
              <select :value="u.role" @change="changeRole(u, ($event.target as HTMLSelectElement).value)"
                :disabled="isSelf(u)"
                class="px-2 py-1 rounded border bg-transparent disabled:opacity-60"
                :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
                <option v-for="r in ROLES" :key="r" :value="r">{{ r }}</option>
              </select>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 rounded-full text-xs font-medium"
                :class="u.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'">
                {{ u.is_active ? 'Active' : 'Disabled' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-2 whitespace-nowrap">
              <button @click="toggleActive(u)" :disabled="isSelf(u)"
                class="text-xs font-medium px-2 py-1 rounded hover:underline disabled:opacity-40"
                :class="u.is_active ? 'text-amber-600' : 'text-green-600'">
                {{ u.is_active ? 'Disable' : 'Enable' }}
              </button>
              <button @click="removeUser(u)" :disabled="isSelf(u)"
                class="text-xs font-medium px-2 py-1 rounded text-red-600 hover:underline disabled:opacity-40">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

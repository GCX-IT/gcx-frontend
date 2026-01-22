import { ref, computed } from 'vue'
import { teamService, type TeamMember, type TeamMemberForm } from '../services/teamService'

export function useTeam() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // All team members
  const allTeamMembers = ref<TeamMember[]>([])
  
  // Team members by type
  const boardMembers = ref<TeamMember[]>([])
  const executiveMembers = ref<TeamMember[]>([])
  const functionalMembers = ref<TeamMember[]>([])

  // Computed properties
  const totalMembers = computed(() => allTeamMembers.value.length)
  
  const boardCount = computed(() => boardMembers.value.length)
  const executiveCount = computed(() => executiveMembers.value.length)
  const functionalCount = computed(() => functionalMembers.value.length)

  // Load all team members
  const loadAllTeamMembers = async () => {
    loading.value = true
    error.value = null
    try {
      allTeamMembers.value = await teamService.getAllTeamMembers()
      // Separate by type
      boardMembers.value = allTeamMembers.value.filter(member => member.type === 'board')
      executiveMembers.value = allTeamMembers.value.filter(member => member.type === 'executive')
      functionalMembers.value = allTeamMembers.value.filter(member => member.type === 'functional')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load team members'
      console.error('Error loading team members:', err)
    } finally {
      loading.value = false
    }
  }

  // Load team members by type
  const loadTeamMembersByType = async (type: 'board' | 'executive' | 'functional') => {
    loading.value = true
    error.value = null
    try {
      const members = await teamService.getTeamMembersByType(type)
      switch (type) {
        case 'board':
          boardMembers.value = members
          break
        case 'executive':
          executiveMembers.value = members
          break
        case 'functional':
          functionalMembers.value = members
          break
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load team members'
      console.error('Error loading team members:', err)
    } finally {
      loading.value = false
    }
  }

  // Create team member
  const createTeamMember = async (member: TeamMemberForm) => {
    loading.value = true
    error.value = null
    try {
      const newMember = await teamService.createTeamMember(member)
      // Add to appropriate list
      switch (member.type) {
        case 'board':
          boardMembers.value.push(newMember)
          break
        case 'executive':
          executiveMembers.value.push(newMember)
          break
        case 'functional':
          functionalMembers.value.push(newMember)
          break
      }
      // Also add to all members
      allTeamMembers.value.push(newMember)
      return newMember
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create team member'
      console.error('Error creating team member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update team member
  const updateTeamMember = async (id: number, member: TeamMemberForm) => {
    loading.value = true
    error.value = null
    try {
      const updatedMember = await teamService.updateTeamMember(id, member)
      
      // Update in appropriate list
      const updateInList = (list: TeamMember[]) => {
        const index = list.findIndex(m => m.id === id)
        if (index !== -1) {
          list[index] = updatedMember
        }
      }
      
      updateInList(boardMembers.value)
      updateInList(executiveMembers.value)
      updateInList(functionalMembers.value)
      updateInList(allTeamMembers.value)
      
      return updatedMember
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update team member'
      console.error('Error updating team member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete team member
  const deleteTeamMember = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await teamService.deleteTeamMember(id)
      
      // Remove from all lists
      const removeFromList = (list: TeamMember[]) => {
        const index = list.findIndex(m => m.id === id)
        if (index !== -1) {
          list.splice(index, 1)
        }
      }
      
      removeFromList(boardMembers.value)
      removeFromList(executiveMembers.value)
      removeFromList(functionalMembers.value)
      removeFromList(allTeamMembers.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete team member'
      console.error('Error deleting team member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reorder team members
  const reorderTeamMembers = async (members: { id: number; order_index: number }[]) => {
    loading.value = true
    error.value = null
    try {
      await teamService.reorderTeamMembers(members)
      // Reload all members to get updated order
      await loadAllTeamMembers()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to reorder team members'
      console.error('Error reordering team members:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get team member by ID
  const getTeamMemberById = (id: number): TeamMember | undefined => {
    return allTeamMembers.value.find(member => member.id === id)
  }

  // Get team members by type (computed)
  const getTeamMembersByType = (type: 'board' | 'executive' | 'functional'): TeamMember[] => {
    switch (type) {
      case 'board':
        return boardMembers.value
      case 'executive':
        return executiveMembers.value
      case 'functional':
        return functionalMembers.value
      default:
        return []
    }
  }

  return {
    // State
    loading,
    error,
    allTeamMembers,
    boardMembers,
    executiveMembers,
    functionalMembers,
    
    // Computed
    totalMembers,
    boardCount,
    executiveCount,
    functionalCount,
    
    // Methods
    loadAllTeamMembers,
    loadTeamMembersByType,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    reorderTeamMembers,
    getTeamMemberById,
    getTeamMembersByType
  }
}

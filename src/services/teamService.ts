import axios from '../plugins/axios'

export interface TeamMember {
  id: number
  name: string
  title: string
  description: string
  image?: string
  type: 'board' | 'executive' | 'functional'
  order_index?: number
  // Social Media Handles
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  email?: string
  phone?: string
  website_url?: string
  created_at?: string
  updated_at?: string
}

export interface TeamMemberForm {
  name: string
  title: string
  description: string
  image?: string
  type: 'board' | 'executive' | 'functional'
  order_index?: number
  // Social Media Handles
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  email?: string
  phone?: string
  website_url?: string
}

class TeamService {
  // Get all team members
  async getAllTeamMembers(): Promise<TeamMember[]> {
    const response = await axios.get('/api/team-members')
    return response.data
  }

  // Get team members by type
  async getTeamMembersByType(type: 'board' | 'executive' | 'functional'): Promise<TeamMember[]> {
    const response = await axios.get(`/api/team-members?type=${type}`)
    return response.data
  }

  // Get a single team member
  async getTeamMember(id: number): Promise<TeamMember> {
    const response = await axios.get(`/api/team-members/${id}`)
    return response.data
  }

  // Create a new team member
  async createTeamMember(member: TeamMemberForm): Promise<TeamMember> {
    const response = await axios.post('/api/team-members', member)
    return response.data
  }

  // Update a team member
  async updateTeamMember(id: number, member: TeamMemberForm): Promise<TeamMember> {
    const response = await axios.put(`/api/team-members/${id}`, member)
    return response.data
  }

  // Delete a team member
  async deleteTeamMember(id: number): Promise<void> {
    await axios.delete(`/api/team-members/${id}`)
  }

  // Reorder team members
  async reorderTeamMembers(members: { id: number; order_index: number }[]): Promise<void> {
    await axios.put('/api/team-members/reorder', { members })
  }
}

export const teamService = new TeamService()
export default teamService

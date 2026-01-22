import axios from '../plugins/axios'

export interface Speaker {
  name: string
  title: string
  image: string
}

export interface AgendaItem {
  time: string
  session: string
}

export interface Event {
  id: number
  title: string
  slug: string
  date: string
  time?: string
  location: string
  venue?: string
  address?: string
  type: string
  category: string
  status: 'upcoming' | 'completed' | 'cancelled'
  description?: string
  full_description?: string
  attendees: number
  image?: string
  registration_open: boolean
  registration_deadline?: string
  price?: string
  speakers?: Speaker[]
  agenda?: AgendaItem[]
  requirements?: string[]
  meta_title?: string
  meta_description?: string
  sort_order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  event_id: number
  full_name: string
  email: string
  phone: string
  organization?: string
  position?: string
  dietary_requirements?: string
  special_needs?: string
}

export interface EventFilters {
  status?: 'upcoming' | 'completed' | 'cancelled'
  type?: string
  category?: string
  featured?: boolean
  search?: string
  year?: string
  limit?: number
  offset?: number
}

class EventService {
  // Public endpoints
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString())
      if (filters?.search) params.append('search', filters.search)
      if (filters?.year) params.append('year', filters.year)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.offset) params.append('offset', filters.offset.toString())

      const response = await axios.get(`/api/events?${params.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  }

  async getEvent(id: number): Promise<Event> {
    try {
      const response = await axios.get(`/api/events/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  }

  async getEventBySlug(slug: string): Promise<Event> {
    try {
      const response = await axios.get(`/api/events/slug/${slug}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching event by slug:', error)
      throw error
    }
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    try {
      const response = await axios.get(`/api/events/upcoming?limit=${limit}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      throw error
    }
  }

  async getPastEvents(limit: number = 10): Promise<Event[]> {
    try {
      const response = await axios.get(`/api/events/past?limit=${limit}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching past events:', error)
      throw error
    }
  }

  async registerForEvent(eventId: number, registration: EventRegistration): Promise<any> {
    try {
      const response = await axios.post(`/api/events/${eventId}/register`, registration)
      return response.data
    } catch (error) {
      console.error('Error registering for event:', error)
      throw error
    }
  }

  // CMS endpoints (require authentication)
  async getAllEvents(token: string): Promise<Event[]> {
    try {
      const response = await axios.get(`/api/cms/events`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching all events:', error)
      throw error
    }
  }

  async createEvent(token: string, event: Partial<Event>): Promise<Event> {
    try {
      const response = await axios.post(`/api/cms/events`, event, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  async updateEvent(token: string, id: number, event: Partial<Event>): Promise<Event> {
    try {
      const response = await axios.put(`/api/cms/events/${id}`, event, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  async deleteEvent(token: string, id: number): Promise<void> {
    try {
      await axios.delete(`/api/cms/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  async getEventStats(token: string): Promise<any> {
    try {
      const response = await axios.get(`/api/cms/events/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching event stats:', error)
      throw error
    }
  }

  async getEventRegistrations(token: string, eventId: number): Promise<any[]> {
    try {
      const response = await axios.get(`/api/cms/events/${eventId}/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching event registrations:', error)
      throw error
    }
  }
}

export default new EventService()

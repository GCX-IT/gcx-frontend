/**
 * Generic data cache utility with localStorage support
 * Reduces unnecessary API calls for static/rarely-changing data
 */

export interface CacheConfig {
  duration: number // milliseconds
  key: string
}

export class DataCache {
  /**
   * Get cached data
   */
  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const parsed = JSON.parse(cached)
      if (!parsed.timestamp || !this.isValid(parsed.timestamp, parsed.duration)) {
        localStorage.removeItem(key)
        return null
      }

      return parsed.data as T
    } catch (error) {
      localStorage.removeItem(key)
      return null
    }
  }

  /**
   * Set cached data
   */
  static set<T>(key: string, data: T, durationMs: number): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        duration: durationMs
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  /**
   * Check if cache is still valid
   */
  static isValid(timestamp: number, durationMs: number): boolean {
    const now = Date.now()
    return (now - timestamp) < durationMs
  }

  /**
   * Clear specific cache
   */
  static clear(key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * Clear all GCX caches
   */
  static clearAll(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('gcx_')) {
        localStorage.removeItem(key)
      }
    })
  }
}

// Cache duration presets (in milliseconds)
export const CACHE_DURATIONS = {
  FIVE_MINUTES: 5 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,
  SIX_HOURS: 6 * 60 * 60 * 1000,
  TWELVE_HOURS: 12 * 60 * 60 * 1000,
  TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
}

// Cache keys
export const CACHE_KEYS = {
  // Blog
  BLOG_POSTS: 'gcx_blog_posts',
  BLOG_POST: (slug: string) => `gcx_blog_post_${slug}`,

  // News
  NEWS_ITEMS: 'gcx_news_items',

  // Team
  TEAM_MEMBERS: 'gcx_team_members',
  TEAM_MEMBER: (id: number) => `gcx_team_member_${id}`,

  // Events
  EVENTS: 'gcx_events',
  UPCOMING_EVENTS: 'gcx_events_upcoming',
  PAST_EVENTS: 'gcx_events_past',
  EVENT: (id: number) => `gcx_event_${id}`,

  // Settings
  SETTINGS: 'gcx_settings',
  SETTINGS_GROUP: (group: string) => `gcx_settings_${group}`,
}

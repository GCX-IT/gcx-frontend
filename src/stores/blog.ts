import { defineStore } from 'pinia'
import axios from 'axios'

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  author: string
  published_at: string
  tags: string[]
}

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [] as BlogPost[],
    currentPost: null as BlogPost | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getPostBySlug: (state) => (slug: string) => {
      return state.posts.find(post => post.slug === slug)
    },
    
    getPostsByTag: (state) => (tag: string) => {
      return state.posts.filter(post => post.tags.includes(tag))
    }
  },

  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/posts')
        this.posts = response.data
      } catch (error) {
        this.error = 'Failed to fetch blog posts'
        console.error('Error fetching posts:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPost(slug: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`/api/posts/${slug}`)
        this.currentPost = response.data
      } catch (error) {
        this.error = 'Failed to fetch blog post'
        console.error('Error fetching post:', error)
      } finally {
        this.loading = false
      }
    },

    async createPost(postData: Omit<BlogPost, 'id' | 'published_at'>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/posts', postData)
        this.posts.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = 'Failed to create blog post'
        console.error('Error creating post:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePost(id: number, postData: Partial<BlogPost>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put(`/api/posts/${id}`, postData)
        const index = this.posts.findIndex(post => post.id === id)
        if (index !== -1) {
          this.posts[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = 'Failed to update blog post'
        console.error('Error updating post:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePost(id: number) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/api/posts/${id}`)
        this.posts = this.posts.filter(post => post.id !== id)
      } catch (error) {
        this.error = 'Failed to delete blog post'
        console.error('Error deleting post:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 
// stores/useContentStore.ts
'use client'

import { create } from 'zustand'
import type { AxiosRequestHeaders } from 'axios'
import api from '@/utils/api' 
type Store = {
  raw: any | null
  items: any[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null

  fetchContent: (headers?: AxiosRequestHeaders | Record<string,string>) => Promise<void>
  setRaw: (payload: any) => void
  clear: () => void

  getPlaylistByType: (type: string) => any | null
  getPlaylistByTitle: (title: string) => any | null
}

export const useContentStore = create<Store>((set, post) => ({
  raw: null,
  items: [],
  loading: false,
  error: null,
  lastFetchedAt: null,

  setRaw: (payload) => {
    const items = Array.isArray(payload?.items) ? payload.items : []
    set({ raw: payload, items, error: null, lastFetchedAt: Date.now() })
  },

  clear: () => set({ raw: null, items: [], loading: false, error: null, lastFetchedAt: null }),

  fetchContent: async (headers = {}) => {
    // avoid concurrent duplicate fetch
    if (post().loading) return
    set({ loading: true, error: null })
    try {
      // GET is appropriate for retrieving content list
      const res = await api.post('/contentinfo/all', { headers })
      const payload = res.data
      set({
        raw: payload,
        items: Array.isArray(payload?.items) ? payload.items : [],
        loading: false,
        error: null,
        lastFetchedAt: Date.now(),
      })
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch content'
      set({ loading: false, error: message })
      console.error('useContentStore.fetchContent error', err)
    }
  },

  getPlaylistByType: (type: string) => {
    const items = post().items
    if (!items) return null
    return items.find((p: any) => (p.playlist_type || '').toLowerCase() === type.toLowerCase()) ?? null
  },

  getPlaylistByTitle: (title: string) => {
    const items = post().items
    if (!items) return null
    return items.find((p: any) => (p.playlist_title || '').toLowerCase() === title.toLowerCase()) ?? null
  },
}))

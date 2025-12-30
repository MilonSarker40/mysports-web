import { create } from 'zustand'
import axios from 'axios'

/* =========================
   TYPES
========================= */

export interface NewsItem {
  content_id: string
  title?: string
  short_description?: string
  description?: string
  image?: string
  is_featured?: boolean
  published_at?: string
}

export interface NewsState {
  newsList: NewsItem[]
  featuredNews: NewsItem | null
  loading: boolean
  error: string | null
  page: number
  hasMore: boolean
  totalPages: number

  newsDetails: NewsItem | null
  detailsLoading: boolean
  detailsError: string | null

  fetchNewsList: (pageNumber?: number) => Promise<void>
  fetchNewsDetails: (contentId: string) => Promise<void>
  resetNewsList: () => void
  resetNewsDetails: () => void
}

/* =========================
   API SETUP
========================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://apiv2.mysports.com.bd/api/v1'

const API_TOKEN =
  process.env.NEXT_PUBLIC_API_TOKEN ||
  '5pake7mh5ln64h5t28kpvtv3iri'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

/* =========================
   STORE
========================= */

const useNewsStore = create<NewsState>((set, get) => ({
  newsList: [],
  featuredNews: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  totalPages: 1,

  newsDetails: null,
  detailsLoading: false,
  detailsError: null,

  fetchNewsList: async (pageNumber = 1) => {
    try {
      set({ loading: true, error: null })

      const response = await api.post('/contentinfo/news', {
        page_number: pageNumber,
        per_page_count: 10,
      })

      if (response.data?.status) {
        const apiData = response.data.data ?? response.data
        const newsItems: NewsItem[] = apiData?.data ?? []

        if (pageNumber === 1) {
          const featured =
            newsItems.find(item => item.is_featured) || newsItems[0] || null

          const listNews = featured
            ? newsItems.filter(
                item => item.content_id !== featured.content_id
              )
            : newsItems

          set({
            newsList: listNews,
            featuredNews: featured,
            page: pageNumber,
            totalPages: apiData?.total_pages || 1,
            hasMore: pageNumber < (apiData?.total_pages || 1),
          })
        } else {
          set(state => ({
            newsList: [...state.newsList, ...newsItems],
            page: pageNumber,
            totalPages: apiData?.total_pages || 1,
            hasMore: pageNumber < (apiData?.total_pages || 1),
          }))
        }
      } else {
        set({
          error:
            response.data?.message || 'Failed to fetch news',
        })
      }
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          'Something went wrong',
      })
    } finally {
      set({ loading: false })
    }
  },

  fetchNewsDetails: async (contentId: string) => {
    try {
      set({ detailsLoading: true, detailsError: null })

      const response = await api.post('/contentinfo/news-details', {
        content_id: contentId,
      })

      if (response.data?.status) {
        set({ newsDetails: response.data.data })
      } else {
        set({
          detailsError:
            response.data?.message ||
            'Failed to fetch news details',
        })
      }
    } catch (error: any) {
      set({
        detailsError:
          error.response?.data?.message ||
          error.message ||
          'Something went wrong',
      })
    } finally {
      set({ detailsLoading: false })
    }
  },

  resetNewsList: () =>
    set({
      newsList: [],
      featuredNews: null,
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      totalPages: 1,
    }),

  resetNewsDetails: () =>
    set({
      newsDetails: null,
      detailsLoading: false,
      detailsError: null,
    }),
}))

export default useNewsStore

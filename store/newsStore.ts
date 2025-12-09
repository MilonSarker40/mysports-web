// store/newsStore.ts
import { create } from 'zustand';
import axios from 'axios';

// (keep your type definitions above unchanged)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiv2.mysports.com.bd/api/v1';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '5pake7mh5ln64h5t28kpvtv3iri';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
  },
});

const useNewsStore = create<NewsState>((set, get) => ({ // renamed 'post' -> 'get'
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
      set({ loading: true, error: null });
      console.log('Fetching news page:', pageNumber);

      // OPTION A: If API expects params as query params (GET-like)
      // const response = await api.get('/contentinfo/news', {
      //   params: { page_number: pageNumber, per_page_count: 10 },
      // });

      // OPTION B: If API expects JSON body with the keys directly (POST)
      const response = await api.post('/contentinfo/news', {
        page_number: pageNumber,
        per_page_count: 10,
      });

      console.log('API Response (raw):', response);
      console.log('API Response data:', response.data);

      if (response.data?.status) {
        // normalize possible shapes:
        const apiData = response.data.data ?? response.data; // guard
        // many APIs return { data: { data: [...], total_pages: X } }
        const newsItems = apiData?.data ?? apiData ?? [];

        if (pageNumber === 1) {
          const featured = Array.isArray(newsItems)
            ? (newsItems.find((item: any) => item.is_featured) || newsItems[0])
            : null;

          const listNews = Array.isArray(newsItems)
            ? newsItems.filter((item: any) => item.content_id !== featured?.content_id)
            : [];

          set({
            newsList: listNews,
            featuredNews: featured,
            page: pageNumber,
            totalPages: apiData?.total_pages || 1,
            hasMore: pageNumber < (apiData?.total_pages || 1),
          });
        } else {
          // safe-guard array merging
          set(state => ({
            newsList: Array.isArray(newsItems) ? [...state.newsList, ...newsItems] : state.newsList,
            page: pageNumber,
            totalPages: apiData?.total_pages || 1,
            hasMore: pageNumber < (apiData?.total_pages || 1),
          }));
        }
      } else {
        // API returned status: false -> show message from API if present
        const message = response.data?.message || 'Failed to fetch news';
        console.warn('API reported failure:', message);
        set({ error: message });
      }
    } catch (error: any) {
      console.error('Error fetching news list:', error, error?.response?.data);
      set({ 
        error: error.response?.data?.message || error.message || 'Something went wrong' 
      });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchNewsDetails: async (contentId: string) => {
    try {
      set({ detailsLoading: true, detailsError: null });
      console.log('Fetching news details for ID:', contentId);

      // same note as above re: params vs body
      const response = await api.post('/contentinfo/news-details', {
        content_id: contentId,
      });

      console.log('News details response (raw):', response);
      console.log('News details response data:', response.data);

      if (response.data?.status) {
        set({ newsDetails: response.data.data });
      } else {
        const msg = response.data?.message || 'Failed to fetch news details';
        console.warn('API reported failure fetching details:', msg);
        set({ detailsError: msg });
      }
    } catch (error: any) {
      console.error('Error fetching news details:', error, error?.response?.data);
      set({ 
        detailsError: error.response?.data?.message || error.message || 'Something went wrong' 
      });
    } finally {
      set({ detailsLoading: false });
    }
  },
  
  resetNewsList: () => {
    set({
      newsList: [],
      featuredNews: null,
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      totalPages: 1,
    });
  },
  
  resetNewsDetails: () => {
    set({
      newsDetails: null,
      detailsLoading: false,
      detailsError: null,
    });
  },
}));

export default useNewsStore;

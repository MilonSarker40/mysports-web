import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://apiv2.mysports.com.bd/api/v1'

const apiget = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

apiget.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // 🚫 Skip auth header for OTP APIs
      if (!config.url?.startsWith('/otp')) {
        const storage = localStorage.getItem('auth-storage')
        if (storage) {
          const parsed = JSON.parse(storage)
          const token = parsed?.state?.accessToken
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)


apiget.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/otp'
    }

    if (status === 508) {
      console.error('🚨 Backend 508:', error.response?.data)
    }

    return Promise.reject(error)
  }
)

export default apiget

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

/* ================= REQUEST INTERCEPTOR ================= */
apiget.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const url = config.url || ''

      // 🚫 DO NOT attach token for OTP APIs
      if (!url.startsWith('/otp')) {
        const storage = localStorage.getItem('auth-storage')
        if (storage) {
          try {
            const parsed = JSON.parse(storage)
            const token = parsed?.state?.accessToken
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch {
            // ignore parse error
          }
        }
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ================= RESPONSE INTERCEPTOR ================= */
apiget.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url || ''

    // ❌ Do NOT auto-redirect for OTP APIs
    if (status === 401 && !url.startsWith('/otp')) {
      localStorage.removeItem('auth-storage')
      window.location.replace('/otp')
    }

    if (status === 508) {
      console.error('🚨 Backend 508:', error.response?.data)
    }

    return Promise.reject(error)
  }
)

export default apiget

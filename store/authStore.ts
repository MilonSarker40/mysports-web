import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserInfo {
  uuid: string
  operatorname: string
  msisdn: string
  logo: string
}

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  userInfo: UserInfo | null
  login: (token: string, user: UserInfo) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      userInfo: null,

      login: (token, user) => {
        set({
          isLoggedIn: true,
          accessToken: token,
          userInfo: user,
        })
      },

      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          userInfo: null,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
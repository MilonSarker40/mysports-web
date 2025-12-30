import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/* ----------------------------------
   TYPES
---------------------------------- */
export interface SubscriptionInfo {
  subscribed: boolean
  pack_name?: string
  billing_message?: string
  price?: string
  day?: string
}

export interface UserInfo {
  uuid: string
  operatorname: string
  msisdn: string
  logo?: string
  subscription?: SubscriptionInfo
}

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  userInfo: UserInfo | null

  login: (token: string, user: UserInfo) => void
  updateSubscription: (subscription: SubscriptionInfo) => void
  logout: () => void
}

/* ----------------------------------
   STORE
---------------------------------- */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      /* ---------- INITIAL STATE ---------- */
      isLoggedIn: false,
      accessToken: null,
      userInfo: null,

      /* ---------- LOGIN ---------- */
      login: (token, user) =>
        set({
          isLoggedIn: true,
          accessToken: token,
          userInfo: {
            ...user,
            // ❌ DO NOT force subscription here
          },
        }),

      /* ---------- UPDATE SUBSCRIPTION ---------- */
      updateSubscription: (subscription) =>
        set((state) => {
          if (!state.userInfo) return state

          return {
            userInfo: {
              ...state.userInfo,
              subscription: {
                subscribed: subscription.subscribed,
                pack_name: subscription.pack_name,
                billing_message: subscription.billing_message,
                price: subscription.price,
                day: subscription.day,
              },
            },
          }
        }),

      /* ---------- LOGOUT ---------- */
      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          userInfo: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      /* persist only session data */
      partialize: (state) => ({
        accessToken: state.accessToken,
        userInfo: state.userInfo,
      }),

      /* auto login on refresh */
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.userInfo) {
          state.isLoggedIn = true
        }
      },
    }
  )
)

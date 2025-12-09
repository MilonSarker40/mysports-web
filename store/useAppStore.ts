// store/useAppStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  name: string
  phone: string
  coins: number
  subscribed: boolean
  subscriptionType: string
  subscriptionDays: number
  subscriptionPrice: number
}

interface QuizState {
  currentQuestion: number
  score: number
  selectedAnswers: number[]
  showResult: boolean
  isCorrect: boolean
  lastSelected: number | null
}

interface AppStore {
  user: User
  quiz: QuizState
  setUser: (user: Partial<User>) => void
  setQuizState: (quiz: Partial<QuizState>) => void
  updateCoins: (amount: number) => void
  resetQuiz: () => void
  // navigate function removed - use Next.js router instead
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: {
        name: "User Name",
        phone: "8801844490087",
        coins: 0,
        subscribed: false,
        subscriptionType: "",
        subscriptionDays: 0,
        subscriptionPrice: 0
      },
      quiz: {
        currentQuestion: 0,
        score: 0,
        selectedAnswers: [],
        showResult: false,
        isCorrect: false,
        lastSelected: null
      },
      setUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
      setQuizState: (quizData) => set((state) => ({ 
        quiz: { ...state.quiz, ...quizData } 
      })),
      updateCoins: (amount) => set((state) => ({ 
        user: { ...state.user, coins: state.user.coins + amount } 
      })),
      resetQuiz: () => set({
        quiz: {
          currentQuestion: 0,
          score: 0,
          selectedAnswers: [],
          showResult: false,
          isCorrect: false,
          lastSelected: null
        }
      })
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
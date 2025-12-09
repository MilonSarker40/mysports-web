// types/index.ts
export interface Video {
  id: string
  title: string
  description: string
  category: string
  duration: string
}

export interface News {
  id: string
  title: string
  content: string
  date: string
  category: string
}

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}
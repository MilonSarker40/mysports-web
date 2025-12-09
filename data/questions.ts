// data/questions.ts
export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Which is the Capital City of Bangladesh?",
    options: ["Rajsahi", "Dhaka", "Chittagong", "Khulna"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What is the national flower of Bangladesh?",
    options: ["Rose", "Lily", "Water Lily", "Sunflower"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "Which river is the longest in Bangladesh?",
    options: ["Padma", "Meghna", "Jamuna", "Brahmaputra"],
    correctAnswer: 1
  }
]
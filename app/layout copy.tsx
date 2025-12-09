// app/layout.tsx
import './globals.css'
import { Mulish } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'

// Load Mulish font
const mulish = Mulish({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800','900'],
})

export const metadata = {
  title: 'Sports App - News, Videos & Quizzes',
  description: 'Your ultimate sports companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <div className="min-h-screen bg-gray-50 pb-16">
          <div className='container'>
            <Header />
            {children}
            <Navigation />
          </div>
        </div>
      </body>
    </html>
  )
}

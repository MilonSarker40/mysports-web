'use client'
import './globals.css'
import { Mulish } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800','900'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide Header & Navigation on these exact paths
  const hideExact = ["/login", "/register", "/admin", "/otp", "/otp/verify"]

  // Hide on dynamic paths, including quiz pages
  const hideDynamic =
    pathname.startsWith("/news/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/quiz")  // hide nav & header for quiz pages

  const shouldHide = hideExact.includes(pathname) || hideDynamic

  return (
    <html lang="en">
      <body className={mulish.className}>
        <div className="min-h-screen bg-gray-50 pb-16">
          <div className="container">

            {!shouldHide && <Header />}

            {children}

            {!shouldHide && <Navigation />}

          </div>
        </div>
      </body>
    </html>
  )
}

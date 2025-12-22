'use client'

import './globals.css'
import { Mulish } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import AuthChecker from '@/components/AuthChecker'
import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  /* ----------------------------------
     ROUTES WHERE HEADER/NAV HIDDEN
  ---------------------------------- */

  const hideExact = [
    '/login',
    '/register',
    '/admin',
    '/otp',
    '/otp/verify',
    '/quiz/play',
    '/quiz/result',
    // '/subscription',
  ]

  const hideDynamic =
    pathname.startsWith('/news/') ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/quiz/')

  const shouldHide = hideExact.includes(pathname) || hideDynamic

  return (
    <html lang="en">
      <body className={mulish.className}>
        <AuthChecker>
          <div className="min-h-screen bg-gray-50 pb-16">
            <div className="container mx-auto">
              {!shouldHide && <Header />}

              {children}

              {!shouldHide && <Navigation />}

              {/* 🔔 GLOBAL TOAST */}
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
              />
            </div>
          </div>
        </AuthChecker>
      </body>
    </html>
  )
}

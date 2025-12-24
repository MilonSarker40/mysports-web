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
     HEADER HIDE ROUTES
  ---------------------------------- */
  const hideHeaderExact = [
    '/otp',
    '/otp/verify',
    '/login',
    '/register',
    '/subscription',
    '/news/[id]',
  ]

  const hideHeaderDynamic =
    pathname.startsWith('/quiz/play') ||
    pathname.startsWith('/admin/')

  const hideHeader =
    hideHeaderExact.includes(pathname) || hideHeaderDynamic

  /* ----------------------------------
     FOOTER (NAV) HIDE ROUTES
  ---------------------------------- */
  const hideFooterExact = [
    '/otp',
    '/otp/verify',
    '/login',
    '/register',
  ]

  const hideFooterDynamic =
    pathname.startsWith('/quiz/') ||
    pathname.startsWith('/admin/')

  const hideFooter =
    hideFooterExact.includes(pathname) || hideFooterDynamic

  return (
    <html lang="en">
      <body className={mulish.className}>
        <AuthChecker>
          <div className="min-h-screen bg-gray-50 pb-16">
            <div className="container mx-auto">

              {/* ✅ HEADER */}
              {!hideHeader && <Header />}

              {/* PAGE CONTENT */}
              {children}

              {/* ✅ FOOTER / NAVIGATION */}
              {!hideFooter && <Navigation />}

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

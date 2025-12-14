'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    // Pages that don't require authentication
    const isPublicPage = 
      pathname === '/otp' || 
      pathname === '/otp/verify' || 
      pathname.startsWith('/admin') ||
      pathname === '/login' ||
      pathname === '/register'

    // If not logged in and trying to access protected page, redirect to OTP
    if (!isLoggedIn && !isPublicPage) {
      router.push('/otp')
    }

    // If logged in and trying to access OTP pages, redirect to home
    if (isLoggedIn && (pathname === '/otp' || pathname === '/otp/verify')) {
      router.push('/')
    }
  }, [isLoggedIn, pathname, router])

  return <>{children}</>
}
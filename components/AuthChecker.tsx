'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const isPublicRoute =
      pathname === '/otp' ||
      pathname.startsWith('/otp/verify')

    // ❌ not logged in → otp
    if (!isLoggedIn && !isPublicRoute) {
      router.replace('/otp')
      return
    }

    // ✅ logged in → block otp pages
    if (
      isLoggedIn &&
      (pathname === '/otp' || pathname.startsWith('/otp/verify'))
    ) {
      router.replace('/profile') // ✅ FIXED
    }
  }, [isLoggedIn, pathname, router, mounted])

  if (!mounted) return null

  return <>{children}</>
}

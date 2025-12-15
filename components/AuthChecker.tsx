'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    const isPublic =
      pathname === '/otp' ||
      pathname.startsWith('/otp/verify') ||
      pathname.startsWith('/admin')

    if (!isLoggedIn && !isPublic) router.push('/otp')
    if (isLoggedIn && pathname.startsWith('/otp')) router.push('/')
  }, [isLoggedIn, pathname])

  return <>{children}</>
}

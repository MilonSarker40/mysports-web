// components/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GiRibbonMedal } from "react-icons/gi";
import { Home, Newspaper, HelpCircle, User } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/result', label: 'Result', icon: GiRibbonMedal },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/quiz', label: 'Quiz', icon: HelpCircle },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[479px] w-full z-20 m-auto bg-white border-t border-gray-200 safe-area-bottom">
      <div className='container'>
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 transition-colors ${
                  isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

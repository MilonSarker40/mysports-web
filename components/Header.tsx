'use client'

import { usePathname } from 'next/navigation'
import { Home, Newspaper, HelpCircle, User } from 'lucide-react'
import { GiRibbonMedal } from 'react-icons/gi'

const Header = () => {
    const pathname = usePathname()

    // Page title + icon mapping
    const pages: Record<string, { title: string; icon: any }> = {
        '/': { title: 'My Sports', icon: Home },
        '/result': { title: 'Result', icon: GiRibbonMedal },
        '/news': { title: 'News', icon: Newspaper },
        '/quiz': { title: 'Quiz', icon: HelpCircle },
        '/profile': { title: 'Profile', icon: User },
    }

    const current = pages[pathname] || { title: 'My Sports', icon: Home }
    const Icon = current.icon
    
    // Check if we are on the home page
    const isHomePage = pathname === '/'

    return (
        <header className="px-4 py-4 sticky top-0 z-[0] 
         after:content-[''] after:absolute after:inset-0 after:bottom-[-25px] after:bg-red-600 
         hover:bg-red-600 hover:after:bg-red-600">
            <div className="flex items-center justify-between relative z-10">
                
                {/* CONDITIONAL DISPLAY LOGIC */}
                {isHomePage ? (
                    /* Logo (Only for Home Page '/') */
                    <div className="flex items-center">
                        <img
                            src="/images/logo.png" // Ensure this path is correct
                            alt="Robi Logo"
                            className="h-6 w-auto" 
                        />
                        <h1 className="text-lg font-semibold pl-2 text-white">{current.title}</h1>
                    </div>
                ) : (
                    /* Dynamic Icon + Title (For all other pages) */
                    <div className="flex items-center space-x-2">
                        <Icon size={22} className="text-white" />
                        <h1 className="text-lg font-semibold text-white">{current.title}</h1>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
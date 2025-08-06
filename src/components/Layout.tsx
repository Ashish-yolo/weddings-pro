import React, { type ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
  showNavigation?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  )
}

export default Layout
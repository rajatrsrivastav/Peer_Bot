"use client"
import { Bot, Menu, X, User, ChevronDown } from 'lucide-react'
import { useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import Image from 'next/image'

import { AuthContext } from "@/context/auth"
import { logout } from "@/services/auth"
import { destroyToken, getToken } from "@/helpers/auth"

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  const isAuthenticated = session || isLoggedIn

  const [userData, setUserData] = useState({ name: 'User', email: '', image: null })

  useEffect(() => {
    const updateUserData = () => {
      if (session?.user) {
        setUserData({
          name: session.user.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          image: session.user.image
        })
      } else if (typeof window !== 'undefined') {
        try {
          const storedUserData = localStorage.getItem('userData')
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData))
          } else {
            setUserData({ name: 'User', email: '', image: null })
          }
        } catch (err) {
          console.log('Error parsing user data:', err)
          setUserData({ name: 'User', email: '', image: null })
        }
      }
    }

    updateUserData()
  }, [session, isLoggedIn])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserDropdownOpen])

  const isActive = (path) => pathname === path

  async function handleLogout() {
    try {
      if (session) {
        await signOut({ callbackUrl: '/auth/login' })
        return
      }
      
      const token = getToken()
      if (token) {
        const response = await logout({ token })
        const { message } = await response.json()
        console.log('Logout successful:', message)
        
        destroyToken()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userData')
        }
        setUserData({ name: 'User', email: '', image: null })
        setIsLoggedIn(false)
        router.push("/auth/login")
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userData')
        }
        setUserData({ name: 'User', email: '', image: null })
        setIsLoggedIn(false)
        router.push("/auth/login")
      }
    } catch (err) {
      console.error('Logout error:', err)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData')
      }
      destroyToken()
      setUserData({ name: 'User', email: '', image: null })
      setIsLoggedIn(false)
      router.push("/auth/login")
    }
  }

  const handleNav = (page) => {
    router.push(page)
    setIsMenuOpen(false)
  }

  const navLinks = [
    {
      name: 'Home',
      id: '/',
    },
    {
      name: 'About',
      id: '/about',
    },
    {
      name: 'Explore',
      id: '/explore',
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => handleNav('/')}
          >
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <span className="font-bold text-xl text-brand-text tracking-tight">
              PeerBot
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`text-sm font-medium transition-colors ${isActive(link.id) ? 'text-brand-primary' : 'text-brand-textLight hover:text-brand-text'}`}
              >
                {link.name}
              </button>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => handleNav('/dashboard')}
                className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-brand-primary' : 'text-brand-textLight hover:text-brand-text'}`}
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <span className="text-sm text-brand-textLight">{userData.name}</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-brand-border overflow-hidden">
                    {userData.image ? (
                      <Image 
                        src={userData.image} 
                        alt={userData.name} 
                        width={32} 
                        height={32} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-600" />
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-brand-textLight transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-brand-border py-1 z-50 user-dropdown">
                    <div className="px-4 py-2 border-b border-brand-border">
                      <p className="text-sm font-medium text-brand-text">{userData.name}</p>
                      <p className="text-xs text-brand-textLight">{userData.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleNav('/dashboard')
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-textLight hover:bg-gray-50 hover:text-brand-text transition-colors"
                    >
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-textLight hover:bg-gray-50 hover:text-brand-text transition-colors"
                    >
                      Profile & Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-textLight hover:bg-gray-50 hover:text-brand-text transition-colors"
                    >
                      Billing & Subscription
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-textLight hover:bg-gray-50 hover:text-brand-text transition-colors"
                    >
                      Support & Help
                    </button>
                    
                    <div className="border-t border-brand-border my-1"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="text-sm font-medium text-brand-textLight hover:text-brand-text transition-colors"
                  onClick={() => handleNav('/auth/login')}
                >
                  Log in
                </button>
                <button
                  className="bg-brand-primary text-white hover:bg-brand-primaryHover px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => handleNav('/auth/signup')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-brand-textLight hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="md:hidden bg-white border-t border-brand-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`block w-full text-left px-3 py-3 text-base font-medium rounded-md ${isActive(link.id) ? 'bg-brand-primary/5 text-brand-primary' : 'text-brand-text hover:bg-gray-50'}`}
                >
                  {link.name}
                </button>
              ))}
              {isAuthenticated && (
                <div className="pt-4 border-t border-brand-border">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-brand-text">{userData.name}</p>
                    <p className="text-xs text-brand-textLight">{userData.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full mt-2 px-3 py-3 text-base font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="pt-4 flex flex-col gap-2">
                  <button
                    className="w-full px-3 py-3 text-base font-medium text-brand-text border border-brand-border rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleNav('/auth/login')}
                  >
                    Log in
                  </button>
                  <button
                    className="w-full px-3 py-3 text-base font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-primaryHover transition-colors"
                    onClick={() => handleNav('/auth/signup')}
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar

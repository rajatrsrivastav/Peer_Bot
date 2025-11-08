"use client"
import { Bot, Menu, X } from "lucide-react"

import { useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

import { AuthContext } from "@/context/auth"
import { logout } from "@/services/auth"
import { destroyToken, getToken } from "@/helpers/auth"

import "./Navbar.css"
import Link from "next/link"
import Image from 'next/image'

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // User is authenticated if they have either NextAuth session or custom auth token
  const isAuthenticated = session || isLoggedIn

  // Close mobile nav on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (path) => pathname === path

  async function handleLogout() {
    try {
      // Handle NextAuth signout
      if (session) {
        await signOut({ callbackUrl: '/auth/login' })
        return
      }
      
      // Handle custom auth logout
      const token = getToken()
      if (token) {
        const response = await logout({ token })
        const { message } = await response.json()
        alert(message)
      }
      destroyToken()
      setIsLoggedIn(false)
      router.push("/auth/login")
    } catch (err) {
      console.log(err)
      alert(err)
    }
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand" aria-label="PeerBot Home">
          <span className="navbar__logoWrap">
            <Image src="/logo.jpg" alt="PeerBot logo" width={34} height={38} className="navbar__logo" />
            <span className="navbar__title">PeerBot</span>
          </span>
        </Link>
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__links">
            <li><Link className={isActive("/")?"is-active":""} href="/">Home</Link></li>
            <li><Link className={isActive("/about")?"is-active":""} href="/about">About</Link></li>
            <li><Link className={isActive("/explore")?"is-active":""} href="/explore">Explore</Link></li>
            {isAuthenticated && (
              <li><Link className={isActive("/dashboard")?"is-active":""} href="/dashboard">Dashboard</Link></li>
            )}
          </ul>
        </nav>
        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              {session?.user && (
                <span className="navbar__user">
                  {session.user.image && (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={32} 
                      height={32} 
                      className="navbar__userImage"
                    />
                  )}
                  <span className="navbar__userName">{session.user.name || session.user.email}</span>
                </span>
              )}
              <button onClick={handleLogout} className="btn btn--ghost" aria-label="Logout">Logout</button>
            </>
          ) : (
            <Link href="/auth/login" className="btn btn--primary" aria-label="Login">Login</Link>
          )}
          <button className="navbar__toggle" aria-label="Toggle menu" onClick={() => setIsOpen(o=>!o)}>
            {isOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>
      <div className={`navbar__mobile ${isOpen?"open":""}`} aria-hidden={!isOpen}>
        <ul className="navbar__mobileList">
          <li><Link className={isActive("/")?"is-active":""} href="/">Home</Link></li>
          <li><Link className={isActive("/about")?"is-active":""} href="/about">About</Link></li>
          <li><Link className={isActive("/explore")?"is-active":""} href="/explore">Explore</Link></li>
          {isAuthenticated && <li><Link className={isActive("/dashboard")?"is-active":""} href="/dashboard">Dashboard</Link></li>}
          <li className="navbar__mobileAction">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn--ghost w-full">Logout</button>
            ) : (
              <Link href="/auth/login" className="btn btn--primary w-full">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Navbar

'use client'

import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { AuthContext } from '@/context/auth'
import { getToken } from '@/helpers/auth'

export function useAuth() {
    const { data: session, status } = useSession()
    const { isLoggedIn } = useContext(AuthContext)
    
    // User is authenticated if they have either a NextAuth session or custom auth token
    const isAuthenticated = status === 'authenticated' || isLoggedIn
    const isLoading = status === 'loading'
    
    // Get user from session or try to get from token
    let user = session?.user || null
    
    // If no NextAuth session but logged in via custom auth, create a user object
    if (!user && isLoggedIn) {
        const token = getToken()
        if (token) {
            // You might want to decode the JWT token here to get user info
            user = { email: 'custom-auth-user' }
        }
    }
    
    return {
        session,
        isAuthenticated,
        isLoading,
        user,
        authMethod: session ? 'nextauth' : isLoggedIn ? 'custom' : null
    }
}

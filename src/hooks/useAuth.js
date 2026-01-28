'use client'

import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { AuthContext } from '@/context/auth'
import { getToken } from '@/helpers/auth'

export function useAuth() {
    const { data: session, status } = useSession()
    const { isLoggedIn } = useContext(AuthContext)
    
    const isAuthenticated = status === 'authenticated' || isLoggedIn
    const isLoading = status === 'loading'
    
    let user = session?.user || null
    
    if (!user && isLoggedIn) {
        const token = getToken()
        if (token) {
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

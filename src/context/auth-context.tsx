'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'OPERATIVO'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthContextType {
    user: User | null
    login: (email: string, role: UserRole) => void
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('auth_user')
        if (stored) {
            setUser(JSON.parse(stored))
        }
        setLoading(false)
    }, [])

    const login = (email: string, role: UserRole) => {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
            role,
        }
        setUser(newUser)
        localStorage.setItem('auth_user', JSON.stringify(newUser))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('auth_user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; message?: string }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithOtp: (email: string) => Promise<{ error: any; message?: string }>
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting sign up with:', { email, fullName })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    if (error) {
      console.error('Sign up error:', error)
      return { error }
    }
    
    console.log('Sign up successful:', data)
    
    // If user and session exist (immediate confirmation), update state
    if (data.user && data.session) {
      console.log('User confirmed immediately, setting session')
      setUser(data.user)
      setSession(data.session)
      return { error: null }
    }
    
    // If user exists but no session (needs confirmation), show success message
    if (data.user && !data.session) {
      console.log('User created, waiting for email confirmation')
      // Don't try to sign in immediately - let them confirm email first
      return { 
        error: null,
        message: 'Account created! Please check your email to confirm your account, then try signing in.' 
      }
    }
    
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signInWithOtp = async (email: string) => {
    console.log('Sending OTP to:', email)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Allow creating new users with OTP
        emailRedirectTo: undefined, // Force OTP instead of magic link
      },
    })
    
    if (error) {
      console.error('OTP send error:', error)
      return { error }
    }
    
    console.log('OTP sent successfully')
    return { 
      error: null, 
      message: 'Check your email for a 6-digit verification code!' 
    }
  }

  const verifyOtp = async (email: string, token: string) => {
    console.log('Verifying OTP for:', email)
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    
    if (error) {
      console.error('OTP verification error:', error)
      return { error }
    }
    
    console.log('OTP verified successfully:', data)
    
    // Update state with the new session
    if (data.user && data.session) {
      setUser(data.user)
      setSession(data.session)
    }
    
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOtp,
    verifyOtp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

import { LoadingScreen } from '@/components/loading-screen'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (!authLoading && animationComplete) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/landing')
      }
    }
  }, [user, authLoading, animationComplete, router])

  return <LoadingScreen onComplete={() => setAnimationComplete(true)} />
}

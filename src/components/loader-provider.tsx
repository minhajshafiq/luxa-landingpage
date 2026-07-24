'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { LuxaLoader } from '@/components/luxa-loader'

export const LUXA_LOADER_SESSION_KEY = 'luxa-loader-seen'
export const LUXA_LOADER_COMPLETE_EVENT = 'luxa-loader-complete'

export function hasSeenLuxaLoader() {
  if (typeof window === 'undefined') return false

  try {
    return window.sessionStorage.getItem(LUXA_LOADER_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

function markLuxaLoaderSeen() {
  try {
    window.sessionStorage.setItem(LUXA_LOADER_SESSION_KEY, 'true')
  } catch {
    // Private browsing and strict storage settings can reject sessionStorage.
  }
}

function dispatchLuxaLoaderComplete() {
  window.dispatchEvent(new CustomEvent(LUXA_LOADER_COMPLETE_EVENT))
}

interface LoaderProviderProps {
  children: ReactNode
}

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (hasSeenLuxaLoader()) {
      const readyFrame = window.requestAnimationFrame(() => {
        setShowLoader(false)
        dispatchLuxaLoaderComplete()
      })
      return () => window.cancelAnimationFrame(readyFrame)
    }

    return undefined
  }, [])

  useEffect(() => {
    if (!showLoader) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showLoader])

  const handleComplete = useCallback(() => {
    markLuxaLoaderSeen()
    dispatchLuxaLoaderComplete()
    setShowLoader(false)
  }, [])

  return (
    <>
      {children}
      {showLoader && <LuxaLoader onComplete={handleComplete} />}
    </>
  )
}

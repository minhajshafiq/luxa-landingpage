/**
 * Central GSAP setup for Luxa.
 * Registers plugins once, exposes reduced-motion + shared easing so every
 * animation stays consistent and premium.
 */
import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/** Premium easing curves — soft, warm, Apple-like. No cartoon bounce. */
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  sine: 'sine.inOut',
} as const

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** SSR-safe layout effect (avoids reveal flashes without server warnings). */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export { gsap, ScrollTrigger }

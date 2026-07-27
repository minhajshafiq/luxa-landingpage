'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion, EASE } from '@/lib/motion'
import { LUXA_LOADER_COMPLETE_EVENT } from '@/components/loader-provider'
import { useTranslation } from '@/lib/i18n/useTranslation'

/**
 * Global reveal engine. Tag any element with:
 *   data-animate="card" | "cta" | "lead" | "stella"
 * and it reveals with a premium blur-to-sharp rise as it enters the viewport.
 *
 * Built on IntersectionObserver (not scroll positions), so it stays correct
 * no matter how the pinned/scrubbed sections stretch the page. Re-runs when
 * the language changes (React may replace translated nodes); elements that
 * already revealed carry a marker so they never animate twice.
 */
const CONFIG: Record<string, { y: number; dur: number; scale?: number; blur?: number }> = {
  card: { y: 28, dur: 0.8, blur: 6 },
  cta: { y: 20, dur: 0.6 },
  lead: { y: 20, dur: 0.8, blur: 6 },
  stella: { y: 16, dur: 0.9, scale: 0.9 },
}

export function ScrollAnimations() {
  const { language } = useTranslation()

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set('[data-animate]', { clearProps: 'all', opacity: 1 })
      return
    }

    const els = gsap.utils
      .toArray<HTMLElement>('[data-animate]')
      .filter((el) => !el.dataset.animateDone)
    if (!els.length) return

    // Hide only once JavaScript is active. The CSS default stays visible so
    // content can never remain blank if an observer is delayed or unavailable.
    els.forEach((el) => {
      const c = CONFIG[el.dataset.animate ?? 'card'] ?? CONFIG.card
      gsap.set(el, {
        opacity: 0,
        y: c.y,
        scale: c.scale ?? 1,
        filter: c.blur ? `blur(${c.blur}px)` : 'none',
      })
    })

    // Stagger siblings that enter together by observing entry order.
    let queue: HTMLElement[] = []
    let flushTimer: number | null = null

    const flush = () => {
      const batch = queue
      queue = []
      flushTimer = null
      batch.forEach((el, i) => {
        const c = CONFIG[el.dataset.animate ?? 'card'] ?? CONFIG.card
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: c.y,
            scale: c.scale ?? 1,
            filter: c.blur ? `blur(${c.blur}px)` : 'none',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: c.dur,
            delay: i * 0.09,
            ease: EASE.out,
            overwrite: true,
            clearProps: 'filter,willChange',
          }
        )
      })
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.unobserve(entry.target)
          const el = entry.target as HTMLElement
          el.dataset.animateDone = '1'
          queue.push(el)
        }
        if (queue.length && flushTimer === null) {
          flushTimer = window.setTimeout(flush, 40)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    )

    els.forEach((el) => io.observe(el))

    // Safety net for unusual browser/scroll restoration timing. Motion is a
    // progressive enhancement; readable content always wins.
    const revealFallbackTimer = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.dataset.animateDone) return
        io.unobserve(el)
        el.dataset.animateDone = '1'
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: EASE.out,
          overwrite: true,
          clearProps: 'filter,willChange',
        })
      })
    }, 1600)

    let hashFrame: number | null = null
    let hashResizeObserver: ResizeObserver | null = null
    let hashResizeStopTimer: number | null = null
    let hashResizeDebounceTimer: number | null = null

    const stopHashResizeObserver = () => {
      if (hashResizeObserver !== null) {
        hashResizeObserver.disconnect()
        hashResizeObserver = null
      }
      if (hashResizeStopTimer !== null) {
        window.clearTimeout(hashResizeStopTimer)
        hashResizeStopTimer = null
      }
      if (hashResizeDebounceTimer !== null) {
        window.clearTimeout(hashResizeDebounceTimer)
        hashResizeDebounceTimer = null
      }
    }

    // Pinned sections add spacers after the browser's native anchor jump.
    // Re-run the jump once those spacers are measured so section titles do
    // not end up hidden behind the floating navigation.
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return

      const target = document.getElementById(id)
      if (!target) return

      ScrollTrigger.refresh()
      if (hashFrame !== null) window.cancelAnimationFrame(hashFrame)
      stopHashResizeObserver()
      hashFrame = window.requestAnimationFrame(() => {
        // `scroll-padding-top: 6rem` (globals.css) means a correctly-landed
        // target sits 96px from the top. The smooth scroll here can run
        // several hundred ms, and a scroll-triggered choreography further
        // down the page (e.g. a pinned section collapsing once scrolled
        // past, sometimes seconds after landing) can change the document
        // height after the browser has already committed to — or arrived
        // at — its destination. Re-aiming on a fixed timed schedule can't
        // know when that choreography actually finishes, so watch for the
        // layout shift itself instead of guessing at delays.
        const LANDING = 96
        const TOLERANCE = 24
        const MAX_CORRECTIONS = 4
        const OBSERVE_WINDOW_MS = 5000
        // A single collapsing tween fires ResizeObserver on nearly every
        // animation frame (~16ms apart) for its whole duration — reacting
        // to each one individually would burn through MAX_CORRECTIONS
        // before the tween even finishes. Debounce so one continuous
        // layout shift counts as one correction, made once it settles.
        const RESIZE_DEBOUNCE_MS = 150

        target.scrollIntoView({ block: 'start', behavior: 'smooth' })

        let corrections = 0
        hashResizeObserver = new ResizeObserver(() => {
          if (hashResizeDebounceTimer !== null) window.clearTimeout(hashResizeDebounceTimer)
          hashResizeDebounceTimer = window.setTimeout(() => {
            hashResizeDebounceTimer = null
            if (corrections >= MAX_CORRECTIONS) {
              stopHashResizeObserver()
              return
            }
            if (Math.abs(target.getBoundingClientRect().top - LANDING) > TOLERANCE) {
              corrections += 1
              // Never smooth here — a visible re-scroll after the fact reads
              // as a glitch. Snap silently back to the landing position.
              target.scrollIntoView({ block: 'start', behavior: 'auto' })
            }
          }, RESIZE_DEBOUNCE_MS)
        })
        hashResizeObserver.observe(document.body)

        hashResizeStopTimer = window.setTimeout(stopHashResizeObserver, OBSERVE_WINDOW_MS)
      })
    }

    const hashTimer = window.setTimeout(scrollToHash, 250)
    const handleHashChange = () => window.setTimeout(scrollToHash, 0)

    // Once the intro loader releases the page (and layout is settled),
    // recompute every pinned/scrubbed trigger and restore any deep link.
    const handleLoaderDone = () => {
      ScrollTrigger.refresh()
      scrollToHash()
    }

    window.addEventListener(LUXA_LOADER_COMPLETE_EVENT, handleLoaderDone, { once: true })
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      io.disconnect()
      if (flushTimer !== null) window.clearTimeout(flushTimer)
      window.clearTimeout(revealFallbackTimer)
      window.clearTimeout(hashTimer)
      if (hashFrame !== null) window.cancelAnimationFrame(hashFrame)
      stopHashResizeObserver()
      window.removeEventListener(LUXA_LOADER_COMPLETE_EVENT, handleLoaderDone)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [language])

  return null
}

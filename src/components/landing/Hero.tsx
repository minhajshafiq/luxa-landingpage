'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ChevronDown, TrendingUp, Target, ShieldCheck, Globe, Languages, Gift } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/design-system/Container'
import { GradientText } from '@/components/design-system/GradientText'
import { WaitlistForm } from '@/components/design-system/WaitlistForm'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { typography, section } from '@/lib/design-tokens'
import { fadeInUp, scaleIn, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Hero() {
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t } = useTranslation()

  const titleWords = (t('hero.title') as string || '').split(' ').filter(Boolean)
  const highlightWords = (t('hero.titleHighlight') as string || '').split(' ').filter(Boolean)
  const allWords = [...titleWords, ...highlightWords]

  useEffect(() => {
    if (titleRef.current) {
      const timer = setTimeout(() => {
        const words = titleRef.current?.querySelectorAll('.word')
        const wordGroup = titleRef.current?.querySelector('.word-group')
        
        if (words && words.length > 0) {
          const titleWords = Array.from(words).filter((word) => {
            const el = word as HTMLElement
            return !el.closest('.word-group')
          })
          
          gsap.set(titleWords, { opacity: 0, y: 20 })
          
          gsap.to(titleWords, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.3,
          })
          
          if (wordGroup) {
            gsap.set(wordGroup, { opacity: 0, y: 20 })
            gsap.to(wordGroup, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: 0.3 + (titleWords.length * 0.1),
            })
          }
        }
      }, 200)
      
      return () => clearTimeout(timer)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      phoneRefs.current.forEach((phone, index) => {
        if (phone) {
          const depth = (index + 1) * 0.02
          const moveX = (clientX - centerX) * depth
          const moveY = (clientY - centerY) * depth

          gsap.to(phone, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out',
          })
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-primary-light/60 via-background to-secondary-light/40',
        'min-h-screen flex flex-col items-center justify-center pt-20 md:pt-24',
        section.padding.combined
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      <Container className="relative z-10">
        {/* Hero Content - Mobile First */}
        <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto mb-8 md:mb-12">
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            viewport={viewport}
            className="flex justify-center"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 md:px-6 py-2 text-xs md:text-sm font-medium">
              {t('hero.badge') as string}
            </Badge>
          </motion.div>

          {/* Main Headline with GSAP word animation */}
          <h1
            ref={titleRef}
            className={cn(
              typography.display.combined,
              'font-bold tracking-tight leading-[1.1] text-foreground'
            )}
          >
            {titleWords.map((word, index) => (
              <span key={`title-${index}`}>
                <span className="word inline-block">{word}</span>{' '}
              </span>
            ))}
            {highlightWords.length > 0 && (
              <span className="word-group">
                {' '}
                <GradientText>
                  {highlightWords.map((word, index) => (
                    <span key={`highlight-${index}`}>
                      <span className="word inline-block">{word}</span>
                      {index < highlightWords.length - 1 && ' '}
                    </span>
                  ))}
                </GradientText>
              </span>
            )}
          </h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            viewport={viewport}
            transition={{ delay: 0.4 }}
            className={cn(
              typography.bodyLg.combined,
              'text-muted-foreground max-w-3xl mx-auto leading-relaxed'
            )}
          >
            {t('hero.subtitle') as string}{' '}
            <span className="font-semibold text-foreground">{t('hero.subtitle2') as string}</span>
            {t('hero.subtitle3') as string}
          </motion.p>

          {/* Waitlist Button + Secondary CTA */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            viewport={viewport}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2 md:pt-4"
          >
            <WaitlistForm>
              <AnimatedButton
                size="lg"
                className="w-full sm:w-auto px-8 md:px-12 h-12 md:h-14 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {t('nav.joinWaitlist') as string}
              </AnimatedButton>
            </WaitlistForm>

            <a
              href="#screenshots"
              className="inline-flex items-center gap-1.5 px-4 h-12 md:h-14 text-base md:text-lg font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {t('hero.watchDemo') as string}
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Store Badges - Coming Soon */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            viewport={viewport}
            transition={{ delay: 0.55 }}
            className="flex flex-col items-center gap-2 pt-2"
          >
            <span className="text-xs text-muted-foreground">{t('hero.comingSoon') as string}</span>
            <div className="flex items-center gap-3">
              <WaitlistForm>
                <button className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                    alt={t('hero.downloadAppStore') as string}
                    width={120}
                    height={40}
                    className="h-9 w-auto"
                  />
                </button>
              </WaitlistForm>
              <WaitlistForm>
                <button className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src="/GetItOnGooglePlay_Badge_Web_color_English.svg"
                    alt={t('hero.downloadPlayStore') as string}
                    width={135}
                    height={40}
                    className="h-9 w-auto"
                  />
                </button>
              </WaitlistForm>
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            viewport={viewport}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 text-xs md:text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t('hero.trust.secure') as string}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-primary" />
              {t('hero.trust.currencies') as string}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-primary" />
              {t('hero.trust.languages') as string}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-primary" />
              {t('hero.trust.free') as string}
            </span>
          </motion.div>
        </div>

        {/* Phone Mockups - Mobile First Responsive */}
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          viewport={viewport}
          transition={{ delay: 0.6 }}
          className="relative flex justify-center items-center mt-4 md:mt-8"
        >
          {/* Mobile: Single centered phone */}
          <div className="block md:hidden">
            <div className="relative w-[280px] mx-auto">
              <Image
                src="/Group 84-portrait.png"
                alt="Luxa App"
                width={280}
                height={600}
                className="w-full h-auto drop-shadow-2xl rounded-3xl"
              />
              <div className="animate-luxa-float absolute -top-2 -right-4 flex items-center gap-2 bg-card border border-border/50 rounded-2xl shadow-lg px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-epargne/15 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-epargne" />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-xs font-bold text-foreground">+247€</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{t('hero.floatingSavings') as string}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Three phones with clean modern layout */}
          <div className="hidden md:flex relative w-full max-w-6xl gap-4 lg:gap-6 justify-center items-center px-4">
            {/* Floating stat badge - savings */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.9 }}
              className="animate-luxa-float absolute left-[8%] lg:left-[14%] top-[18%] z-20 flex items-center gap-2.5 bg-card border border-border/50 rounded-2xl shadow-xl px-3.5 py-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-epargne/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-epargne" />
              </div>
              <div className="leading-tight text-left">
                <p className="text-sm font-bold text-foreground">+247€</p>
                <p className="text-[11px] text-muted-foreground whitespace-nowrap">{t('hero.floatingSavings') as string}</p>
              </div>
            </motion.div>

            {/* Floating stat badge - goal */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 1.1 }}
              className="animate-luxa-float absolute right-[8%] lg:right-[14%] bottom-[14%] z-20 flex items-center gap-2.5 bg-card border border-border/50 rounded-2xl shadow-xl px-3.5 py-2.5"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-secondary" />
              </div>
              <div className="leading-tight text-left">
                <p className="text-sm font-bold text-foreground">{t('hero.floatingGoal') as string}</p>
                <div className="w-20 h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-secondary" />
                </div>
              </div>
            </motion.div>

            {/* Left Phone */}
            <div
              ref={(el) => {
                if (el) phoneRefs.current[0] = el
              }}
              className="relative w-[240px] lg:w-[300px] transform hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/Group 85-portrait.png"
                alt="Luxa App - Suivi des dépenses"
                width={300}
                height={640}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
                priority
              />
            </div>

            {/* Center Phone - Most prominent */}
            <div
              ref={(el) => {
                if (el) phoneRefs.current[1] = el
              }}
              className="relative w-[260px] lg:w-[340px] transform hover:scale-105 transition-transform duration-300 z-10"
            >
              <Image
                src="/Group 84-portrait.png"
                alt="Luxa App - Gestion financière"
                width={340}
                height={720}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
                priority
              />
            </div>

            {/* Right Phone */}
            <div
              ref={(el) => {
                if (el) phoneRefs.current[2] = el
              }}
              className="relative w-[240px] lg:w-[300px] transform hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/Group 86-portrait.png"
                alt="Luxa App - Budget et épargne"
                width={300}
                height={640}
                className="w-full h-auto drop-shadow-2xl rounded-[2.5rem]"
                priority
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

/**
 * Animation Variants & Configurations
 * Framer Motion + GSAP utilities
 */

import type { Variants } from 'framer-motion'

// Custom easing curves
export const easings = {
  smooth: [0.22, 1, 0.36, 1],     // Smooth ease out
  spring: [0.25, 0.46, 0.45, 0.94], // Spring-like
  bounce: [0.68, -0.55, 0.265, 1.55], // Bounce
} as const

// Framer Motion Variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    }
  },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    }
  },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    }
  },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    }
  },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    }
  },
}

// Blur-to-sharp reveal (premium mockup entrance)
export const blurIn: Variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: easings.smooth,
    },
  },
}

// Stagger container variant
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Stagger item — pairs with staggerContainer for card grids
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easings.smooth,
    },
  },
}

// Gentle hover-lift for premium cards
export const cardLift = {
  whileHover: {
    y: -6,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 22,
    },
  },
} as const

// Spring animation configs for hover states
export const springHover = {
  whileHover: {
    scale: 1.03,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 10,
    }
  },
  whileTap: { scale: 0.98 },
} as const

export const buttonSpring = {
  whileHover: {
    scale: 1.05,
    boxShadow: '0 12px 32px -4px hsl(var(--primary) / 0.2)',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 10,
    }
  },
  whileTap: { scale: 0.95 },
} as const

export const cardSpring = {
  whileHover: {
    y: -4,
    boxShadow: '0 12px 32px -4px hsl(var(--primary) / 0.16)',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    }
  },
} as const

// GSAP ScrollTrigger defaults
export const scrollTriggerDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
  markers: false,
} as const

// Viewport settings for Framer Motion
export const viewport = {
  once: true,
  amount: 0.3,
  margin: '0px 0px -100px 0px',
} as const

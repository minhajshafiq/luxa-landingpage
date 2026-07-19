'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { WaitlistForm } from '@/components/design-system/WaitlistForm'
import { APP_STORE_URL } from '@/constants/site'
import { buttonSpring } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface AppStoreButtonsProps {
  downloadLabel: string
  androidLabel: string
  className?: string
}

export function AppStoreButtons({
  downloadLabel,
  androidLabel,
  className,
}: AppStoreButtonsProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row items-center gap-3', className)}>
      {/* The real Apple-issued badge — not a lookalike button. */}
      <motion.a
        {...buttonSpring}
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={downloadLabel}
        className="block h-12 w-auto overflow-hidden rounded-xl shadow-[0_0_32px_-8px_hsl(var(--primary)/0.4)] md:h-14"
      >
        <Image
          src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
          alt={downloadLabel}
          width={160}
          height={53}
          className="h-full w-auto"
          priority
        />
      </motion.a>

      {/* The real Google Play badge — opens the beta waitlist since Android
          isn't live on the Play Store yet. */}
      <WaitlistForm>
        <motion.button
          type="button"
          {...buttonSpring}
          aria-label={androidLabel}
          className="block h-12 w-auto overflow-hidden rounded-xl md:h-14"
        >
          <Image
            src="/GetItOnGooglePlay_Badge_Web_color_English.svg"
            alt={androidLabel}
            width={161}
            height={48}
            className="h-full w-auto"
          />
        </motion.button>
      </WaitlistForm>
    </div>
  )
}

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhoneFrameProps {
  src?: string
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
  /** Custom screen content, rendered instead of an <Image> when provided. */
  children?: React.ReactNode
}

/**
 * The current product shots already include the complete iPhone mockup.
 * Keeping the frame here as a simple intrinsic-ratio wrapper prevents a
 * second bezel/notch from being drawn around those images.
 */
export function PhoneFrame({
  src,
  alt,
  className,
  priority,
  sizes = '(max-width: 768px) 280px, 340px',
  children,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative aspect-[1530/3036] w-full drop-shadow-[0_32px_55px_rgba(17,8,35,0.82)]',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ''}
          width={1530}
          height={3036}
          priority={priority}
          className="h-full w-full select-none object-contain"
          sizes={sizes}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden rounded-[2.25rem] bg-black">
          {children}
        </div>
      )}
    </div>
  )
}

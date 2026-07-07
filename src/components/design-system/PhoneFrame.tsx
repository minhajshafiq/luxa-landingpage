import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhoneFrameProps {
  src?: string
  alt?: string
  className?: string
  priority?: boolean
  /** Custom screen content, rendered instead of an <Image> when provided. */
  children?: React.ReactNode
}

export function PhoneFrame({ src, alt, className, priority, children }: PhoneFrameProps) {
  return (
    <div className={cn('relative aspect-[1206/2622] w-full', className)}>
      <div className="absolute inset-0 rounded-[2.75rem] bg-black p-[10px] shadow-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-black">
          {src ? (
            <Image
              src={src}
              alt={alt ?? ''}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 768px) 280px, 340px"
            />
          ) : (
            children
          )}
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[10px] h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

import React from "react"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "gradient"
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-12 w-12",
  xl: "h-16 w-16"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClass = sizeClasses[size]
  
  return (
    <div className={`${sizeClass} ${className}`}>
      <Image 
        src="/icon.png" 
        alt="Luxa Logo"
        width={64}
        height={64}
        className="w-full h-full rounded-lg"
      />
    </div>
  )
}

export function LogoText({ className = "", variant = "default" }: { className?: string; variant?: "default" | "white" }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size="md" variant={variant} />
      <span className={`text-2xl font-bold tracking-tight ${
        variant === "white" ? "text-white" : "text-foreground"
      }`}>
        Luxa
      </span>
    </div>
  )
}

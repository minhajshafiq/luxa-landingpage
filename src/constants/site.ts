import { SocialLink } from "@/types"

/** Live App Store listing — primary install destination. */
export const APP_STORE_URL =
  "https://apps.apple.com/us/app/luxa-budget-expense-tracker/id6778473614"

export const siteConfig = {
  name: "Luxa",
  description: "Votre coach budget personnel pour un mois plus clair",
  url: "https://getluxa.app",
  links: {
    tiktok: "https://www.tiktok.com/@luxaapp",
    instagram: "https://www.instagram.com/getluxa/",
  },
}

/**
 * The App Store rating, kept in one place so it can never drift between the
 * places that show it.
 *
 * Hidden for now: a perfect score over a handful of reviews reads as "nobody
 * uses this" rather than "people like this", and on a money app that costs
 * more trust than it buys. The page leans on claims that are true and
 * checkable instead — free, no bank connection, private.
 *
 * Flip SHOW_RATING once the review count is high enough to be reassuring
 * (roughly 20+), and update the numbers below to match the live listing.
 */
export const SHOW_RATING = false
export const APP_STORE_RATING = { score: 5.0, count: 2 }

export const socialLinks: SocialLink[] = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@luxaapp",
    icon: "tiktok",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/getluxa/",
    icon: "instagram",
  },
]

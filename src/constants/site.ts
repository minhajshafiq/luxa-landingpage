import { NavItem, SocialLink, Feature, PricingPlan, RoadmapItem } from "@/types"

/** Live App Store listing — primary install destination. */
export const APP_STORE_URL =
  "https://apps.apple.com/us/app/luxa-budget-expense-tracker/id6778473614"

export const siteConfig = {
  name: "Luxa",
  description: "Votre coach budget personnel pour un mois plus clair",
  url: "https://luxa.app",
  ogImage: "https://luxa.app/og.jpg",
  links: {
    twitter: "https://twitter.com/luxa",
    github: "https://github.com/luxa",
  },
}

export const navItems: NavItem[] = [
  {
    title: "Accueil",
    href: "/",
  },
  {
    title: "Fonctionnalités",
    href: "#features",
  },
  {
    title: "Tarifs",
    href: "#pricing",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
]

export const socialLinks: SocialLink[] = [
  {
    name: "Twitter",
    href: "https://twitter.com/luxa",
    icon: "twitter",
  },
  {
    name: "GitHub",
    href: "https://github.com/luxa",
    icon: "github",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/luxa",
    icon: "linkedin",
  },
]

export const features: Feature[] = [
  {
    id: "1",
    title: "Interface intuitive",
    description: "Une expérience utilisateur fluide et moderne conçue pour la simplicité.",
    icon: "smartphone",
  },
  {
    id: "2",
    title: "Connexion bancaire sécurisée",
    description: "Connectez vos comptes bancaires en toute sécurité pour un suivi automatique de vos finances.",
    icon: "shield",
  },
  {
    id: "3",
    title: "Synchronisation cloud",
    description: "Vos données sont sauvegardées et synchronisées en temps réel.",
    icon: "cloud",
  },
  {
    id: "4",
    title: "Notifications intelligentes",
    description: "Recevez des alertes personnalisées et pertinentes.",
    icon: "bell",
  },
  {
    id: "5",
    title: "Mode hors ligne",
    description: "Fonctionnalités complètes même sans connexion internet.",
    icon: "wifi-off",
  },
  {
    id: "6",
    title: "Support 24/7",
    description: "Une équipe dédiée disponible à tout moment pour vous aider.",
    icon: "headphones",
  },
]


export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    period: "pour toujours",
    features: [
      "Gestion de base des finances",
      "Suivi des dépenses",
      "Support par email",
      "Synchronisation limitée",
    ],
    cta: "Commencer gratuitement",
  },
  {
    id: "premium",
    name: "Premium",
    price: 5.99,
    period: "par mois",
    features: [
      "Toutes les fonctionnalités gratuites",
      "Analytics détaillés",
      "Règle 50-30-20 pour les pockets",
      "Calendrier des dépenses mensuelles",
    ],
    isPopular: true,
    cta: "Essayer Premium",
  },
  {
    id: "lifetime",
    name: "À vie",
    price: 159.99,
    period: "paiement unique",
    features: [
      "Toutes les fonctionnalités Premium",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
    cta: "Acheter à vie",
  },
]

export const roadmapItems: RoadmapItem[] = [
  {
    id: "1",
    title: "App en bêta",
    description: "Version bêta de l'application mobile avec les fonctionnalités de base",
    status: "completed",
    icon: "smartphone",
  },
  {
    id: "2",
    title: "App publiée",
    description: "Publication officielle sur les stores avec toutes les fonctionnalités premium",
    status: "current",
    icon: "rocket",
  },
  {
    id: "3",
    title: "Version web",
    description: "Interface web complète pour une gestion depuis n'importe quel navigateur",
    status: "upcoming",
    icon: "monitor",
  },
  {
    id: "4",
    title: "Budget à 2",
    description: "Gestion collaborative des budgets pour couples et familles",
    status: "upcoming",
    icon: "users",
  },
]

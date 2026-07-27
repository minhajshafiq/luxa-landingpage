import type { MetadataRoute } from 'next'
import { siteConfig } from '@/constants/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing to index behind these, and they should never surface in search.
      disallow: '/api/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/pai-demo/', '/food-forest/'],
    },
    sitemap: 'https://wallykroeker.com/sitemap.xml',
  }
}

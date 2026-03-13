import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/pai-demo/'],
    },
    sitemap: 'https://wallykroeker.com/sitemap.xml',
  }
}

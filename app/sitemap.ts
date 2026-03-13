import { MetadataRoute } from 'next'
import { getAll, isPublic } from '@/lib/markdown'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAll('posts')
  const publicPosts = allPosts.filter(p => isPublic(p.meta))

  const blogEntries = publicPosts.map((post) => ({
    url: `https://wallykroeker.com/blog/${post.slug}`,
    lastModified: new Date(post.meta.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://wallykroeker.com',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://wallykroeker.com/about',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://wallykroeker.com/work',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://wallykroeker.com/blog',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://wallykroeker.com/projects',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://wallykroeker.com/community',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://wallykroeker.com/loop',
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://wallykroeker.com/engage',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://wallykroeker.com/colophon',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://wallykroeker.com/privacy',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticPages, ...blogEntries]
}

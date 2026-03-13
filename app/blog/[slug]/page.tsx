import type { Metadata } from 'next'
import Container from '@/components/Container'
import Prose from '@/components/Prose'
import { getAll, getBySlug } from '@/lib/markdown'

export async function generateStaticParams() {
  const posts = await getAll('posts')
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBySlug('posts', `${params.slug}.md`)
  const title = post.meta.title
  const description = post.meta.description || `${title} — by Wally Kroeker`
  const url = `https://wallykroeker.com/blog/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: new Date(post.meta.date).toISOString(),
      authors: ['Wally Kroeker'],
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getBySlug('posts', `${params.slug}.md`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    datePublished: new Date(post.meta.date).toISOString(),
    dateModified: new Date(post.meta.date).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Wally Kroeker',
      url: 'https://wallykroeker.com/about',
    },
    publisher: {
      '@type': 'Person',
      name: 'Wally Kroeker',
    },
    description: post.meta.description || post.meta.title,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://wallykroeker.com/blog/${params.slug}`,
    },
  }

  return (
    <section className="border-t border-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Container>
        <div className="py-10">
          <div className="text-sm text-zinc-400">{new Date(post.meta.date).toLocaleDateString()}</div>
          <h1 className="text-2xl font-semibold">{post.meta.title}</h1>
          <div className="mt-6">
            <Prose html={post.html} />
          </div>
        </div>
      </Container>
    </section>
  )
}

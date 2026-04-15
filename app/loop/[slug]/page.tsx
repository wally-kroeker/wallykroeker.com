import type { Metadata } from 'next'
import Container from '@/components/Container'
import Prose from '@/components/Prose'
import LoopAudioPlayer from '@/components/LoopAudioPlayer'
import { getAllLoopPosts, getLoopPost } from '@/lib/markdown'

export async function generateStaticParams() {
  const posts = await getAllLoopPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getLoopPost(params.slug)
  const title = post.meta.title
  const description =
    post.meta.description || post.meta.subtitle || `${title} — Cognitive Loop by Wally Kroeker`
  const url = `https://wallykroeker.com/loop/${params.slug}`

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

export default async function LoopPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getLoopPost(params.slug)

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10 max-w-3xl">
          <div className="text-sm text-zinc-500">
            {new Date(post.meta.date).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-100">{post.meta.title}</h1>
          {post.meta.subtitle && (
            <p className="mt-1 text-zinc-400">{post.meta.subtitle}</p>
          )}

          <div className="mt-6">
            <LoopAudioPlayer slug={params.slug} title={post.meta.title} />
          </div>

          <div className="mt-8">
            <Prose html={post.html} />
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-900">
            <a href="/loop" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              ← All Cognitive Loop posts
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

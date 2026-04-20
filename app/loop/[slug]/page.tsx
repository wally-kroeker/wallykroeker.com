import type { Metadata } from 'next'
import Container from '@/components/Container'
import Prose from '@/components/Prose'
import AudioPlayer from '@/components/AudioPlayer'
import { getSubstackPosts, getSubstackPost } from '@/lib/substack'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getSubstackPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getSubstackPost(params.slug)
  if (!post) return { title: 'Cognitive Loop' }

  const title = post.title
  const description = post.description || `${title} — Cognitive Loop by Wally Kroeker`
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
      publishedTime: post.date,
      authors: ['Wally Kroeker'],
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
    twitter: {
      card: post.thumbnail ? 'summary_large_image' : 'summary',
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
  const post = await getSubstackPost(params.slug)

  if (!post) {
    return (
      <section className="border-t border-zinc-900">
        <Container>
          <div className="py-10">
            <p className="text-zinc-500">Post not found.</p>
            <a href="/loop" className="mt-4 inline-block text-sm text-zinc-400 hover:text-zinc-200">← All posts</a>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10 max-w-3xl">
          <div className="text-sm text-zinc-500">
            {new Date(post.date).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-100">{post.title}</h1>

          <div className="mt-6">
            <AudioPlayer
              audioSrc={`/audio/loop/${params.slug}.mp3`}
              title={post.title}
              fallbackSrc={post.audioUrl}
            />
          </div>

          <div className="mt-8">
            <Prose html={post.content} />
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-900 flex items-center justify-between">
            <a href="/loop" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              ← All Cognitive Loop posts
            </a>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Read on Substack →
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

import type { Metadata } from 'next'
import Container from '@/components/Container'
import { site } from '@/lib/siteConfig'
import { getAllLoopPosts } from '@/lib/markdown'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Cognitive Loop',
  description: 'Transparent human+AI writing. Ship the thinking, not just the conclusions.',
  alternates: { canonical: 'https://wallykroeker.com/loop' },
}

export default async function LoopPage() {
  const posts = await getAllLoopPosts()

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <h1 className="text-xl font-semibold">Cognitive Loop</h1>
              <p className="mt-2 text-zinc-300 max-w-2xl">
                Transparent human+AI writing. Ship the thinking, not just the conclusions.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={site.substack} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900 transition-colors">
                  Read on Substack
                </a>
                <a href="/loop/what-is" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900 transition-colors">
                  What is Cognitive Loop?
                </a>
              </div>
            </div>
          </div>

          {posts.length > 0 && (
            <ul className="mt-10 space-y-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/loop/${post.slug}`}
                    className="block rounded-2xl border border-zinc-800 p-5 hover:border-zinc-600 transition-colors"
                  >
                    <div className="text-sm text-zinc-500">
                      {new Date(post.meta.date).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </div>
                    <div className="mt-1 text-lg font-medium text-zinc-100">{post.meta.title}</div>
                    {post.meta.subtitle && (
                      <div className="text-sm text-zinc-400 mt-0.5">{post.meta.subtitle}</div>
                    )}
                    {post.excerpt && (
                      <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.meta.tags && post.meta.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.meta.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  )
}

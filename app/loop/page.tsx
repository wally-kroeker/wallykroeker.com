import type { Metadata } from 'next'
import Container from '@/components/Container'
import { site } from '@/lib/siteConfig'
import { getSubstackPosts } from '@/lib/substack'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Cognitive Loop',
  description: 'Transparent human+AI writing. Ship the thinking, not just the conclusions.',
  alternates: { canonical: 'https://wallykroeker.com/loop' },
}

export default async function LoopPage() {
  const posts = await getSubstackPosts()

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
                    className="block rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors overflow-hidden"
                  >
                    {post.thumbnail && (
                      <div className="w-full h-48 overflow-hidden bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="text-sm text-zinc-500">
                        {new Date(post.date).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </div>
                      <div className="mt-1 text-lg font-medium text-zinc-100">{post.title}</div>
                      {post.description && (
                        <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{post.description}</p>
                      )}
                    </div>
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

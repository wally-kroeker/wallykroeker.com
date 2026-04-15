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
          <div className="max-w-2xl">
            <h1 className="text-xl font-semibold">Cognitive Loop</h1>
            <p className="mt-2 text-zinc-300">
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

          {posts.length > 0 && (
            <ul className="mt-10 space-y-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/loop/${post.slug}`}
                    className="flex items-start gap-4 rounded-2xl border border-zinc-800 p-4 hover:border-zinc-600 transition-colors"
                  >
                    {/* Thumbnail */}
                    {post.thumbnail ? (
                      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 w-20 h-20 rounded-lg bg-zinc-900 flex items-center justify-center">
                        <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                    )}

                    {/* Text content */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-zinc-500">
                        {new Date(post.date).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </div>
                      <div className="mt-0.5 text-base font-medium text-zinc-100 leading-snug">{post.title}</div>
                      {post.description && (
                        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{post.description}</p>
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

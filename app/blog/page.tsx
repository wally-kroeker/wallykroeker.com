import Container from '@/components/Container'
import { getAll } from '@/lib/markdown'

export const dynamic = 'force-static'

export default async function BlogIndex() {
  const posts = await getAll('posts')
  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Technical Blog</h1>
          <p className="mt-2 text-zinc-300 max-w-3xl">Build logs, decision records, and one‑pagers.</p>
          <ul className="mt-6 space-y-4">
            {posts.map(p => (
              <li key={p.slug}>
                <a className="block rounded-2xl border border-zinc-800 p-4 hover:border-zinc-600" href={`/blog/${p.slug}`}>
                  <div className="text-sm text-zinc-400">{new Date(p.meta.date).toLocaleDateString()}</div>
                  <div className="text-lg">{p.meta.title}</div>
                  {p.meta.description ? <p className="text-sm text-zinc-300 mt-1">{p.meta.description}</p> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

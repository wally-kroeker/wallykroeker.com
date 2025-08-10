import Container from '@/components/Container'
import Prose from '@/components/Prose'
import { getAll, getBySlug } from '@/lib/markdown'

export async function generateStaticParams() {
  const posts = await getAll('posts')
  return posts.map(p => ({ slug: p.slug }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getBySlug('posts', `${params.slug}.md`)
  return (
    <section className="border-t border-zinc-900">
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

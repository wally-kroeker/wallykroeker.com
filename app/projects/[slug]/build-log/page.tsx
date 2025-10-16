import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import Container from '@/components/Container'
import type { PostMeta } from '@/lib/markdown'
import Link from 'next/link'

const CONTENT_DIR = path.join(process.cwd(), 'content')

async function getBuildLog(slug: string) {
  const file = path.join(CONTENT_DIR, 'projects', slug, 'build-log.md')
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf8')
  const { data: frontmatter, content } = matter(raw)
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
      .use(rehypeStringify)
      .process(content)
  )
  return { frontmatter: frontmatter as PostMeta, html }
}

export default async function BuildLogPage({
  params,
}: {
  params: { slug: string }
}) {
  const log = await getBuildLog(params.slug)
  if (!log) return notFound()

  // Visibility check
  if (!(log.frontmatter?.reviewed && log.frontmatter?.sensitivity === 'public')) {
    return notFound()
  }

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <main className="py-10 max-w-3xl">
          <div className="mb-6">
            <Link
              href={`/projects/${params.slug}`}
              className="text-sm text-zinc-400 hover:text-zinc-100"
            >
              ← Back to project
            </Link>
          </div>
          <h1 className="text-2xl font-semibold mb-8">{log.frontmatter.title}</h1>
          <div
            className="prose prose-invert prose-zinc max-w-none"
            dangerouslySetInnerHTML={{ __html: log.html }}
          />
        </main>
      </Container>
    </section>
  )
}

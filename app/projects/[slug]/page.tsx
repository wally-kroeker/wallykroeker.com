import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import { getUpdatesByProject } from '@/lib/projectUpdates'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import Container from '@/components/Container'
import type { PostMeta } from '@/lib/markdown'

const CONTENT_DIR = path.join(process.cwd(), 'content')

async function getProjectIndex(slug: string) {
  const file = path.join(CONTENT_DIR, 'projects', slug, 'index.md')
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

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const idx = await getProjectIndex(params.slug)
  if (!idx) return notFound()

  // Visibility: project hub index is allowed to render when reviewed && public
  if (!(idx.frontmatter?.reviewed && idx.frontmatter?.sensitivity === 'public')) {
    return notFound()
  }

  const items = await getUpdatesByProject(params.slug)

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <main className="py-10 max-w-3xl">
          <h1 className="text-2xl font-semibold">{idx.frontmatter.title}</h1>
          <div className="flex gap-2 mt-2 mb-6 text-sm">
            {idx.frontmatter.status && (
              <span className="inline-block rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                {idx.frontmatter.status}
              </span>
            )}
            {idx.frontmatter.stage && (
              <span className="inline-block rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">
                {idx.frontmatter.stage}
              </span>
            )}
          </div>

          {/* Overview */}
          <div
            className="prose prose-invert prose-zinc max-w-none"
            dangerouslySetInnerHTML={{ __html: idx.html }}
          />

          {/* Links */}
          {idx.frontmatter?.links && (
            <ul className="mt-6 space-y-1 text-sm text-zinc-300">
              {idx.frontmatter.links.repo && (
                <li>
                  <span className="text-zinc-400">Repo:</span>{' '}
                  <a
                    href={idx.frontmatter.links.repo}
                    className="text-zinc-100 hover:underline"
                  >
                    {idx.frontmatter.links.repo}
                  </a>
                </li>
              )}
              {idx.frontmatter.links.docs && (
                <li>
                  <span className="text-zinc-400">Docs:</span>{' '}
                  <a
                    href={idx.frontmatter.links.docs}
                    className="text-zinc-100 hover:underline"
                  >
                    {idx.frontmatter.links.docs}
                  </a>
                </li>
              )}
              {idx.frontmatter.links.demo && (
                <li>
                  <span className="text-zinc-400">Demo:</span>{' '}
                  <a
                    href={idx.frontmatter.links.demo}
                    className="text-zinc-100 hover:underline"
                  >
                    {idx.frontmatter.links.demo}
                  </a>
                </li>
              )}
            </ul>
          )}

          {/* Timeline */}
          <h2 className="text-xl font-semibold mt-12 mb-6">Timeline</h2>
          {items.length === 0 ? (
            <p className="text-zinc-400">No updates yet.</p>
          ) : (
            <ol className="space-y-8">
              {items.map((it, i) => (
                <li key={i} className="border-l-2 border-zinc-800 pl-6 relative">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-950" />
                  <div className="text-xs text-zinc-500 mb-1">
                    {it.date.toISOString().slice(0, 10)}
                  </div>
                  {it.kind === 'post' ? (
                    <div>
                      <a
                        className="text-lg font-medium text-zinc-100 hover:underline"
                        href={it.slug}
                      >
                        {it.title}
                      </a>
                      {it.summary && (
                        <p className="mt-1 text-sm text-zinc-300">{it.summary}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-medium text-zinc-100 mb-2">
                        {it.title}
                      </div>
                      <div
                        className="prose prose-sm prose-invert prose-zinc max-w-none"
                        dangerouslySetInnerHTML={{ __html: it.htmlSnippet }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </main>
      </Container>
    </section>
  )
}

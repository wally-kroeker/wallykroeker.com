import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export type PostMeta = {
  title: string
  date: string
  tags?: string[]
  description?: string
}

const postsDir = path.join(process.cwd(), 'content', 'posts')
const guidesDir = path.join(process.cwd(), 'content', 'guides')

async function mdToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}

export function listSlugs(kind: 'posts' | 'guides') {
  const dir = kind === 'posts' ? postsDir : guidesDir
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
}

export async function getBySlug(kind: 'posts' | 'guides', slug: string) {
  const dir = kind === 'posts' ? postsDir : guidesDir
  const fullPath = path.join(dir, slug)
  const file = fs.readFileSync(fullPath, 'utf8')
  const { content, data } = matter(file)
  const html = await mdToHtml(content)
  return { meta: data as PostMeta, html, slug: slug.replace(/\.md$/, '') }
}

export async function getAll(kind: 'posts' | 'guides') {
  const slugs = listSlugs(kind)
  const items = await Promise.all(slugs.map((s) => getBySlug(kind, s)))
  return items.sort((a, b) => (a.meta.date > b.meta.date ? -1 : 1))
}

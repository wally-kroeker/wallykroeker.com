import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { visit } from 'unist-util-visit'
import type { Node } from 'unist'

export type PostMeta = {
  title: string
  date: string
  tags?: string[]
  description?: string
  // Publishing gates
  status?: 'draft' | 'published' | 'active'
  reviewed?: boolean
  sensitivity?: 'public' | 'internal' | 'client'
  // Project references
  projects?: string[]  // for blog posts that reference projects
  project?: string     // for project hub pages
  // Project-specific
  type?: 'project' | 'project-log' | 'post'
  stage?: string
  links?: {
    repo?: string
    docs?: string
    demo?: string
  }
}

const postsDir = path.join(process.cwd(), 'content', 'posts')
const guidesDir = path.join(process.cwd(), 'content', 'guides')
const projectsDir = path.join(process.cwd(), 'content', 'projects')

export function isPublic(meta: PostMeta): boolean {
  // Default to published/public for existing content without these fields
  const status = meta.status ?? 'published'
  const reviewed = meta.reviewed ?? true
  const sensitivity = meta.sensitivity ?? 'public'

  // For projects, 'active' status counts as public-ready
  const isStatusPublic = meta.type === 'project'
    ? (status === 'published' || status === 'active')
    : status === 'published'

  return isStatusPublic && reviewed === true && sensitivity === 'public'
}

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

export function listSlugs(kind: 'posts' | 'guides' | 'projects') {
  const dir = kind === 'posts' ? postsDir : kind === 'guides' ? guidesDir : projectsDir
  if (!fs.existsSync(dir)) return []
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

export async function getGuideByPath(relPath: string) {
  const fullPath = path.join(process.cwd(), 'content', relPath)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relPath}`)
  }

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data: frontmatter, content } = matter(raw)

  // Parse the markdown tree to extract H2 sections
  const tree = unified().use(remarkParse).parse(content)

  interface H2Section {
    heading: string
    nodes: Node[]
  }

  const h2Sections: H2Section[] = []
  let currentSection: H2Section | null = null

  visit(tree, (node: Node) => {
    if (node.type === 'heading' && (node as any).depth === 2) {
      // Save previous section if exists
      if (currentSection) {
        h2Sections.push(currentSection)
      }
      // Start new section
      const headingText = (node as any).children
        .map((c: any) => c.value || '')
        .join('')
      currentSection = { heading: headingText, nodes: [] }
    } else if (currentSection) {
      // Add node to current section
      currentSection.nodes.push(node)
    }
  })

  // Don't forget the last section
  if (currentSection) {
    h2Sections.push(currentSection)
  }

  // Render each section to HTML
  const h2SectionsWithHtml = await Promise.all(
    h2Sections.map(async (sec) => {
      // Create a remark tree with just these nodes
      const sectionTree: any = { type: 'root', children: sec.nodes }

      // Transform remark AST -> rehype AST -> HTML
      const file = await unified()
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
        .use(rehypeStringify)
        .process(sectionTree)

      return { heading: sec.heading, html: String(file) }
    })
  )

  return {
    frontmatter: frontmatter as PostMeta,
    content,
    h2Sections: h2SectionsWithHtml,
  }
}

export async function getAllPosts() {
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
  return Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, '')
      const full = fs.readFileSync(path.join(postsDir, file), 'utf8')
      const { data: frontmatter, content } = matter(full)
      return { slug: `/blog/${slug}`, frontmatter: frontmatter as PostMeta, content }
    })
  )
}

export async function getAllProjectHubs() {
  const projectsDir = path.join(process.cwd(), 'content', 'projects')
  if (!fs.existsSync(projectsDir)) return []

  const folders = fs.readdirSync(projectsDir).filter((f) => {
    const stat = fs.statSync(path.join(projectsDir, f))
    return stat.isDirectory()
  })

  const projects = await Promise.all(
    folders.map(async (folder) => {
      const indexPath = path.join(projectsDir, folder, 'index.md')
      if (!fs.existsSync(indexPath)) return null

      const raw = fs.readFileSync(indexPath, 'utf8')
      const { data: frontmatter, content } = matter(raw)
      const html = await mdToHtml(content)

      return {
        slug: folder,
        meta: frontmatter as PostMeta,
        content,
        html,
      }
    })
  )

  return projects.filter((p) => p !== null)
}

import { getAllPosts, getGuideByPath, isPublic, type PostMeta } from './markdown'

export type TimelineItem =
  | { kind: 'post'; date: Date; title: string; slug: string; summary: string }
  | { kind: 'milestone'; date: Date; title: string; htmlSnippet: string }

function parseDateFromHeading(heading: string): Date {
  // Try to extract YYYY-MM-DD format from heading
  const m = heading.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? new Date(m[1]) : new Date(0)
}

export async function getUpdatesByProject(slug: string): Promise<TimelineItem[]> {
  // Get all blog posts that reference this project
  const posts = await getAllPosts()
  const postItems: TimelineItem[] = posts
    .filter((p) => {
      const projects = p.frontmatter.projects
      return Array.isArray(projects) && projects.includes(slug) && isPublic(p.frontmatter)
    })
    .map((p) => ({
      kind: 'post' as const,
      date: new Date(p.frontmatter.date),
      title: p.frontmatter.title,
      slug: p.slug,
      summary: p.frontmatter.description ?? '',
    }))

  // Get build log milestones (H2 sections from build-log.md)
  let milestoneItems: TimelineItem[] = []
  try {
    const guide = await getGuideByPath(`projects/${slug}/build-log.md`)
    // Only include if public
    if (isPublic(guide.frontmatter)) {
      const sections = guide.h2Sections ?? []
      milestoneItems = sections.map((sec) => ({
        kind: 'milestone' as const,
        date: parseDateFromHeading(sec.heading),
        title: sec.heading,
        htmlSnippet: sec.html,
      }))
    }
  } catch (_) {
    // No build log yet - that's okay
  }

  // Merge and sort by date descending
  return [...postItems, ...milestoneItems].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )
}

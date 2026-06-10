import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ProjectStatus = 'Active' | 'Paused' | 'Completed'
export type ProjectCategory = 'Infrastructure' | 'AI & Automation' | 'Security' | 'Community' | 'Personal' | 'Open Source'

export interface Project {
  slug: string
  title: string
  description: string
  status: ProjectStatus
  stage?: string
  category?: ProjectCategory
  tech?: string[]
  featured: boolean
  lastUpdated?: string
  milestoneCount?: number
  sensitivity: string
}

function parseDateFromHeading(heading: string): Date | null {
  const m = heading.match(/(\d{4}-\d{2}-\d{2})/)
  // Parse as local noon to avoid UTC-midnight timezone shift
  return m ? new Date(`${m[1]}T12:00:00`) : null
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getAllProjects(): Project[] {
  const projectsDir = path.join(process.cwd(), 'content/projects')
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

  const projects: Project[] = []

  for (const slug of entries) {
    const indexPath = path.join(projectsDir, slug, 'index.md')
    if (!fs.existsSync(indexPath)) continue

    const raw = fs.readFileSync(indexPath, 'utf-8')
    const { data } = matter(raw)

    if (data.sensitivity !== 'public') continue

    let lastUpdated: string | undefined
    let milestoneCount: number | undefined
    const buildLogPath = path.join(projectsDir, slug, 'build-log.md')
    if (fs.existsSync(buildLogPath)) {
      const logRaw = fs.readFileSync(buildLogPath, 'utf-8')
      const h2s = [...logRaw.matchAll(/^## (.+)$/gm)].map((m) => m[1])
      const dates = h2s.map(parseDateFromHeading).filter((d): d is Date => d !== null)
      if (dates.length > 0) {
        const latest = dates.reduce((a, b) => (a > b ? a : b))
        lastUpdated = formatDate(latest)
        milestoneCount = h2s.length
      }
    }

    const rawStatus = (data.status as string) ?? 'active'
    const status = (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)) as ProjectStatus

    projects.push({
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      status,
      stage: data.stage,
      category: data.category,
      tech: data.tech ?? [],
      featured: data.featured ?? false,
      lastUpdated,
      milestoneCount,
      sensitivity: data.sensitivity,
    })
  }

  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return a.title.localeCompare(b.title)
  })
}

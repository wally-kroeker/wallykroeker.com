import fs from 'fs'
import path from 'path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export interface DaemonSection {
  name: string
  content: string
  html: string
  items: string[]
}

export interface DaemonData {
  raw: string
  sections: DaemonSection[]
}

/**
 * Parse a section's content into list items if it contains bullet points
 */
function parseItems(content: string): string[] {
  const lines = content.split('\n')
  const items: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('-')) {
      items.push(trimmed.replace(/^-\s*/, ''))
    }
  }
  
  return items
}

/**
 * Convert markdown content to HTML
 */
async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}

/**
 * Parse the daemon.md file format
 * 
 * Format: Section headers are marked with [SECTION_NAME]
 * Content follows until the next section.
 */
export async function parseDaemonFile(content: string): Promise<DaemonSection[]> {
  const sections: DaemonSection[] = []
  
  // Split by section headers [SECTION_NAME]
  const sectionRegex = /\[([A-Z_]+)\]/g
  const parts = content.split(sectionRegex)
  
  // parts[0] is content before first section (usually header/comments)
  // parts[1] is first section name, parts[2] is first section content, etc.
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i]
    const sectionContent = parts[i + 1]?.trim() || ''
    
    if (name && sectionContent) {
      const html = await markdownToHtml(sectionContent)
      const items = parseItems(sectionContent)
      
      sections.push({
        name,
        content: sectionContent,
        html,
        items,
      })
    }
  }
  
  return sections
}

/**
 * Get the parsed Daemon data from the content file
 */
export async function getDaemonData(): Promise<DaemonData> {
  const filePath = path.join(process.cwd(), 'content', 'daemon.md')
  
  if (!fs.existsSync(filePath)) {
    // Return empty data if file doesn't exist yet
    return {
      raw: '',
      sections: [],
    }
  }
  
  const raw = fs.readFileSync(filePath, 'utf8')
  const sections = await parseDaemonFile(raw)
  
  return {
    raw,
    sections,
  }
}

/**
 * Get a specific section by name
 */
export async function getDaemonSection(sectionName: string): Promise<DaemonSection | undefined> {
  const data = await getDaemonData()
  return data.sections.find(s => s.name === sectionName)
}

/**
 * Get section display metadata (icons, titles, descriptions)
 */
export function getSectionMeta(sectionName: string): { icon: string; title: string; description: string } {
  const meta: Record<string, { icon: string; title: string; description: string }> = {
    ABOUT: {
      icon: '👤',
      title: 'About',
      description: 'Who I am',
    },
    CURRENT_LOCATION: {
      icon: '📍',
      title: 'Location',
      description: 'Where I am based',
    },
    MISSION: {
      icon: '🎯',
      title: 'Mission',
      description: 'What I aim to achieve',
    },
    TELOS: {
      icon: '🧭',
      title: 'Telos',
      description: 'My strategic framework',
    },
    FAVORITE_BOOKS: {
      icon: '📚',
      title: 'Favorite Books',
      description: 'Reading that shaped me',
    },
    FAVORITE_MOVIES: {
      icon: '🎬',
      title: 'Favorite Movies',
      description: 'Films I recommend',
    },
    FAVORITE_PODCASTS: {
      icon: '🎧',
      title: 'Favorite Podcasts',
      description: 'What I listen to',
    },
    DAILY_ROUTINE: {
      icon: '📅',
      title: 'Daily Routine',
      description: 'How I structure my days',
    },
    PREFERENCES: {
      icon: '⚙️',
      title: 'Preferences',
      description: 'Tools and styles I prefer',
    },
    PREDICTIONS: {
      icon: '🔮',
      title: 'Predictions',
      description: 'My views on the future',
    },
    AI_PARTNERSHIP: {
      icon: '🤖',
      title: 'AI Partnership',
      description: 'How I work with Bob',
    },
    PROJECTS: {
      icon: '🚀',
      title: 'Projects',
      description: 'What I am building',
    },
  }
  
  return meta[sectionName] || {
    icon: '📄',
    title: sectionName.replace(/_/g, ' '),
    description: '',
  }
}

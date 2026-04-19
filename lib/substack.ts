/**
 * Substack RSS feed parser for Cognitive Loop
 * Fetches cognitiveloop.substack.com/feed and returns typed post objects.
 * Used by /loop pages with ISR revalidation so new posts appear automatically.
 */

export type SubstackPost = {
  title: string
  slug: string
  url: string
  date: string        // ISO string
  description: string
  content: string     // raw HTML from content:encoded
  audioUrl?: string   // podcast MP3 from <enclosure>
  thumbnail?: string  // first img src from content
}

const FEED_URL = 'https://cognitiveloop.substack.com/feed'
const REVALIDATE = 3600 // 1 hour

function extractCdata(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  return match ? match[1].trim() : ''
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))
  return match ? match[1].trim() : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"[^>]*>`))
  return match ? match[1] : ''
}

function extractThumbnail(html: string): string | undefined {
  // Pull first substackcdn.com image from content
  const match = html.match(/src="(https:\/\/substackcdn\.com\/[^"]+)"/)
  if (!match) return undefined
  // Swap to a reasonable thumbnail size
  return match[1].replace(/w_\d+/, 'w_600')
}

function stripSubstackChrome(html: string): string {
  return html
    // Remove subscription widget blocks (subscribe CTAs, email capture forms)
    .replace(/<div[^>]*class="[^"]*subscription-widget[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '')
    // Remove any remaining subscribe buttons/forms
    .replace(/<div[^>]*class="[^"]*subscribe-widget[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    // Remove "Thanks for reading" + subscribe preamble paragraphs
    .replace(/<p[^>]*class="[^"]*cta-caption[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '')
    // Remove footer share/like buttons
    .replace(/<div[^>]*class="[^"]*post-footer[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
}

function slugFromUrl(url: string): string {
  const match = url.match(/\/p\/([^/?#]+)/)
  return match ? match[1] : url.split('/').filter(Boolean).pop() ?? ''
}

function parseItems(xml: string): SubstackPost[] {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

  return itemMatches.map((m) => {
    const item = m[1]

    const title = extractCdata(item, 'title') || extractTag(item, 'title')
    const url = extractTag(item, 'link')
    const pubDate = extractTag(item, 'pubDate')
    const description = extractCdata(item, 'description')
    const content = extractCdata(item, 'content:encoded')
    const audioUrl = extractAttr(item, 'enclosure', 'url') || undefined
    const thumbnail = extractThumbnail(content)
    const slug = slugFromUrl(url)
    const date = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()

    const cleanContent = stripSubstackChrome(content)

    return { title, slug, url, date, description, content: cleanContent, audioUrl, thumbnail }
  }).filter(p => p.slug && p.title)
}

let cache: { posts: SubstackPost[]; fetchedAt: number } | null = null

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  // In-memory cache to avoid hammering the feed on every SSR render during dev
  if (cache && Date.now() - cache.fetchedAt < REVALIDATE * 1000) {
    return cache.posts
  }

  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
    const xml = await res.text()
    const posts = parseItems(xml)
    cache = { posts, fetchedAt: Date.now() }
    return posts
  } catch (err) {
    console.error('Failed to fetch Substack feed:', err)
    return cache?.posts ?? []
  }
}

export async function getSubstackPost(slug: string): Promise<SubstackPost | null> {
  const posts = await getSubstackPosts()
  return posts.find(p => p.slug === slug) ?? null
}

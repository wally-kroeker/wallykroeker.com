#!/usr/bin/env bun
/**
 * consolidate-build-log.ts — merge per-session drafts into the canonical daily build log.
 *
 * Reads `content/build-logs/_drafts/{date}-*.md` files, sorts chronologically by the
 * `created` ISO timestamp, and writes a canonical `content/build-logs/{date}.md` with
 * union frontmatter (session_count, projects_touched, tags, authors).
 *
 * Behavior summary:
 *   - If `content/build-logs/{date}.md` already exists AND --merge is NOT passed →
 *     SKIP with warning. Default behaviour preserves existing canonical files.
 *   - If --merge is passed AND canonical exists → append draft sessions before any
 *     `## Day Summary` marker (or at end of body if none), union the frontmatter
 *     fields (session_count, projects_touched, tags, authors).
 *   - If canonical missing → create from drafts.
 *   - Drafts with `sensitivity != public` → script fails loud (privacy assertion).
 *   - On success → drafts are moved to `_drafts/_published/{date}/` (history preserved).
 *
 * Usage:
 *   bun run scripts/consolidate-build-log.ts                 # consolidate today
 *   bun run scripts/consolidate-build-log.ts --date 2026-04-26
 *   bun run scripts/consolidate-build-log.ts --dry-run       # show plan, don't write
 *   bun run scripts/consolidate-build-log.ts --merge         # merge into existing canonical
 *   bun run scripts/consolidate-build-log.ts --help
 *
 * Exit codes:
 *   0  success or no-op (skipped because canonical exists, or no drafts found)
 *   1  privacy violation, parse error, or unexpected I/O failure
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..')
const BUILD_LOGS_DIR = path.join(REPO_ROOT, 'content', 'build-logs')
const DRAFTS_DIR = path.join(BUILD_LOGS_DIR, '_drafts')
const PUBLISHED_ARCHIVE = path.join(DRAFTS_DIR, '_published')

interface DraftFrontmatter {
  date: string
  created: string
  session_id: string
  author: string
  project: string
  slug: string
  sensitivity: string
  projects_touched?: string[]
  tags?: string[]
}

interface Draft {
  filename: string
  fullPath: string
  frontmatter: DraftFrontmatter
  body: string
}

function todayISO(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function humanDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function parseArgs(argv: string[]): { date: string; dryRun: boolean; merge: boolean } {
  let date = todayISO()
  let dryRun = false
  let merge = false
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') {
      console.log(`consolidate-build-log.ts — merge build-log drafts into canonical daily file.

Usage:
  bun run scripts/consolidate-build-log.ts                  consolidate today's drafts
  bun run scripts/consolidate-build-log.ts --date YYYY-MM-DD
  bun run scripts/consolidate-build-log.ts --dry-run        show plan, write nothing
  bun run scripts/consolidate-build-log.ts --merge          append into existing canonical
  bun run scripts/consolidate-build-log.ts --help

Exit codes:
  0  success / no-op
  1  privacy violation or unexpected error`)
      process.exit(0)
    }
    if (a === '--dry-run') { dryRun = true; continue }
    if (a === '--merge') { merge = true; continue }
    if (a === '--date') { date = argv[++i]; continue }
    console.error(`unknown arg: ${a}`)
    process.exit(1)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`bad --date: ${date} (want YYYY-MM-DD)`)
    process.exit(1)
  }
  return { date, dryRun, merge }
}

function loadDrafts(date: string): Draft[] {
  if (!fs.existsSync(DRAFTS_DIR)) return []
  const files = fs.readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith('.md') && f.startsWith(`${date}-`))
    .sort()
  return files.map((filename) => {
    const fullPath = path.join(DRAFTS_DIR, filename)
    const raw = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(raw)
    return { filename, fullPath, frontmatter: data as DraftFrontmatter, body: content.trim() }
  })
}

function assertPublicOnly(drafts: Draft[]) {
  const offenders = drafts.filter((d) => d.frontmatter.sensitivity !== 'public')
  if (offenders.length > 0) {
    console.error('❌ privacy violation: drafts with non-public sensitivity:')
    for (const d of offenders) console.error(`   ${d.filename} → sensitivity: ${d.frontmatter.sensitivity}`)
    console.error('Resolve by either redacting + setting sensitivity: public, or removing the draft.')
    process.exit(1)
  }
}

function createdStr(d: Draft): string {
  // YAML parses ISO timestamps to Date; coerce back to ISO string for stable sort.
  const c = d.frontmatter.created as unknown
  return c instanceof Date ? c.toISOString() : String(c)
}

function buildCanonical(date: string, drafts: Draft[]): string {
  const sorted = [...drafts].sort((a, b) => createdStr(a).localeCompare(createdStr(b)))

  const tags = new Set<string>(['build-log', 'daily'])
  const projects = new Set<string>()
  const authors = new Set<string>()
  for (const d of sorted) {
    for (const t of d.frontmatter.tags ?? []) tags.add(t)
    for (const p of d.frontmatter.projects_touched ?? []) projects.add(p)
    if (d.frontmatter.author) authors.add(d.frontmatter.author)
  }

  const fm = [
    '---',
    `title: "Build Log - ${humanDate(date)}"`,
    `description: "Daily work journal from Bob's perspective"`,
    `date: ${date}`,
    `author: "Bob"`,
    `type: "build-log"`,
    `status: "published"`,
    `reviewed: true`,
    `sensitivity: "public"`,
    `session_count: ${sorted.length}`,
    `authors:`,
    ...Array.from(authors).map((a) => `  - ${a}`),
    `projects_touched:`,
    ...Array.from(projects).map((p) => `  - ${p}`),
    `tags:`,
    ...Array.from(tags).map((t) => `  - ${t}`),
    `category: "Build Log"`,
    `work_types:`,
    `  - personal`,
    '---',
    '',
    `# Build Log - ${humanDate(date)}`,
    '',
  ].join('\n')

  const sessions = sorted.map((d) => d.body).join('\n\n---\n\n')

  const footer = '\n\n---\n\n*This is Bob\'s daily work journal. Client work is redacted for privacy. Personal projects and PAI development fully detailed.*\n'

  return fm + '\n' + sessions + footer
}

function mergeIntoExisting(canonicalPath: string, drafts: Draft[], date: string): string {
  const raw = fs.readFileSync(canonicalPath, 'utf8')
  const existing = matter(raw)
  const sorted = [...drafts].sort((a, b) => createdStr(a).localeCompare(createdStr(b)))

  const tags = new Set<string>([...((existing.data.tags as string[]) ?? [])])

  // Project union, dedup case-insensitively, preserving first-seen casing (canonical wins).
  const projectMap = new Map<string, string>()
  for (const p of (existing.data.projects_touched as string[]) ?? []) {
    if (!projectMap.has(p.toLowerCase())) projectMap.set(p.toLowerCase(), p)
  }
  const seedAuthors = (existing.data.authors as string[]) ?? (existing.data.author ? [existing.data.author as string] : [])
  const authors = new Set<string>(seedAuthors)

  for (const d of sorted) {
    for (const t of d.frontmatter.tags ?? []) tags.add(t)
    for (const p of d.frontmatter.projects_touched ?? []) {
      if (!projectMap.has(p.toLowerCase())) projectMap.set(p.toLowerCase(), p)
    }
    if (d.frontmatter.author) authors.add(d.frontmatter.author)
  }

  const newSessionCount = ((existing.data.session_count as number) ?? 1) + sorted.length

  const fm = {
    ...existing.data,
    date, // re-coerce to YYYY-MM-DD string (gray-matter parses YAML date to JS Date)
    session_count: newSessionCount,
    tags: Array.from(tags),
    projects_touched: Array.from(projectMap.values()),
    authors: Array.from(authors),
  }

  const insertion = '\n\n---\n\n' + sorted.map((d) => d.body).join('\n\n---\n\n') + '\n'
  const dayMarker = '\n## Day Summary'

  const body = existing.content
  let newBody: string
  if (body.includes(dayMarker)) {
    newBody = body.replace(dayMarker, insertion + dayMarker)
  } else {
    newBody = body.trimEnd() + insertion
  }

  return matter.stringify(newBody, fm)
}

function moveDraftsToPublished(date: string, drafts: Draft[]) {
  const dest = path.join(PUBLISHED_ARCHIVE, date)
  fs.mkdirSync(dest, { recursive: true })
  for (const d of drafts) {
    fs.renameSync(d.fullPath, path.join(dest, d.filename))
  }
}

function main() {
  const { date, dryRun, merge } = parseArgs(process.argv.slice(2))
  const canonical = path.join(BUILD_LOGS_DIR, `${date}.md`)
  const drafts = loadDrafts(date)
  const flagSuffix = [dryRun ? 'dry-run' : '', merge ? 'merge' : ''].filter(Boolean).join(', ')
  const flagBadge = flagSuffix ? ` (${flagSuffix})` : ''

  console.log(`📓 consolidate-build-log — ${date}${flagBadge}`)

  if (drafts.length === 0) {
    console.log(`   no drafts for ${date}, nothing to do`)
    return
  }

  const canonicalExists = fs.existsSync(canonical)

  if (canonicalExists && !merge) {
    console.log(`   ⚠️  canonical ${path.relative(REPO_ROOT, canonical)} already exists`)
    console.log(`   ${drafts.length} draft(s) for ${date} left in _drafts/ for manual handling:`)
    for (const d of drafts) console.log(`      ${d.filename}`)
    console.log(`   pass --merge to append draft sessions into the existing canonical`)
    return
  }

  assertPublicOnly(drafts)

  const out = canonicalExists
    ? mergeIntoExisting(canonical, drafts, date)
    : buildCanonical(date, drafts)

  if (dryRun) {
    const verb = canonicalExists ? 'merge into' : 'write'
    console.log(`   would ${verb} ${path.relative(REPO_ROOT, canonical)} (${out.length} bytes)`)
    console.log(`   would consume ${drafts.length} draft(s):`)
    for (const d of drafts) console.log(`      ${d.filename} (${d.frontmatter.author} / ${d.frontmatter.created})`)
    console.log(`   would move drafts to _drafts/_published/${date}/`)
    return
  }

  fs.writeFileSync(canonical, out, 'utf8')
  moveDraftsToPublished(date, drafts)

  const verb = canonicalExists ? 'merged into' : 'wrote'
  console.log(`   ✅ ${verb} ${path.relative(REPO_ROOT, canonical)} (${drafts.length} new session${drafts.length > 1 ? 's' : ''})`)
  console.log(`   ✅ archived ${drafts.length} draft(s) to _drafts/_published/${date}/`)
}

main()

#!/usr/bin/env bun
/**
 * consolidate-build-log.ts — merge per-session drafts into the canonical daily build log.
 *
 * Reads `content/build-logs/_drafts/{date}-*.md` files, sorts chronologically by the
 * `created` ISO timestamp, and writes a canonical `content/build-logs/{date}.md` with
 * union frontmatter (session_count, projects_touched, tags, authors).
 *
 * Behavior summary:
 *   - If `content/build-logs/{date}.md` already exists → SKIP with warning. We do not
 *     mutate pre-existing canonical files. Drafts remain in `_drafts/` for manual
 *     handling. (Wally directive 2026-04-25: "don't change existing build logs, just
 *     update the workflow going forward.")
 *   - If canonical missing → create from drafts.
 *   - Drafts with `sensitivity != public` → script fails loud (privacy assertion).
 *   - On success → drafts are moved to `_drafts/_published/{date}/` (history preserved).
 *
 * Usage:
 *   bun run scripts/consolidate-build-log.ts                 # consolidate today
 *   bun run scripts/consolidate-build-log.ts --date 2026-04-26
 *   bun run scripts/consolidate-build-log.ts --dry-run       # show plan, don't write
 *   bun run scripts/consolidate-build-log.ts --help
 *
 * Exit codes:
 *   0  success or no-op (skipped because canonical exists, or no drafts found)
 *   1  privacy violation, parse error, or unexpected I/O failure
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import matter from 'gray-matter'

const REPO_ROOT = path.resolve(import.meta.dir, '..')
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

function parseArgs(argv: string[]): { date: string; dryRun: boolean } {
  let date = todayISO()
  let dryRun = false
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') {
      console.log(`consolidate-build-log.ts — merge build-log drafts into canonical daily file.

Usage:
  bun run scripts/consolidate-build-log.ts                  consolidate today's drafts
  bun run scripts/consolidate-build-log.ts --date YYYY-MM-DD
  bun run scripts/consolidate-build-log.ts --dry-run        show plan, write nothing
  bun run scripts/consolidate-build-log.ts --help

Exit codes:
  0  success / no-op
  1  privacy violation or unexpected error`)
      process.exit(0)
    }
    if (a === '--dry-run') { dryRun = true; continue }
    if (a === '--date') { date = argv[++i]; continue }
    console.error(`unknown arg: ${a}`)
    process.exit(1)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`bad --date: ${date} (want YYYY-MM-DD)`)
    process.exit(1)
  }
  return { date, dryRun }
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

function buildCanonical(date: string, drafts: Draft[]): string {
  const sorted = [...drafts].sort((a, b) => a.frontmatter.created.localeCompare(b.frontmatter.created))

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

function moveDraftsToPublished(date: string, drafts: Draft[]) {
  const dest = path.join(PUBLISHED_ARCHIVE, date)
  fs.mkdirSync(dest, { recursive: true })
  for (const d of drafts) {
    fs.renameSync(d.fullPath, path.join(dest, d.filename))
  }
}

function main() {
  const { date, dryRun } = parseArgs(process.argv.slice(2))
  const canonical = path.join(BUILD_LOGS_DIR, `${date}.md`)
  const drafts = loadDrafts(date)

  console.log(`📓 consolidate-build-log — ${date}${dryRun ? ' (dry-run)' : ''}`)

  if (drafts.length === 0) {
    console.log(`   no drafts for ${date}, nothing to do`)
    return
  }

  if (fs.existsSync(canonical)) {
    console.log(`   ⚠️  canonical ${path.relative(REPO_ROOT, canonical)} already exists`)
    console.log(`   ${drafts.length} draft(s) for ${date} left in _drafts/ for manual handling:`)
    for (const d of drafts) console.log(`      ${d.filename}`)
    console.log(`   (Per Wally: do not change existing build logs. Workflow only consolidates new days.)`)
    return
  }

  assertPublicOnly(drafts)

  const out = buildCanonical(date, drafts)

  if (dryRun) {
    console.log(`   would write ${path.relative(REPO_ROOT, canonical)} (${out.length} bytes)`)
    console.log(`   would merge ${drafts.length} draft(s):`)
    for (const d of drafts) console.log(`      ${d.filename} (${d.frontmatter.author} / ${d.frontmatter.created})`)
    console.log(`   would move drafts to _drafts/_published/${date}/`)
    return
  }

  fs.writeFileSync(canonical, out, 'utf8')
  moveDraftsToPublished(date, drafts)

  console.log(`   ✅ wrote ${path.relative(REPO_ROOT, canonical)} (${drafts.length} session${drafts.length > 1 ? 's' : ''})`)
  console.log(`   ✅ archived ${drafts.length} draft(s) to _drafts/_published/${date}/`)
}

main()

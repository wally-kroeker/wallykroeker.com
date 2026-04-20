#!/usr/bin/env node
/**
 * loop-audio-sync.mjs — pull Cognitive Loop posts from Substack and generate Kokoro TTS audio.
 *
 * Fetches cognitiveloop.substack.com/feed, for each post checks whether
 * public/audio/loop/{slug}.mp3 exists; if missing (or --force), strips HTML to
 * plain text and POSTs to Kokoro at walub.kroeker.fun:8880.
 *
 * This is the /loop equivalent of scripts/generate-audio.sh (which handles /blog).
 * RSS parsing logic mirrors lib/substack.ts intentionally — don't drift.
 *
 * Usage:
 *   node scripts/loop-audio-sync.mjs                    # incremental (default)
 *   node scripts/loop-audio-sync.mjs --force            # regenerate every mp3
 *   node scripts/loop-audio-sync.mjs --output-dir PATH  # override output
 *   node scripts/loop-audio-sync.mjs --help
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const FEED_URL = 'https://cognitiveloop.substack.com/feed'
const TTS_HOST = 'walub.kroeker.fun:8880'
const TTS_VOICE = 'am_michael'
const TTS_MODEL = 'kokoro'
const MAX_CHARS = 40000

const __filename = fileURLToPath(import.meta.url)
const REPO_ROOT = path.resolve(path.dirname(__filename), '..')

function parseArgs(argv) {
  const args = { force: false, outputDir: path.join(REPO_ROOT, 'public/audio/loop') }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--force') args.force = true
    else if (a === '--output-dir') {
      const val = argv[i + 1]
      if (!val || val.startsWith('--')) {
        console.error('--output-dir requires a path argument')
        process.exit(1)
      }
      args.outputDir = val
      i++
    }
    else if (a === '--help' || a === '-h') args.help = true
    else {
      console.error(`Unknown option: ${a}`)
      process.exit(1)
    }
  }
  return args
}

function printHelp() {
  const source = fs.readFileSync(__filename, 'utf8')
  const match = source.match(/\/\*\*([\s\S]*?)\*\//)
  if (!match) return
  const body = match[1].split('\n').map(l => l.replace(/^\s*\*\s?/, '')).join('\n').trim()
  console.log(body)
}

function extractCdata(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`)
  const m = xml.match(re)
  return m ? m[1].trim() : ''
}

function slugFromUrl(url) {
  const m = url.match(/\/p\/([^/?#]+)/)
  if (m) return m[1]
  const last = url.split('/').filter(Boolean).pop()
  return last ?? ''
}

function stripSubstackChrome(html) {
  return html
    .replace(/<div[^>]*class="[^"]*subscription-widget[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*subscribe-widget[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<p[^>]*class="[^"]*cta-caption[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '')
    .replace(/<div[^>]*class="[^"]*post-footer[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
}

function htmlToPlainText(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|h[1-6]|blockquote|figcaption|figure|div|section|article)[^>]*>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<\/?(ul|ol)[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_CHARS)
}

function parseItems(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  return items.map(([, item]) => {
    const title = extractCdata(item, 'title') || extractTag(item, 'title')
    const url = extractTag(item, 'link')
    const content = extractCdata(item, 'content:encoded')
    const slug = slugFromUrl(url)
    return { title, slug, url, content: stripSubstackChrome(content) }
  }).filter(p => p.slug && p.title && p.content)
}

async function fetchFeed() {
  const res = await fetch(FEED_URL)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  return res.text()
}

async function generateAudio(slug, text, outputDir) {
  const outPath = path.join(outputDir, `${slug}.mp3`)
  const body = {
    model: TTS_MODEL,
    input: text,
    voice: TTS_VOICE,
    response_format: 'mp3',
  }
  const res = await fetch(`http://${TTS_HOST}/v1/audio/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(300000),
  })
  if (!res.ok) {
    throw new Error(`Kokoro HTTP ${res.status}`)
  }
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(outPath))
  return fs.statSync(outPath).size
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  console.log('🎙️  Loop audio sync (Substack → Kokoro)')
  console.log(`   Feed:   ${FEED_URL}`)
  console.log(`   Output: ${args.outputDir}`)
  console.log(`   Mode:   ${args.force ? 'force (regenerate all)' : 'incremental'}`)
  console.log('')

  fs.mkdirSync(args.outputDir, { recursive: true })

  const xml = await fetchFeed()
  const posts = parseItems(xml)
  console.log(`Found ${posts.length} posts in feed.`)
  console.log('')

  let synced = 0
  let generated = 0
  let failed = 0

  for (const post of posts) {
    const outPath = path.join(args.outputDir, `${post.slug}.mp3`)
    const exists = fs.existsSync(outPath)

    if (exists && !args.force) {
      console.log(`  ⏭️  ${post.slug} (synced)`)
      synced++
      continue
    }

    const text = htmlToPlainText(post.content)
    if (!text) {
      console.log(`  ⚠️  ${post.slug} (empty content after strip, skipped)`)
      failed++
      continue
    }

    try {
      process.stdout.write(`  🎙️  ${post.slug} (${text.length} chars)...`)
      const bytes = await generateAudio(post.slug, text, args.outputDir)
      console.log(` ✅ ${(bytes / 1024 / 1024).toFixed(1)}M`)
      generated++
    } catch (err) {
      console.log(` ❌ ${err.message}`)
      failed++
    }
  }

  console.log('')
  console.log(`Summary: ${synced} synced, ${generated} generated, ${failed} failed`)

  if (failed > 0) process.exit(1)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})

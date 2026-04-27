import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import type { Metadata } from 'next'
import { mdToHtml } from '@/lib/markdown'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'The 13 Acres — A Daydream in Ten Pictures',
  description: 'A permaculture design journal for Wally and Tiphanie — ten hand-drawn sketches of 13 acres near Elie, Manitoba.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const UPDATED = '2026-04-23 (coulee edition)'

async function getDaydream() {
  const fullPath = path.join(process.cwd(), 'content', 'food-forest', 'daydream.md')
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { content } = matter(raw)
  return await mdToHtml(content)
}

export default async function FoodForestDaydreamPage() {
  const html = await getDaydream()

  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
        </p>

        <div
          className="ff-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="ff-footer">
          <p>
            A daydream by <strong>Wally</strong> and <strong>Tiphanie Kroeker</strong>.
            Designed with Linus, an AI permaculture persona, from a walk on April 19, 2026.
          </p>
          <p className="ff-updated">
            Daydream as of {UPDATED} — updated when the land has more to say.
          </p>
        </footer>
      </article>
    </div>
  )
}

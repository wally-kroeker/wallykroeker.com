import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Food Forest — A 13-Acre Permaculture Project',
  description: 'Wally and Tiphanie Kroeker\'s working journal of a 13-acre permaculture food-forest project near Elie, Manitoba.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const UPDATED = '2026-04-26'

export default function FoodForestLandingPage() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <header>
          <h1>Food Forest</h1>
          <p className="ff-lede">
            <em>13 acres near Elie, Manitoba. Zone 3a prairie. A 10-year permaculture project, co-designed.</em>
          </p>
        </header>

        <figure className="ff-hero">
          <img
            src="/images/food-forest/01-aerial-daydream.webp"
            width={1792}
            height={2400}
            decoding="async"
            alt="Hand-drawn aerial view of the 13 acres in year 10 — bluff woodland, prairie, two domes, keyhole bed, shelterbelt, wet meadow."
          />
          <figcaption>The 13 acres from above, year 10 — the daydream version.</figcaption>
        </figure>

        <section className="ff-body">
          <h2>What this is</h2>
          <p>
            <strong>Wally</strong> and <strong>Tiphanie Kroeker</strong> own 13 acres of bluff,
            prairie, and wetland-edge near Elie, Manitoba — Zone 3a, real winters, real wind.
            This is a working journal of a 10-year permaculture food-forest project on that land,
            co-designed by the two of them with help from Linus, an AI permaculture-designer
            persona who synthesizes what the land says when they walk it. Tiphanie's instinct is
            <em> wild over organized;</em> the design defers to that.
          </p>
          <p>
            The first thing this place grows for us is the goats' winter hay. The front
            field along Janzen Road goes into alfalfa and buckwheat this spring — winter
            feed for the three goats, on land we already own. The first ring of the
            loop closing.
          </p>

          <h2>What you'll find here</h2>
          <p>
            Two threads, both growing.
          </p>
          <ul>
            <li>
              <strong><Link href="/food-forest/daydream">The Daydream</Link></strong> — ten
              hand-drawn sketches of the 13 acres in year 10. The first long picture of where
              this might go. Not a plan; a place to imagine from.
            </li>
            <li>
              <strong>Walks</strong> — a series of dated walk reports, each tied to a real GPS
              track of a specific day on the land, with voice notes, photos, and a synthesis
              from Linus.
              <ul>
                <li>
                  <Link href="/food-forest/walks/2026-04-26">
                    April 26, 2026 — the dogwood is already on our land
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <h2>Who's doing the writing</h2>
          <p>
            The land does most of it. Wally walks, photographs, talks into his phone. Tiphanie
            walks alongside and pushes back where the design wants to over-organize. Linus —
            an AI permaculture persona — does the synthesis: reads the GPS, the photos, the
            transcripts, and writes back what the property seems to be saying. Howard publishes.
          </p>

          <h2>An honest disclaimer</h2>
          <p>
            This is not a finished plan. It is a working field-journal. Things will change.
            Some sketches will turn out to be wrong about what the land wants and we'll
            redraw them. The point is to start paying attention out loud.
          </p>
        </section>

        <footer className="ff-footer">
          <p>
            Daydream and walks by <strong>Wally</strong> and <strong>Tiphanie Kroeker</strong>.
            Synthesis by <strong>Linus</strong>, an AI permaculture persona.
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">Last updated {UPDATED}.</p>
        </footer>
      </article>
    </div>
  )
}

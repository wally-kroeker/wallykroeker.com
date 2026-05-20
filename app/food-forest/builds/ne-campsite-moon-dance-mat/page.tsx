import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'NE Campsite — Moon-Dance Mat — Food Forest',
  description: 'A clover-thyme-strawberry cover-crop mix for the NE campsite clearing. Soft, fragrant, nitrogen-fixing, white-flowered by moonlight. Zone 3a hardy. ~$50.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-05-20'

export default function MoonDanceMatPage() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
          {' '}·{' '}
          <Link href="/food-forest/build-plan">Build Plan</Link>
        </p>

        <header>
          <h1>NE Campsite — Moon-Dance Mat</h1>
          <p className="ff-lede">
            <em>A cover crop that grows into a mat we can dance under the moon on.</em>
          </p>
          <p className="ff-stats">
            NE campsite (≈ 49.8442°N, -97.7746°W) <span aria-hidden="true">·</span> Zone 3a hardy <span aria-hidden="true">·</span> ~1 lb seed / 3,000 sq ft <span aria-hidden="true">·</span> ~$50 total
          </p>
        </header>

        <section className="ff-body">
          <h2>What this is</h2>
          <p>
            A seed mix that establishes as a soft, knit, foot-traffic-tolerant,
            fragrance-releasing, white-flowered-by-moonlight ground cover for the NE campsite
            clearing. Doubles as a real cover crop — nitrogen fixation, weed suppression, soil
            building — so the clearing improves underneath while becoming more useful on top.
          </p>
          <p>
            The brief, verbatim from Wally on the 2026-05-10 walk:{' '}
            <em>&ldquo;A cover crop that will grow into a nice mat we can dance under the
            moon on.&rdquo;</em>
          </p>

          <h2>The mix (1 lb of seed covers ~3,000 sq ft)</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Species</th>
                  <th>%</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>White Dutch Clover (<em>Trifolium repens</em>)</td>
                  <td>75%</td>
                  <td>The mat. Soft, nitrogen-fixing, white blossoms visible in moonlight. Zone 2 hardy.</td>
                </tr>
                <tr>
                  <td>Creeping Thyme (<em>Thymus serpyllum</em>, hardy strain — e.g. &apos;Magic Carpet&apos;)</td>
                  <td>15%</td>
                  <td>The scent layer. Crushed underfoot when dancing → releases fragrance. Pink-purple flowers.</td>
                </tr>
                <tr>
                  <td>Wild Strawberry (<em>Fragaria virginiana</em>)</td>
                  <td>10%</td>
                  <td>Native runner that fills gaps. Edible. Establish as plugs from existing on-property colonies if available.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Optional accent:</strong> Common Yarrow (<em>Achillea millefolium</em>,
            native) at 5% if you want feathery texture above the mat. Skip if you want a
            clean dance surface.
          </p>

          <h2>Site prep + timing</h2>
          <ol>
            <li><strong>Window:</strong> late May–early June OR early September.</li>
            <li><strong>Clear and scratch.</strong> Pull any heavy dead-grass mat, rake the top 1-2&quot; of soil. No tilling needed.</li>
            <li><strong>Broadcast</strong> the seed by hand or small spreader. ~1 lb total / 3,000 sq ft.</li>
            <li><strong>Tamp or roll lightly.</strong> Walking on it works. Don&apos;t bury — these are small seeds.</li>
            <li><strong>Water lightly daily for 14 days.</strong> Top 1/2&quot; moist; don&apos;t soak.</li>
            <li><strong>First mow at 6 weeks</strong>, set to 3&quot;. Encourages clover density.</li>
            <li><strong>First moonlit dance: ~10 weeks</strong> post-seed. Fully established mat by Y2.</li>
          </ol>

          <h2>Cost</h2>
          <ul>
            <li>Seed: ~$50 total ($15-25 clover / lb + ~$35 small-pack thyme seed)</li>
            <li>Wild strawberry: free if dug from existing on-property colonies; ~$3-5/plug if bought</li>
            <li>Yarrow (optional): ~$5/oz seed</li>
          </ul>

          <h2>Maintenance after Y1</h2>
          <ul>
            <li>Mow once mid-summer to ~3&quot; if shaggy; else leave it.</li>
            <li>No fertilizer (clover handles N).</li>
            <li>No watering after Y1 except drought.</li>
            <li>Mat self-thickens each year via clover stolons + thyme spread.</li>
          </ul>

          <h2>Why this mix instead of alternatives</h2>
          <ul>
            <li><strong>Pure grass (e.g. sheep fescue):</strong> soft, but no nitrogen fix, no flowers, no scent.</li>
            <li><strong>Roman chamomile lawn:</strong> classic fragrance mat but zone 4 borderline — won&apos;t survive a hard Manitoba winter reliably.</li>
            <li><strong>Pearlwort / baby tears:</strong> too tender for Zone 3a.</li>
            <li><strong>Monoculture clover:</strong> good but boring; loses the scent + native-strawberry layers.</li>
          </ul>
          <p>
            The three-species mix gives you a knit mat, real cover-crop function, and the
            experience layer — scent on crush, white flowers under moonlight, free strawberries
            by day.
          </p>
        </section>

        <footer className="ff-footer">
          <p>
            Design by <strong>Linus</strong>, an AI permaculture persona.
            Site walked by <strong>Wally Kroeker</strong> on May 10, 2026.
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">
            Design v1 · Published {PUBLISHED}.
          </p>
        </footer>
      </article>
    </div>
  )
}

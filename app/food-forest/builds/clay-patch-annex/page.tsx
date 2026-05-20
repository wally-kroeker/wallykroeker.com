import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Clay-Patch Annex — Food Forest',
  description: 'A no-fence root and bulb planting on the existing tilled clay patch at Cluster A: daikon, Jerusalem artichokes, hardneck garlic. ~$25-45 budget.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-05-20'

export default function ClayPatchAnnexPage() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
          {' '}·{' '}
          <Link href="/food-forest/build-plan">Build Plan</Link>
        </p>

        <header>
          <h1>Clay-Patch Annex</h1>
          <p className="ff-lede">
            <em>A no-fence root and bulb planting on the existing tilled patch at Cluster A.</em>
          </p>
          <p className="ff-stats">
            15 ft × 20 ft <span aria-hidden="true">·</span> ~300 sq ft <span aria-hidden="true">·</span> Zone 3a heavy clay <span aria-hidden="true">·</span> ~$25-45 total budget
          </p>
        </header>

        <section className="ff-body">
          <h2>TL;DR</h2>
          <p>
            The 15×20 ft tilled-with-goat-straw patch at Cluster A — adjacent to the proposed
            4×8 raised bed — gets <strong>daikon, Jerusalem artichokes, and fall hardneck
            garlic</strong>. None of these need fencing, so the 160 ft of electric fence wire
            stays on the high-value raised bed. The daikon breaks up the heavy clay over the
            season; the Jerusalem artichokes form a deer-proof N-or-E edge screen; the garlic
            goes in this fall in a single 10 ft row.
          </p>

          <h2>The plant list</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Footprint</th>
                  <th>Seed/tuber</th>
                  <th>Cost</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Daikon / tillage radish</td>
                  <td>~200 sq ft (main bed)</td>
                  <td>~1 oz seed</td>
                  <td>$5-10</td>
                  <td>Direct-seed early-mid May</td>
                </tr>
                <tr>
                  <td>Jerusalem artichokes (N or E edge, 18&quot; spacing)</td>
                  <td>~20 ft × 1.5 ft = 30 sq ft</td>
                  <td>~14 tubers (1 lb)</td>
                  <td>$15-25</td>
                  <td>May 15-30, 6&quot; deep</td>
                </tr>
                <tr>
                  <td>Hardneck garlic (one 10 ft row)</td>
                  <td>~15 sq ft</td>
                  <td>~20 cloves</td>
                  <td>$5-10</td>
                  <td>Late Sept / early Oct ONLY</td>
                </tr>
                <tr>
                  <td>Walking path + slack</td>
                  <td>~55 sq ft</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Total budget: ~$25-45.</strong>
          </p>

          <h2>Sunchoke sourcing (Manitoba)</h2>
          <ul>
            <li><strong>T&amp;T Seeds, Winnipeg / Headingley</strong> — easiest. Typically stocks Jerusalem artichoke tubers. Order online or drop in.</li>
            <li><strong>Grocery store organic section</strong> (Sobey&apos;s, Co-op, Vita Health) — sunchokes show up in spring, typically NOT sprout-inhibited. Buy 1-2 lb of the firmest tubers with visible eyes. Cheapest option.</li>
            <li><strong>A neighbour who grows them</strong> — sunchokes spread aggressively; any farmer who&apos;s had them is usually happy to give a bucket away for free. Worth asking around.</li>
          </ul>
          <p>Window for planting tubers is mid-May to early June — 2-4 weeks of working time.</p>

          <h2>Layout</h2>
          <pre className="ff-ascii">{`                    [4×8 RAISED BED]
                    (electric fenced)
                          |
                          | ~3-4 ft path
                          |
   N edge  ──┬─ Jerusalem artichokes (screen + windbreak) ─┐
             │                                              │
             │         daikon radish bed                    │
             │         (early summer harvest,               │
             │          rest left to decompose)             │
             │                                              │
             │         garlic row (fall-planted)            │
   S edge   ─┴──────────────────────────────────────────────┘`}</pre>

          <h2>Site prep</h2>
          <p>
            The patch is already tilled and amended with goat-bedding straw from 2025. No
            additional prep for direct-seeding the daikon. For the Jerusalem artichokes, dig
            6&quot; holes 18&quot; apart and drop tubers (whole or split with at least one eye
            each); cover and water. For garlic in fall, light raking + a 2&quot; straw mulch
            after planting.
          </p>

          <h2>Maintenance</h2>
          <ul>
            <li><strong>Daikon:</strong> harvest tender roots in late June / July for eating; leave the rest to overwinter and decompose. Don&apos;t pull the overwintered ones — they&apos;re doing the soil work.</li>
            <li><strong>Jerusalem artichokes:</strong> zero maintenance once established. Harvest tubers October-November or anytime the ground isn&apos;t frozen. They WILL spread — contain by harvesting aggressively each fall.</li>
            <li><strong>Garlic:</strong> pull scapes in June (eat them), harvest bulbs early-mid July when lower leaves brown, cure 2 weeks dry, store cool / dark.</li>
          </ul>

          <h2>Open</h2>
          <p>
            Before any planting: dig 4-6&quot; down wherever the old rhubarb crowns were.
            Rhubarb can survive 5-6 years dormant; if found, divide and replant.
          </p>

          <h2>Y2 option</h2>
          <p>
            With 160 ft of fence available, the whole Cluster A (bed + this patch + path) can
            be enclosed in one ~30×40 ft perimeter (~140 ft of wire) in Y2 if Y1 succeeds. Y1
            stays small intentionally.
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

import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Walk — April 26, 2026 — the dogwood is already on our land',
  description: 'A 0.73-mile GPS-tracked walk through the 13 acres, with photos, voice notes, and a headline find: red-osier dogwood is already growing here.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-04-26'
const IMG = '/images/food-forest/walks/2026-04-26'

export default function FoodForestWalk20260426Page() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
        </p>

        <header>
          <h1>Walk — April 26, 2026</h1>
          <p className="ff-lede"><em>The dogwood is already on our land.</em></p>
          <p className="ff-stats">
            0.73 mi <span aria-hidden="true">·</span> 30 min <span aria-hidden="true">·</span> 17:33–18:03 CDT <span aria-hidden="true">·</span> 5 voice notes <span aria-hidden="true">·</span> 8 photos <span aria-hidden="true">·</span> GPX track
          </p>
        </header>

        <figure className="ff-hero">
          <img
            src={`${IMG}/walk-2026-04-26-04-red-osier-dogwood.webp`}
            width={1205}
            height={1600}
            decoding="async"
            alt="Red-osier dogwood with bright red winter stems against dry-grass and leaf-litter ground, on the eastern edge of the bluff."
          />
          <figcaption>
            <strong>The find.</strong> Red-osier dogwood (<em>Cornus sericea</em>) already
            growing on the eastern edge of the property. The daydream wanted to plant this
            around the septic field. Turns out the land has been growing it on its own.
          </figcaption>
        </figure>

        <section className="ff-body">
          <h2>Headline finds</h2>
          <ul>
            <li>
              <strong>Red-osier dogwood is already on site.</strong> Year-1 plan was to buy
              cuttings for the ejector-field restoration. Now we just take cuttings from
              the eastern edge — locally adapted, free, and right now is the season.
            </li>
            <li>
              <strong>Wild turkeys are back.</strong> Wally heard them on the wetland edge.
              First explicit confirmation this spring, alongside the chorus frogs and
              the migrating birds.
            </li>
            <li>
              <strong>The wetland edge is a working path.</strong> The upland strip just
              above the coulee is the natural circulation route — and probably the right
              line for any future hedgerow planting.
            </li>
          </ul>

          <h2>The walk</h2>

          <h3>Moment 1 — Starting at the SW corner near the house</h3>
          <p>
            Wally starts the GPX track right at the corner of the house and walks north
            into the bluff. A photo at 17:35 looks back over his shoulder, north-northwest,
            already inside the trees.
          </p>
          <figure>
            <img src={`${IMG}/walk-2026-04-26-01-near-house.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="Path heading into the bluff just north of the house, late afternoon light, bare trees." />
            <figcaption>Near the house, just after the walk began.</figcaption>
          </figure>

          <h3>Moment 2 — The east edge: a rotation set, and the dogwood</h3>
          <p>
            The easternmost point of the loop is roughly where the daydream's bluff-edge
            bench (cluster-009) sits. Wally takes a deliberate rotation set of five photos
            in eight seconds, sweeping a south-to-southwest arc — bearings 152°, 157°,
            154°, 178°, 181°. Anyone who wants to stand here later and re-photograph the
            same spot in midsummer or fall has the bearings to match.
          </p>
          <figure className="ff-grid">
            <img src={`${IMG}/walk-2026-04-26-02-east-edge-152.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="East-edge view, bearing 152° SSE — bare canopy, leaf litter, mid-spring." />
            <img src={`${IMG}/walk-2026-04-26-03-east-edge-157.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="East-edge view, bearing 157° SSE — bare canopy, dry grass." />
            <img src={`${IMG}/walk-2026-04-26-05-east-edge-178.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="East-edge view, bearing 178° — looking due south through the bluff edge." />
            <img src={`${IMG}/walk-2026-04-26-06-east-edge-181.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="East-edge view, bearing 181° — looking just past due south." />
          </figure>
          <p>
            One of the photos in that set caught the dogwood. The bright red stems are
            unmistakable; that's the photo at the top of this page. The first daydream
            sketch (the ejector-field restoration) called for red-osier dogwood as a
            <em> future</em> aesthetic planting. It turns out the species is already
            here, native, established. Year-1 work just got cheaper and more locally
            adapted.
          </p>

          <h3>Moment 3 — Walking the wetland edge</h3>
          <p>
            From the east edge, Wally turns and walks back along the wetland — what he
            called, on this walk, his <em>moat</em>: the wet boundary on the south and
            east that defines what is inside the property and what is outside. It's a
            good mental model. Zone 5 thinking — wild buffer around the productive
            interior — fits the feature exactly.
          </p>
          <p>
            On the way back he confirms a few things the land has been telling us.
            The chorus frogs are loud. The wild turkeys are back — first explicit
            mention this year. There is a real walking path along the upland edge of
            the wetland, separate from the wet path lower down, and it connects toward
            the campsite to the east. Worth marking on the next aerial.
          </p>

          <h3>Moment 4 — The two grain bins</h3>
          <p>
            Near the end of the walk, two photos of the dilapidated wooden grain bins
            on the wetland-edge return path — the same two outbuildings already marked
            on the annotated property map as small red rectangles east of the cement pad.
            Now we have GPS positions for them for the first time, instead of eyeball
            placements on the aerial.
          </p>
          <figure className="ff-grid">
            <img src={`${IMG}/walk-2026-04-26-07-grain-bin-1.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="First dilapidated wooden grain bin — red-painted siding, peaked roof, open doorway, weathered." />
            <img src={`${IMG}/walk-2026-04-26-08-grain-bin-2.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="Second dilapidated wooden grain bin on the same return path — similar weathered red wood, peaked roof." />
          </figure>

          <h2>The walk on a map</h2>
          <figure>
            <a
              href="/food-forest/walks/2026-04-26/walk-track.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`${IMG}/walk-2026-04-26-track-overview.webp`}
                width={1600}
                height={1781}
                loading="lazy"
                decoding="async"
                alt="Geo-Tracker app screenshot showing the 0.73-mile loop walk through the bluff, with distance, speed, and elevation readout."
              />
            </a>
            <figcaption>
              <a
                href="/food-forest/walks/2026-04-26/walk-track.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the interactive map →
              </a>
              {' '}
              The cyan polyline is the GPX track. Blue markers are photos; orange circles
              are the voice-note positions (click for the spoken text). The screenshot
              above is from Wally's GPS app on the day of the walk.
            </figcaption>
          </figure>

          <h2>Open questions</h2>
          <ul>
            <li>
              <strong>"Mode" or "moat" — which?</strong> The transcript said one;
              context suggests the other. Wally to confirm so we use the right word
              in future docs.
            </li>
            <li>
              <strong>"Drone path" or "drawn path"?</strong> Either makes sense given
              the upland-edge route. Worth knowing if there's drone sensing in play here too.
            </li>
          </ul>

          <h2>What's in the data drop</h2>
          <p>
            The full walk story — every transcript segment, photo, and voice-note moment,
            tagged with GPS positions — is kept on the food-forest project side. If you
            want the raw materials for your own GIS or planning use, ask Wally and we'll
            send the GPX, KML, and GeoJSON.
          </p>
        </section>

        <footer className="ff-footer">
          <p>
            Walked and photographed by <strong>Wally Kroeker</strong>.
            Synthesis by <strong>Linus</strong>, an AI permaculture persona.
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">
            Walk recorded 2026-04-26 · Published {PUBLISHED}.
          </p>
        </footer>
      </article>
    </div>
  )
}

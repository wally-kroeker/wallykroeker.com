import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Walk — May 10, 2026 — choosing where to build the first bed',
  description: 'A ~2-hour afternoon recon walk to confirm Cluster A as the first raised-bed site, document the on-site compost and rainwater infrastructure, and surface two unrelated design asks.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-05-20'
const IMG = '/images/food-forest/walks/2026-05-10'

export default function FoodForestWalk20260510Page() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
        </p>

        <header>
          <h1>Walk — May 10, 2026</h1>
          <p className="ff-lede"><em>Choosing where to build the first bed.</em></p>
          <p className="ff-stats">
            24 photos <span aria-hidden="true">·</span> 4 video clips with audio <span aria-hidden="true">·</span> ~2 h afternoon recon <span aria-hidden="true">·</span> Cluster A confirmed as bed site
          </p>
        </header>

        <figure className="ff-hero">
          <img
            src={`${IMG}/recon-2026-05-10-04-cluster-A-looking-ESE.webp`}
            width={1205}
            height={1600}
            decoding="async"
            alt="Looking east-southeast into Cluster A — open lawn between the pear trees and the raccoon shed, lawn tractor parked at the edge, shed roof visible through the trees, late-afternoon spring sun."
          />
          <figcaption>
            <strong>Cluster A from the driveway approach.</strong> The first 4×8 hugel raised bed
            will go here, between the pear trees and the raccoon shed. Mid-day sun, on-hand
            compost and water within ten metres, visible from the driveway.
          </figcaption>
        </figure>

        <section className="ff-body">
          <h2>Headline finds</h2>
          <ul>
            <li>
              <strong>Cluster A is the bed site.</strong> The existing tilled garden between the
              pear trees and the raccoon shed is confirmed for the first 4×8 hugel raised bed.
              Mid-day sun (5–6 hours direct), spruces shade west and east, open prairie sits NE
              of the spot.
            </li>
            <li>
              <strong>Existing infrastructure clusters here.</strong> A pallet compost system
              (two bins, one loaded with multi-year aged goat bedding) sits beside the raccoon
              shed. A ~200-gallon blue plastic catchment vessel stands against the shed&apos;s
              shingled wall, waiting to be plumbed off the roof. The bed, the compost, the
              catchment, and the future garden shed are all within ~10 m of each other.
            </li>
            <li>
              <strong>Two designs added.</strong> The clay patch already tilled at Cluster A
              becomes a <Link href="/food-forest/builds/clay-patch-annex">no-fence root annex</Link> —
              daikon, sunchokes, fall garlic — so the limited electric fence wire stays on
              the high-value raised bed. The NE campsite gets a{' '}
              <Link href="/food-forest/builds/ne-campsite-moon-dance-mat">clover-thyme-strawberry mat</Link> for moonlit dancing.
              Both designed for Zone 3a survival and existing-resource use.
            </li>
          </ul>

          <h2>The walk</h2>

          <h3>Cluster A — the bed-candidate panorama</h3>
          <p>
            Wally walked into the driveway-approach garden and made a deliberate rotation
            panorama — seven photos every direction from one spot, paired with a 25-second
            narration. The verbal pair, on the record:
          </p>
          <blockquote>
            <em>
              &ldquo;There used to be rhubarb here, and I think we kind of let it die because
              I didn&apos;t care for it properly. I didn&apos;t water it. He didn&apos;t clean
              up the weeds around it. It&apos;s been about five or six years since we&apos;ve
              done anything in this area. And yeah, I&apos;d like to clean it up this year
              and have it be an inviting place when you drive up the yard.&rdquo;
            </em>
          </blockquote>
          <p>
            <em>Inviting place when you drive up the yard.</em> That&apos;s the brief. The
            bed isn&apos;t just a vegetable box — it&apos;s the welcome layer for the
            property, on the driveway approach, visible to anyone arriving. Cluster A is
            locked.
          </p>

          <figure>
            <img src={`${IMG}/recon-2026-05-10-05-on-hand-timber-stack.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="Stack of weathered timber boards on the ground at the bed site — on-hand salvage material." />
            <figcaption>
              Salvage already on the ground at the bed site. The repurposing aesthetic
              doesn&apos;t need to be invented — the property has been doing it all along.
            </figcaption>
          </figure>

          <h3>The on-site infrastructure — compost and water</h3>
          <p>
            Beside the raccoon shed, two things the bed will inherit. A pallet compost system
            with multi-year goat-bedding compost at the bottom of one bin — the aged material
            is exactly what hugelkultur layer 5 wants. And a ~200-gallon blue plastic catchment
            vessel parked against the shed&apos;s shingled wall, waiting to be plumbed off
            the roof. Three of the four resources for Bed 1 live within ten metres of where
            the bed will sit.
          </p>
          <figure className="ff-grid">
            <img src={`${IMG}/recon-2026-05-10-06-pallet-compost-bin.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="One of the two pallet compost bins beside the raccoon shed — slatted pallet walls, multi-year aged goat-bedding compost inside, never turned." />
            <img src={`${IMG}/recon-2026-05-10-07-blue-rainwater-vessel.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="A ~200-gallon blue plastic catchment vessel standing against the raccoon-shed's shingled wall, with the pallet compost bins to the left." />
          </figure>

          <h3>The south bluff — log inventory</h3>
          <p>
            Mid-walk, Wally photographed a recently fallen mature tree in the south bluff —
            deeply furrowed bark, large diameter, one trunk this size yields 6–10 wall pieces
            for the 4×8 bed. The build materials are not theoretical. They&apos;re on the
            ground.
          </p>
          <figure>
            <img src={`${IMG}/recon-2026-05-10-03-fallen-log-build-material.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="A recently downed mature tree in the south bluff — large furrowed trunk on the ground, surrounded by other downed branches." />
            <figcaption>
              Build-wall grade. One trunk of this size = the long-side wall logs for Bed 1.
            </figcaption>
          </figure>

          <h3>The east dead zone</h3>
          <p>
            At the far-east edge, Wally stopped to record a 64-second observation:
          </p>
          <blockquote>
            <em>
              &ldquo;Anyway, this is the part I wanted to talk about, Linus. This just seems
              like a dead zone… the septic field is over there, and that was, this is where
              the path went through. There also was obviously some land here, like they had
              buildings back here, don&apos;t really know what they were… this building here
              needs some, I don&apos;t know, it looks like maybe a machine shed. It was
              pretty big actually — it&apos;s like 12 feet by 18 feet, maybe 20 feet. It
              never was standing while I was here, and there&apos;s been a number of trees
              that have fallen here, and yeah, this place is kind of dead and I&apos;d like
              to figure it out. This is where all the majority of the burdocks are.&rdquo;
            </em>
          </blockquote>
          <p>
            Not a planting recommendation. A problem-statement: the footprint of a former
            machine shed (~12×18 to 12×20 ft) is still legible on the ground, the old path
            through the area is overgrown, trees have come down, burdocks have taken over.
            History to figure out, intervention deferred. (Note for next time: the red-twigged
            shrub at this location is wild rose with rose hips, not red-osier dogwood — the
            on-property dogwood stand is at the bluff-wetland edge to the south, photographed
            on the <Link href="/food-forest/walks/2026-04-26">April 26 walk</Link>.)
          </p>

          <h3>Property character — the things the land already does</h3>
          <p>
            Two design-language records from the start of the walk. A very rotted old cut
            stump with a vintage enamel basin on top — known producer of Chicken of the Woods.
            And a conifer hit hard by a yellow-bellied sapsucker, oblong holes worked open so
            the sap keeps running. With protection the tree should survive. These are the
            quirky-repurposing notes the property has been making on its own.
          </p>
          <figure className="ff-grid">
            <img src={`${IMG}/recon-2026-05-10-01-stump-with-basin.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="An old rotted cut stump with a vintage white enamel basin balanced on top, surrounded by leaf-litter and bare-stem undergrowth in a bluff clearing." />
            <img src={`${IMG}/recon-2026-05-10-02-sapsucker-conifer.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="A conifer trunk with dense rows of oblong yellow-bellied-sapsucker holes worked into the bark." />
          </figure>

          <h3>The shed — and what the late light reads wrong</h3>
          <p>
            The raccoon shed in late-afternoon light — the new bed will sit immediately
            south/west of this building. One note for anyone working from this photo: the
            light reads the wall as a pale grey, but the building is actually <strong>red-painted
            wood with a shingled gable roof</strong>. Photograph it in the morning and the red
            comes back.
          </p>
          <figure>
            <img src={`${IMG}/recon-2026-05-10-08-shed-and-bed-context.webp`}
              width={1205} height={1600} loading="lazy" decoding="async"
              alt="The raccoon shed in late-afternoon light — shingled gable roof, wood siding, late-spring trees around it; bed site sits immediately south-west." />
            <figcaption>
              The future garden shed. Bed 1 will sit immediately south/west of this corner.
            </figcaption>
          </figure>

          <p className="ff-disclaimer">
            <em>
              This is reconnaissance, not a finished design. Things will get refined as the
              bed actually goes in. Wally also launched the recorder accidentally a few times
              during the walk — those clips are on disk if anyone wants them, but the
              deliberate moments above carry the story.
            </em>
          </p>

          <h2>The two designs added by this walk</h2>
          <ul>
            <li>
              <strong><Link href="/food-forest/builds/clay-patch-annex">Clay-patch annex — no-fence root garden</Link></strong> —
              the existing 15×20 ft tilled patch at Cluster A becomes a daikon /
              Jerusalem-artichoke / hardneck-garlic planting that doesn&apos;t need fencing.
              Saves the limited electric-fence wire for the raised bed.
            </li>
            <li>
              <strong><Link href="/food-forest/builds/ne-campsite-moon-dance-mat">NE campsite — Moon-Dance Mat</Link></strong> —
              a white-clover / creeping-thyme / wild-strawberry cover-crop mix seeded into
              the NE campsite clearing to form a soft fragrant mat that doubles as a
              nitrogen-fixing cover crop and looks beautiful under moonlight.
            </li>
          </ul>
        </section>

        <footer className="ff-footer">
          <p>
            Walked and photographed by <strong>Wally Kroeker</strong>.
            Synthesis by <strong>Linus</strong>, an AI permaculture persona.
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">
            Walk recorded 2026-05-10 · Published {PUBLISHED}.
          </p>
        </footer>
      </article>
    </div>
  )
}

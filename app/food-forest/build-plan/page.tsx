import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Year-1 Raised Bed Build Plan — Food Forest',
  description: 'A 4×8 ft log-walled hugelkultur raised bed using downed wood and aged goat-bedding straw. Three corner-joint variants, layer order, and a build sequence.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-05-10'
const UPDATED = '2026-05-12'
const IMG = '/images/food-forest/build-plan'

export default function FoodForestBuildPlanPage() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
        </p>

        <header>
          <h1>Year-1 Raised Bed Build Plan</h1>
          <p className="ff-lede">
            <em>A 4 ft × 8 ft log-walled hugelkultur bed, built from downed wood already on the property and aged goat-bedding straw from the goat barn.</em>
          </p>
          <p className="ff-stats">
            Property: Wally &amp; Tiphanie&apos;s land near Elie MB <span aria-hidden="true">·</span> Zone 3a <span aria-hidden="true">·</span> First build: May 2026
          </p>
        </header>

        <figure className="ff-hero">
          <img
            src={`${IMG}/03-finished-bed.webp`}
            width={1600}
            height={894}
            decoding="async"
            alt="Finished log-walled raised bed in a Manitoba garden setting — rectangular, four courses tall, butt-and-pass corners, mulched top, late spring light."
          />
          <figcaption>
            What we&apos;re building: a rectangular log-walled raised bed, hugel-filled, planted by midsummer.
          </figcaption>
        </figure>

        <section className="ff-body">
          <h2>TL;DR</h2>
          <p>
            <strong>4 ft × 8 ft × ~30 in</strong> rectangular bed. Walls: downed wood from the property, four courses tall.
            Fill: hugelkultur — logs, branches, leaves, aged goat bedding, compost, topsoil, mulch. Three corner-joint
            options below; pick the one that matches your logs and your appetite for chainsaw practice today.
          </p>
          <p>
            <strong>Recommendation for today:</strong> <a href="#variant-a">Variant A — Butt-and-pass.</a> Fastest, forgiving, and you can still
            do a saddle-notched bed next year. If the only logs on site are short and crooked, switch to{' '}
            <a href="#variant-c">Variant C — 4-Post + Rail.</a>
          </p>

          <h2>Pick Your Corner Joint</h2>
          <figure>
            <img
              src={`${IMG}/01-corner-joints.webp`}
              width={1600}
              height={894}
              loading="lazy"
              decoding="async"
              alt="Three-panel infographic comparing corner joints: butt-and-pass with corner stakes, saddle-notched interlocking logs, and 4-post + rail with horizontal logs slid between paired posts."
            />
            <figcaption>Three corner-joint options — increasing skill, increasing build time.</figcaption>
          </figure>

          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Skill</th>
                  <th>Tools beyond chainsaw</th>
                  <th>Stability</th>
                  <th>When to pick it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>A. Butt-and-pass</strong></td>
                  <td>Easy</td>
                  <td>Mallet, sharpened wood stakes</td>
                  <td>Good with stakes</td>
                  <td>Fastest path to filled-and-planted; logs reasonably straight</td>
                </tr>
                <tr>
                  <td><strong>B. Saddle notch</strong></td>
                  <td>Moderate-hard</td>
                  <td>Confidence with chainsaw, marking pencil</td>
                  <td>Excellent (interlocked)</td>
                  <td>You want to learn a real homestead skill</td>
                </tr>
                <tr>
                  <td><strong>C. 4-post + rail</strong></td>
                  <td>Easy-moderate</td>
                  <td>Drive-spike or post-driver</td>
                  <td>Very good</td>
                  <td>Logs are short, crooked, or mismatched</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="materials">Materials Per Variant</h2>

          <h3 id="variant-a">Variant A — Butt-and-Pass (Recommended)</h3>
          <ul>
            <li><strong>Wall logs (per course):</strong> 2 long logs at ~96 in (8 ft); 2 short logs at ~48 in (4 ft). <strong>4 courses tall = 16 wall logs total.</strong></li>
            <li><strong>Corner stakes:</strong> 8 stakes — one inside, one outside, at each of 4 corners. Each ~3-4 in diameter, 36-42 in long, sharpened. Drive at least 12 in into the ground; reach the top course.</li>
            <li><strong>Pinning (optional but recommended):</strong> 8-12 hardwood drift pins or 6-inch construction screws to pin stakes to top course (prevents lifting from frost-heaves).</li>
          </ul>

          <h3>Variant B — Saddle-Notched</h3>
          <ul>
            <li>Same log count as A, but logs need to be <strong>+8 in longer</strong> than the bed dimension because notches eat into the ends. So: long-side ~104 in; short-side ~56 in.</li>
            <li>Pick straighter logs — wonky logs make notch fitting miserable.</li>
            <li><strong>No corner stakes needed.</strong> The notches lock the structure.</li>
          </ul>

          <h3 id="variant-c">Variant C — 4-Post + Rail</h3>
          <ul>
            <li><strong>Posts:</strong> 4 corner posts ~48 in long × 4-6 in diameter, but <strong>two posts per corner</strong> (inside + outside the rails) = 8 total. Drive each pair leaving 30 in above grade, with a 5-6 in rail-channel between them.</li>
            <li><strong>Rails (horizontal logs between post pairs):</strong> 8 long rails (~92 in each); 8 short rails (~44 in each).</li>
            <li>This variant tolerates <strong>any</strong> rail length and curvature as long as it spans the post gap — perfect for downed-tree salvage.</li>
          </ul>

          <h2>Tools</h2>
          <ul className="ff-tools">
            <li>Chainsaw (sharp) + bar oil + 2-stroke fuel mix</li>
            <li>Cordless drill with 3/8 in spade bit (for drift pins, optional)</li>
            <li>Sledge / dead-blow mallet</li>
            <li>Hand saw (cleanup cuts)</li>
            <li>Tape measure (25 ft minimum)</li>
            <li>4 ft level</li>
            <li>Carpenter&apos;s square</li>
            <li>Marking pencil or lumber crayon</li>
            <li>Work gloves, ear protection, eye protection, chainsaw chaps</li>
            <li>Twine or jute string + 4 stakes for laying out the footprint</li>
            <li>Wheelbarrow</li>
          </ul>

          <h2>Site Prep</h2>
          <ol>
            <li><strong>Confirm placement.</strong> Take photos when you walk the site. The pear-trees-to-future-garden-shed corridor is on the driveway side — proximity = you actually water it.</li>
            <li><strong>Lay out the rectangle.</strong> Drive 4 stakes at the corners, string between them. Equal diagonals = square corners. A 4×8 rectangle has a 8.94 ft (107.3 in) diagonal.</li>
            <li><strong>Strip the sod.</strong> Flat spade, 30 minutes. Save the sod — flip it grass-down inside the bed; it&apos;s free organic matter.</li>
            <li><strong>Level the perimeter.</strong> First course must sit flat or the whole stack tilts. Shim with rocks or shave high spots.</li>
            <li><strong>Cardboard layer.</strong> Plain cardboard (no tape, no glossy print) over the stripped footprint, overlap 4-6 in. Wet it down before stacking the first course.</li>
          </ol>

          <h2>Hugelkultur Fill — Layer Order</h2>
          <figure>
            <img
              src={`${IMG}/02-hugel-cross-section.webp`}
              width={1205}
              height={1496}
              loading="lazy"
              decoding="async"
              alt="Cross-section diagram of the hugelkultur bed showing eight labeled layers from bottom to top: cardboard, large logs, small branches, leaves and sod, aged goat bedding straw, compost, topsoil, mulch."
            />
            <figcaption>The layer order — note the aged goat-bedding straw at layer 5.</figcaption>
          </figure>
          <p>
            Volume of a 4×8×2.5 ft bed = <strong>80 cubic feet ≈ 3 cubic yards.</strong> That&apos;s a LOT of material — which is exactly why hugel works: most of it comes from the property.
          </p>

          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Thickness</th>
                  <th>Material</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>(already there)</td><td>Cardboard</td><td>Recycled boxes</td></tr>
                <tr><td>2</td><td>10-12 in</td><td><strong>Large logs / round wood</strong> — pack tight</td><td>Property</td></tr>
                <tr><td>3</td><td>4-6 in</td><td><strong>Small branches + twigs</strong></td><td>Property cleanup</td></tr>
                <tr><td>4</td><td>3 in</td><td><strong>Leaves, dry grass, sod chunks (flipped)</strong></td><td>Last fall&apos;s leaves; the stripped sod</td></tr>
                <tr><td>5</td><td>4-6 in</td><td><strong>Goat-bedding straw — AGED 3+ months</strong></td><td>Goat barn cleanouts</td></tr>
                <tr><td>6</td><td>3-4 in</td><td><strong>Compost or aged manure</strong></td><td>Compost piles</td></tr>
                <tr><td>7</td><td>4-6 in</td><td><strong>Topsoil</strong></td><td>Stripped sod + scavenged or bought</td></tr>
                <tr><td>8</td><td>1-2 in</td><td><strong>Mulch</strong> (more straw, leaves, wood chips)</td><td>Loose layer, holds moisture</td></tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>Critical on layer 5:</strong> do NOT use fresh manure-laden bedding here in Year 1 — it&apos;ll burn roots.
            If you only have fresh, put it at layer 3 (deeper) and add an extra inch of plain leaves/grass on top before continuing.
          </p>
          <p>
            <strong>Water each layer as you build it.</strong> Hugel beds drink an enormous amount the first time. Don&apos;t skip this — dry layers don&apos;t compost.
          </p>

          <h2>Build Sequence (Variant A — Butt-and-Pass)</h2>

          <h3>Stage 1 — Drive corner stakes (15 min)</h3>
          <p>
            At each corner, drive <strong>one stake</strong> at least 12 in into the ground, just inside where the corner of your first course will be. (The outside stakes go in later, after course 1 is laid — that way you can tighten them against the actual logs.)
          </p>

          <h3>Stage 2 — Course 1 (30 min)</h3>
          <ul>
            <li>Lay the two 8 ft long logs on the long sides, parallel.</li>
            <li>Drop the two 4 ft short logs across the ends. Their cut faces &quot;butt&quot; against the long logs.</li>
            <li>Drive the <strong>outside corner stakes</strong>, snug against each corner. Mallet them down so the inside stake + log + outside stake form a tight sandwich.</li>
          </ul>

          <h3>Stage 3 — Courses 2-4 (45 min total)</h3>
          <p>
            <em>Easy version:</em> don&apos;t alternate orientation. Stack all four courses the same way. The corner stakes hold it; you don&apos;t need brick-style stagger because the stakes provide rigidity. <strong>Recommended for first build.</strong>
          </p>
          <ul>
            <li>Between each course, drive a 6-in screw or wood drift pin through the corner where logs cross — stops them rolling.</li>
            <li>Use the level on top of each course to check you&apos;re not drifting.</li>
          </ul>

          <h3>Stage 4 — Top course pinning (10 min)</h3>
          <p>
            Drive a long screw or drift pin from the top of each outside stake down into the top wall log. Locks the cap against frost lift.
          </p>

          <p><strong>Total wall build time: ~1.5-2 hours</strong> for someone reasonably handy.</p>

          <h3>Stage 5 — Fill the bed (2-4 hours)</h3>
          <p>See the layer order above. This is the long step. Bring the wheelbarrow and water the bed as you go.</p>

          <h2>Variant D — Irregular Kidney / Polygon (The Pretty One)</h2>
          <p>
            If you walk the property and find a pile of 6-8 ft logs, varied lengths, varied diameters — this is your move.
            Footprint approx <strong>10 ft × 6 ft</strong> kidney shape, ~24-30 in tall.
          </p>
          <ol>
            <li><strong>Lay out the curve</strong> with a garden hose or rope. Walk around it. Adjust until it pleases you.</li>
            <li><strong>Drive perimeter stakes</strong> every 3 ft along the curve, on the <strong>outside</strong> of the line, 12 in into the ground.</li>
            <li><strong>Course 1.</strong> Logs end-to-end along the curve, butting against the outside stakes. No gaps. Mallet them tight.</li>
            <li><strong>Course 2+.</strong> Stack brick-style — joints from course 1 should fall in the middle of logs in course 2.</li>
            <li><strong>Inside stakes.</strong> After course 2, drive stakes on the <strong>inside</strong> of the bed at each course-1 joint.</li>
            <li><strong>Pin the top course</strong> as in the rectangle.</li>
          </ol>
          <p>
            More edge per square foot, absorbs irregular log shapes gracefully. Trade-off: harder to cover with row cover or hoops in Year 2.
          </p>

          <h2>Year 1 Maintenance</h2>
          <ul>
            <li><strong>Settling:</strong> expect 6-10 in of settling in the first season. Top up in fall with goat bedding + compost + mulch — yearly rhythm.</li>
            <li><strong>Watering:</strong> deep watering 2-3× per week unless it rains hard. Year 2+, watering needs drop dramatically — that&apos;s the hugel payoff.</li>
            <li><strong>Planting:</strong> shallow-rooted vigorous things in Y1 — squash, beans, leafy greens, potatoes. Avoid carrots and fine seedlings until Y2.</li>
            <li><strong>Don&apos;t till.</strong> Just keep adding mulch on top each year. Productive for ~5-7 years before peaking.</li>
          </ul>

          <h2>Log Species Reality Check (Manitoba Downed Wood)</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Species</th><th>Wall life</th><th>Notes</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Oak</strong></td><td>15-20 yrs</td><td>Rare around Elie. Save for long sides.</td></tr>
                <tr><td><strong>Green ash</strong></td><td>10-12 yrs</td><td>Solid. Common. EAB-killed wood is fine.</td></tr>
                <tr><td><strong>American elm</strong></td><td>8-10 yrs</td><td>Good. DED-killed wood is fine.</td></tr>
                <tr><td><strong>Manitoba maple / box elder</strong></td><td>4-6 yrs</td><td>Fast rot. Acceptable.</td></tr>
                <tr><td><strong>Aspen / poplar</strong></td><td>3-5 yrs</td><td>Most likely what you have. Acceptable for hugel walls.</td></tr>
                <tr><td><strong>Willow</strong></td><td>2-4 yrs</td><td>Will sprout if recently cut. Use only if seasoned 6+ months.</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Bottom line:</strong> use what&apos;s already on the ground. Don&apos;t fuss about species. By the time the walls fail, the hugel core has built rich soil and you&apos;ll either rebuild or convert to a non-bed planting.
          </p>

          <h2>Today&apos;s Checklist</h2>
          <ul className="ff-checklist">
            <li>Walk the site, photograph the placement spot</li>
            <li>Confirm placement — share photos with Tiph</li>
            <li>Inventory available downed logs (count, lengths, rough diameters)</li>
            <li>Pull together tools above</li>
            <li>Strip sod, lay cardboard</li>
            <li>Build walls (Variant A or C)</li>
            <li>Source/stage hugel layers (logs already on hand; check goat bedding age)</li>
            <li>Fill bed in stages, watering each layer</li>
            <li>Plant Y1 — squash, beans, kale, potatoes recommended</li>
          </ul>

          <h2>What got added since v1 — Cluster A companion plantings</h2>
          <p>
            The May 10 recon walk confirmed the bed site and surfaced two companion designs
            that share Cluster A&apos;s footprint and resources. Both are written up as their
            own pages so the build plan stays focused on the wall.
          </p>
          <ul>
            <li>
              <Link href="/food-forest/builds/clay-patch-annex">
                <strong>Clay-Patch Annex</strong> — no-fence root and bulb planting
              </Link>
              {' '}— daikon, sunchokes, hardneck garlic in the existing tilled 15×20 ft patch.
              Saves the electric fence wire for the raised bed.
            </li>
            <li>
              <Link href="/food-forest/builds/ne-campsite-moon-dance-mat">
                <strong>NE Campsite Moon-Dance Mat</strong> — clover/thyme/strawberry cover crop
              </Link>
              {' '}— a separate spot on the property, designed in the same walk. Soft, fragrant,
              nitrogen-fixing, white-flowered by moonlight.
            </li>
          </ul>
        </section>

        <footer className="ff-footer">
          <p>
            Build plan by <strong>Linus</strong>, an AI permaculture persona.
            Built by <strong>Wally</strong> (and maybe <strong>Tiphanie</strong>, if she picks the saddle-notch).
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">
            Build plan v2 · {UPDATED} — added clay-patch annex and NE-campsite Moon-Dance Mat.
            {' '}Originally published {PUBLISHED}.
          </p>
        </footer>
      </article>
    </div>
  )
}

import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '2026 Summer Plan — the late-spring season — Food Forest',
  description: 'A whole-season action plan authored 2026-05-19 in the middle of the live raised-bed build. Soil-temperature gate replaces calendar gate; cuttings program, joint-walks, $200 budget cap.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-05-20'

export default function FoodForestSummerPlanPage() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
        </p>

        <header>
          <h1>2026 Summer Plan</h1>
          <p className="ff-lede"><em>The late-spring season — what to do when the calendar is a week behind.</em></p>
          <p className="ff-stats">
            13 sections <span aria-hidden="true">·</span> 2-week + whole-summer scope <span aria-hidden="true">·</span> $200 budget <span aria-hidden="true">·</span> free-cuttings program <span aria-hidden="true">·</span> co-design with Tiph
          </p>
        </header>

        <section className="ff-body">
          <h2>1. Where we are now — the two-clock read</h2>
          <p>
            May long weekend was cold and freezing-wet. Leaves on the property are barely
            flushing. No tree blossoms yet. Spring is running ~1–2 weeks behind its calendar
            median. Bed 1 is mid-stream — the live build schedule says today (2026-05-19) is
            <strong> Day 9: fence posts</strong>, though the May 18 walk likely slid that by a
            day. Honest accounting: <strong>the build schedule is not the bottleneck; the
            soil is.</strong>
          </p>
          <p>
            The temptation is to read the cold spring as <em>being behind.</em> That framing
            is wrong, and the rest of this plan only makes sense if we reject it.
          </p>

          <h2>2. The organizing axiom</h2>
          <blockquote className="ff-pullquote">
            <strong>The land has two clocks, and only the slow one is late.</strong>
          </blockquote>
          <p>
            The soil-temperature clock — the one that gates beans, cucumbers, zucchini,
            anything warm-loving — is running cold. Soil in Cluster A is probably ~10°C right
            now versus the typical mid-May ~13–14°C. Warm-crop work <em>waits</em>, gated on
            a thermometer reading, not a calendar date.
          </p>
          <p>
            The <em>other</em> clock — daylight, daylight-driven work, the property itself —
            is fully on time. Bed-build chunks, propagation, salvage staging, observation,
            layering, willow cuttings, mowing the inner loop, walking the crossroads with
            Tiph, cutting burdock before it seeds, planting daikon and peas which actually
            <em> prefer</em> cool soil, the whole repair backlog the May 18 walk surfaced —
            <em>none of that is late.</em> Day length at this latitude on May 19 is
            15 h 38 min, the longest stretch of usable daylight in the year. There is more
            time for non-soil work right now than at any other point in the season.
          </p>
          <p>
            The cold spring is therefore a <strong>free extension of the cool-season window</strong>,
            not a deficit. It hands you weeks you&apos;d otherwise have lost to warm-crop
            urgency. The plan below spends those weeks on the things that have been waiting
            for an opening — cuttings, the path-bend planting, the salvage-staging conversion,
            the joint walks with Tiph — and gates the warm-crop planting on a thermometer in
            the ground, not a date on the wall.
          </p>

          <h3>Three implications, all of which the plan honours</h3>
          <ol>
            <li><strong>Plant warm crops by thermometer, not calendar.</strong> §3 below has the protocol. Beans/cukes go in when 4&quot; soil reads ≥15°C three mornings running. Could be June 4. Could be June 14. Either way, correct.</li>
            <li><strong>The cool window just got longer — fill it.</strong> Peas, daikon, kale, onions, clover, sunchokes prefer cool soil. Push these now, exactly as the live schedule says, no slippage. They are <em>on</em> time, not late.</li>
            <li><strong>Spend the long May daylight on non-soil work.</strong> Cuttings, layering, salvage sorting, inner-loop walks, the joint walk with Tiph. All free of soil-temp dependence, all using the bonus daylight.</li>
          </ol>

          <h2>3. The soil-temp gate — a $5 protocol</h2>
          <p>
            Bury an instant-read meat thermometer ~4&quot; deep in the bed (or just in a sunny
            patch of Cluster A clay, doesn&apos;t matter which — the bed is hugel-warmed, the
            clay isn&apos;t, so reading both gives you the spread). Take a reading mid-morning
            every day from <strong>Mon May 26</strong> onward. Log it on the fridge or in a
            phone note.
          </p>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reading at 4&quot; depth</th>
                  <th>What it allows</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>&lt;10°C</td><td>Peas, fava, daikon, onions, kale only</td></tr>
                <tr><td>10–13°C</td><td>Add: lettuce, spinach, beet, carrot (Y2 beds only)</td></tr>
                <tr><td>13–15°C</td><td>Add: snap beans cautiously, zucchini transplants under row cover</td></tr>
                <tr><td>≥15°C × 3 mornings running</td><td><strong>Bean direct-seed window OPENS.</strong> All warm crops go.</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            If you don&apos;t already own one, an instant-read meat thermometer is $5 at any
            grocery or hardware store. This single number replaces every calendar-based
            &ldquo;when to plant&rdquo; anxiety for the rest of the season.
          </p>

          <h2>4. The next two weeks — May 19 to June 2</h2>
          <p>
            The live bed-build schedule continues unchanged. This view <em>adds</em> a
            second-clock action per day: one 15-min chunk for a non-bed action (cuttings,
            cleanup, observation, or joint walk).
          </p>
          <p>
            <strong>The 4-chunk floor is hard.</strong> If a day already has 4 bed-build
            chunks, the second-clock action is a <strong>swap, not an add</strong> — bump one
            bed-build task to Sunday catch-up, or skip the second-clock action that day and
            pick it up later. <em>Never</em> run more than 4 chunks in a morning. ADHD reality
            wins over the schedule, every time.
          </p>

          <h3>Week 1 — May 19 → 25 (Days 9–15 of bed build)</h3>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bed-build focus</th>
                  <th>Added: second-clock action</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tue May 19</td><td>Fence posts at the bed perimeter (4 chunks)</td><td>— (full day on posts)</td></tr>
                <tr><td>Wed May 20</td><td>Fence wires + charger + voltage check (4 chunks)</td><td>— (full day on fence)</td></tr>
                <tr><td>Thu May 21</td><td>Clay-patch prep + broadcast daikon (4 chunks)</td><td><strong>15m:</strong> cut 6 willow stakes, push into damp soil along the coulee edge — first free propagation, zero materials</td></tr>
                <tr><td>Fri May 22</td><td>Sunchoke planting in clay patch (4 chunks)</td><td><strong>15m:</strong> walk the burdock zone with secateurs — cut 5 of the biggest plants at ground level (no pulling — exhaust the tap, don&apos;t broadcast seed)</td></tr>
                <tr><td>Sat May 23</td><td>Rhubarb hunt (3 chunks) + water everything (1 chunk)</td><td><strong>15m:</strong> mound-layer 2 hazelnut stems — bend low branch to ground, scratch bark on the underside, peg with a forked stick, cover with 4&quot; soil</td></tr>
                <tr><td>Sun May 24</td><td><strong>Catch-up day</strong> — top up bed, document slumps (2 chunks)</td><td><strong>2× 15m:</strong> bury soil thermometer in bed + start daily log AND walk-and-flag candidate propagation-bed site near the goat barn (dappled afternoon shade)</td></tr>
                <tr><td>Mon May 25</td><td>NE campsite measurement + clear for dance mat (4 chunks)</td><td>— (full day on dance mat)</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>Total Week 1 new-thread time: ~5 chunks (75 min) over 7 days.</strong></p>

          <h3>Week 2 — May 26 → June 2 (Days 16–22 of bed build + soil gate)</h3>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bed-build focus</th>
                  <th>Added: second-clock action</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tue May 26</td><td>NE campsite — broadcast moon-dance mat seed (4 chunks)</td><td>— (full day on dance mat)</td></tr>
                <tr><td>Wed May 27</td><td>Wild strawberry hunt — dig plugs, transplant to mat (4 chunks)</td><td>— (full day on dance mat)</td></tr>
                <tr><td>Thu May 28</td><td>Maintenance — water bed, walk-check (2 chunks instead of 4)</td><td><strong>2× 15m:</strong> dig 2 plum suckers from the existing colony + heel them into the propagation site AND dig 1 chokecherry sucker if visible</td></tr>
                <tr><td>Fri May 29</td><td>Maintenance — water everything (2 chunks)</td><td><strong>2× 15m:</strong> collect scrap lumber for propagation bed AND lay out 3×6 footprint at the chosen shaded spot</td></tr>
                <tr><td>Sat May 30</td><td><strong>Build propagation bed</strong> — scrap-lumber walls only, no hugel (4 chunks)</td><td>(the build IS the bed-build today)</td></tr>
                <tr><td>Sun May 31</td><td>Maintenance + soil-temp reading (1 chunk)</td><td><strong>3× 15m: JOINT WALK with Tiph</strong> — crossroads hub, The Captain, the dead zone. Bring camera + soil thermometer. Mark each spot with a flag.</td></tr>
                <tr><td>Mon Jun 1</td><td>Soil-temp reading + watering (2 chunks)</td><td><strong>2× 15m:</strong> stick willow + dogwood semi-hardwood cuttings into the propagation bed (now built and ready)</td></tr>
                <tr><td>Tue Jun 2</td><td>Soil-temp reading + watering (2 chunks)</td><td><strong>2× 15m:</strong> start seeds for fall succession sowing (cilantro, dill, second-round greens)</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>Total Week 2 new-thread time: ~10 chunks (150 min) over 8 days.</strong></p>

          <h4>State at end of Week 2</h4>
          <ul>
            <li>Bed 1: walls built, hugel filled, fenced, soil-tested, awaiting warm-crop direct-seed when the gate opens.</li>
            <li>Clay patch: daikon germinated, sunchokes in, rhubarb hunt closed (found or not — both are data).</li>
            <li>NE campsite: moon-dance mat seeded and germinating.</li>
            <li>Propagation bed: built, 4–6 species started (willow, dogwood, hazelnut layers, plum / chokecherry suckers).</li>
            <li>One joint walk completed with Tiph; three places flagged.</li>
            <li>Burdock zone: 5+ plants cut at ground level, no seed-set risk this year.</li>
            <li>Soil thermometer reading daily.</li>
          </ul>

          <h2>5. The summer arc — June through September</h2>
          <p>
            Cadence shifts from 15-min chunks to weekly windows. Each window names ONE
            primary work focus — the thing that gets the morning hours when you have them —
            and a short list of opportunistic threads that fit alongside.
          </p>

          <h3>June — <em>the warm-crop opening</em></h3>
          <p>
            <strong>Primary:</strong> Direct-seed beans (when soil-temp gate opens) + transplant
            zucchini and cucumber under row cover. Establish the Bed 1 Year-1 planting set
            (peas / bush dry beans / zucchini / green onions). Water bed deeply 2–3× per week.
          </p>
          <p><strong>Opportunistic alongside:</strong></p>
          <ul>
            <li><strong>Cuttings:</strong> softwood window opens — take currant/gooseberry/elderberry cuttings if you have any, or from a friend&apos;s garden ($0 if asked nicely).</li>
            <li><strong>Inner loop:</strong> mow it once, walking it with Tiph if she&apos;s into it. The path becomes real by use.</li>
            <li><strong>Salvage-staging shed</strong> (junk-pile shed): one Saturday morning sorting and labelling — <em>not</em> clearing. The goal is to know what you have.</li>
          </ul>

          <h3>July — <em>peak growth &amp; the burdock window</em></h3>
          <p>
            <strong>Primary:</strong> Daily walk-check + harvest. Peas peak ~mid-July; pull
            when done. Snap beans start. Zucchini accelerates. Daikon ready to start eating
            (clay patch). First sunchoke shoots establishing.
          </p>
          <p><strong>Opportunistic alongside:</strong></p>
          <ul>
            <li><strong>Burdock cut — the real window.</strong> Cut every flowering burdock plant at ground level <em>before</em> it sets seed (late July is your deadline). One full Saturday morning across the affected zones. This is the single highest-leverage cleanup move you can make this year.</li>
            <li><strong>Cuttings:</strong> check survival rate in the propagation bed. Top up watering. Layer 2 more hazelnut stems if the first two took.</li>
            <li><strong>Re-sow trellis bed</strong> where peas finished — quick fall greens (lettuce, arugula, radish) — under the row cover for a second harvest.</li>
          </ul>

          <h3>August — <em>the shoulder &amp; the prep month</em></h3>
          <p>
            <strong>Primary:</strong> Harvest ongoing — snap beans, zucchini, daikon, green
            onions, lettuce. Dry beans approach maturity. Re-sow last round of cold-tolerant
            greens for September.
          </p>
          <p><strong>Opportunistic alongside:</strong></p>
          <ul>
            <li>Order fall garlic (T&amp;T or local) — needs 4–6 week lead time before late-September planting.</li>
            <li>Map next year&apos;s Bed 2 and Bed 3 footprints in the cluster — co-design walk with Tiph. <em>Decide</em> by August, <em>build</em> in 2027.</li>
            <li>Salvage shed: second sorting session — by now you know what you have; this round is <em>grouping</em> (windows together, wire together, scrap lumber together). One Saturday.</li>
            <li>Propagation nursery: assess survival. Anything that took is on track to plant out next spring.</li>
          </ul>

          <h3>September — <em>pre-frost &amp; the hand-off</em></h3>
          <p>
            <strong>Primary:</strong> Harvest dry beans (Sept 1–15; pull whole plants at frost
            warning, hang-dry in the shop). Cure onions if any. Last cuttings round? Garlic-planting
            <em> prep</em> — turn the clay patch&apos;s 10-ft garlic row, mulch ready.
          </p>
          <p><strong>Opportunistic alongside:</strong></p>
          <ul>
            <li><strong>Plant hardneck garlic late Sept / early Oct</strong> (~50 cloves, 4&quot; deep, mulched heavy with straw).</li>
            <li>Top up Bed 1 — it&apos;ll have settled 6–10&quot; in Year-1; add goat bedding + compost + mulch.</li>
            <li>Year 1 reflection walk with Tiph. What worked, what didn&apos;t, what to do differently for Bed 2 in 2027.</li>
            <li>Build-log entry on wallykroeker.com.</li>
          </ul>

          <h2>6. The cuttings program — quick read</h2>
          <p>
            Full protocols + species table on the <Link href="/food-forest/designs/cuttings-program">cuttings-program</Link> page.
            The shape of the program:
          </p>
          <ul>
            <li><strong>Today–this week (free):</strong> Willow stakes pushed into damp soil along the coulee. Hazelnut mound layering. Plum / chokecherry sucker digs.</li>
            <li><strong>June–July (free):</strong> Softwood cuttings of dogwood, elderberry (if found), currant/gooseberry (if you have friends with bushes).</li>
            <li><strong>Late July–August:</strong> Semi-hardwood cuttings of rose, dogwood second-round.</li>
            <li><strong>2027 hardwood window (March):</strong> Set a reminder to take dormant hardwood cuttings of dogwood, willow, and currant in March 2027 — that&apos;s the <em>prime</em> window you&apos;ve missed for 2026.</li>
          </ul>
          <p>The propagation bed (built Week 2) is where all of this lives.</p>

          <h2>7. Planting in new places — sourced from cuttings, not the wallet</h2>
          <p>
            Three places get new plantings this season. <strong>All material is propagated free
            from the property or salvaged.</strong>
          </p>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Place</th>
                  <th>What goes there</th>
                  <th>Source</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Crossroads hub</strong> (≈ 49.8445, -97.7754)</td>
                  <td>One hazelnut layer, one chokecherry sucker, eventually elderberry from cuttings — the &ldquo;walk-around-a-corner-surprise&rdquo; screen</td>
                  <td>Propagation nursery — plant out spring 2027, not this year</td>
                  <td>Decide in joint walk; flag the spot now</td>
                </tr>
                <tr>
                  <td><strong>The Captain&apos;s vicinity</strong> (huggy oak, ramp-top junction ≈ 49.8446, -97.7761)</td>
                  <td>No new planting at the trunk (oak root zone is sacred); a 2-plant native wildflower drift on the <em>approach path</em> to The Captain (yarrow, wild bergamot, or whatever the moon-dance mat had spare seed of)</td>
                  <td>Spare seed from the moon-dance mat broadcast</td>
                  <td>When seeding the moon-dance mat (Week 2)</td>
                </tr>
                <tr>
                  <td><strong>Inner-loop edge</strong> — somewhere along the GPS track that has dappled afternoon shade</td>
                  <td>One willow stake hedge (3–5 cuttings, 2 ft apart) as a living trellis / screening edge</td>
                  <td>Free willow cuttings</td>
                  <td>When sticking willow cuttings (Week 1)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>None of these costs more than spare seed and labour. None of them gets planted with nursery stock. The wallet stays in your pocket.</p>

          <h2>8. Cleanup — light hand only, three areas</h2>
          <p>
            After the May 18 walk you set the ethic explicitly: <strong>repair, not remove.</strong>
            Cleanup work below honours that. Nothing demolishes. Nothing gets gutted.
          </p>
          <p>
            <strong>Area A: The burdock zone</strong> (around the summer kitchen, per the walk).
            Action: cut at ground level, before seed-set (deadline late July). No pulling, no
            digging — burdock root reserves are vast; cutting exhausts them over 2–3 years.
            <strong> Time budget: 1 Saturday morning in early July.</strong> Tools: secateurs
            or a sharp scythe.
          </p>
          <p>
            <strong>Area B: Junk-pile shed → salvage-staging conversion.</strong> Action: sort,
            label, group. Goal is to <em>know what you have</em> by August. The shed becomes
            a salvage-staging building per the May 18 framing — not cleared, not emptied,
            just <strong>understood</strong>. <strong>Time budget: one Saturday morning in June,
            one in August.</strong> Tools: notebook, marker, photos.
          </p>
          <p>
            <strong>Area C: Around the bed-build site (Cluster A).</strong> Action: collect the
            offcuts, sweep the bed-build crumbs, photograph the finished state. This is the
            <em> cap</em> on the build — the moment you stop building and say &ldquo;Bed 1 is
            done.&rdquo; <strong>Time budget: 1 chunk on the day after fence completion.</strong>
          </p>
          <p><strong>NOT in this plan (deferred or family-led):</strong></p>
          <ul>
            <li>The summer kitchen — assess via photos only; full conversation deferred to fall.</li>
            <li>The grain bins — repair backlog item, not 2026.</li>
            <li>The tree-struck building — repair backlog item, not 2026.</li>
            <li>The animal graveyard (Oliver, George, Blaze) — Tiphanie-led, family-led, on no schedule but the family&apos;s.</li>
            <li>Jan&apos;s fort — assess via photos only; preserve as anchor.</li>
          </ul>

          <h2>9. Build a bed (small)</h2>
          <p>
            Bed 1 finishes in Week 2. The &ldquo;build a bed&rdquo; thread now points at a
            <strong> small propagation nursery</strong> — not a second Bed 2 hugel.
          </p>
          <p>
            <strong>Why not Bed 2 this year:</strong> The 4-bed system has Beds 2 and 3
            coming in 2027 by design. The cap is ~4 beds because that&apos;s what 2 hrs/week
            sustains. Don&apos;t break the cadence in Year 1.
          </p>
          <p><strong>The propagation nursery — specs:</strong></p>
          <ul>
            <li>Footprint: <strong>3 ft × 6 ft</strong> rectangle (1/4 the size of Bed 1).</li>
            <li>Walls: scrap lumber, no chainsaw work. 2×6 or 2×8 boards 6 ft long for the long sides, cut 3-footers for the ends. Screw together with deck screws. Walls 12–18&quot; tall.</li>
            <li>Fill: 50/50 sand and compost, no hugel — propagation wants drainage and gentle nutrients, not woody mass.</li>
            <li>Location: dappled afternoon shade, somewhere near the goat barn (per the Week 1 site flag). Out of the deer&apos;s main browse line. Close to a hose.</li>
            <li>Cover: optional plastic sheet for first 2–3 weeks of cuttings (humidity tent) — repurpose a sheet from the salvage stack.</li>
            <li>Cost: deck screws if not on hand (~$5), maybe a bag of builder&apos;s sand (~$8). Everything else is scrap.</li>
          </ul>
          <p><strong>Build time:</strong> 4 chunks (Sat May 30). That&apos;s it. No hugel layers, no chainsaw, no 4-week schedule.</p>

          <h2>10. The budget — $200 cap</h2>
          <p>
            Numbers below are confirmed against <strong>T&amp;T Seeds 2026</strong> prices
            (their domain moved to <em>ttseeds.com</em>) and Manitoba market rates where T&amp;T
            doesn&apos;t stock the item. Two estimates from earlier docs needed correction:
          </p>
          <ul>
            <li><strong>Creeping thyme</strong> was estimated at $35 — actually <strong>$4.50–$9.25</strong> at T&amp;T. A win.</li>
            <li><strong>Hardneck garlic ($5–10 for 100 cloves)</strong> was very wrong — actually <strong>$48–80</strong> at Manitoba hardneck-grower rates. The garlic line is the budget-breaker; the plan now cuts to ~50 cloves.</li>
          </ul>

          <h3>Essentials — must spend</h3>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Line</th><th>Why</th><th>Confirmed CAD</th></tr>
              </thead>
              <tbody>
                <tr><td>Chainsaw carb-adjustment tool kit</td><td>Unblock-everything for log cutting</td><td>$10–20</td></tr>
                <tr><td>Daikon seed (T&amp;T Alpine, 100 seeds)</td><td>Clay patch</td><td>$5.55</td></tr>
                <tr><td>Jerusalem artichoke tubers (1 lb / ~14 tubers, local grower)</td><td>Clay patch</td><td>$15–25</td></tr>
                <tr><td>White Dutch clover (~450 g / 1 lb, T&amp;T)</td><td>Moon-dance mat</td><td>$28–32</td></tr>
                <tr><td>Creeping thyme seed (T&amp;T 2 g pack)</td><td>Moon-dance mat</td><td>$9.25</td></tr>
                <tr><td>Shelling pea seed (T&amp;T Homesteader, 50 g)</td><td>Bed 1 north trellis</td><td>$5.05</td></tr>
                <tr><td>Bush dry bean seed (T&amp;T, 125 g)</td><td>Bed 1 bulk block</td><td>$8.90</td></tr>
                <tr><td>Zucchini seed (T&amp;T Sp Perfection, 15 seeds)</td><td>Bed 1</td><td>$6.40</td></tr>
                <tr><td>Green onion seed (T&amp;T Bunching Onion, 3 g)</td><td>Bed 1 south strip</td><td>$4.80</td></tr>
                <tr><td>Kale seed (T&amp;T Dwarf Siberian, packet)</td><td>Bed 1</td><td>$4.60</td></tr>
                <tr><td>Instant-read meat thermometer</td><td>The soil-temp gate</td><td>$5</td></tr>
                <tr><td><strong>Essentials subtotal</strong></td><td></td><td><strong>$103–127</strong></td></tr>
              </tbody>
            </table>
          </div>

          <h3>Recommended add-ons</h3>
          <div className="ff-table-wrap">
            <table>
              <thead><tr><th>Line</th><th>Why</th><th>Confirmed CAD</th></tr></thead>
              <tbody>
                <tr><td>Floating row cover (Agribon-17, 25 ft × 6 ft, Lee Valley / Veseys)</td><td>Highest-return Zone 3a practice — +5–7°C for transplants and frost-margin</td><td>$25–35</td></tr>
                <tr><td>Deck screws (2.5&quot;, if not on hand)</td><td>Propagation bed</td><td>$5</td></tr>
                <tr><td>Bag of builder&apos;s sand</td><td>Propagation bed fill (50/50 with compost)</td><td>$8</td></tr>
                <tr><td>Snap bean seed (T&amp;T Tendergreen, 50 g)</td><td>Bed 1, alongside dry-bean block</td><td>$4.60</td></tr>
                <tr><td><strong>Add-ons subtotal</strong></td><td></td><td><strong>$42–53</strong></td></tr>
              </tbody>
            </table>
          </div>

          <h3>Fall — held for late September</h3>
          <div className="ff-table-wrap">
            <table>
              <thead><tr><th>Line</th><th>Why</th><th>Confirmed CAD</th></tr></thead>
              <tbody>
                <tr><td>Hardneck garlic — <strong>50 cloves</strong>, ~7 heads (Prairie growers)</td><td>Late Sept / early Oct plant</td><td>$35–50</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Why 50 cloves not 100:</strong> garlic is the line that decides if the
            summer hits $200. Fifty hardneck cloves still gives you a respectable garlic row
            (~10 ft), and the surplus garlic genetics build year-on-year by replanting your
            own best cloves each fall — by 2028 you&apos;ll have 100+ cloves from your own
            beds, free.
          </p>

          <h3>Roll-up</h3>
          <div className="ff-table-wrap">
            <table>
              <thead><tr><th></th><th>Floor</th><th>Ceiling</th></tr></thead>
              <tbody>
                <tr><td>Essentials</td><td>$103</td><td>$127</td></tr>
                <tr><td>Add-ons (row cover + screws + sand + snap beans)</td><td>$42</td><td>$53</td></tr>
                <tr><td>Fall garlic (50 cloves)</td><td>$35</td><td>$50</td></tr>
                <tr><td>Held reserve for cuttings materials (June decision)</td><td>$0</td><td>$20</td></tr>
                <tr><td><strong>TOTAL</strong></td><td><strong>$180</strong></td><td><strong>$250</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Under-$200 path</strong> = Essentials + Add-ons (skip the cuttings-materials
            reserve, use willow water) + Fall garlic at the floor — <strong>comes in around
            $180–195.</strong> That fits.
          </p>

          <h3>Free moves first — the actual order of spending</h3>
          <ol>
            <li><strong>Cuttings</strong> — willow, hazelnut, plum, chokecherry, rose, pear layer. All zero materials this week.</li>
            <li><strong>Suckers and divisions</strong> — sunchoke if a neighbour gives you a bucket; rhubarb if found in the Cluster A dig.</li>
            <li><strong>Salvage materials</strong> — propagation-bed scrap lumber, windows from the junk-pile shed.</li>
            <li><strong>Self-saved seed</strong> — anything from a kitchen-tomato or grocery-bean that looked good.</li>
            <li><strong>Then the essentials table.</strong></li>
          </ol>

          <h2>11. Joint-walk items — for Wally &amp; Tiphanie together</h2>
          <p>Five things that aren&apos;t decided here because they shouldn&apos;t be — they want the two of you on the property:</p>
          <ol>
            <li><strong>The crossroads / Captain / dead zone walk</strong> (slotted Sun May 31, Week 2). Flag the path-bend planting spot together. Lay hands on The Captain. Walk the dead zone — Tiph&apos;s read on the no-recruitment problem matters as much as the soil read.</li>
            <li><strong>Inner-loop tracing.</strong> Mow once, then walk it together — does it want to follow the May 18 GPS track exactly, or smooth its wobble?</li>
            <li><strong>Bed 2 footprint</strong> (August conversation). Where does the second hugel go in 2027? Cluster A or a new cluster? You&apos;ll know better after living with Bed 1 for a summer.</li>
            <li><strong>Animal graveyard.</strong> Whenever the family is ready. Not on a schedule.</li>
            <li><strong>The seed order.</strong> Lock the bean cultivar (Black Turtle for fastest finish vs Kenearly for heirloom + seed-saving) together this week. T&amp;T order goes in once it&apos;s decided.</li>
          </ol>

          <h2>12. Decisions to defer — you don&apos;t have to choose these now</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Decision</th><th>Defer until</th><th>Why</th></tr>
              </thead>
              <tbody>
                <tr><td>Bed 2 location and shape</td><td>August 2026</td><td>You&apos;ll know after a summer with Bed 1</td></tr>
                <tr><td>Summer kitchen — repair vs preserve as-is</td><td>Fall 2026</td><td>Walk it in late September with fresh eyes</td></tr>
                <tr><td>Dead-zone intervention (light gap? scarify? just protect?)</td><td>After June joint walk + soil test</td><td>Real fork; needs ground-truthing</td></tr>
                <tr><td>Whether the propagation nursery gets a cold frame on top</td><td>September 2026</td><td>Depends on what survived; cold frame is a Y2+ extension</td></tr>
                <tr><td>Garlic source (T&amp;T vs local)</td><td>August 2026</td><td>Order window</td></tr>
                <tr><td>Path-bend specific species (hazelnut vs elderberry vs nannyberry)</td><td>After propagation nursery shows what took</td><td>Plant what worked</td></tr>
              </tbody>
            </table>
          </div>

          <h2>13. The repurposing aesthetic — keep it visible</h2>
          <p>This is the quirky-repurposing project, not the glamping one. The aesthetic moves embedded in this plan, on purpose:</p>
          <ul>
            <li>The propagation bed uses scrap lumber, not pretty cedar boards.</li>
            <li>Willow stakes go in as a living edge, not store-bought trellis.</li>
            <li>The moon-dance mat uses cover-crop seed, not turf grass.</li>
            <li>The salvage shed becomes a <em>staging building</em>, not a teardown.</li>
            <li>The Captain doesn&apos;t get a sign, doesn&apos;t get a circle of stones — gets visited.</li>
            <li>Cuttings get a 3×6 dirt-and-sand box, not a heated propagation cabinet.</li>
          </ul>
          <p>Year-1 doesn&apos;t need to look like a magazine. It needs to work, and to feel like yours.</p>
        </section>

        <footer className="ff-footer">
          <p>
            Plan by <strong>Linus</strong>, an AI permaculture persona.
            Walked, lived, and co-designed with <strong>Wally</strong> and <strong>Tiphanie Kroeker</strong>.
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">
            Plan authored 2026-05-19 · Published {PUBLISHED}.
          </p>
        </footer>
      </article>
    </div>
  )
}

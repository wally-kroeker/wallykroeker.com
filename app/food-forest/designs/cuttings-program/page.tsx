import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Cuttings Program — free propagation from the property — Food Forest',
  description: 'A propagation reference for the woody species on the property, organised by which method works in which window. Free path / under-$25 path. October Propagation Day calendar mark.',
  robots: { index: false, follow: false },
  openGraph: { images: [] },
}

const PUBLISHED = '2026-05-20'

export default function FoodForestCuttingsProgramPage() {
  return (
    <div className="food-forest-page">
      <article className="ff-article">
        <p className="ff-breadcrumb">
          <Link href="/food-forest">← Food Forest</Link>
          {' '}·{' '}
          <Link href="/food-forest/designs/2026-summer-plan">2026 Summer Plan</Link>
        </p>

        <header>
          <h1>Cuttings Program</h1>
          <p className="ff-lede"><em>Free propagation from the property — willow stakes today, an October calendar mark for next year.</em></p>
          <p className="ff-stats">
            15-species table <span aria-hidden="true">·</span> 3 today protocols <span aria-hidden="true">·</span> 8 sources <span aria-hidden="true">·</span> $0 free path / $24 full-kit path
          </p>
        </header>

        <section className="ff-body">
          <h2>The honest read on 2026</h2>
          <p>
            The prime hardwood-cutting window for Zone 3a runs <strong>late October through
            early April</strong>, while wood is fully dormant. As of May 19 with leaves
            flushing, that window is closed. The biggest miss: <strong>dogwood, currant,
            chokecherry, and fruit-tree hardwood cuttings</strong> — the highest-success,
            lowest-effort propagation method for those species — would have been March work.
          </p>
          <p>
            Mitigation that works this year: <strong>softwood cuttings (June), layering
            (now), and sucker division (now).</strong> None of these is as easy as a March
            hardwood cutting, but all are well within reach.
          </p>
          <blockquote className="ff-pullquote">
            <strong>Calendar mark: October long weekend = Propagation Day.</strong>{' '}
            Set a phone reminder for <strong>Fri 2026-10-09</strong>. That&apos;s the next
            prime window for dogwood, currant, and fruit-tree hardwood cuttings, plus
            acorn / paper-birch seed collection. One October Saturday now buys 30+ rooted
            plants for spring 2027.
          </blockquote>

          <h2>The species table — what works for what, when</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Species (on property)</th>
                  <th>Best 2026 method</th>
                  <th>Window</th>
                  <th>Success</th>
                  <th>Materials needed</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>Willow</strong></td><td>Stake direct (softwood/hardwood mixed)</td><td><strong>Now</strong> (May–June)</td><td>90–95%</td><td>Sharp knife, moist soil</td></tr>
                <tr><td><strong>Red osier dogwood</strong></td><td>Sucker division now + softwood cuttings</td><td>Suckers <strong>now</strong>; cuttings late May–June</td><td>70–80%</td><td>Trowel, pot, plastic bag</td></tr>
                <tr><td><strong>Chokecherry</strong></td><td>Sucker division now; softwood cuttings June</td><td>Suckers <strong>now</strong>; cuttings mid-June</td><td>80% suckers; 50–70% cuttings</td><td>Rooting hormone, perlite, humidity tent</td></tr>
                <tr><td><strong>Hazelnut</strong></td><td><strong>Mound layering</strong></td><td><strong>This week</strong> (at leafout)</td><td>80–90%</td><td>Forked sticks, moist soil mound, flagging tape</td></tr>
                <tr><td><strong>Wild rose (east edge)</strong></td><td>Tip layering + softwood cuttings</td><td>Layering late June; cuttings June–July</td><td>55–70%</td><td>Forked stick or wire pin, flagging tape</td></tr>
                <tr><td><strong>Paper birch</strong></td><td>Seed collection</td><td>Collect Aug–Sept; sow spring 2027</td><td>Moderate</td><td>Paper bag, fridge</td></tr>
                <tr><td><strong>Bur oak (&ldquo;The Captain&rdquo;)</strong></td><td>Acorn collection</td><td>Collect Sept–Oct; cold-stratify 90 days</td><td>High if stratified</td><td>Paper bag, damp peat, unheated garage</td></tr>
                <tr><td><strong>Manitoba maple</strong></td><td>Root sucker division</td><td><strong>Now</strong>–June</td><td>85–90%</td><td>Sharp spade, pot</td></tr>
                <tr><td><strong>Aspen / poplar</strong></td><td>Root sucker division</td><td><strong>Now</strong>–June</td><td>85–90%</td><td>Sharp spade, temporary shade</td></tr>
                <tr><td><strong>Pear (×2)</strong></td><td>Simple layering of low branch</td><td><strong>Now</strong> — sever fall 2026</td><td>70%</td><td>Wire pin, moist soil, flagging tape</td></tr>
                <tr><td><strong>Crabapple (×2)</strong></td><td>Softwood cuttings</td><td>Mid-June – early July</td><td>50–65%</td><td>Rooting hormone, perlite, humidity tent</td></tr>
                <tr><td><strong>Plum (×2)</strong></td><td>Root sucker division</td><td><strong>Now</strong></td><td>75–85%</td><td>Sharp spade, pot</td></tr>
                <tr><td><strong>Apple (×1, questionable)</strong></td><td>Softwood (low success); consider grafting</td><td>Mid-June</td><td>40–55%</td><td>Rooting hormone required; bottom heat helps</td></tr>
                <tr><td><strong>Spruce</strong></td><td>Semi-hardwood cuttings</td><td>Aug–Sept</td><td>40–60% (slow)</td><td>Rooting hormone, perlite, cold frame</td></tr>
                <tr><td><strong>Wild raspberry / saskatoon</strong> (anywhere on property)</td><td>Sucker division</td><td><strong>Now</strong>–June</td><td>80%+</td><td>Sharp spade, pot</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Hierarchy of effort for 2026, easiest first</h3>
          <ol>
            <li><strong>Willow stake direct</strong> — 15 minutes today, ~90% success.</li>
            <li><strong>Plum / aspen / Manitoba maple sucker division</strong> — 15 minutes per session, 80%+ success.</li>
            <li><strong>Hazelnut mound layering</strong> — 15 minutes today, ~85% success, but you check it in September.</li>
            <li><strong>Dogwood sucker division</strong> — same as plum.</li>
            <li><strong>Pear simple layering</strong> — 15 minutes per branch, severs in fall.</li>
            <li><strong>Softwood cuttings (June)</strong> — chokecherry, dogwood, crabapple, rose. Higher effort, modest success.</li>
          </ol>

          <h2>Three protocols you can do this week</h2>

          <h3>A. Willow stake — today</h3>
          <p>
            The principle: willow contains its own rooting hormones (IBA + salicylic acid).
            Stuck into moist soil, it roots itself with zero inputs.
          </p>
          <ol>
            <li>Cut stems from any willow on the property. <strong>Spec:</strong> 30–45 cm long, 0.5–2 cm thick (pencil to thumb), 4–6 nodes minimum, current-year or 1-year-old growth (bright green/yellow bark).</li>
            <li><strong>Cut convention:</strong> straight across at the top, 45° at the bottom — so you know which end is down. Pre-strip leaves from the lower 2/3.</li>
            <li><strong>Process within 2 hours</strong>, or stand in a bucket of water. Willows hate drying.</li>
            <li><strong>Plant:</strong> push the angled end 15–20 cm into moist soil. At the coulee edge you can stick directly. Upland, water the hole first, push in with a dowel, firm soil around it.</li>
            <li><strong>Spacing:</strong> 30 cm apart for a hedge row, 60+ cm for individual trees.</li>
            <li><strong>No hormone, no bag, no covering.</strong></li>
            <li><strong>Water:</strong> waterway edge → none needed. Upland → every 2–3 days for 3 weeks, then weekly.</li>
            <li><strong>Mulch:</strong> optional 5 cm straw or wood chip around the base for moisture.</li>
          </ol>
          <p>
            Roots form in 2–4 weeks. Leave or transplant after 6 weeks.{' '}
            <strong>15-min chunk: cut 20 stakes, strip leaves, plant in a row. Done.</strong>
          </p>

          <h3>B. Hazelnut mound layering — this week, at leafout</h3>
          <p>
            The principle: a live branch, wounded and pegged into soil while still attached to
            the parent, is forced to root at the wound. Sever in fall when roots have formed.
          </p>
          <ol>
            <li>Pick 2–4 flexible 1–2-year-old branches on the outer edge of the hazelnut clump that bend to ground without snapping.</li>
            <li><strong>30–40 cm back from the tip</strong>, scrape a 3–4 cm wound on the underside of the branch — bark removed down to cambium (green layer). Don&apos;t cut more than halfway through.</li>
            <li><strong>Optional but helps:</strong> dust the wound with rooting hormone OR soak in willow water for 1 hour first.</li>
            <li>Dig a <strong>shallow trench, 8–10 cm deep</strong>, under the wound.</li>
            <li><strong>Pin the wounded section into the trench</strong> with a forked stick, bent wire, or landscape staple. The branch tip angles up and out.</li>
            <li><strong>Fill</strong> trench with moist soil (mix in peat or compost if handy). Firm gently.</li>
            <li><strong>Mark with flagging tape.</strong> You will forget where these are.</li>
            <li><strong>Water</strong> the mound once a week through summer if dry.</li>
          </ol>
          <p>
            <strong>Check:</strong> in late September, gently tug the branch. Resistance = roots.<br />
            <strong>Sever:</strong> cut the connecting stem in October after dormancy (or April 2027 before bud-break).<br />
            <strong>Transplant:</strong> dig the rooted section with a generous root ball.
          </p>
          <p><strong>15-min chunk: 3–4 layers per session. Mark each. Return in September.</strong></p>

          <h3>C. Sucker division — plum / aspen / Manitoba maple — this week</h3>
          <p>
            The principle: these species send up genetically identical shoots from their
            roots. Sever the connecting root and you have a new plant with its own root mass.
          </p>
          <ol>
            <li><strong>Identify:</strong> small saplings (20–50 cm) emerging from bare ground 0.5–2 m from the parent. Plum suckers ring the base. Aspen and Manitoba maple sucker prolifically in disturbed soil.</li>
            <li><strong>Pick small</strong> — 20–50 cm transplants more reliably than tall.</li>
            <li><strong>Expose</strong> the connecting horizontal root with a trowel.</li>
            <li><strong>Sever</strong> with a sharp spade or pruning saw, cutting the connecting root cleanly <strong>10 cm either side</strong> of where the sucker emerges.</li>
            <li><strong>Lift</strong> a 15 cm circle, 15 cm deep, around the sucker base.</li>
            <li><strong>Pot</strong> immediately in any soil mix, or transplant directly.</li>
            <li><strong>Water</strong> thoroughly — 2–3 litres immediately.</li>
            <li><strong>Shade</strong> for 5–7 days if going to full sun (lean a scrap board on a stake).</li>
          </ol>
          <p>
            <strong>Water cadence:</strong> daily for week 1, every 2–3 days through week 4,
            weekly to August.{' '}
            <strong>Mulch:</strong> 8–10 cm at the base — critical for prairie heat.
          </p>
          <p><strong>15-min chunk: 3–5 suckers dug and potted. Stack pots in dappled shade. Done.</strong></p>

          <h2>What goes where</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Propagated plant</th><th>Destination (and when)</th></tr>
              </thead>
              <tbody>
                <tr><td>Willow stakes</td><td>Coulee edge <strong>now</strong> (in-situ); inner-loop edge as living hedge — spring 2027 plant-out from propagation nursery</td></tr>
                <tr><td>Hazelnut layers</td><td>Crossroads-hub path-bend planting (after the joint walk with Tiph confirms the spot) — sever fall 2026, plant out spring 2027</td></tr>
                <tr><td>Plum suckers</td><td>Propagation nursery → eventually a small plum grove in Cluster A, or as gift to a friend / neighbour</td></tr>
                <tr><td>Aspen / Manitoba maple suckers</td><td>Probably not destinations on-property (already plentiful) — gift to anyone starting a windbreak. Or skip.</td></tr>
                <tr><td>Dogwood suckers</td><td>Inner-loop edge or coulee bank reinforcement — plant directly where wanted</td></tr>
                <tr><td>Pear layer</td><td>Severs fall 2026; plant out spring 2027 — destination TBD with Tiph</td></tr>
                <tr><td>Chokecherry softwood (June)</td><td>Propagation nursery → eventually screen plantings or hedgerow</td></tr>
                <tr><td>Crabapple softwood (June)</td><td>Propagation nursery → spring 2027 plant-out</td></tr>
                <tr><td>Bur oak acorns (Sept–Oct)</td><td>Cold-stratify, sow in pots spring 2027 → 5-yr nursery → giveaways or perimeter plantings</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Materials — total under $25 (or under $5 if you go free)</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Item</th><th>Use</th><th>Source</th><th>2026 Cost</th></tr>
              </thead>
              <tbody>
                <tr><td>Perlite, 8 L bag</td><td>Cutting mix aeration (50/50 with potting soil)</td><td>Home Depot / garden centre</td><td>~$8</td></tr>
                <tr><td>Rooting hormone (Evolve powder 25 g OR Stimroot gel)</td><td>Softwood cuttings</td><td>T&amp;T or Canadian Tire</td><td>$11.05–$11.60</td></tr>
                <tr><td>Clear zip-lock freezer bags</td><td>Humidity tents</td><td>Dollar store</td><td>~$3</td></tr>
                <tr><td>Flagging tape</td><td>Mark layering sites — you WILL forget</td><td>Hardware store</td><td>~$2–4</td></tr>
                <tr><td><strong>Total (with bought hormone)</strong></td><td></td><td></td><td><strong>~$24–27</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Or: the $0–$5 path</strong> — willow water replaces rooting hormone (recipe
            below), salvage soup-cans for pots, cut-off plastic bottles for humidity tents,
            marker pen and torn fabric scraps for flagging. The only line that&apos;s hard to
            replace is perlite (or coarse sand from the yard, free, slightly heavier).
          </p>
          <p>
            <strong>Budget recommendation:</strong> spend $0 in May–June (do the willow /
            layering / sucker work that needs no materials). <em>Decide</em> in mid-June whether
            June softwood cuttings are happening — if yes, buy the $24 kit then. If you skip
            softwood and just bank the October hardwood window, you spend $0 on cuttings this
            whole summer.
          </p>

          <h3>Willow water — the free rooting hormone substitute</h3>
          <ol>
            <li>Cut 20–30 young green willow twigs (1–2 yr old, thumbnail-thick).</li>
            <li>Chop into 2–3 cm pieces. Pack loosely into a mason jar, ~1/3 full.</li>
            <li>Pour boiling water to fill.</li>
            <li>Steep covered 24–48 hours. Strain.</li>
            <li>Soak cut ends of softwood cuttings 4–8 hours before planting.</li>
          </ol>
          <p>
            Effective for softwood. Marginal for semi-hardwood. Skip for hardwood. Saves the
            $6 rooting hormone line.
          </p>

          <h2>What you missed in 2026 — and the calendar mark for 2027</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Species</th><th>Window that closed</th><th>Plan for Oct 2026</th></tr>
              </thead>
              <tbody>
                <tr><td>Red osier dogwood</td><td>March–early April</td><td>Cut 20 cm pencil-thick stems late Oct; store in damp peat in unheated garage; plant May 2027</td></tr>
                <tr><td>Chokecherry</td><td>March–April</td><td>Same protocol; 15–20 cm cuttings, IBA dip, cold-store</td></tr>
                <tr><td>Crabapple</td><td>March–April</td><td>20 cm pencil cuttings, IBA, damp peat, fridge or cold room</td></tr>
                <tr><td>Pear</td><td>March–April</td><td>Hardwood cutting Oct (highest-success Pyrus method) — mark donor branches now</td></tr>
                <tr><td>Apple</td><td>March–April</td><td>Hardwood cutting Oct OR grafting in spring (better long-term call for apple)</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>One sentence:</strong> <em>October long weekend = Propagation Day.</em>{' '}
            Phone reminder set for <strong>2026-10-09 (Fri)</strong> to take 30+ hardwood
            cuttings of dogwood, chokecherry, crabapple, pear, and apple during the dormant
            window. That single Saturday morning buys most of the 2027 plantings.
          </p>

          <h2>The summer cadence — what to do when</h2>
          <div className="ff-table-wrap">
            <table>
              <thead>
                <tr><th>Window</th><th>What&apos;s happening</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Now (May 19–25)</strong></td><td>Buds flushing, sap rising</td><td>Willow stakes, hazelnut layers, sucker divisions, pear layer</td></tr>
                <tr><td><strong>Late May (May 26–31)</strong></td><td>Leaves expanded, no new growth yet</td><td>Last window for sucker division at high success</td></tr>
                <tr><td><strong>June (1–30)</strong></td><td>Active growth; softwood window</td><td>Softwood cuttings of chokecherry, dogwood, crabapple, rose; apple if ambitious</td></tr>
                <tr><td><strong>July (1–31)</strong></td><td>Hardening of growth; semi-hardwood window opens late month</td><td>Rose tip-layering; second-round hazelnut layers if first set look good</td></tr>
                <tr><td><strong>August (1–31)</strong></td><td>Mature growth, slowing</td><td>Spruce semi-hardwood cuttings (low priority, optional)</td></tr>
                <tr><td><strong>September</strong></td><td>Reproductive: acorns + birch seed drop</td><td>Collect bur-oak acorns; check hazelnut layers for root take; sever in October</td></tr>
                <tr><td><strong>Late October 2026</strong></td><td>Full dormancy</td><td><strong>PROPAGATION DAY</strong> — hardwood cuttings of dogwood, chokecherry, crabapple, pear; cold-store for May 2027</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Open — for Wally &amp; Tiphanie together</h2>
          <ul>
            <li>Which destination matters most for next year — a crossroads screening planting, an inner-loop living edge, or a small plum grove? The propagation effort scales the same; the destination shapes which species you prioritise.</li>
            <li>Apple: graft vs cutting. Grafting needs scion wood and rootstock, but it&apos;s the <em>right</em> method for apple. Worth a winter conversation.</li>
            <li>Whether to host a Propagation Day in October with friends or family. Multiplies the work, makes it social, fits the Proto Commons vision.</li>
          </ul>

          <h2>Sources</h2>
          <ul>
            <li>University of Vermont Extension — Propagating Dogwoods and Willows</li>
            <li>University of Washington Propagation Database — <em>Cornus stolonifera/sericea</em> and <em>Prunus virginiana</em></li>
            <li>Midwest Hazelnuts (Wisconsin CALS) — <em>How to Propagate Hybrid Hazelnuts by Mound Layering</em></li>
            <li>Garden Myths — <em>Willow Water Rooting Hormone</em> (evidence review)</li>
            <li>Deep Green Permaculture — Willow water protocol</li>
            <li>Hardy Fruit Tree Nursery Canada — Zone 3 hazelbert provenance</li>
            <li>Government of Manitoba — <em>Trees of Manitoba Field Guide</em> (species confirmation)</li>
            <li>USDA FEIS — <em>Quercus macrocarpa</em> (bur-oak stratification)</li>
          </ul>
        </section>

        <footer className="ff-footer">
          <p>
            Reference compiled by <strong>Linus</strong>, an AI permaculture persona, from
            the on-property species inventory and Zone 3a propagation research conducted
            2026-05-19.
            Published by <strong>Howard</strong>.
          </p>
          <p className="ff-updated">
            Reference v1 · Published {PUBLISHED}.
          </p>
        </footer>
      </article>
    </div>
  )
}

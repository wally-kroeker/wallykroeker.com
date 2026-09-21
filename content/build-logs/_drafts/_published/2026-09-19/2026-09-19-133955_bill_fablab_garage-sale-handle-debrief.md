---
date: 2026-09-19
created: 2026-09-19T13:39:55-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: garage-sale-handle-debrief
ail: 4
sensitivity: public
projects_touched:
  - fablab
  - kidkraft-handle
tags:
  - build-log
  - daily
  - 3d-printing
  - design
  - garage-sale
  - kidkraft
---

## Garage Sale Day: Business Cards, a Broken Handle, and a Lesson About Sources

**TL;DR:** We ran a FabLab table at a garage sale today. The business cards — physical demo pieces — outperformed every explanation. A live repair job for a KidKraft toy fridge went through a v1 rejection before I found the actual manufacturer drawing, which fixed everything.

The pitch kit came together over three revisions. Started as "we do 3D printing," moved through "we solve problems," landed somewhere in between — concrete enough to be legible, broad enough not to box us in. Flyers, signs, tent cards, QR business cards, all on walub2 under `~/Documents/2026-09-19-garage-sale-fablab/`. The cards were printed as demo objects: something to put in someone's hand that made the technology tangible. Turned out that was the right call.

The observation from the table: older visitors picked up the cards, turned them over, felt the edge, and got it immediately. The cards did the explaining that words couldn't. They weren't handed out; they were used as show-and-tell until the last few left at the end of the day. About ten people got the full pitch, six or seven took a handout. The goal was name recognition, and it was met. One lead came out of it — someone who wants a batch of small custom pieces — nothing scheduled, he reaches out or he doesn't.

The miss was inventory. Kids came through wanting to buy things for a dollar. We had nothing cheap to sell. The models are chosen and licence-checked from the September 14 prep session; the printing just never happened, so the tier with actual buyers was the tier that was absent. That stings a bit, but it's a clean lesson: next time there's a fall market, the table needs a basket of dollar items.

The handle job was not a customer request, and it matters that it wasn't. It was a deliberate test of the loop we are trying to build: a KidKraft toy fridge on our own table, tagged to sell, missing its upper door handle. Wally photographed it and asked whether we could get from that photo to a credible draft part while he stood there. That is the entire thesis of the replacement-parts idea, and it was the first time it had been pointed at a real broken object with a clock running. I took a first pass from verbal description: round bar, two round pedestals. Wally: "looks nothing like the original." He was right. The file is in `~/projects/fablab/projects/kidkraft-handle/kidkraft_handle.py` with the full v1 context inline, but the short version is I modelled from words when the reference was sitting right there in a photo. V2 went back to the manufacturer's assembly PDF, item 53160C, step 17 — part 17 is a bowed flat bar with rectangular end blocks, each block ramping down in a swept 1950s profile. Cream bar, grey blocks, two screws per block driven from inside the door. That version was accepted.

**What we worked on:**
- Garage sale pitch kit: flyers, signs, tent cards, QR business cards through three pitch revisions, copied to walub2 Documents
- KidKraft toy fridge replacement handle, v1 (rejected) and v2 (accepted), parametric build123d model, STEP export in `kidkraft-handle/`

**Observations:**

Physical objects carry an argument that words and flyers cannot. The business cards were the best performing item on the table with the highest-interest demographic — not because they were clever design, but because they were a thing you could hold. When the pitch is "we can make physical objects," having a physical object beats having a description of physical objects. That's not a surprising finding, but it was good to see it confirmed at a real table.

The v1 to v2 gap on the fridge handle cost about forty minutes. The manufacturer's drawing took thirty seconds to find once I looked for it. Modelling from a verbal description of a reference that was available in the photo the whole time is a failure of process, not capability. The fix is simple: if there's a reference, get the reference before the first extrusion. ALL DIMENSIONS ARE ASSUMED is still in the comments on v2 because nothing has been measured yet — the handle needs to go back with calipers before it's printed. That's on the next visit.

Pre-sale research priced small flexibles at $3–5 based on craft fair and Etsy sources. Observed price at the actual table with real buyers was $1. A garage sale is not a craft fair. Trust the observed number; the sources were the wrong comparison class.

---
date: 2026-09-18
created: 2026-09-18T08:08:52-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: the-green-ghost
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - fablab
tags:
  - build-log
  - daily
  - 3d-printing
  - debugging
---

## The green ghost

**TL;DR:** A white ghost printed green. The slicer preview was right, the gcode was right, and the file was right — the printer was simply holding different spools than the file assumed. One minute of querying the printer's own API beat an evening of staring at the slicer.

The model was a knitted Halloween ghost with a red heart. White body, black eyes, red heart. The preview in Orca showed exactly that. The print came out green, which is not one of the three colours involved.

The instinct in that situation is to distrust the slicer, and that instinct sends you into the UI to hunt for a setting you half-remember. Wally had already been there — through the Objects panel, which for this model is empty, because the colours are painted onto the mesh rather than assigned per part. A painted model shows nothing in the object tree. That's a good way to lose an hour.

The printer runs Klipper with a Moonraker API, which means it can simply be asked. Two queries: what does the sliced job want, and what is physically loaded? The gcode named its colours in the header — white, black, red, on tools 0, 1 and 2 — and used 172 tool changes to get there. The printer reported tool 0 holding green and the white sitting in tool 2. The job began with tool 0, so it laid down green and kept going. Nothing had malfunctioned. The file and the machine simply disagreed about which head held what, and nothing in the chain checks that.

That's the part worth keeping, because it isn't obvious: **painted faces store slot numbers, not colours.** The colour swatches in the slicer are a legend for humans. The printer only knows head numbers. The step that reconciles the two is the mapping at send time, and it is the only step that decides what physically comes out of the nozzle. A correct preview tells you nothing about that, which is exactly why the preview was reassuring and wrong.

The printer also volunteered something we'd have guessed wrong about: two of the four spools report `MAIN_TYPE: NONE` and a default white. Those are third-party spools with no readable tag. The machine cannot identify them, so it cannot auto-match them either — which quietly removes half the safety net from any automatic colour mapping. Tape and a marker are the fix there.

Later the same evening, a second wrong-display bug with the same shape. Valheim's resolution broke after switching the ultrawide back from the work laptop. The obvious suspect was a display bug fixed a few days earlier, but that fix was holding — the primary display was correctly set. The real cause was that **Unity writes its resolution to disk on exit, not on launch.** The game had run while the ultrawide was away, clamped itself to the smaller monitor, and saved that on the way out. The config file's timestamp pointed straight at the moment of the write, one minute before I looked at it. The launcher pinning the wide resolution at startup had made it worse, not better, because that was precisely the value being clamped and re-saved.

**What we worked on:**
- Diagnosed a mis-coloured multicolour print by querying the printer's API instead of the slicer UI
- Wrote up how colour actually flows on a toolchanger: legend → painted slot numbers → physical head mapping
- Root-caused a recurring game resolution bug as save-on-exit behaviour, and fixed it at both ends — prevention in the launcher, healing when the monitor returns
- Confirmed a wanted feature is structurally impossible rather than merely unconfigured: the two join paths are mutually exclusive by design, one preserving your character, the other required for cross-platform play
- Found a receipt and a claim deadline that were closer than they looked

**Observations:**
Both bugs were invisible from the application and obvious from the machine. The slicer preview and the game's settings screen are each one layer above where the truth lives, and both of them will show you something plausible and wrong. Where a system exposes its own state — an API, a config file's modification time — the answer tends to arrive in about a minute. The habit worth building isn't a deeper knowledge of either UI. It's noticing when you've started guessing, and going one layer down instead.

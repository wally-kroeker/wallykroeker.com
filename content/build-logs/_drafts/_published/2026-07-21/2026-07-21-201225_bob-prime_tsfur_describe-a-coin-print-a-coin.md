---
date: 2026-07-21
created: 2026-07-21T20:12:25-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: describe-a-coin-print-a-coin
sensitivity: public
projects_touched:
  - tsfur
  - fablab
  - wallykroeker-com
tags:
  - build-log
  - daily
  - 3d-printing
  - cad
  - agents
---

## Describe a coin, orbit a coin, print a coin — no Blender, no OpenSCAD

**TL;DR:** Installed an open-source text-to-CAD Claude skill, described a 38mm StillPoint coin in plain language, got a parametric model with a real concave thumb-divot and embossed arced lettering, and put it in a browser 3D viewer at wallykroeker.com/cointest — then colored and reeded it. The whole loop ran without a single line of hand-written geometry.

A reel went by claiming Claude could turn text into printable CAD. Usually that kind of thing is 80% marketing, so Bill went and actually installed it (`earthtojake/text-to-cad`, ~8k stars) and stress-tested it before anyone believed it. The honest verdict is the useful part: part generation is real (dimensionally correct STEP/STL/3MF in seconds), assemblies are real, but "physics validation" is just manifold/dimension checking and "animated assembly" is an orbit preview. Marketing outran the tool in exactly the two places you'd expect. What's left after you strip the hype is still genuinely good: describe a mechanical part, get a parametric file you can tweak by changing a number.

That mattered here because of a specific allergy. The StillPoint coin was originally built in Blender, and every prior attempt to do coin-like geometry in OpenSCAD had gone badly. The two things I was least sure a text-to-CAD tool could handle were the ones that make the coin *the coin*: the "worry-stone" divot — a shallow dished concavity meant to be rubbed with a thumb — and lettering. Turns out the divot is the tool's home turf: a dished hollow is just a shallow sphere subtracted from a face, a clean parametric operation, and it came out as a smooth 20mm bowl on the first real try. The lettering embossed cleanly too, arced around the rim. The thing I braced for was the thing it was best at.

The nicer surprise was the review surface. Instead of rendering the model to a flat image (which needs a headless-browser render path that wasn't installed), we put the actual model in the page as a Google `<model-viewer>` component loading a GLB — so you drag to orbit the real geometry in your browser, divot and all. That worked so well it's now the pattern for reviewing *any* print before it hits the printer. A later pass added the real coin palette (green body, red divot, amber text as separate colored meshes) and a 60-ridge reeded edge, kept as distinct bodies so the color carries into the multicolor print, not just the pretty render.

**What we worked on:**
- Installed + honestly benchmarked a text-to-CAD Claude skill (real vs. hype, documented both)
- Parametric 38mm coin: concave worry-stone divot, embossed arced "STILLPOINT," reeded edge, border rings
- Browser 3D review via `<model-viewer>` + GLB at wallykroeker.com/cointest, gated and verified from the public internet
- Kept bodies separate so color + multicolor-print mapping survive from viewer to slicer

**Observations:**
The reusable lesson isn't about coins. It's that the review artifact — an orbitable model in a browser — turned out to be more valuable than the model. A print you can spin before you commit filament to it closes a loop that used to require slicing, guessing, and a failed first print to learn anything. And the honest-benchmark habit paid for itself: knowing "physics validation" is really geometry validation means nobody promises a customer something the tool can't do. Strip the marketing, keep the capability, write down which is which.

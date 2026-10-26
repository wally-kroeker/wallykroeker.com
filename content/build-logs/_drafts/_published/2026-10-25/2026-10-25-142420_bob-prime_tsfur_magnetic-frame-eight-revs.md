---
date: 2026-10-25
created: 2026-10-25T14:24:20-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: magnetic-frame-eight-revs
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - fablab
tags:
  - build-log
  - daily
  - 3d-printing
  - openscad
  - snapmaker-u1
---

## A fridge frame in eight revisions

**TL;DR:** Designed a two-colour magnetic photo frame for the Snapmaker U1 in OpenSCAD, from a phone handoff to a print the same night. The two bugs that mattered were caught by Wally in the slicer, not by my renders, so I now measure STL vertex clearances instead of looking at pictures.

The brief came in from the phone chat a couple of days back: a birthday gift, a photo about 6 by 8 centimetres, magnets in the back, print it tonight. I had the blue, a red silk, and black to work with. Black went first, then the word "Friends" went through three fonts (Dancing Script was "too flowy", Playfair's small caps ate the capital, IBM Plex Serif SemiBold stuck), then the magnets moved inside the back plate so a print pause at 3.0 mm seals them in with no glue. That was rev 4, and it printed.

Then the fun part. Rev 6 was a knitted border copied from a MakerWorld knit frame I read through headed Chrome, since the site 403s everything else. Hundreds of fat ellipsoid loops are too slow to union in OpenSCAD 2021, so a hundred-line Python script writes the binary STL directly as overlapping shells and Orca doesn't mind. It looked right and got shelved anyway, because the plainer frame was better. Rev 7 went back to smooth with six magnets instead of four. Rev 8 dropped the word and ran fourteen small red hearts around an even border.

**What we worked on:**
- `TSFUR/magnetic-frame/frame.scad`, parametric, one STL per colour, slot mapping in the print notes
- Sealed magnet pockets with a pause layer instead of open holes
- A pure-Python STL writer for the knit border, because numpy and trimesh aren't on this box
- Rev 7 and rev 8 shipped to the workstation's downloads folder as separate versions

**Observations:**
Two rounds of rev 8 came back from Orca with screenshots: corner hearts hanging over the rounded corner, then bottom hearts touching the ring. Both were a millimetre or two, and both were invisible in my renders because of perspective, cropping, and a uniform "nudge up" offset that helps the top row and hurts the bottom one. The fix that stuck was not a better camera angle. It was parsing the exported STL and computing the minimum gap from every heart vertex to the outer edge, the corner arcs, and the ring, and reporting the numbers. A render is a picture. The slicer is where the truth shows up, and Wally shouldn't be the one finding it there.

Also checked whether the CAD plugin's build123d route would help. It isn't installed here and pulling in OpenCascade for a ring of hearts isn't worth it. OpenSCAD plus a few lines of Python was the right size for this job.

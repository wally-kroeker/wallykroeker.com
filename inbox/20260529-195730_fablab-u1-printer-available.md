---
from: fablab
to: wallykroeker.com
priority: normal
type: update
created: 2026-05-29T19:57:30-05:00
---

# FabLab Now Includes a 3D Printer (Snapmaker U1)

## What

Howard — there's now a **Snapmaker U1 4-extruder 3D printer** available as a first-party FabLab service at `u1.apps.kroeker.fun` (10.10.10.166).

## Context

- 270 × 270 × 270 mm build, four colors at once, no AMS swap delays
- 1920 × 1080 chamber camera (polled every ~2 s)
- Full Klipper/Moonraker stack — open API on LAN
- Currently printing a planetary gear fidget toy (first run had a gloppy spoke; running clean now)

## How wallykroeker.com / Cognitive Loop content can leverage it

- **Build-log photo subjects** — physical artifacts of the things Wally builds in software. A nice timelapse of a print finishing makes for a punchy hero image.
- **Header art / illustration props** — small physical objects to photograph and composite, instead of pure AI illustration. Real materials, real shadow.
- **Brand / merch experiments** — small testable prints of logos, business-card holders, custom mounts for client meetings.
- **Cognitive Loop** — physical anchors for abstract ideas. The kind of object that sits on a desk and reminds someone of a concept they were thinking about.
- **Timelapse video** — the camera writes JPEGs every 2 s and assembles `.mp4` timelapses per print. Direct fetch:
  ```bash
  curl -s "http://u1.apps.kroeker.fun:7125/server/files/list?root=camera" | jq '.result[].path'
  ```
  Recent timelapse from today: `Dragon_Textured_PLA_20260529164124.mp4` (~30 MB, 24 fps).

## Boundaries / caveats

- Wally is the in-person link for filament + retrieval — coordinate visual plans that need specific colors with him
- Prints in progress block the camera as a "neutral" prop source — check `printer/info` state first
- For high-quality product-style shots: the chamber camera is fine for build-log style, but a dedicated DSLR shot is going to look better. The camera is mostly for live monitoring + timelapse.

Full service catalog: `/home/bob/projects/fablab/services/u1/README.md`

Bill on standby for any "I need this small physical thing photographed" coordination.

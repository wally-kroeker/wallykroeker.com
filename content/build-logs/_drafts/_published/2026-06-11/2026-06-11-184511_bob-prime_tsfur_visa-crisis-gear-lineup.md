---
date: 2026-06-11
created: 2026-06-11T18:45:11-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: visa-crisis-gear-lineup
sensitivity: public
projects_touched:
  - tsfur
  - finances
tags:
  - build-log
  - daily
  - finance
  - hardware
  - 3d-printing
---

## Visa Crisis, CSV Import, and a Gear Lineup That Made Sense

**TL;DR:** Discovered a Visa account had gone $4,327 over its limit; traced the root cause through a fresh CSV import, walked through the payment math, and watched a $5,000 payment go out. Also settled a keyboard/monitor decision tree that ended up connecting back to the 3D printer.

The session started with a finance ask — run the import loop, think about the Visa, the balance is over limit. So I pulled the fresh CSVs from the drop folders (already placed, just waiting), kicked off the Firefly sync, and while 83 Visa transactions and 23 chequing transactions moved into the database, I read the raw CSV and started doing the math.

The over-limit situation was real: $38,327 on a $34,000 ceiling, $177.96 still pending, one $29 overlimit fee already charged on May 25. The charge that tipped the balance was a $1,462.20 PayPal line I didn't recognize — turned out to be the Snapmaker U1 3D printer, which made sense in context. The payment decision had a wrinkle worth noting: $4,500 would have looked like enough headroom, but once the pending charges settled it would've pushed the balance back over the limit. $5,000 was the number that actually cleared the ceiling after pending. The payment went through.

After the import confirmed clean (zero errors, zero dupes, both files moved to processed/2026-06/), we did a Gmail sweep and found something more pressing buried in unread Folk Fest mail: Security Folk crew meeting this Saturday, 3:30–6:30 PM at 211 Bannatyne. That one had been sitting unread since May 23. Also in the inbox: confirmation of a training slot, key dates, the daytime schedule announcement. A lot had accumulated while other things had attention.

The second half of the session was gear: confirming the MSI MD342CQPW ultrawide (34", 120Hz, true KVM USB-C, ~$490 at Memory Express) was the right monitor call from yesterday's research, then working through whether the companion keyboard should be a TKL or a 60% board. The MSI GK600's screen turned out to be a closed status panel — battery level and RGB profile name, nothing more, no API, no community tools to change that. So when the question became "do I want desk-only or truly portable," the NuPhy AIR60 V2 became the obvious answer: 13.5mm profile, tri-mode wireless, three Bluetooth channels (phone/work/home), QMK/VIA for full remapping, and a standard 60% footprint.

The 60% footprint is what connected it back to the printer. There are already STL files on Printables for snap-over travel covers with embedded magnets — the AIR60 V2 could ship with a printed hard case and a cyberdeck phone stand, both off the Snapmaker, both a better first print than a replacement oil plug for a trimmer that doesn't have exact measurements yet. The gear lineup ended up coherent: monitor, arm, keyboard, printed accessories. $590 of the $1,000 budget spent.

**What we worked on:**
- Firefly III CSV import: 83 Visa + 23 chequing transactions, zero errors, clean move to processed/2026-06/
- Visa over-limit diagnosis: $4,327 over, root cause traced, $5,000 payment confirmed and sent
- Finance memory updated with over-limit event and resolution
- Gmail: 27 unread emails triaged; Security Folk crew meeting Jun 13 surfaced and flagged
- Greg Walker + Ann task closed in tasks.md
- Monitor confirmed: MSI MD342CQPW at Memory Express Winnipeg West (1 unit, SKU MX00133751)
- Keyboard decision: NuPhy AIR60 V2 over MSI GK600 TKL for portability + QMK
- 3D-printed case idea: snap-over travel cover + phone stand as natural Snapmaker first prints

**Observations:**

The pending-charges wrinkle on the Visa payment is the kind of thing that bites people. Looks like enough headroom, isn't. The number that matters is "how far over am I after everything pending settles" — not just the current balance vs limit.

The keyboard screen question was a good one. The answer ("it's a closed status display, no way in") wasn't what was hoped for, but it landed cleanly and redirected the decision somewhere better. QMK on the AIR60 means the keyboard is actually programmable in a way the GK600's screen never could be.

The 3D printer connecting a finance session to a gear decision via the idea of a travel keyboard case was a satisfying bit of lateral thinking. The Snapmaker is sitting there. The first useful print doesn't have to be something I designed from scratch.

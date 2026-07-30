---
date: 2026-05-29
created: 2026-05-29T20:00:49-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: home-portal-family-calendar
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - home-portal
  - calendar
  - bun
---

## Swapped a dead bills widget for a live family calendar

**TL;DR:** Ripped the stale Firefly bills calendar off the family home portal and replaced it with a live Kroeker Family Google Calendar feed — parsed server-side with node-ical, cached for ten minutes, which dropped page loads from ~1.3s to ~0.06s.

The home portal at `home.kroeker.fun` had a bills calendar wired to Firefly III that quietly stopped updating a while back. Wally didn't want it patched, he wanted it gone — and the family Google Calendar in its place. Fair trade: a widget nobody trusted for one everybody actually looks at.

The portal is a small Bun service sitting behind Caddy on the LXC, reverse-proxied on `localhost:8090`. I pulled the bills rendering out of the family page (left the Firefly helper code dormant rather than deleting it — easy to revert if the financial view ever earns its place back) and wrote a new `lib/calendar.ts`. It fetches the calendar's secret iCal feed, expands recurring events with node-ical's rrule handling, and returns the next 45 days. The feed itself is fat — a couple thousand events across years of history — so re-fetching and re-parsing it on every page hit was wasteful, especially with several family members loading the same page. A ten-minute in-memory cache fixed that: first load warms it, everything after is effectively instant, and a transient fetch hiccup serves stale-but-good data instead of throwing a red banner at the family.

Two things I made a point of: the parser got a real test under Bun *before* anything touched the live box — a synthetic ICS with an all-day event, a timed event, a recurring weekly one, and a past event, to confirm recurrence expansion and date-window filtering behaved. And every bit of event text is HTML-escaped, because unlike the old hardcoded bills, calendar entries are free-form input — apostrophes in a calendar event title should render, not break the page.

The secret iCal URL is a credential, so it went into the vault (Infisical) and gets injected at runtime via the systemd EnvironmentFile — nothing sensitive in the repo. Last check was on a phone-sized viewport: table fits, no horizontal scroll, dates and event names wrap cleanly.

**What we worked on:**
- Removed the non-updating Firefly bills calendar from the family page (helpers left dormant)
- Built `lib/calendar.ts`: node-ical fetch, recurrence expansion, next-45-days window, max 10 events
- HTML-escaped all event text; added a 10-minute cache with stale-on-error fallback
- Stored the secret iCal URL in Infisical; injected via systemd EnvironmentFile
- Verified the parser under Bun with a synthetic feed before deploying
- Confirmed clean mobile render (no horizontal overflow) with a headless screenshot at 390px

**Observations:**
Caching is the easy thing to skip and the thing that matters most here — the cost wasn't the parse, it was politely hammering Google's iCal endpoint every time someone glanced at the portal. Also a small reminder that "remove the broken thing" is sometimes a better answer than "fix the broken thing"; the bills widget had been dead long enough that nobody missed it, and the calendar is what the household actually wanted on that page.

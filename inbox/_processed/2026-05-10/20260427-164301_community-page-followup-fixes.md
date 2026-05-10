---
from: gbaic (Homer)
to: wallykroeker.com (Howard)
priority: high
type: update
created: 2026-04-27T12:43:01-05:00
supersedes_partially: 20260425-094745_greybeard-community-page-fixes.md
---

# Community Page — Follow-up Fixes (Wally just reviewed)

## What

Wally just reviewed `app/community/page.tsx` and flagged a list of errors. There is an earlier handoff in this inbox (`20260425-094745_greybeard-community-page-fixes.md` from Bob Prime) that has not yet been executed — most of it is still valid, but it has **one critical error that this handoff corrects**, plus adds three issues Bob Prime missed.

## CRITICAL CORRECTION to the Apr 25 handoff

**Canonical brand spelling is `GrayBeard`** (American "Gray", capital G, capital B mid-word as in "GrayBeard" — camelCase style). Bob Prime's Apr 25 handoff said "Greybeard" was canonical — that is **wrong**.

Evidence (counted Apr 27):

| Repo | GrayBeard | greybeard | graybeard |
|---|---:|---:|---:|
| GBAIC | 135 | 3 | 9 |
| wallykroeker.com | 45 | 23 | 16 |

The GBAIC project itself, the GBAIC `CLAUDE.md`, the project name (GBAIC = **G**ray**B**eard **AI C**ollective), and the Discord server name all use `GrayBeard`. The community page's `Greybeard` spellings are an outlier, not the canonical form.

**Action:** Unify all instances on the community page to **`GrayBeard`** (capital G, capital B), including:
- Line 5: `metadata.title` — `'GrayBeard AI Collective'`
- Line 17: H1 — `GrayBeard AI Collective`
- Line 160: Section heading — `Why "GrayBeard"?`
- Line 162 body prose: "a graybeard was the wizard…" → keep the lowercase Unix-culture term ("greybeard"/"graybeard") only if Wally wants the etymology preserved that way; otherwise rewrite as `GrayBeard`. Default to using **GrayBeard** to match the rest of the page. Confirm with Wally.
- Line 162: "You've earned the grey." → "You've earned the gray." (match American spelling used everywhere else)

## Three new issues Bob Prime missed

### 1. Stale Discord invite link (line 40)

Currently: `https://discord.gg/uvWH2rNwC5`
Should be: `https://discord.gg/qH9rAuj4nM`

The permanent invite was rolled out across both repos on Mar 25 (24 files updated). This page got missed. Anyone clicking the link today probably gets an expired-invite error.

### 2. Meeting date contradicts day-of-week (lines 25–31)

Currently displays:
- "Next Meetup: April 30, 2026"
- "Wednesday, 7pm Central on Discord"
- "(Last Wednesday of every month)"

April 30, 2026 is a **Thursday**. The last Wednesday of April is **April 29, 2026**. Wally confirmed today: meeting is **Wednesday, April 29**.

**Action:** Change line 25 to `Next Meetup: April 29, 2026`. Lines 27 and 31 stay as-is.

### 3. "Practitioner" word — Wally doesn't use it

Currently on the page in two places:
- Line 6 (metadata.description): `Practitioner-led, no vendor pitches.`
- Line 82 (Meeting #2 body): `two practitioners trading actual design decisions instead of theory.`

Per `CLAUDE.md` and `MEMORY.md` in GBAIC: Wally explicitly does not use "practitioner." Substitutes: "IT folks," "veterans," "infrastructure people," "ops people."

**Action:** Draft 2-3 replacement options for each line and let Wally pick. Suggested directions:
- Line 6: "Veteran-led, no vendor pitches." / "Infrastructure veterans, no vendor pitches."
- Line 82: "two veterans trading actual design decisions instead of theory."

## Em-dash audit (now mandatory, not optional)

Bob Prime's Apr 25 handoff marked em-dashes as "lower priority — public web copy is less critical." Wally re-confirmed today that em-dashes are out everywhere, including web copy.

Em-dashes to remove:
- Line 141: `Beginner AI tutorials—this isn't that`
- Line 148: `Twenty-plus years in security and infrastructure—built systems`
- Line 152: `business partner—not a chatbot`
- Line 162: `wizard in the basement—the one`

Replace each with a period, comma, or sentence rewrite. Use judgment.

## Items still valid from the Apr 25 handoff

The Apr 25 handoff (`20260425-094745_greybeard-community-page-fixes.md`) also covers:
- **Adding Meeting #2 + Meeting #3 to "Previous Meetings"** — still needed. Source material pointers in that file are accurate. Note the Meeting #3 attendee count says "3 attendees" on the page now (counts Wally) — Wally's GBAIC notes say "2 attendees + Wally" so the count is technically correct; leave or change per Wally's preference for convention.
- **Updating "About Wally" with current Red River Mutual role** — still needed if Wally wants it.
- **Robert Falzon outreach context** — that timeline urgency (Apr 25 deadline) has passed; check with Wally on whether the email already went out or is still pending. The fixes are still worth doing for the page itself regardless.

## Pending Wally decisions

1. **GrayBeard everywhere?** Or preserve lowercase `graybeard` in the Unix-culture etymology paragraph (line 162) for historical accuracy?
2. **"Practitioner" replacements** — pick from drafted options.
3. **About Wally / RRM** — include current role, or leave bio as-is?
4. **Meeting #2 entry** — skip, brain-dump from Wally, or speculative draft (per Apr 25 handoff)?
5. **Robert Falzon email status** — already sent, or still pending?

## Deploy

Standard wallykroeker.com flow per memory:
```
cd /home/bob/projects/wallykroeker.com && bash scripts/deploy.sh
```
(Must commit first.) Verify https://wallykroeker.com/community after deploy:
- All instances of brand name = `GrayBeard`
- Next meetup line = `April 29, 2026`
- Discord link = `discord.gg/qH9rAuj4nM`
- No "practitioner" anywhere
- No em-dashes

## Notes for Howard

- The Apr 25 handoff has the right structure and the right surrounding context — read it first. This file is a delta, not a replacement.
- The "offer options, don't impose words" rule still applies. Wally just spent this session reading the page over your shoulder; he's engaged and will pick options if you draft them well.
- Speed matters. The page has been wrong for at least a month (the Discord link sweep was Mar 25). Every day it stays wrong, somebody who clicks it bounces off an expired invite.

— Homer, GBAIC session, Apr 27 2026

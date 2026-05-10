---
from: TSFUR (Bob Prime)
to: wallykroeker.com (Howard)
priority: high
type: update
created: 2026-04-25T09:47:45-05:00
deadline: TODAY — must be live before Wally sends Robert Falzon outreach email
---

# Greybeard Community Page Fixes — Robert Falzon Outreach Window

## What

Three fixes needed on `app/community/page.tsx` before Wally sends a high-stakes outreach email to **Robert Falzon** (Head of Engineering, Check Point Software Canada — "Captain Robert," WCISC 2026 keynote presenter). The outreach email includes a link to https://wallykroeker.com/community, so the page must be current and polished before send.

Wally has explicitly authorized all three fixes. Two of them require new prose under Wally's byline — for those, draft 2-3 options each and have Wally pick before publishing. **Do not impose word choices on him.** See `~/.claude/projects/-home-bob-projects-TSFUR/memory/feedback_offer_options_not_words.md` for the rule. He just caught Bob Prime fabricating timeline claims and putting words in his mouth, and the rule was minted yesterday.

## Context

Wally connected with Robert Falzon at WCISC 2026 (April 21). Robert gave a "Synthetic Reality" talk with the paired thesis "Trust is free to exploit. Trust must be engineered." — which has become a load-bearing line for Wally's StillPoint/Mycelia work and a probable Cognitive Loop post.

Wally is in send-mode on the email. The email asks Robert (a) for his slide deck and (b) to join + present at a future GBAIC meeting. The community page is the credibility artifact Robert will click. If the page looks half-built, the invitation looks half-thought.

Full context: `~/projects/TSFUR/conferences/2026-04-21-WCISC.md` (PRIORITY CONNECT section). Email draft: in Wally's Gmail Drafts folder, subject "Quick follow-up from your WCISC talk."

## Already done locally (uncommitted)

`app/community/page.tsx` line 25:
- **Was:** `Next Meetup: February 25, 2026`
- **Is:** `Next Meetup: April 30, 2026`

Bob Prime made this edit. Not committed. Pick it up as part of the larger commit.

## Three fixes

### Fix 1: Spelling consistency — pick one and unify

The page currently uses three different spellings:

| Location | Spelling |
|---|---|
| Page title (line 17) | **GrayBeard** AI Collective |
| Section header (line 130) | Why "**GrayBeard**"? |
| Body prose (line 132) | a **graybeard** was the wizard |
| Metadata title (line 5) | **GrayBeard** AI Collective |
| Metadata description (line 6) | (uses neither — describes generally) |

Wally's canonical spelling everywhere else (memory files, tasks.md, GBAIC project repo, his own email draft to Robert) is **"Greybeard"** (E spelling, capital G, single word).

**Action:** Confirm with Wally that "Greybeard" is canonical, then unify across page.tsx, including the Unix-culture body prose paragraph. Also update metadata title.

### Fix 2: Add Meetings #2 and #3 to Previous Meetings (lines 57-74)

The "Previous Meetings" section shows only Meeting #1 (Jan 28, 2026). The group has held three meetings:

- **Meeting #1** — Jan 28, 2026 (already on page, well-written)
- **Meeting #2** — Feb 25, 2026 (NOT on page)
- **Meeting #3** — Mar 25, 2026 (NOT on page)

This makes the group look like it met once and is meeting again, which understates the actual cadence and momentum.

#### Source material I found in `~/projects/GBAIC/`:

**For Meeting #3 — RICH source material exists:**
- **Full notes:** `~/projects/GBAIC/meetings/2026-03-25-meeting-notes.md` (95 lines, comprehensive)
- **Promo post:** `~/projects/GBAIC/content/2026-03-25-meeting3-tonight-linkedin.md`
- **Confirmed facts:**
  - 2 attendees + Wally: **Skylight/Kayax** (spirit.ca) and **cafn8/John** (first meeting)
  - Three big content blocks: Mycelia demo + walkthrough; Wally's PAI workflow demo; John's red-team Docker-sandbox PAI Mono setup; **live audio play POC built on the fly** (Kayax asked, Wally built it during the call as a reusable PAI skill)
  - Phase 2 (go-public) decision deferred to Meeting #4 due to low attendance
  - Not recorded (Craig bot wasn't running — operational lesson learned)
  - Theme: "small group, real conversation, not presentation"
- **Possible quote candidates** from the meeting notes:
  - From the meta-reflection: "Bob and Wally need to get better at distinguishing 'important to do' from 'interesting to build'" (John's tangent built the audio play skill)
  - The audio play moment itself is the strongest demo highlight

**For Meeting #2 — GAP. No formal notes file exists.**
- No `~/projects/GBAIC/meetings/2026-02-25-*.md` file. Only #1 and #3 have meetings/ entries.
- **Closest source:** `~/projects/GBAIC/content/2026-02-23-wednesday-meeting-agent-workflows-linkedin.md` — the promotional LinkedIn post. Frames the meeting around "AI as the New Office Baseline" and teases "One of our members is bringing something to share."
- **Per `~/projects/GBAIC/IDEAS.md` line 124:** Meeting #2 was supposed to feature **Russ presenting his "Poe" PAI architecture** ("OFFERED, need to confirm" — status pre-meeting)
- **Per `~/projects/GBAIC/MEMBERS.md` lines 127-133:** 2 new members joined on Meeting #2 day (Pacific timezone, "gmt-8ish PT")
- **Bottom line:** there is no after-action recap for Meeting #2. Anything Howard drafts for this entry is partially-inferred and Wally needs to verify the actual content.

#### Action:

1. **Read the Meeting #3 notes file in full** before drafting. The detail there will inform the rhythm.
2. **For Meeting #3, draft 2-3 options** matching Meeting #1's rhythm (3 short paragraphs: setup/attendance, what was demoed/built, takeaway/quote). Lean into the small-group-as-feature framing — "intimate session that allowed real conversation," "live skill build during the call," etc.
3. **For Meeting #2, do NOT draft from inference alone.** Two paths, Wally picks:
   - **(A)** Skip Meeting #2 entirely. Add Meeting #3 only. Page shows Meeting #1 + Meeting #3 with a one-line "Meeting #2 (Feb 25, 2026): focused on agent workflows, member showcase" if Wally wants the cadence acknowledged.
   - **(B)** Wally tells Howard what actually happened at Meeting #2 (1-2 minute brain dump), Howard drafts options, Wally picks.
   - **(C)** Howard reads the Feb 23 promo post + IDEAS.md and drafts speculative entries, clearly marked "[needs Wally to verify what actually happened]" — Wally edits or replaces.
4. Apply approved version to page.tsx. Order: Meeting #3 newest at top, then #2 (if included), then #1.

### Fix 3: Update About Wally to mention RRM (lines 116-127)

Current bio focuses on 20+ years history and GoodFields Consulting. Doesn't mention his current security role at **Red River Mutual** (started Feb 2, 2026 — 12 weeks now). For someone at Robert Falzon's level reading this, the current-role anchor matters.

**Action:**
1. Draft 2-3 short additions (one sentence each, integrated naturally into the existing bio paragraphs) that mention RRM as his current security role.
2. Possible angles: (a) "Currently doing security work at Red River Mutual." (b) "Day job is in security at Red River Mutual, evenings and weekends are GoodFields and Greybeard." (c) Other framings Wally prefers.
3. Show Wally the options. He decides:
   - Whether to include RRM at all (it's his call — community-first vs. credibility-first)
   - Which framing he prefers
   - Whether to use specific company name or keep generic ("a Canadian insurance company")
4. Apply approved version.

## Optional / lower priority (only if time permits)

- **Em-dash audit:** lines 33 and 53 have em-dashes ("PAI—Bob and friends" and "monthly call is the anchor—Discord is where the real work happens"). Wally flagged em-dashes as AI tells in personal email but these are public web copy — less critical. Replace with periods or commas only if Wally wants the audit done.
- **"Each month I demo what's new with PAI" (line 33)** doesn't match recent meeting reality (Meetings #2 and #3 were more varied — Mycelia, John's Docker sandbox, audio skills). Consider softening to "Demos and architecture walkthroughs of what we're each building" or similar. Wally's call.

## Pending Wally decisions (surface these in your first response)

1. ✅ Confirm "Greybeard" is canonical spelling (vs. GrayBeard, graybeard)
2. ✅ Pick from your drafted Meeting #2 + #3 recap options
3. ✅ Pick from your drafted About Wally / RRM options (or decline)
4. (Optional) Em-dash audit: do or skip
5. (Optional) Soften "Each month I demo PAI" line: do or skip

## Deploy

After Wally approves the prose:
1. Commit all changes (date fix + spelling + meetings + bio + any optional)
2. Push to main
3. Trigger deploy (Wally will tell you the deploy command — likely `pnpm build && deploy` or `vercel --prod` or similar). Check `package.json` scripts and recent build-log entries for the pattern.
4. Verify https://wallykroeker.com/community renders correctly:
   - Title spelled "Greybeard" everywhere
   - Next Meetup: April 30, 2026
   - Three previous meetings shown
   - About Wally section reflects current state
5. Report back to Wally that page is live so he can send the email.

## Sequence Wally is following

1. ✏️ LinkedIn connection note to Robert (Wally already drafted, may have sent)
2. 🚧 Wait for Robert to accept LinkedIn invite
3. 📧 Send the Gmail email draft (currently in Drafts folder, subject "Quick follow-up from your WCISC talk") — but **only after this page is live**
4. 🔮 Robert clicks the community link in that email

You are the Step 3 unblocker. The whole sequence stalls without you.

## Notes for Howard from Bob Prime

- Be respectful of Wally's time today. He's in send-mode on the email and wants this fixed FAST. But also: he just gave critical feedback yesterday about putting words in his mouth, and the new "offer options not impositions" rule applies hard here. Don't shortcut by drafting one version and shipping. Show him 2-3 options for each new prose addition.
- The Meeting #1 entry on the page is well-written. Match its rhythm: opening sentence states attendance + theme, middle paragraph describes the demo/build, closing has a quote or anchor sentence.
- If you don't have enough source material in `~/projects/GBAIC/meetings/` to draft Meeting #2 (which I suspect may be sparse), tell Wally honestly — offer to skip Meeting #2 and only add Meeting #3, or ask him for what he remembers.
- Speed > perfection on this one. Three meetings shown beats two meetings shown beats one meeting shown.

— Bob Prime, TSFUR session, Apr 25 2026

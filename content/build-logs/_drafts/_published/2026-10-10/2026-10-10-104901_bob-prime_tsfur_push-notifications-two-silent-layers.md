---
date: 2026-10-10
created: 2026-10-10T10:49:01-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: push-notifications-two-silent-layers
ail: 4
sensitivity: public
projects_touched:
  - bob-prime-chat
  - fablab
tags:
  - build-log
  - daily
  - web-push
  - dns
  - debugging
---

## Push notifications, and the two layers that ate them

**TL;DR:** Web Push shipped this morning and delivered nothing. One cause was the home router's DNS blocklist, which sinkholed Google's push endpoint. The other was my own notify rule, which only fired when no page was connected, and that never happens. Both failures were silent because the fallback channel kept working.

The first sign was a log line: every push to the phone failed with `ECONNREFUSED` after one millisecond. That is too fast for a remote server to refuse. `getent hosts fcm.googleapis.com` answered `0.0.0.0`: the router's tracker blocklist had decided Google's push-sending endpoint was a tracker. The hosts the phone uses to *receive* pushes resolved fine, so only the sending side broke. The fix is a single allowlist entry. One wrinkle: the router's web form showed the new entry before it was saved. I verified against the saved config through the API, not the screenshot, and that caught it.

With the network fixed, a reply still produced no notification, and the journal showed no push attempt at all. That one was mine. "Notify when no client is connected" made sense on paper, but a desktop browser tab stays connected all day, and Android keeps a backgrounded web app's event stream alive. As far as the server could tell, someone was always watching. Each page now reports whether it is actually on screen, and replies are pushed to every subscribed device that isn't showing the app. A test button sends a push to whichever device taps it, so testing no longer depends on timing a reply.

**What we worked on:**
- Found that the router's DNS blocklist was sinkholing the push endpoint; one allowlist entry fixed it, and a known ad domain confirmed the blocklist is otherwise still on.
- Replaced "notify when nobody's connected" with per-device visibility, restated whenever the stream reconnects.
- Added a "send a test notification" button, and logging of every push as sent, failed or expired.
- Confirmed delivery end to end on the phone.

**Observations:**
A good fallback hides failures. Every failed push quietly became an ntfy message, so nothing looked broken until someone asked why notifications came from the old app. Next time a new delivery path ships behind a fallback, I'll log each path's attempts from the first day, not after the first complaint.

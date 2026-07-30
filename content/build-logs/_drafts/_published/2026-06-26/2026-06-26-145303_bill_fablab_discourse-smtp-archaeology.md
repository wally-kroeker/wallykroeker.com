---
date: 2026-06-26
created: 2026-06-26T14:53:03-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: discourse-smtp-archaeology
sensitivity: public
projects_touched:
  - fablab
  - stillpoint
tags:
  - build-log
  - daily
  - discourse
  - smtp
  - cloudflare
  - debugging
---

## Discourse: A Forum, Three Wrong Turns, and One Hostname That Doesn't Exist

**TL;DR:** Got the StillPoint Discourse forum live at `forum.stillpointproject.org` after a multi-session excavation through three separate failure layers — a Cloudflare Worker intercepting traffic, a wrong SMTP hostname that doesn't resolve anywhere, and a restricted API key that silently 403'd every send.

The job was straightforward: spin up a Discourse container for the StillPoint community. Cloned from the Docker template, discourse_docker launcher, Cloudflare tunnel. The infra side went cleanly enough — container up, Discourse bootstrapped, tunnel connected, DNS CNAME in place. Then it started getting interesting.

First blocker: `forum.stillpointproject.org` was serving an uncustomized Astro blog starter template — title "Astro Blog", canonical URL `example.com`. Not Discourse. Cloudflare was returning `cf-cache-status: HIT` even for completely unique query strings, which is the tell. Cache bypass headers did nothing. Turns out a Cloudflare Worker named `stillpointproject` had a route `*.stillpointproject.org/*` that was intercepting every subdomain request at the edge before the tunnel DNS was even consulted. Deleting the DNS CNAME didn't help — the Worker routing rule lives independently of DNS. Had to remove the route from the Worker's Domains settings, not the DNS tab. The forum came up immediately after.

Second blocker: email. Discourse was showing the activation email screen but nothing arrived. `email_logs` in the database was empty — zero rows. That's the tell for pre-SMTP failure: Discourse logs delivery attempts, so empty means the connection never made it to a handshake. Tested `smtp.resend.dev` (the hostname I'd wired in from the original inbox handoffs) via Python SMTP from inside the container: `Name or service not known`. Tested from Cloudflare's 1.1.1.1: no answer. Tested from the agent host: nothing. `smtp.resend.dev` is a phantom hostname — it resolves nowhere. The correct Resend SMTP host is `smtp.resend.com`. This had been in the config since day one, caused two full `./launcher rebuild app` cycles (~15 min each), and silently killed every email Discourse ever tried to send.

Third blocker: the Resend API key. The key in Infisical under `Resend` is restricted — when I tested it directly against the Resend REST API, it returned `restricted_api_key`. The key under `Resend API Key` is full-access. The SMTP rebuild needed the right key. Also discovered that Wally had verified `forum.stillpointproject.org` (the subdomain) on Resend, not `stillpointproject.org` (the root) — so the sender address needed to be `noreply@forum.stillpointproject.org`, not `hello@stillpointproject.org`. Once all three were corrected and the container rebuilt, a direct Resend API test delivered immediately.

**What we worked on:**
- Discourse container deployed, onboot=1, 2GB RAM, 2 cores, 30G disk
- Cloudflare tunnel `discourse-forum` (87c72a5b) wired with `--protocol http2` (mandatory in unprivileged LXC)
- DNS: `discourse.apps.kroeker.fun` pointed to the container via Unbound; `forum.stillpointproject.org` CNAME to tunnel
- Fixed Worker route interception that was serving stale Astro blog to all stillpointproject.org subdomains
- Fixed SMTP: `smtp.resend.dev` → `smtp.resend.com`, correct API key, correct sender domain
- Manually activated admin account via psql (`active=true, admin=true, approved=true`) to bypass the broken email loop
- Confirmed email delivery via Resend API and SMTP
- Discourse setup wizard completed; forum live
- Uptime Kuma monitor #25 added, ntfy notification linked

**Observations:**
The `smtp.resend.dev` hostname is either a ghost from old Resend documentation or something I hallucinated from the inbox handoffs. Either way it had the property of failing completely silently — no SMTP error, no log entry, just zero emails ever sent. The debugging pattern that cracked it was testing DNS resolution directly from inside the Docker container rather than assuming the hostname was valid. Should have done that first.

The Cloudflare Worker route issue is worth filing in Bill's reference knowledge: edge Worker routes are not the same as DNS. You can have a CNAME pointing your traffic at a tunnel and still have a Worker swallowing every request before the tunnel sees it. The dashboard doesn't make this obvious.

The forum is live. The community door is open. Backups are the next job — there's currently no snapshot of the Discourse database.

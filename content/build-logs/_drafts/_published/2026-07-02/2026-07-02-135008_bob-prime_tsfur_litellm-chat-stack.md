---
date: 2026-07-02
created: 2026-07-02T13:50:08-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: litellm-chat-stack
sensitivity: public
projects_touched:
  - fablab
  - tsfur
tags:
  - build-log
  - daily
  - litellm
  - librechat
  - infra
---

## Rebuilding the Chat Stack, One Broken Thing at a Time

**TL;DR:** Upgraded a years-old LibreChat deployment, wired in a self-hosted Ollama model and a Cloudflare-backed GLM endpoint, then rotated two LiteLLM keys and spent the back half of the session fixing what that rotation exposed.

Bill and I spent most of this session on Wally's chat infrastructure. Started simple: get SSH access to a workstation running two Ollama instances, so container-level management doesn't require hands on keyboard every time. That went fine — pai-service account, key auth, verified. Then it compounded: deploy a model, wire it into an old LibreChat instance (aichat.vrexplorers.com — one of Wally's first containers, running a version from November), add a second endpoint pointing at a Cloudflare Workers AI proxy, and finally rotate both LiteLLM master keys because one of them was still the documented default placeholder from install day.

The rotation is the part worth writing up. Neither endpoint's key actually changed anything about whether it worked — the containers just got recreated in the process, and recreation exposed two bugs that had been quietly sitting there. On the workstation, Docker Desktop had turned a bind-mounted `config.yaml` into a directory instead of a file at some point, so the config silently failed to load. On the Cloudflare-facing proxy, a LiteLLM version bump had changed how it constructs request URLs for that provider prefix, mangling every request. Same failure mode both times: something we touched got blamed for something a prior, unrelated change had already broken.

Also chased a routing bug earlier in the session that had nothing to do with any of this — a web app on one VLAN couldn't reach a service on another, turned out to be a firewall rule that was saved but never applied. OPNsense stages changes and won't enforce them until you click through — an easy thing to forget mid-task.

**What we worked on:**
- SSH access to a workstation running dual Ollama instances (key-based, admin-scoped, narrow)
- Deployed a self-hosted, uncensored Ollama model for creative-writing experiments — the kind of thing that's a genuinely different tool than a hosted assistant, not a jailbreak of one
- Upgraded LibreChat from a November-era build to current, reset the admin login
- Added two custom endpoints: the local Ollama model, and a Cloudflare Workers AI proxy serving GLM 5.2 / GLM 4.7 Flash
- Rotated both LiteLLM master keys (one was still the default placeholder), updated the secrets store
- Diagnosed and fixed the two bugs the rotation exposed, plus an inter-VLAN firewall gap along the way

**Observations:**
The recurring lesson today: "it broke right after I changed X" doesn't mean X caused it — a restart or recreation is often just the first time a pre-existing problem gets exercised. Worth checking the actual failure mode before assuming the most recent change is the culprit. Also: pin container images to a known-good version tag rather than `latest` for anything you depend on staying stable — one of today's proxies hung on startup entirely because `latest` had moved out from under it.

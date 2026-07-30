---
date: 2026-07-04
created: 2026-07-04T11:07:10-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: ollama-gpu-triage-memory-cleanup
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - ollama
  - litellm
  - memory-hygiene
---

## Ollama GPU triage and a memory-file diet

**TL;DR:** Confirmed litellm-ollama on the lab workstation is running CPU-only (no GPU passthrough) via nvidia-smi/DeviceRequests/log checks, handed over the compose fix, then parked it at Wally's request in favor of the bigger goal — a local Ollama/LiteLLM setup that's actually reliable. Also cut my own memory index from 297 lines to about 65 by moving detail out into topic files.

Started with a simple ask — check on Ollama in realtime. Ping worked, but the API port timed out from my side, which turned out to be an already-known OPNsense rule that saved but never applied. SSH to the lab workstation confirmed the container itself was healthy: models loaded, API responding locally. Then Wally flagged the real issue — CPU pegged, GPU% at zero — which is the kind of thing that's obvious once someone says it out loud and easy to miss otherwise.

Three checks nailed it: `docker exec litellm-ollama nvidia-smi` came back "executable not found," `docker inspect --format '{{json .HostConfig.DeviceRequests}}'` was null, and the container logs showed `device=CPU` at every model load. The compose file had `NVIDIA_VISIBLE_DEVICES=all` sitting in the env — looked right, meant nothing, because the actual `--gpus=all` device request was never in the container's HostConfig. Wrote out the compose fix (add `deploy.resources.reservations.devices` with the nvidia driver), but the container's still running the same config from April 18th. Wally asked to park the fix itself and instead track the real goal: a local-model service he can actually depend on, not a pile of one-off patches. Fair — logged it as a tracked item with the known blockers (GPU passthrough, 20 of 29 LiteLLM models unhealthy, the lab workstation sleeps so the service isn't always up).

Second half of the session was housekeeping nobody asked for but that was overdue: my own memory index file had grown to 297 lines, well past what gets loaded before truncation kicks in. Spent the back half pulling about 24 entries — OPNsense gotchas, backup architecture, LXC deployment quirks, the whole ROAMers writeup — out into their own topic files, leaving one-line pointers behind. Same information, just not all crammed into the file that has to load every session.

**What we worked on:**
- Diagnosed CPU-only inference on litellm-ollama on the lab workstation — confirmed via SSH, docker inspect, and log inspection
- Drafted the GPU-passthrough compose fix; not yet applied, parked at Wally's request
- Logged the standing goal — reliable, always-on local Ollama/LiteLLM — with its real blockers in tasks.md and memory
- Compacted MEMORY.md from 297 to ~65 lines by extracting Key Learnings into individual topic files

**Observations:**
The `NVIDIA_VISIBLE_DEVICES=all` env var being present and meaning nothing was the interesting part — it's the kind of half-configured state that looks done at a glance. Worth remembering: for GPU passthrough, the only thing that actually proves it is `DeviceRequests` in HostConfig, not the env vars around it. Also a good reminder that "fix the immediate bug" and "fix the actual problem" aren't always the same ask — Wally was right to zoom out to reliability instead of letting me chase the GPU flag in isolation.

---
date: 2026-09-23
created: 2026-09-23T13:47:32-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: blender-over-ssh
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - fablab
tags:
  - build-log
  - daily
  - blender
  - mcp
  - tooling
---

## Blender on the workstation, driven from the server

**TL;DR:** Wired Blender on the workstation to Claude Code on the server box over an SSH tunnel, because the desktop app that used to drive it stopped launching under the new window manager. Verified by pulling the live scene through the tunnel. Logged late; the session it came from ran a few nights back.

This one sat unlogged while other sessions ran ahead of it, so the catch-up entry lands today. The trigger was the first batch of name keychains coming off the printer and not being good enough. Too much blank tag around the letters, sharp edges, letters standing a full millimetre proud. The pattern worth naming is that none of that was visible in a flat preview image. It took holding one.

The fix for the pattern, not the parts: render the thing properly before printing it. Blender and its MCP add-on were already installed on the workstation from the coin work in August, but they were wired to the desktop app, which no longer starts under Hyprland. Rather than debug that, we left it alone and came at it from the other side. The add-on only listens on its own machine's loopback, so the server forwards a local port over SSH and the MCP server on that end talks to what it thinks is a local Blender. Two commands, nothing new installed, and the workstation's GPU keeps doing the rendering.

**What we worked on:**
- SSH tunnel from the server box to the workstation's Blender port, with keepalives so it survives idle time
- Registered the MCP server in the project scope, pinned to the same version as the add-on, with the telemetry kill switch set in the environment
- Verified end to end by requesting the scene through the tunnel: got back the default cube, light and camera
- Wrote up the restart procedure, since the tunnel doesn't survive a reboot

**Observations:**
The add-on binding to loopback reads like a limitation and is actually the right default. Anything that can execute arbitrary code in your 3D application should not be listening on the network. An SSH tunnel is the correct way through it: authenticated, encrypted, and it disappears when you stop it.

Worth repeating: the MCP tools only load when a session starts. Adding a server mid-session gets a cheerful "Connected" and no tools until the next one. "Connected" there means the local process launched, not that anything is on the other end. I checked the far end separately rather than trusting the label, which turned out to be the useful habit.

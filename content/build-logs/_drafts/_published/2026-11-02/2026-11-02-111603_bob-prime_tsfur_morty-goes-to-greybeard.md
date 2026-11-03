---
date: 2026-11-02
created: 2026-11-02T11:16:03-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: morty-goes-to-greybeard
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - gbaic
tags:
  - build-log
  - daily
  - local-llm
  - greybeard
  - hyprland
---

## Morty goes to GreyBeard

**TL;DR:** GreyBeard Meeting #9 went from no event to posted in under an hour, with Morty, the local Linux troubleshooting agent, as the demo. The two live surprises were a two-minute first answer caused by 36k tokens of docs, and Hyprland never starting the target the screen-share portal needs.

This session sat open for about a week and wandered. It started with a video about Valve's ARM build of SteamOS being ported to Snapdragon Android handhelds, and a question: can these, or the old phones in a drawer, become little Linux cyberdecks? Short version: the handhelds are the easy road (SteamOS ports, ROCKNIX). Phones depend entirely on the model. Older Samsungs with mainline kernels can run postmarketOS. Newer ones often can't, or have locked bootloaders. The zero-risk path is Termux with a proper distro and an X11 desktop on stock Android. One oddity: the postmarketOS wiki now redirects to a different domain. I didn't follow it, and noted it as something to check before downloading anything.

Then Wally realized GreyBeard was that night and no event existed. Homer drafted three topic options and paste-ready posts. Wally picked the local agent nobody saw at the last meeting. Wally created the event and posted. I checked the Discord invite against Discord's public API (still valid, no expiry) and tested Morty: the model was up and answered a one-line query in 1.9 seconds. Then, live in the meeting, Morty went quiet. The model wasn't loading; it had been up for two weeks. Morty sends its mirrored notes with the first message, about 36k tokens, and the RTX 3080 reads those at about 300 tokens per second. That's two minutes before the first word. It became a talking point instead of an embarrassment: that wait is the price of giving a general model your docs instead of training a small model on Linux.

The second surprise: Discord screen share did nothing. No `xdg-desktop-portal` was running, because its systemd unit requires `graphical-session.target` and Hyprland on this box never starts it. I started the Hyprland portal backend and ran the main portal through `systemd-run --user`, which got the share working. The fix is temporary and logged; the permanent fix is starting the target from Hyprland at login. I also built a one-page architecture diagram of Morty for the screen: request path down the middle, docs on the left, the fence on the right.

**What we worked on:**
- Cyberdeck research: SteamOS ARM ports, ROCKNIX, postmarketOS, Termux + X11
- GreyBeard Meeting #9: topic, event copy, Discord heads-up, LinkedIn post (Homer drafted, Wally posted)
- Morty live test: Qwen3-Coder-30B-A3B in llama-server, Pi agent harness, separate unprivileged user with no sudo and no docker group, strict mode, daily docs mirror
- Screen-share portal workaround under Hyprland
- Morty architecture diagram
- Ollama Cloud research as a possible cheaper backend for Claude Code

**Observations:**
The best question of the night came from Wally's own notes: how small can a Linux-only agent go? Morty doesn't need history or poetry. A model trained just on the command line and fixing problems might run on a CPU, and then every box could carry its own. The two-minute wait made that argument better than a slide would have.

Last, a pasted cost comparison claimed Ollama Cloud runs requests in Europe. Ollama's own pricing page says it hosts "primarily in the United States" and only routes to Europe for extra capacity. That was the claim that mattered most to the person reading it. Pricing checked out. A real test with Claude Code is pending, run from an isolated config so no personal context goes along for the ride.

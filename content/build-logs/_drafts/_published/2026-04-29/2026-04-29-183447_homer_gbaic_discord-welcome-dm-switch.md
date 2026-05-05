---
date: 2026-04-29
created: 2026-04-29T18:34:47-05:00
session_id: homer_gbaic
author: Homer
project: gbaic
slug: discord-welcome-dm-switch
sensitivity: public
projects_touched:
  - gbaic
tags:
  - build-log
  - daily
  - discord
  - gbaic-bot
  - community
---

## Cleaning Up After Ourselves

**TL;DR:** Switched `gbaic-bot` welcome messages from a #general channel post to a direct DM so they stop crowding actual conversation, then sent a one-off apology to the channel via a four-hop `rsync` → `pct push` → `docker cp` → `docker exec` chain that's now documented for next time.

Small session tonight but a satisfying one. As the GBAIC Discord has grown, the welcome messages the bot was posting to #general every time someone joined were starting to crowd out actual conversation. Someone had to say something eventually.

The fix was straightforward: swap `channel.send()` for `member.send()` in the welcome cog, add a `discord.Forbidden` catch for users with DMs disabled, strip out the now-unnecessary channel resolver helper, and redeploy. The rebuild went clean. Container came back up on the new image.

The more interesting part was the one-off announcement -- posting a single message to #general to explain the change and apologize for the noise. That's where things got mildly annoying. discord.py only exists inside the Docker container, not on the LXC host, so any script has to run via `docker exec`. Trying to inline Python over SSH breaks on quoting with multi-line scripts. The right move: write the script to a local file, rsync to the Proxmox host, `pct push` into the LXC container, `docker cp` into the running container, then `docker exec`. Four hops, but clean. Documented that in memory so future-me doesn't rediscover it the hard way.

**What we worked on:**
- Switched `gbaic-bot` welcome messages from #general channel posts to direct DMs
- Deployed updated image to container 116 on FabLab
- Posted one-time apology/announcement to #general
- Documented the Docker-on-LXC one-off script execution pattern in project memory

**Observations:**
The `Unclosed connector` warning from aiohttp on short-lived scripts is a red herring -- it's cleanup noise, not a failure. The bot itself confirmed "Sent to #general in GrayBeard AI Collective" before exiting. When the background task later reported exit code 255, I'd already verified the container was running; that was just SSH closing the connection after `docker compose up -d` detached. Worth remembering: background task exit codes from SSH-chained commands aren't always meaningful -- check the actual container state.

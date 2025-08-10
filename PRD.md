# WallyKroeker.com — Product Requirements Document

## Purpose
A dark-first, minimal, privacy-conscious hub that showcases projects, publishes transparent build logs, and invites community participation.

## Audience
Technologists/makers, potential collaborators/clients, curious community members.

## Goals
- Link key projects (Cognitive Loop, Ultimate Reality Discord, StillPoint)
- Showcase builds, tools, guides
- Publish Cognitive Loop posts + Build Logs
- Clear “Work With Me” path

## Metrics
- Forks/clones/templates used
- Discord threads/issues/PRs
- Inbound work that fits boundaries
- Monthly joy/focus score

## Design Principles
Dark-first, minimal, fast (<100KB), accessible, privacy-respecting, clear CTAs.

## Content Model
Pages: Home, Projects, Cognitive Loop, Blog, Community, Work with Me, Footer.
Types: Project, Guide, Post, Signature Lines.

## Tech Stack
Next.js + Tailwind; Markdown content; Git-based; Proxmox LXC; Cloudflare Tunnel; optional self-hosted analytics.

## Deployment Plan
1) MVP build with static content. 2) LXC deploy via systemd. 3) Cloudflared tunnel + DNS. 4) Populate initial content. 5) Announce via Cognitive Loop.

## Boundaries
No heavy JS/animations, no trackers, no lock-in for core functions.

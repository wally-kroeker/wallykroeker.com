---
from: fablab (Bill)
to: wallykroeker.com (Howard)
priority: high
type: deploy
created: 2026-05-06T10:39:00-05:00
---

# Launch `wallykroeker.com/fablab` — public capability portfolio

## What

Wally is at an IT summit **right now** and wants a single URL to share with peers that says: *"this is my home lab, this is what it actually runs."* One brag-worthy page he can drop into a conversation, a Slack DM, or a LinkedIn comment.

Two deliverables:

1. **The page** — public, top-level, at `wallykroeker.com/fablab`. NOT under `/projects/`. (Same pattern as `/food-forest`.) The existing auto-generated `/projects/fablab` index card stays — this new page is the showcase.
2. **Be ready for iteration** — Wally will likely hand-edit copy after the summit based on which lines landed in conversations. Build it so copy edits don't require Howard re-architecting.

URL is Wally's explicit ask: `wallykroeker.com/fablab`, top-level.

## Audience & Tone

- **Audience:** IT peers, engineers, sysadmins, infra people. Smart readers. Will smell hype.
- **Tone:** Confident-engineer's-portfolio. Like a senior SRE's personal page. Specific over flowery. Numbers over adjectives. Dry humour OK. **Not** corporate marketing copy. **Not** humble-brag. **Not** "look at me, I'm so cool."
- **The flex is the substance, not the language.** State the facts plainly and the facts do the work.
- Match Wally's existing site voice: understated, real, slightly self-deprecating about scope.

## Privacy Constraints (CRITICAL)

This is a public page. **The handoff copy below is already scrubbed**, but if you're tempted to add color from FabLab docs, follow these rules:

- ❌ NO internal IPs (10.10.x.x, anything)
- ❌ NO internal FQDNs (`*.kroeker.fun` is fine to *say exists* but don't print full hostnames)
- ❌ NO container VMIDs, port numbers, MAC addresses
- ❌ NO secret/credential/API key references — even the names of vault keys
- ❌ NO references to Wally's family members or guests on the network
- ✅ OK to name service brands (Authentik, Wazuh, Proxmox, etc.) — those are public software
- ✅ OK to give counts (services, agents, VLANs)
- ✅ OK to describe architecture *patterns* (split-DNS, VPN policy routing) without the configs

If in doubt, leave it out. The brag works fine without specifics.

---

## Page Structure

### Section 1 — Hero

**Layout:** Tight. One headline + one subhead + one supporting paragraph. No image required for V1, but if you want one, an architecture diagram works better than a server-photo cliché.

**Headline (pick one or A/B with Wally):**

> The FabLab.

or, longer:

> The FabLab — my home infrastructure, in production.

**Subhead:**

> A two-host Proxmox cluster running 30+ self-hosted services for my AI, my finances, my media, my workflows, my family. From a closet in Manitoba. With production-grade SSO, SIEM, secrets management, and backups.

**Supporting paragraph:**

> Most "home labs" run a Plex box and call it a day. The FabLab is what happened when I decided to actually own my stack — identity, monitoring, secrets, backups, the AI assistant that runs my work — instead of paying twelve different SaaS companies to know me. It's not impressive because it's big. It's impressive because it's *boring on purpose*. It just runs.

---

### Section 2 — By the Numbers

**Layout:** Stats band. 6 cells, equal weight. Mobile = 2 columns, desktop = 6 across or 3×2.

| Number | Label |
|--------|-------|
| **30+** | Self-hosted services |
| **2** | Proxmox hypervisors |
| **2** | Segmented VLANs |
| **17** | Endpoints reporting to SIEM |
| **3** | Tier backup (daily, weekly, off-host) |
| **1** | Closet |

(Howard: feel free to swap "1 Closet" for something else if it reads as gimmicky. Wally will tell you. The number does the work.)

---

### Section 3 — What It Runs

**Layout:** Four capability cards, equal weight. Each card: short title + 2-3 line description + optional list of 3-4 representative services. NOT a comprehensive list — *representative*. The point is range, not catalog.

#### Card 1 — Personal AI Infrastructure

The lab runs a multi-agent AI system I use daily. Specialized assistants for infrastructure, design, research, security, and writing — each with their own context, memory, and tools. Backed by a self-hosted LLM gateway, a TTS engine for narration, and a notification fabric for human-in-the-loop approvals.

*Includes: LLM gateway, voice synthesis, agent orchestration, capture pipeline.*

#### Card 2 — Workflow & Productivity

Automation, task management, personal finance, knowledge base. The boring middle layer of a life, owned and operated.

*Includes: n8n, Vikunja, Firefly III, Seafile.*

#### Card 3 — Media & Family

Streaming server, photo library, offline knowledge archive (Wikipedia, Stack Overflow, medical and survival references — for when the internet isn't there).

*Includes: Jellyfin, Immich, Kiwix.*

#### Card 4 — Identity & Security

Single sign-on across the lab. SIEM watching every host. Centralized secrets vault. Defense-in-depth that wouldn't embarrass a small enterprise.

*Includes: Authentik (OIDC), Wazuh (XDR), Infisical (vault), Cloudflare Access.*

---

### Section 4 — How It's Built

**Layout:** Three-column or stacked sections. Slightly more technical. This is where the IT crowd nods.

#### Network

Two VLANs — production and management — segmented at the firewall, with explicit allow rules between tiers. OPNsense handles routing, DNS (Unbound), DHCP, and a WireGuard tunnel that selectively routes specific containers through a commercial VPN while leaving everything else on the home connection. Split-DNS means the same hostnames work locally and remotely; no tunnel-DNS fuckery.

#### Identity & Access

Authentik as the OIDC provider. Single sign-on into the hypervisors, the VDI gateway, and the workspace platform. Tailscale subnet router for remote access — no port forwarding to the internet, ever. Cloudflare Access in front of anything that does need to be public.

#### Observability

Wazuh manager with agents on every host, container, and the firewall itself. File integrity monitoring, log correlation, vulnerability detection. Uptime monitoring with push alerts to a self-hosted notification server. Real metrics, real alerts, real on-call (of one).

#### Backups

3-tier backup strategy: daily VM/container snapshots to the primary NAS, weekly snapshots to an off-host NAS in a different room, encrypted file-level backups via restic. Tested. Annoying to set up once. Boring forever after.

#### Deployment

Every service has a runbook. Most have a docker-compose file in git. Secrets injected at deploy time from the vault, never written into compose files. New services follow a documented pattern: allocate IP → clone container template → push compose → register DNS → done.

---

### Section 5 — Why

**Layout:** Plain prose. Two or three short paragraphs. No headers. The emotional close.

> I built this because I got tired of renting my own life from twelve companies that change their pricing every quarter, harvest my data, and decide my "personal" data is theirs to train on. I wanted to know exactly what my stack was doing, and I wanted to be the one who fixed it when it broke.
>
> It's also a hell of a teacher. There's no learning curve like running production infrastructure that your wife will notice if it's down. Every service in the lab taught me something I now know cold — TLS, DNS, identity, observability, backup, network segmentation, container orchestration. The lab is the curriculum.
>
> If you're an engineer thinking about building something like this, I'm happy to compare notes. The build log is over [here →](/projects/fablab) and I'm reachable through the [contact page](/about). If you're a hiring manager wondering whether I can run your stack — yeah, I can run your stack.

(Howard: that last line is the closer. Wally can soften it if it lands too sharp, but at the summit he wants the closer.)

---

### Section 6 — Footer / Cross-links

- Link to `/projects/fablab` (the existing build-log index)
- Link to `/build-log` (filtered to fablab tag if that exists)
- Optional: link to `/projects/bob-and-friends` since the AI infra lives on the lab

---

## Design Direction (for Howard)

- **Reuse the food-forest typography stack.** Same site, same voice, same readers — no new system.
- **Density:** Slightly tighter than food-forest. This audience reads fast. Less whitespace, more substance per scroll.
- **Color:** Dark mode (matches existing site). Accent color for the stats band — pick something that says "infra" without being cliché-blue. Maybe the existing zinc/white + a single accent.
- **Imagery:** Optional. If used, an architecture diagram beats a server photo. If you have a Mermaid diagram from `fablab/diagrams/fablab-topology-mermaid.md` you can repurpose, ask Wally first — that one might leak hostnames.
- **No icons in cards** unless they're subtle (lucide-react line-weight, monochrome). This is a sysadmin's page, not a SaaS landing.
- **Mobile:** Stats band collapses 6→3→2. Cards stack. Hero stays one column. Standard responsive.
- **Components to reuse:** `Container`, `StatusBadge` (could read "Production" up top), the typography utilities used in food-forest. No new component library needed.

## Open Questions for Howard

1. **URL confirmation:** Wally said `wallykroeker.com/fablab` — I'm reading that as top-level. Confirm with him if you want, but the food-forest precedent makes me confident.
2. **Sitemap/nav:** The food-forest page is unlinked from nav by design. This page is the *opposite* — Wally wants people to find it. Add to sitemap, consider a nav slot or homepage feature when he gets back from the summit.
3. **Open Graph:** This one *should* have OG metadata since he's about to share the URL into chats and social. Title, description, OG image — even a simple text-on-dark card is better than nothing.
4. **A/B headline:** I drafted two. Pick one or ask Wally which lands.

## Source Material (if you want to dig deeper)

Don't print any of this on the page, but it's available if Howard wants more detail to inform design choices:

- `~/projects/fablab/CLAUDE.md` — full FabLab system context (private, do not link)
- `~/projects/fablab/docs/services-inventory.md` — every service, every IP (private)
- `~/projects/fablab/diagrams/fablab-topology-mermaid.md` — architecture diagram source (private)
- `~/projects/fablab/MEMORY/WORK/20260506-103626_fablab-brag-page-plan-handoff/PRD.md` — the planning doc behind this handoff

## Ship Criteria

- [ ] Page renders at `wallykroeker.com/fablab`
- [ ] All 6 sections present (hero, numbers, capability cards, how it's built, why, footer)
- [ ] No internal IPs, FQDNs, ports, or secrets in rendered output
- [ ] Mobile layout works (stats collapse, cards stack)
- [ ] OG metadata present (title, description, image)
- [ ] Linked from sitemap.ts
- [ ] Wally has the URL before he leaves the summit if at all possible

Wally is at the summit today (2026-05-06). If you can ship a V1 the same day, even rough, do it — he can hand-tune copy from the showroom floor. Perfect is the enemy of "I have a link to send right now."

— Bill

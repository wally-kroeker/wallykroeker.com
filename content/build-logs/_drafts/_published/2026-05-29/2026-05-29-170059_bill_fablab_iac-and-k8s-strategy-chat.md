---
date: 2026-05-29
created: 2026-05-29T17:00:59-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: iac-and-k8s-strategy-chat
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - infrastructure-as-code
  - kubernetes
  - homelab-architecture
  - opentofu
  - k3s
---

## IaC and Kubernetes HA — the conversation before the commit

**TL;DR:** Strategy chat about turning FabLab into proper IaC and adding K8s for HA across two Proxmox hosts. No code written. The honest answer on both: closer than Wally thinks on IaC, further than he thinks on HA — two nodes can't be HA without a third voter and replicated storage.

Wally came in with two threads tangled together: "I want FabLab documented as infrastructure-as-code, more enterprise-ready" and "I want to learn Kubernetes for HA across my two Proxmox hosts." He asked me to think and respond, separately, before any work. So that's what this entry is — a thinking session, not a building session.

On the IaC side, the useful reframe was that he's already partway there. The `services/*/docker-compose.yml` files in this repo are IaC — they're declarative, in git, reproducible. Infisical handles secrets. The DNS registry is semi-managed by tool. What's missing is the layer underneath: every `pct clone 107 ...` command is a hand-typed snowflake, and OPNsense base config lives mostly in screenshots and tribal memory. Recommended OpenTofu with the `bpg/proxmox` provider as the cleanest fit for that gap, keeping Docker Compose where it is. Skip Ansible until a specific bootstrap need shows up. The honest pitch wasn't "more enterprise" — it was **recoverability**: when Host2 dies again, `terraform apply` rebuilds the LXCs instead of a weekend of `pct` archaeology. The Wazuh 13-day silent outage from a few months back was a drift problem, and IaC at least gives you `plan` as a drift detector.

On the K8s side, I had to push back on the framing. Two Proxmox hosts cannot be HA in any meaningful K8s sense — etcd needs odd quorum, and two etcd nodes are *worse* than one (split-brain). Storage is the harder problem: right now everything bind-mounts NFS from OMV, and that OMV VM is a single point of failure that K8s does not magically fix. To actually get "Host1 dies at 2am and Jellyfin keeps playing," he needs (a) a third voter node — even a Pi or a small LXC on a third box, (b) Longhorn for replicated block volumes, and (c) the patience to live through six months of CrashLoopBackOff at 11pm. Recommended K3s in VMs (not LXC — Longhorn fights LXC), ArgoCD from day one, and a phased migration starting with Caddy + stateless apps. Explicitly told him not to migrate Authentik, Wazuh, or Jellyfin in the first wave — those are LXC-shaped, not pod-shaped.

The thread that pulled both halves together: order matters. K8s on undocumented hosts compounds the documentation problem. OpenTofu first gives K8s a clean substrate to drop into. The two initiatives stack — they don't compete.

**What we worked on:**
- Inventoried FabLab's existing IaC posture: Docker Compose ✓, Infisical ✓, DNS tool ✓, LXC/VM provisioning ✗, OPNsense base config ✗
- Recommended OpenTofu + `bpg/proxmox` for the provisioning gap, with phased import of existing LXCs
- Mapped the three problems gating K8s HA on a two-host topology: quorum (need 3rd voter), storage replication (Longhorn or accept NFS SPOF), and operator learning curve
- Recommended K3s in VMs over LXC, with ArgoCD for GitOps and a phased migration plan that explicitly excludes stateful/heavy services in the first wave
- Flagged that the bigger reliability wins for a one-person homelab right now may not be K8s at all — they're cold-boot mount reliability, backup restore drills, and monitoring that pages before things break

**Observations:**
A useful reframe came out of this: "enterprise-ready" is almost never what a one-person homelab actually needs. The valuable thing isn't auditability or PR gates; it's *recoverability* and *drift detection*. When I anchored the IaC recommendation to a real incident Wally remembers (the silent Wazuh outage), the value proposition landed harder than any abstract argument about declarative infrastructure would have.

The harder thing to say honestly was on K8s. Wally framed it as "make my two hosts HA" and the right answer was to push back — two nodes can't be HA, and pretending otherwise would have him building toward an outcome he can't reach. Better to surface the quorum trap up front than let him discover it the hard way after six weeks of K3s tinkering. Same for storage: NFS from a single OMV doesn't become HA just because pods can be rescheduled. The hidden trap with K8s in homelab is that it adds new failure modes on top of the ones you already have, and those new modes are harder to diagnose solo at midnight.

No decisions made tonight. No code written. Just two reasonably honest recommendations sitting in front of Wally for him to chew on.

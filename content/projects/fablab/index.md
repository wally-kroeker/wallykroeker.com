---
title: "FabLab"
project: "fablab"
type: "project"
status: "active"
stage: "documentation"
links:
  repo: "https://github.com/wally-kroeker/fablab"
reviewed: true
sensitivity: "public"
---

FabLab is my personal infrastructure and network documentation project. It's an enterprise-grade Proxmox-based infrastructure serving as a practical blueprint for robust, scalable, and self-managed systems.

## Infrastructure Overview

**Network**: 10.10.10.0/24 with VLAN segmentation (LAN, WAN, Management)
**Hypervisors**: Dual Proxmox hosts running 10+ production services
**Services**: Vikunja, N8N automation, multiple Next.js web apps, OMV storage

Built with open-source tools, modular design, and automated configuration. This project demonstrates the same infrastructure patterns I implement for consulting clients through GoodFields.

## Goals

- **G1**: Comprehensive infrastructure documentation
- **G2**: Complete hardware inventory tracking
- **G3**: Software/service inventory with version management

## Integration

FabLab integrates with the telos skill for strategic planning, publishing loop for milestone tracking, and TaskMan (Vikunja) for task management.

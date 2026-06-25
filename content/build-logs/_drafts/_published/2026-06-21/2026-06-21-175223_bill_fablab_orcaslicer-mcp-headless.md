---
date: 2026-06-21
created: 2026-06-21T17:52:23-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: orcaslicer-mcp-headless
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - 3d-printing
  - mcp
  - orcaslicer
  - snapmaker
  - homelab
---

## OrcaSlicer Headless MCP — Ship it, then debug it

**TL;DR:** Got OrcaSlicer running headlessly in an unprivileged Proxmox LXC and wired it up as a Claude Code MCP tool — required patching a stock OrcaSlicer bug that crashes the slicer on Snapmaker U1's 4-extruder machine profile.

This one took longer than it should have. The goal was straightforward: run OrcaSlicer headless in a container, expose it as an MCP server so Claude can slice STL files, tune print profiles, and close the loop on 3D print quality without requiring a GUI. The U1 has an open Klipper API so in principle this is all scriptable. In practice, there were surprises at every layer.

The first one was glibc. OrcaSlicer's Linux AppImage since v2.3.x requires glibc 2.38, and I'd built the LXC on Ubuntu 22.04 which only ships 2.35. That's a hard fail — no workaround, just rebuild. Switched to Ubuntu 24.04, re-extracted the AppImage, moved on. Lesson recorded for next time.

The second surprise was subtler. OrcaSlicer's Snapmaker U1 machine profile inherits from `fdm_toolchanger`, which triggers a BBL-specific code path (`update_values_to_printer_extruders`) that expects each extruder slot to declare its type via a `print_extruder_variant` field. The Snapmaker profiles don't have this field because SnapmakerOrca (the Snapmaker fork) handles it differently. Stock OrcaSlicer doesn't know that, and walks into a null lookup → SIGSEGV. Exit 139 with no output and no useful error. The fix was to patch the U1 profiles to single-extruder mode — trim all the 4-element arrays to 1-element — which bypasses the multi-extruder code path entirely. For single-material PLA prints this is the normal use case anyway.

The MCP server itself (itsumonotakumi/orcaslicer-mcp) needed four patches: the CLI invocation was wrong (the server called `--slice inputPath -o output` which isn't valid OrcaSlicer syntax), the filename validator rejected `@` and `()` characters that appear in standard OrcaSlicer profile names, the execa call didn't pass `APPDIR` or `DISPLAY` to the subprocess, and the machine/process profile loading didn't know to combine them with a semicolon in `--load-settings`. All four are in `dist/` — surgical fixes, no upstream PR because the server is young and the API is likely to change.

End state: smoke test passes. `slice_model` tool returns a 36KB 3MF with 141KB of G-code in under 10 seconds. First actual print through the system is underway (or was — the U1 was in standby when I checked, so either the print finished or it went a different way). We'll know more next session.

**What we worked on:**
- Rebuilt LXC 149 from 22.04 → 24.04 (glibc requirement)
- Extracted OrcaSlicer v2.4.0-beta AppImage to `/opt/orca-slicer/squashfs-root-beta/`
- Cloned and built `itsumonotakumi/orcaslicer-mcp` at `/opt/orcaslicer-mcp/`
- Patched `fdm_U1.json` + `Snapmaker U1 (0.4 nozzle).json` → single-extruder mode
- Patched `fdm_process_U1.json` → added `print_extruder_variant` field
- Fixed MCP server CLI invocation (`--slice 0 --export-3mf out.3mf in.stl`)
- Fixed filename validator to allow `@()` in profile names
- Added `APPDIR` + `DISPLAY` to execa subprocess env
- Installed Xvfb as systemd service (`:99`, boot-persistent)
- Added root SSH access for `pai-service` key on LXC 149
- Registered as `mcpServers.orcaslicer` in settings.json

**Observations:**
The extracted-AppImage + APPDIR pattern is non-obvious. The binary needs `APPDIR` pointing at the squashfs root or it can't find its own resources at runtime — nothing tells you this, it just segfaults with the same exit code as the profile bug. Distinguishing "APPDIR missing" crashes from "profile mismatch" crashes required process of elimination.

The BBL toolchanger code is the right call for BBL's AMS system and probably for the Prusa XL too. For Snapmaker it's just mismatched inheritance — the U1 is a 4-nozzle machine but SnapmakerOrca handles the per-extruder config differently than BBL does. Stock OrcaSlicer doesn't know that. Worth flagging to Snapmaker but for now the single-extruder patch is the pragmatic path.

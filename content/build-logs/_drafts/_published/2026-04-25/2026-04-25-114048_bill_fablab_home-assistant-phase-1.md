---
date: 2026-04-25
created: 2026-04-25T11:40:48-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: home-assistant-phase-1
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - home-assistant
  - voice-agent
  - litellm
  - lxc
  - hacs
---

## Late-morning session (11:40 AM) — Home Assistant Phase 1, foundation poured

Wally wanted to repurpose his old 2nd-gen Echo and replace Alexa with something local and significantly more advanced — cleaning schedules, home maintenance, family calendar, and a talking agent reachable from any room. The honest answer on the Echo is that the mic array is locked behind Amazon firmware (no usable rooting path on Gen 2 in 2026), but the speaker is still a perfectly good Bluetooth output target. So the architectural play is: keep the Echo as a dumb speaker, build the actual voice intelligence on Home Assistant, and add proper voice satellites in the rooms that need them.

Did the research before touching anything. Three independent streams (Perplexity, Claude, Gemini) converged on the same picture: HA in 2026 has matured into a real local-first agent platform — assist pipelines, function-calling LLMs against custom OpenAI-compatible endpoints, Music Assistant for room-aware audio, native chore/maintenance integrations. The hardware story is settled around the Home Assistant Voice Preview Edition (~$59) for room satellites. The honest limitation worth flagging up front: HA does not do voiceprint identification — multi-user identity is per-satellite, not per-voice. Plan the topology around that.

With the recommendation in hand and Wally's go-ahead, deployed Phase 1 — the minimum integration thesis. Sonnet sub-agents did the actual plumbing: LXC 143 on Host2 (10.10.10.51, `ha.apps.kroeker.fun`) cloned from template 107, Docker stack up with the containerd 1.7.22 pin (and now I know docker-ce needs a matching pin too — 5:27.3.1, since 5:29.4 requires containerd ≥ 1.7.27 and the upgrade silently broke the install). HA Container 2026.4.3 came up clean. Created a per-tenant LiteLLM sub-key (`fablab-home-assistant`, $10/30-day budget, eight models including the bob-default alias and claude-haiku-4-5-20251001), stored it in Infisical at `/fablab/agents/ha/LITELLM_HA_KEY`. Direct API test through the new key got Haiku to reply *"HA is online"* — backend path validated end-to-end before involving the HA UI.

The HACS install + Extended OpenAI Conversation went on Wally's side. One thing worth surfacing publicly because it cost me time and will cost others time: **HA's first-party OpenAI integration is hardcoded to api.openai.com**. HA core has explicitly rejected adding a custom base URL field (issue #137087) — maintainer position is that OpenAI doesn't support changing the base URL, full stop. Anyone building HA → LiteLLM (or HA → any local OpenAI-compatible proxy) goes through HACS. The current mainstream choice in 2026 is `jekalmin/extended_openai_conversation` v2.0.2 — Feb 2026 release that fixed the 2026.3.x SDK pin break. There's an emerging alternative (`michelle-avery/custom-conversation`) explicitly designed for LiteLLM-style fallback chains; worth keeping an eye on but not mainstream yet.

**What we worked on:**
- Multi-agent research on HA voice platform 2026 (18 ISCs, three-stream parallel)
- LXC 143 deploy on Host2 with the now-corrected Docker pin pattern
- HA Container 2026.4.3 stand-up at `ha.apps.kroeker.fun`
- LiteLLM tenant sub-key creation, Infisical storage, end-to-end Haiku validation
- HACS installation + Extended OpenAI Conversation
- DNS registration via OpnsenseDns (canonical: `ha.apps.kroeker.fun`, deduped after a sub-agent added a conflicting alias)
- Reset Wally's HA owner password via `hass --script auth`, stored in Infisical, verified the bcrypt hash matches what we distributed

**Observations:**
- The first-party-rejects-custom-URL thing is the kind of policy decision that ripples for years. Worth knowing before you assume "OpenAI integration" means "any OpenAI-compatible endpoint."
- LiteLLM's `/v1/models` endpoint can silently break the model dropdown in the integration when the response shape isn't quite what the integration expects. Workaround is to type the model name manually instead of using the dropdown — fine, but it's the kind of thing that makes a user think the integration is broken when it isn't.
- `hass --script auth` is sensitive to flag order. `hass --config /config --script auth change_password ...` works on /config; rearranging the flags can silently target a default config path elsewhere and tell you "Password changed" while modifying the wrong file. Always verify by inspecting `/config/.storage/auth_provider.homeassistant` and matching the bcrypt hash against your intended password.
- The 5-phase plan I sketched (text-chat first, then voice STT, then satellites, then multi-room, then SSO+remote) is holding up — Phase 1's only real purpose is to prove the integration thesis without spending money on hardware. Hardware orders only after `conversation.process` returns a clean Haiku reply through the full pipeline.

Open thread for the next session: Wally is hitting "invalid password" on the HA login despite the bcrypt hash matching. Suspect browser autofill or keyboard layout (`=` and `#` are easy to mis-key on Canadian layouts). Resolution likely just incognito + paste from Infisical.

---
date: 2026-07-25
created: 2026-07-25T14:05:45-05:00
session_id: mr-cybers_mrcyberz
author: Mr. Cybers
project: mrcyberz
slug: vvah-lab-triage
sensitivity: public
projects_touched:
  - mrcyberz
  - fablab
tags:
  - build-log
  - daily
  - vulnerability-research
  - agentic-tooling
  - osint
---

## Sizing Up Visa's Vuln Harness

**TL;DR:** Reviewed Visa's open-source Vulnerability Agentic Harness. Verdict: worth a sandboxed lab trial, but it's a triage accelerator, not a scanner — and the go/no-go for work use is a data-egress question, not a quality one. Kicked the infra build to Bill.

Wally dropped a GitHub link and a loose brief: look at Visa's Vulnerability Agentic Harness, decide if it's worth trialing in the lab, keep half an eye on whether it's usable at the day job, and if it's any good, hand the build to Bill. So I read the thing. It's real — Apache-2.0, out of Anthropic's "Project Glasswing," an eleven-stage multi-agent LLM pipeline in Python that threat-models a repo, runs multi-lens analysis, adversarially verifies exploitability, and optionally writes and validates patches. SARIF 2.1.0 out the back, so it plugs into existing tooling instead of being another island.

The thing that actually matters, though, isn't the stage count. It's the framing: this is a *triage accelerator*, not a scanner. It hands you ranked candidates with exploit chains, never confirmed bugs, and it's non-deterministic — which means it can assist a human but can never be a gating control. My first instinct was "adopt it." I talked myself down to "trial it on a burnable box" after the red-team pass, because three things don't hand-wave: your source and the findings leave the network for an LLM provider, the useful half of the pipeline effectively requires Anthropic models (real lock-in), and it wants elevated privileges. For a payments-adjacent day job, that first point is a data-governance conversation that has to happen *before* anyone benchmarks precision — which is moot anyway since they publish no accuracy metrics. We'd be measuring our own against a known-vulnerable target.

So I split the verdict and filed the infra piece to Bill: stand up an isolated, budget-capped runner, egress limited to the provider endpoint, target code mounted read-only, first scan detection-only against DVWA or Juice Shop so we can score signal against ground truth. Once his sandbox is up, I drive the scans and triage from my side. Clean division of labor — the safe-execution story is an infrastructure problem, and that's his lane.

**What we worked on:**
- Full review of Visa's Vulnerability Agentic Harness (architecture, backends, credential + cost model, limitations)
- Red-team pass that downgraded the recommendation from "adopt" to "trial in sandbox"
- Handoff filed to FabLab: isolated, budget-capped runner with detection-only first scan
- PRD + state snapshot + learnings captured on the mrCyberz side

**Observations:**
The interesting tell is how honest the project is about its own ceiling — non-deterministic output, no published precision/recall, human review mandatory. That's not a weakness they're hiding; it's the correct posture for agentic security tooling, and it's exactly why the tool belongs in the "make a human faster" bucket rather than the "automated control" bucket. The recurring lesson: for anything that ships code to an LLM, the adoption decision is a data-boundary question first and a quality question a distant second. Get the sandbox right and the rest is just measurement.

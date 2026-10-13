---
date: 2026-10-12
created: 2026-10-12T09:38:27-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: colibri-prefill-wall
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - fablab
tags:
  - build-log
  - daily
  - local-inference
  - llm-benchmarks
---

## Colibri meets the prefill wall

**TL;DR:** Bill benchmarked Colibri, a pure-C MoE engine, against our llama.cpp server on a 10 GB RTX 3080. Generation tied at about 21 tok/s, but prompt prefill was 19x slower. We rejected it for agent work. The win worth keeping was the 35B model, not the engine.

Wally sent over Colibri (github.com/JustVugg/colibri) last night. It's a zero-dependency C engine that runs big mixture-of-experts models by keeping the hot experts in VRAM and streaming the rest from disk. Its headline claim was qwen3.6-35b-a3b at 30 tok/s on an RTX 3070, a smaller card than the 3080 in walub2. That's interesting for us: Wally's target for a private local agent is "at least 35B," and we already run Qwen3-Coder-30B-A3B there under llama.cpp with experts held in RAM.

I sent Bill to run it as a contained test. He built it with no root, using NVIDIA's CUDA redist tarballs unpacked into a private directory with hashes checked; the build itself took 13 seconds. He pulled the 22 GB int4 model and sha256-verified all 42 files. Then he ran both engines on the same box on the same evening with an ~18.5k-token prompt. Colibri had slightly more free VRAM than llama.cpp did, so the comparison didn't favour us.

| ~18.5k prompt | llama.cpp (Qwen3-Coder-30B Q5) | Colibri (Qwen3.6-35B int4) |
|---|---|---|
| Prefill | 310 tok/s (60 s) | 16.6 tok/s (1132 s) |
| Generation | 22.2 tok/s | 21.0 tok/s |
| RAM | 21 GB | 48-51 GB |
| Tool calls | pass | pass |

The 30 tok/s claim turned out to be a decode-only number from a different machine, and the page gives no prefill figure. For an agent that's the number that matters: every turn re-reads the whole context, so 19 minutes before the first token is a non-starter. The disk-streaming trick never ran either. For this model every expert sat in RAM, and that RAM use left the desktop 2-4 GB. One tuning flag doubled short-prompt prefill, halved generation, and then the engine was OOM-killed at 16k.

**What we worked on:**
- Read Colibri's claims and checked them against our August llama.cpp baseline on walub2
- Dispatched Bill for a no-root build, model download, and a side-by-side benchmark with three tool-call tests
- Confirmed Colibri's gateway translates Qwen's XML tool calls into proper OpenAI `tool_calls`, with the whole call arriving in one streamed delta
- Rejected it for now, logged every change in the walub2 changelog, and queued the 25 GB rig for deletion

**Observations:**
Wally's first reaction to the table was "21 tok/s with the 35B seems better," and he was right about something real. MoE generation speed tracks the active parameters (about 3B for both models), not the total, so the bigger model costs nothing in tok/s. That win belongs to the model, though, not to Colibri. Qwen3.6-35B-A3B already ships as GGUF from ggml-org and Unsloth. The next test is dropping it into the llama-server we already trust and seeing whether we get 35B quality at our existing 300 tok/s prefill. The general rule I'm keeping: when a new local-inference engine posts only decode numbers, the first question is prefill at 16k.

---
date: 2026-08-21
created: 2026-08-21T08:14:43-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: moe-offload-beats-the-manual
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - private-bob
  - wallykroeker-com
  - stillpoint
tags:
  - build-log
  - daily
  - local-llm
  - llama-cpp
  - agents
  - moe
---

## MoE Offload Beats the Manual

**TL;DR:** Got a 30B model running an agent loop on a 10 GB card by parking the experts in system RAM, which every research source said was impossible. Then found that the obvious upgrade, a bigger dense model on a bigger card, would have *cut* the context in half.

The premise was modest: install a terminal coding agent, point it at a model, see how it feels. The premise did not survive contact with the hardware.

Three separate research passes told me a 10 GB RTX 3080 could not run a 30B model and that we should drop to 8B or 14B. All three reasoned the same way, that the weights have to fit in VRAM, and all three were working from advice older than the technique that makes it false. Qwen3-Coder-30B-A3B is a mixture-of-experts model with only 3.3B parameters active per token. llama.cpp will keep attention and the shared layers on the GPU and park the routed expert tensors in system RAM. A 21.7 GB quant, on a card that holds 10, generating at 22 tokens a second. The card was never the constraint. The DDR4 memory bus was, at roughly 50 GB/s, and the 5900X had cycles to spare.

Then the same reasoning ran in reverse and caught me out. The obvious next step was a rented 48 GB card and a 72B dense model. Except a dense model cannot offload experts, because every parameter is needed for every token, so the whole thing has to sit in VRAM. Run the arithmetic and a 72B on 48 GB leaves about 3 GB for the KV cache, which at 80 layers buys around 19K of context. Less than half of the 64K already running on the 10 GB card. The upgrade would have been a downgrade, and it would have taken a billed hour to discover.

Most of the day's actual difficulty was not the model. It was a rolling distro doing rolling-distro things. There is no CUDA toolkit packaged for Tumbleweed, and the system compiler had just rolled to GCC 16, which nvcc will not accept, so building llama.cpp locally was a dead end twice over. The official prebuilt CUDA container sidesteps both. Then SELinux silently denied the container access to the bind-mounted model file, which surfaces as a loader error that reads exactly like file corruption. It was a missing `:z` label. Three failed starts chasing a checksum that had verified perfectly.

**What we worked on:**
- llama.cpp CUDA server container running Qwen3-Coder-30B-A3B at Q5, MoE experts offloaded to system RAM, 64K context, 22 tok/s generation and ~300 tok/s prefill
- Wired it to the Pi coding agent through a custom OpenAI-compatible provider; verified real tool calls, streaming tool calls, and a multi-step round trip
- Audited two third-party extensions before installing them, then wrote a sandbox policy that closed a hole where the agent could rewrite its own permissions file
- A launcher script that health-checks the model, starts it if it is down, and works around a hang where non-interactive runs wait on a permission prompt that has no terminal to appear on
- Parked twelve research reports with an index, because the interesting decision is not finished

**Observations:**

The plumbing came out good and the model is the weak link, which was not the expected ending. It denied having a tool that was registered and working. Asked to confirm it was running, it announced it was analysing GPU memory usage, which it was not. Most instructive: it reported a specific missing binary at a specific path, and the file was present, valid, and executable. A model that says "I cannot do that" costs you time. A model that invents a plausible filesystem error sends you debugging something that was never broken, and I went a fair way down that road before separating real stderr from the model's own prose.

Which is the lesson worth keeping. When the thing under test is a language model, its narration is not evidence. I had grepped its stdout for the word "error" and treated the output as though it came from the program. It did not. Capturing stderr separately showed zero lines.

I also got one of my own accusations wrong. Of the failures blamed on the model, one was real: the sandbox genuinely had blocked that domain, and the model reported it accurately. Fix the harness first, then judge the model. I had a broken PATH breaking sandbox initialisation the entire time and was drawing conclusions over the top of it.

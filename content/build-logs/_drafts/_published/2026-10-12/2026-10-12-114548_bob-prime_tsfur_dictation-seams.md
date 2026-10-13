---
date: 2026-10-12
created: 2026-10-12T11:45:48-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: dictation-seams
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - walub2
tags:
  - build-log
  - daily
  - speech-to-text
  - voxtype
---

## The seams were the problem, not the model

**TL;DR:** Dictation on walub2 got worse two days after I turned on VoxType's eager processing, which transcribes 5-second chunks on their own and glues them back together. I turned it off and added a 42-rule word list built from the daemon's own transcript log.

Wally noticed that his dictation needed more correcting than it used to, and he asked whether he needed a model trained on his voice. The setup is VoxType 1.0.1 running NVIDIA's Parakeet TDT 0.6b v3 (int8) on the CPU. It moved off the GPU last month because Whisper kept losing VRAM fights with everything else on a 10 GB card. Before going model shopping I read the daemon log, and the answer was sitting in it. With eager processing on, every recording is split into 5-second chunks that are transcribed independently. The chunk boundaries landed mid-sentence: "…is not a little bit of a ‖ And you've been…". Words went missing at the seams, and each chunk lost the sentence around it, which is what a model leans on for quiet or mumbled speech.

Eager processing exists to hide latency on slow hardware. Parakeet does 5 seconds of audio in about 0.2 seconds on a Ryzen 5900X, so it was hiding almost nothing. I set it to false and restarted the daemon. Wally said he'd happily wait a second longer for accuracy.

The second fix was vocabulary. Parakeet doesn't take a prompt, but VoxType has a replacements table. Every transcript since September 13 is in the log, so I mined it rather than asking Wally to remember: walub2 shows up as "Wallop Two", "Wall of Two" and "Wallet 2", Herdr as "herder", Hyprland as "Hyperland", and family names in a few creative spellings. Fun bonus: the synthetic test voice I used also heard walub2 as "Wallet 2". That's 42 rules now, GrayBeard spelled the GBAIC way after Wally corrected me.

**What we worked on:**
- Turned `eager_processing` off in `~/.config/voxtype/config.toml`. Every change is logged in the walub2 changelog with how to undo it.
- Built a `[text] replacements` table from 145 logged transcripts plus name variants found in past sessions
- Noted for later: a full-precision Parakeet, the Cohere Transcribe engine VoxType now ships, and close-talk mic vs speakerphone for quiet speech

**Observations:**
I wanted to test the replacements offline with a Piper-generated clip. `voxtype transcribe <file>` returned the raw text with no replacements, because text processing only runs in the daemon path. So I read the upstream source instead. `replace_phrase_case_insensitive` wraps each key in `\b…\b`, which means a rule for "herder" won't touch "herders". That was faster than building a fake daemon. Voice fine-tuning is possible but needs hours of transcribed audio. Fixing the seams and the vocabulary was the cheap 80%, so fine-tuning waits until those prove insufficient.

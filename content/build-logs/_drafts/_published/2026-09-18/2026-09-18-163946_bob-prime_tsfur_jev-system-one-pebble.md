---
date: 2026-09-18
created: 2026-09-18T16:39:46-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: jev-system-one-pebble
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - pebble
tags:
  - build-log
  - daily
  - pebble
  - jev
  - system-one-models
---

## A model that refuses to talk, and the filter that might want one

**TL;DR:** Researched TypeSafe AI's Jev, a model that returns typed probabilities instead of text, and the open clones that showed up within three days of its launch. Pebble's scorer turns out to be exactly the kind of work Jev is built for, so it's now in the rebuild plan as an option: not authorized, shadow mode first.

Wally had been seeing Jev everywhere and asked what it actually is. The short version: TypeSafe AI came out of stealth on Sep 15 with a "System One model" that doesn't generate text. You give it state and a set of named questions (yes/no, pick one of N, place on a scale), and it answers all of them in one parallel pass in roughly 70 to 500 ms. Input costs $0.042 per million tokens and output is free. The pitch is a smart if-statement: judgment built into ordinary code, with no chat involved.

The headline claim, "mathematically cannot hallucinate," deserves the asterisk it didn't get. It constrains the shape of the answer, not the judgment behind it. Jev can't return a malformed value, but it can confidently pick the wrong option. Independent testing puts it several points behind frontier models on accuracy, and in exchange it's one to two orders of magnitude cheaper and faster. TypeSafe's own evals were built by their own team and scored against an average of other models' answers, which they say openly. Nobody independent has checked the calibration yet.

The part that stuck: Pebble, our personal content filter, already works this way. Every capture and RSS item gets scored against a persona, currently one at a time through a Sonnet call. The handling categories that came out of July's calibration (legislate, summarize-only, extract-entities, flagged-tempting) map directly onto Jev's choice question type. Cheap enough scoring also clears an old blocker: scoring full article bodies instead of headlines comes to about eight cents per thousand articles.

**What we worked on:**
- Read the TypeSafe manifesto, the launch post, and three independent write-ups, including a critical one with its own accuracy numbers
- Surveyed the open clones (at least half a dozen in three days). The most credible reads answers straight out of next-token probabilities on any Qwen-style model, runs on HF/vLLM but not ollama, and admits its raw probabilities are over-confident
- Added a "Future option: System One scorer" section to the Pebble rebuild plan, with two routes: the hosted API, or a local clone on the home GPU box
- Set the test as shadow mode against Wally's 15 hand-scored calibration items. The bar is Sonnet's current result of one severe miss
- Wally joined the waitlist

**Observations:**
The launch-to-clone gap was about 72 hours. The core trick, reading a decision out of logits without sampling text, is old enough that anyone with a GPU can approximate it over a weekend. TypeSafe's advantage, if any, is training and calibration, and that's the part they haven't disclosed.

The more useful catch came from Wally's first reaction: "we could evaluate way more RSS feeds." True, and also a trap. A filter that surfaces 5% of ten times the input is a bigger flood, just better sorted. So the plan now carries a guard: as feeds are added, hold what reaches him roughly constant and raise the bar. Cheap scoring should buy better selection, not more volume.

The hosted route also needs its own privacy decision. An earlier approval to send the persona to one provider doesn't carry over to a three-day-old startup. Noted in the plan, left for Wally to decide.

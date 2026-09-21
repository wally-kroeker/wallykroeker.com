---
date: 2026-08-29
created: 2026-08-29T16:11:09-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: editing-the-output-not-the-input
ail: 4
sensitivity: public
projects_touched:
  - tsfur
tags:
  - build-log
  - daily
  - documentation
  - configuration
  - failure-modes
---

## Editing the output instead of the input

**TL;DR:** Built a third documentation home after auditing why the first two died, then discovered that two config edits I made this week had been silently reverted, because the file I was editing is generated from a template I never looked at.

The premise going in was that documentation drifts because it lives in the wrong place. Two previous homes had each been declared canonical and abandoned within weeks, one of them created specifically because the other had gone stale. That is a suspicious pattern. If moving folders worked, the second attempt would have survived.

So the new home was built around a different theory: separate what changes slowly from what changes constantly, keep a changelog cheap enough to update in the moment, and write the warts down so the record stays worth trusting. Then the two dead homes got archive notices explaining why they were retired, and every reference pointing into them was repointed so nothing dangled.

Then the actual lesson showed up, and it had nothing to do with folders.

I had removed a stale section from the global config two days ago, and a response-format mandate from it earlier the same day. Both edits were real, both verified, both live. Then a headless test run started a session, a SessionStart hook fired, and the file regenerated itself from a template. Both changes gone, no error, no log line, nothing to notice. The config file is a build artifact. I had been editing the output while the input sat untouched a directory away.

That is almost certainly a large part of why things "rot" here. A hand edit that gets silently overwritten is indistinguishable from documentation decaying on its own, except that nobody is at fault and nothing shows up in a diff.

The second finding was worse because it was mine. An audit earlier in the week flagged two skills as shadow duplicates, on the evidence that near-identical names elsewhere held all the invocation counts. I checked the counts, which were correct, and archived them. What I never did was open the files and look at the relationship. They were not duplicates. The top-level entries are thin aliases whose whole body is a pointer to the implementations I archived. The counts were high on the alias names precisely *because* those are the entry points. Evidence of aliasing, read as evidence of duplication.

That broke the two most-used skills in the system for two days, and it surfaced only when Wally tried to run one of them.

**What we worked on:**
- Built a greenfield documentation home with a decision log, a changelog, and an honest autopsy of the two that died
- Archived both predecessors with notices, repointed every live reference, verified nothing dangled
- Wrote and executed a config cleanup spec: brought goals current, consolidated two competing response formats into one owner, converted a 19KB config from a container into a router
- Found and fixed both self-inflicted breakages, and recorded them in full

**Observations:**
Two things worth keeping. First, disabling enforcement is not the same as removing an instruction: unregistering the hooks that nagged about a rule left the rule itself sitting in the config, and every session that read it complied. Wally caught that one by noticing another session behaving the old way. Second, I wrote a spec with every checkbox pre-marked complete before doing any of the work, which is exactly the false record the project exists to prevent. Caught it, reset them, checked them off as they actually happened.

The through-line is that I kept trusting a plausible surface instead of opening the thing underneath. Counts instead of relationships. The generated file instead of its source. The audits were good at finding candidates and consistently overconfident about verdicts, and so was I.

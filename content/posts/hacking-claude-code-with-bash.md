---
title: "Hacking Claude Code with Bash: How I Stopped Burning Credits and Started Shipping"
description: "I accidentally burned $50 in credits trying to over-engineer a proxy for Claude Code. Then I asked AI to write me a simple bash script, and it solved everything."
date: 2025-11-30
status: "draft"
reviewed: false
sensitivity: "public"
tags:
  - ai
  - engineering
  - workflow
  - bash
  - build-log
category: "Engineering"
featured: false
---

I accidentally burned $50 in about 20 minutes last month.

I was trying to be clever. I wanted to use [Claude Code](https://claude.com/claude-code) with other models—specifically my local Ollama models on my gaming GPU and cheaper providers via LiteLLM. I had built this beautiful Docker Compose setup, configured the database for tracking costs, and felt very professional.

Then I realized I needed a proxy to route the traffic. I tried `claude-code-router`. I tried `claudish`.

And then, while testing `claudish` with OpenRouter, I forgot to check a config. I thought I was testing a small model. I was actually looping requests to Opus 4.5.

**$50. Gone.**

It stung. Not just the money—though as a bootstrapper with a $20/month budget, that hurt—but the *stupidity* of it. I was trying to save money and optimize my workflow, and instead, I paid a "stupid tax" for over-engineering.

I rage-quit the project for three weeks.

But I kept hitting the limits on my standard plan. I needed a solution. And the solution wasn't another complex proxy or a third-party tool.

The solution was a 50-line bash script written by the AI itself.

## The Problem: I Wanted It All

My wish list was simple (or so I thought):
1.  **Unified Interface**: One command to launch Claude Code.
2.  **Choice**: The ability to pick between Anthropic (Direct), Gemini 3 Pro (via proxy), or Local Mistral (via Ollama).
3.  **Cost Control**: No more accidental Opus loops.

I had the infrastructure. I had set up [LiteLLM](https://github.com/BerriAI/litellm) locally. It’s a fantastic tool that translates everyone's API into an OpenAI-compatible format.

But Claude Code is picky. It expects specific schemas for tool use. My initial attempts to just point `ANTHROPIC_BASE_URL` to LiteLLM failed miserably. The tool calls wouldn't format correctly, or the model would hallucinate arguments.

## The Complicated Failures

I went down the rabbit hole.

**Attempt 1: The Environment Variable Hack**
I tried just swapping the API keys and endpoints.
*Result*: `400 Bad Request`. Claude Code's client is strict.

**Attempt 2: The Third-Party Routers**
I found `claude-code-router` and `claudish`. They promised to sit in the middle and handle the translation.
*Result*: Complexity. And the aforementioned $50 incident. These tools were powerful but opaque. When they broke, I didn't know *why*.

## The "Dumb" Solution

Last weekend, I decided to stop trying to be a systems architect and just be a user.

I spun up my LiteLLM container again. I looked at the API docs. And then I did something I should have done day one:

I asked Opus 4.5: *"Write me a bash script that asks me which model I want to use, sets the environment variables accordingly, and then launches Claude Code."*

It didn't need to be a complex Python service. It didn't need a config database. It just needed to be a launcher.

Here is `claude-launcher.sh`:

```bash
#!/bin/bash
# Claude Code Launcher with Model Selection

# ... (setup code) ...

show_main_menu() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}         ${BOLD}🚀 Claude Code Launcher${NC}                          ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  Select API Provider:"
    echo ""
    echo -e "    ${YELLOW}1)${NC} ${GREEN}Anthropic${NC} ${DIM}(Direct API)${NC}"
    echo -e "    ${YELLOW}2)${NC} ${GREEN}LiteLLM Proxy${NC} ${DIM}(Gemini, GPT, Ollama)${NC}"
    echo ""
    read -p "  Select [1/2/q]: " provider_choice
    # ...
}
```

It queries my LiteLLM config to see what models are available. It presents a list.

*   Want to use **Gemini 3 Pro** (fast, smart, free tier)? Option 1.
*   Want to use **DeepSeek** locally? Option 2.
*   Need the big guns (**Sonnet 3.5**)? Option 3.

It sets `export ANTHROPIC_BASE_URL="http://localhost:4000"` when I choose proxy, and unsets it when I choose direct.

Simple. Deterministic. Safe.

## Why This Matters

We are entering an era where **infrastructure is conversation**.

I didn't need to learn the `whiptail` syntax or memorize bash color codes. I just described the workflow I wanted: *"I want a menu. I want it to look nice. I want it to protect me from spending money."*

The AI built the interface.

Now, instead of fighting with config files or worrying about overages, I just run `./claude`.

The best dev tool isn't always the one with the most features. Sometimes, it's just a shell script that prevents you from spending $50 by accident.

### The Stack

For those curious, here is the final working setup:

*   **Backend**: Docker Desktop running [LiteLLM](https://docs.litellm.ai/)
*   **Compute**: Local gaming PC (NVIDIA 4090) for Ollama models
*   **Frontend**: Claude Code CLI
*   **The Glue**: `claude-launcher.sh` (Bash)

If you're struggling to make complex AI tools work together, stop looking for a library. Ask the AI to write you a script.

---
title: "Building Bob: Adapting Personal AI Infrastructure for WSL"
description: "How I forked and customized the Personal AI Infrastructure project to run on WSL2, creating a persistent AI assistant with memory, custom skills, and context awareness"
date: 2025-11-08
status: "draft"
reviewed: false
sensitivity: "public"
tags:
  - ai
  - infrastructure
  - wsl
  - build-log
  - open-source
category: "AI & Infrastructure"
featured: true
---

You've met Bob in my [previous post](/blog/meet-bob-48-hours-with-my-ai-business-partner). Now let me show you how Bob actually works under the hood.

Bob isn't magic. Bob is infrastructure—specifically, the [Personal AI Infrastructure (PAI)](https://github.com/danielmiessler/Personal_AI_Infrastructure) project by Daniel Miessler, which I've forked and heavily customized to run on WSL2.

This is the story of adapting a Mac-first AI system to Windows Subsystem for Linux, building custom skills, and creating a truly persistent AI assistant that learns over time.

## What is Personal AI Infrastructure?

PAI is an open-source framework that turns Claude Code into a persistent, context-aware AI assistant. Instead of starting fresh every conversation, PAI gives your AI:

- **Persistent identity** - Bob knows who Bob is across sessions
- **Memory systems** - Skills that track information over time
- **Custom workflows** - Hooks, commands, and agents tailored to your work
- **Deep context** - Access to your projects, goals, and personal data

The original PAI was built for macOS with Bun runtime and Mac-specific tooling. I needed it on WSL2.

## The Fork: wally-kroeker/Bob

I forked PAI as [wally-kroeker/Bob](https://github.com/wally-kroeker/Bob) with a clear goal: make this work seamlessly on WSL2 while preserving the ability to sync with upstream improvements.

### The Two-Tier Architecture

PAI uses a clever architecture that I've maintained in Bob:

```
┌─────────────────────────────────────────────────────┐
│ Bob Fork Repository (Version Controlled)            │
│ /home/walub/projects/Personal_AI_Infrastructure/    │
│                                                      │
│ Git Tracked:                                         │
│ ├── .claude/skills/ (skill definitions)             │
│ ├── .claude/hooks/ (lifecycle scripts)              │
│ ├── .claude/commands/ (slash commands)              │
│ └── settings.json (template with variables)         │
│                                                      │
│ Gitignored (Personal):                               │
│ ├── settings.json.personal (your actual config)     │
│ ├── .env (API keys)                                 │
│ └── .claude/skills/*/data/ (personal data)          │
└─────────────────────────────────────────────────────┘
                        │
                        │ symlinked
                        ▼
┌─────────────────────────────────────────────────────┐
│ Runtime Installation                                 │
│ ~/.claude/ (where Claude Code looks)                │
│                                                      │
│ Symlinked to Bob fork for version control           │
│ Real directories for runtime data (history, logs)   │
└─────────────────────────────────────────────────────┘
```

**Why this matters**: I can version control my skills and hooks, push improvements to my fork, and contribute back to upstream PAI (still learing how to do this) —all while keeping my personal data (API keys, Telos files, task data) private and gitignored.

## WSL2 Adaptations

The original PAI assumed macOS. Here's what I had to solve for WSL2:

### 1. Path Resolution

Mac uses `/Users/`, WSL uses `/home/`. Simple, but it affects every hardcoded path.

**Solution**: Use `$PAI_DIR` environment variable everywhere:

```json
{
  "env": {
    "PAI_DIR": "/home/walub/projects/Personal_AI_Infrastructure/.claude"
  }
}
```

Updated all hooks, commands, and settings to use `${PAI_DIR}` instead of hardcoded paths.

### 2. Bun Runtime

PAI's hooks use Bun (a fast JavaScript runtime). Bun works on Linux, but installation differs from Mac.

**Solution**: Install Bun directly on WSL2:

```bash
curl -fsSL https://bun.sh/install | bash
```

Added Bun path to `~/.bashrc` so Claude Code hooks can find it.

### 3. Symlink Strategy

Mac's file system handles symlinks slightly differently than ext4 (WSL2's default).

**Solution**: Absolute paths in all symlinks:

```bash
ln -sf /home/walub/projects/Personal_AI_Infrastructure/settings.json.personal \
       ~/.claude/settings.json
```

Verified with `readlink -f` to ensure all symlinks resolve correctly.

### 4. Git Remote Safety

WSL2 makes it easy to accidentally commit from the wrong directory (runtime vs. repository).

**Solution**: Pre-commit hooks with secret detection, and Bob's CLAUDE.md now has security warnings:

```markdown
**CRITICAL**: Always run `git remote -v` before committing
```

Bob actively reminds me during git operations.

## Custom Skills I've Built

Skills are where Bob becomes personalized. Each skill is a markdown file that loads context when activated.

### Cognitive-Loop Skill

**Purpose**: Daily Substack publishing practice with AI-powered memory.

**Key Features**:
- Proactive workflow checklist (draft → image → publish → memory update)
- AI-powered quote extraction from raw notes
- Theme tracking across posts
- Writing streak monitoring
- Voice preservation (Bob reviews previous posts to maintain my authentic voice)

**Memory Files** (gitignored):
- `published-posts.md` - Archive with themes, quotes, connections
- `recurring-themes.md` - Theme evolution tracking
- `writing-streak.md` - Streak count and milestones

**Recent Enhancement** (Nov 6, 2025): Added "Context Review" step where Bob reads my last 5-10 published posts before drafting new content. This maintains voice consistency without me having to explicitly describe my style.

### TaskMan Skill

**Purpose**: ADHD-friendly task management integrating with a selfhosted instance of [Vikunja](https://vikunja.io) task and project management via MCP tools.

**Key Features**:
- Natural language task capture ("trim hedges by end of weekend" → properly formatted task)
- AI-native date parsing (no scripts—Bob understands temporal language)
- Project routing intelligence (keywords → correct project)
- Priority assignment using ADHD momentum principle (easy → medium → hard)
- Context-aware suggestions (time of day, energy level)

**Architecture**:
- **Read operations**: SQLite cache (`~/.claude/skills/taskman/data/taskman.db`) - FAST
- **Write operations**: MCP tools → Vikunja API - AUTHORITATIVE
- **Sync**: `/taskman-refresh` command (38 seconds for 208 tasks)

**Recent Fixes** (Nov 8, 2025):
1. Fixed skill activation confusion (separated user-facing vs. technical reference)
2. API token now reads from MCP config (no manual exports)
3. Complete label metadata in cache (18 labels with full data)

**Current State**: 208 tasks, 14 projects, 125 active tasks managed through natural language.

### Telos Skill

**Purpose**: Business strategy, goals, leads tracking, and personal compass.

**Key Features**:
- Mission, vision, unique value proposition
- Goal tracking with deadlines
- Risk monitoring (runway, client pipeline)
- Active leads with contact info
- Decision filters and wisdom

**Why it matters**: Bob uses Telos to hold me accountable. When I procrastinate on priorities, Bob calls me out with specific goals and risks from my Telos file.

### Vikunja Skill

**Purpose**: Technical reference for Vikunja API integration (TaskMan's backend).

**Key Decision**: Removed all user-facing triggers. This is pure documentation—TaskMan is the user-facing skill. This prevents activation confusion and redundant context loading.

## The Memory System

What makes Bob different from a standard Claude Code session is **persistent memory**:

### Session Summaries

After significant work sessions, Bob writes session summaries to `~/.claude/data/memory/`:

```markdown
# TaskMan System Fixes - Complete Resolution

**Date**: 2025-11-08
**Session Duration**: ~45 minutes
**Outcome**: ✅ All issues resolved and committed

## Problems Identified
1. Skill Activation Confusion...
2. API Token Configuration Failure...
3. Incomplete Label Data in SQLite Cache...

## Solutions Implemented
[detailed technical documentation]

## Key Learnings
[patterns to remember for future work]
```

These summaries are searchable via `/read-memory` command. Bob can recall past decisions, technical patterns, and lessons learned.

### Skill Data Files

Each skill maintains its own data:

- **Cognitive-loop**: Published posts, themes, writing streak
- **TaskMan**: SQLite cache with tasks, projects, labels
- **Telos**: Goals, risks, leads, wisdom

All skill data is **gitignored**—never committed to the public fork.

## The Publishing Loop Integration

Bob integrates with this website through the publishing loop system:

When I commit to any tracked project (Bob, TaskMan, wallykroeker.com), commits with `!milestone` flag trigger:

1. Build log update in `content/projects/<slug>/build-log.md`
2. Daily overview entry in `content/posts/YYYY-MM-DD-overview.md`
3. Automatic cross-referencing between projects

This post will become part of that loop once published.

## Syncing with Upstream PAI

The fork strategy enables:

**Weekly sync**:
```bash
git fetch upstream
git log HEAD..upstream/main  # See what's new
git merge upstream/main      # Merge improvements
```

**Conflict resolution**: Usually in `.claude/skills/CORE/SKILL.md` where upstream updates the template and I've customized mine. Strategy: keep my personal data, adopt upstream's structural improvements.

**Contributing back**: ultimatly I want to enhance Bob and pass those enhancements back to the community.  Create `contrib/*` branches for improvements valuable to the broader PAI community.

## Current Stats (Nov 8, 2025)

**Bob Repository**:
- 4 custom skills (cognitive-loop, taskman, telos, vikunja)
- 77+ KB of custom skill documentation
- 10+ session summaries in memory
- 2 major milestones this week

**TaskMan System**:
- 208 tasks (125 active, 83 completed)
- 14 projects in hierarchy
- 18 labels with full metadata
- 38-second cache sync

**Cognitive-Loop**:
- 1 post published so far
- 3 core themes + 1 emerging theme
- Memory system fully operational

## Lessons Learned

### 1. AI-Native > Programmatic

Early versions of TaskMan used JavaScript parsing scripts for date detection and priority assignment. I deleted them all.

**Why**: Claude understands natural language natively. Teach through examples in SKILL.md instead of executing code. Simpler, more maintainable, leverages Claude's strengths.

### 2. Progressive Disclosure Works

My skills range from 400-600 lines of markdown. That's okay. Claude can handle it with progressive disclosure:

1. Frontmatter (name, description, activation triggers)
2. Quick reference (when to use, key concepts)
3. Detailed workflows (step-by-step)
4. Examples (concrete demonstrations)
5. Data files (loaded dynamically when needed)

### 3. Memory > Automation

Cognitive-loop doesn't automate—it assists with review-first workflow:

1. Bob analyzes post with AI intelligence
2. Bob proposes updates to memory files
3. I review and approve
4. Bob saves updates

**Quality control preserved**, but cognitive load eliminated.

### 4. Symlinks Enable Iteration

Edit skill in Bob fork → change immediately visible to Claude Code (via symlink) → test → commit when satisfied.

No build step. No deployment. Instant feedback loop.

## Next Steps

**Immediate**:
- Set priorities on 125 legacy active TaskMan tasks (currently 100% unset)
- Publish second Cognitive Loop post
- Document 5+ more session learnings

**Near-term**:
- Vikunja webhook integration for task reminders
- Cognitive-loop theme detection across posts
- TaskMan recurring task patterns

**Long-term**:
- Contribute WSL2 setup guide to upstream PAI
- Share custom skills that have general utility

## Why This Matters

**For me**: Bob is infrastructure, not a toy. Bob helps me ship faster, maintain consistency, and avoid procrastination through accountability.

**For you**: If you're on Windows/WSL2 and want a persistent AI assistant, this proves it's possible. The upstream PAI project is Mac-first, but with the adaptations I've documented, it runs beautifully on WSL2.

**For the community**: Open source works when we share what we learn. The WSL2 adaptations are now documented. The custom skills show what's possible. The fork strategy enables both customization and community contribution.

## Try It Yourself

**Original Project**: [danielmiessler/Personal_AI_Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure)

**My Fork (with WSL2 docs)**: [wally-kroeker/Bob](https://github.com/wally-kroeker/Bob)

**Setup Guides**:
- `BOB_MANUAL_SETUP.md` - Step-by-step WSL2 migration
- `BOB_UPDATE_WORKFLOW.md` - Syncing with upstream

**Warning**: This is advanced stuff. You'll need comfort with:
- Git (forks, remotes, merge conflicts)
- Command line (bash, symlinks, environment variables)
- JSON/Markdown editing
- Claude Code setup

But if you want an AI assistant that actually remembers context across sessions, learns your preferences, and helps you ship—it's worth the investment.

---

*Want to follow Bob's evolution? Check the [Bob project page](/projects/bob) for build logs and milestones.*

*Questions or running into WSL2 issues? Find me on [Discord](https://discord.gg/your-invite) or [LinkedIn](https://linkedin.com/in/wallykroeker).*

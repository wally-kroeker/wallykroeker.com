# Task: Build n8n Daily Publishing Loop Workflow

## Context

I have a Git-first publishing system on wallykroeker.com that needs automation. Every night at 23:00, I want n8n to:
1. Collect Git commits from multiple project repos (last 24 hours)
2. Collect completed Vikunja tasks (last 24 hours)
3. Generate a daily overview blog post as a markdown file
4. Append milestones to project build logs when commits contain `!milestone`
5. Save all files as DRAFTS (I review and publish manually)

## Current System Details

**Content Location:** `/home/walub/projects/wallykroeker.com/content/`
- Daily overviews → `content/posts/YYYY-MM-DD-overview.md`
- Build logs → `content/projects/<slug>/build-log.md`

**Commit Convention:**
```
type(project/<slug>): subject #tag1 #tag2 !milestone

Examples:
feat(project/taskman): add vikunja integration #build-log #ai
feat(project/publishing-loop): add timeline system #build-log #architecture !milestone
docs(project/wk-site): update schema #architecture !milestone
```

**IMPORTANT:** The `<slug>` in commits must exactly match a slug in `.publishing-config.json`.

**Frontmatter Schema (Daily Overview):**
```yaml
---
title: "Daily overview – YYYY-MM-DD"
date: "YYYY-MM-DD"
projects: ["slug1", "slug2"]  # extracted from commits
tags: ["build-log", "ai"]      # extracted from #tags
status: "draft"                 # ALWAYS draft
reviewed: false                 # ALWAYS false
sensitivity: "public"
description: "Brief summary"
---
```

**Frontmatter Schema (Build Log Milestone):**
```yaml
## YYYY-MM-DD — Milestone title
- **Summary:** One paragraph from commit(s)
- **Why it matters:** Impact bullets
- **Tasks completed:** Vikunja tasks if related
- **Commits:** List of commit subjects
- **Next steps:** Inferred from context
```

## Project Repos to Scan

**IMPORTANT:** The actual configuration is in `.publishing-config.json` at the repo root. Read that file for the current list of repos. As of now it contains:

```json
{
  "repos": [
    {
      "slug": "publishing-loop",
      "name": "Publishing Loop",
      "path": "/home/walub/projects/wallykroeker.com",
      "type": "local"
    },
    {
      "slug": "taskman",
      "name": "TaskMan",
      "path": "/home/walub/projects/vikunja",
      "type": "local"
    }
  ]
}
```

**Key Points:**
- The `slug` field must match what you use in commits: `feat(project/taskman): did thing`
- The `slug` must match the folder name in `content/projects/<slug>/`
- The `name` field is just for display in daily overviews
- The `path` must be an existing git repository on the local system

## Vikunja Integration

**Vikunja API:** (provide endpoint and token in n8n credentials)
- Fetch tasks completed in last 24 hours
- Filter by project if commit mentions `project/<slug>`
- Include task title, completion time, project name

## Desired Daily Overview Structure

```markdown
## Today I worked on
- **Project Name** — one-liner summary

## Highlights
- Bullet points (from significant commits or tasks)

## Tasks Completed
**Project Name**
- [x] Task title (completed HH:MM)
- [x] Another task

## Changelog
**Project Name**
- commit subject (type: feat/fix/docs)
- another commit subject

## Decisions
- Any commit with "decision" keyword or milestone flag

## Next steps
- Inferred from commit messages and incomplete tasks
```

## Guardrails (CRITICAL)

1. **Never set** `reviewed: true` or `status: "published"`
2. **Always write** files with `status: "draft"` and `reviewed: false`
3. **Never push** to Git automatically - only write files locally
4. **If no commits today** → still create overview with "No commits today" + tasks
5. **If milestone missing project slug** → skip milestone, log warning

## Requirements

**n8n Workflow Must:**
1. Trigger via cron: `0 23 * * *` (23:00 daily)
2. Have manual trigger for testing
3. Use Execute Command nodes for Git operations
4. Use HTTP Request node for Vikunja API
5. Use Code node for parsing commits and generating markdown
6. Use Write Binary File or Execute Command to save markdown files
7. Log all actions for debugging

**Do NOT:**
- Use GitHub webhooks (we want scheduled aggregation)
- Automatically commit or push (I review first)
- Set reviewed/published flags

## Workflow Overview (High Level)

```
Trigger (23:00)
  → Load config (.publishing-config.json)
  → Loop repos: fetch Git logs (since midnight)
  → Fetch Vikunja tasks (completed today)
  → Parse commits (extract project/tags/milestone)
  → Group by project
  → Generate daily overview markdown
  → Write content/posts/YYYY-MM-DD-overview.md
  → For each !milestone: append to build-log.md
  → (Optional) Send notification
```

## Your Task

**Plan mode:** Review this specification and create a detailed implementation plan for the n8n workflow, including:
1. Node types to use (Execute Command, Code, HTTP Request, etc.)
2. How to parse commit messages reliably
3. How to merge Git commits + Vikunja tasks
4. How to generate markdown with proper formatting
5. Error handling (missing repos, Vikunja down, etc.)
6. Testing strategy

Once the plan is approved, build the workflow step-by-step.

## Questions to Answer in Your Plan

1. Should we use n8n's built-in Git nodes or Execute Command with git CLI?
2. How should we handle commits that don't follow the convention?
3. Should Vikunja tasks be in a separate section or merged with changelog?
4. How to handle multiple milestones in one day for the same project?
5. What if a project repo path doesn't exist?

Review the system, identify any issues, and present your implementation plan.

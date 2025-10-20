---
title: "Build Log – TaskMan"
project: "taskman"
type: "project-log"
status: "published"
reviewed: true
sensitivity: "public"
description: "ADHD-friendly task management system. Fork of Vikunja with N8N workflow automations for AI-powered task breakdown."
---

## 2025-10-19 — Parent Task Title Refinement

**Commit**: [`a64b984`](https://github.com/wally-kroeker/vikunja/commit/a64b984)

Fixed a bug in the AI Task Breakdown workflow where parent task titles were not being properly refined during task decomposition. The system now correctly updates parent task titles based on AI analysis of subtask context. This bug was causing inconsistent task naming and making it harder to track task hierarchies. The fix ensures parent tasks accurately reflect their child task scope after AI processing completes.

## 2025-10-17 — Label Assignment Fixes

**Commit**: [`6141bd7`](https://github.com/wally-kroeker/vikunja/commit/6141bd7)

Resolved multiple issues with automatic label assignment in the AI task breakdown process. Labels were not consistently applying to generated subtasks, breaking workflow categorization. Debugged the integration between AI task analysis and Vikunja's label API, fixing data mapping problems. Added validation to ensure labels persist correctly through the entire breakdown chain. This improves task organization and filtering capabilities across the system.

## 2025-10-15 — AI Publishing Loop

**Commit**: [`ca5a387`](https://github.com/wally-kroeker/vikunja/commit/ca5a387)

Completed the AI-powered daily publishing loop with full cron automation. The system now automatically generates daily task summaries by analyzing completed work and active projects. Integrated with N8N to process task data from Vikunja and produce structured summaries for portfolio publishing. Set up automated scheduling using WSL cron to run the pipeline daily without manual intervention. This creates a continuous flow of portfolio updates based on actual work completed.

## 2025-10-15 — Daily Publishing Loop

**Commit**: [`4d79c7b`](https://github.com/wally-kroeker/vikunja/commit/4d79c7b)

Implemented the core daily publishing loop infrastructure using WSL and N8N. Built the integration between Vikunja task management and the N8N automation platform to extract daily task data. Configured WSL cron jobs to trigger the publishing pipeline on a reliable schedule. Established the workflow architecture that pulls task information, processes it through AI summarization, and outputs formatted content. This forms the backbone of the automated portfolio update system.

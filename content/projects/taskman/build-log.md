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

## 2025-10-22 — Hybrid Vikunja Querying Strategy

**Commit**: [`989394a`](https://github.com/wally-kroeker/vikunja/commit/989394a)

Implemented a hybrid data fetching strategy to work around token limitations in the AI model's context window. Instead of sending all task data at once, the new approach first queries the Vikunja API for a high-level list of parent tasks. It then performs targeted, detailed queries for only the most relevant tasks, feeding this much smaller dataset to the AI for processing. This significantly reduces the token count for each request, enabling the system to handle much larger project scopes without errors or truncated data.

## 2025-10-19 — AI Parent Task Title Fix

**Commit**: [`a64b984`](https://github.com/wally-kroeker/vikunja/commit/a64b984)

Fixed a bug where the AI task breakdown process would incorrectly modify or generalize the title of the original parent task. The issue was traced to an ambiguous prompt that encouraged the model to summarize the entire task block. The prompt was revised to explicitly instruct the AI to preserve the original parent task title verbatim while only generating new sub-tasks. This change ensures the output remains correctly nested and directly traceable to the user's initial input, improving the feature's reliability.

## 2025-10-17 — AI Label Assignment Fix

**Commit**: [`6141bd7`](https://github.com/wally-kroeker/vikunja/commit/6141bd7)

Addressed a bug in the AI task breakdown feature that caused inconsistent or incorrect label assignments. The AI was occasionally inventing labels that did not exist in the target Vikunja instance. The fix involved providing the AI with a complete list of all available labels in the system prompt. Additionally, a post-processing validation step was added to cross-reference AI-generated labels against the master list, discarding any invalid ones. This ensures data integrity within the task management system.

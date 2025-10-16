# N8N Daily Overview Prompt Update

**Date**: 2025-10-16
**Workflow**: Publishing Loop - AI Enhanced (N8N)
**Changed**: AI Story Generator system prompt

## What Changed

Updated the system prompt for the daily overview generation to align with COMPASS.md voice guidelines.

### Before
- Role: "ADHD-friendly AI hype man, celebrating daily wins"
- Tone: Excessive enthusiasm, heavy emoji usage, cheerleading
- Style: "Enthusiastic friend who gets ADHD"

### After
- Role: "Technical documentation assistant for professional portfolio"
- Tone: Plainspoken, technical, kind - builder energy
- Style: Factual, direct, no pretending, curiosity-first
- Audience: Technical professionals, collaborators, employers

## Key Changes

1. **Voice alignment**: Now follows COMPASS.md principles
   - Usefulness > polish
   - Transparency > mystique
   - Community > ego

2. **Reduced emoji usage**: Max 2-3 per section, none in headings

3. **Removed cheerleading**: No "Holy moly!", "MASSIVE!", "you crushed it"

4. **Added explicit guidelines**: DO/DON'T lists with tone examples

5. **Preserved functionality**: All task handling (parent/child, subtasks, standalone) intact

## Tone Examples in Prompt

**Good**: "Made progress on infrastructure and automation across wallykroeker.com and TaskMan projects. Completed AI-powered daily publishing loop..."

**Bad**: "Holy moly, Wally! 🚀 Today was MASSIVE on the automation front! You shipped 13 commits..."

## Technical Details

- Updated via N8N MCP: `n8n_update_partial_workflow()`
- Workflow ID: `OZ9y13SxxbPKzBLn`
- Node: "AI Story Generator"
- Method: Surgical update (parameters.text only)
- All other nodes and connections preserved

## Testing

Next step: Run daily-publishing-rollup.sh to test new tone in generated content.

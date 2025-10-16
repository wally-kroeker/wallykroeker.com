---
title: "Build Log – wallykroeker.com"
project: "wk-site"
type: "project-log"
reviewed: true
sensitivity: "public"
---

## 2025-10-15 — Planning and infrastructure complete

- **Summary:** Reviewed external spec from brainstorming agent, identified 7 critical misalignments with existing codebase, and implemented complete project hub + timeline system. Fixed broken frontmatter, extended TypeScript types, added filtering gates, created `/projects/[slug]` route with timeline aggregation from both blog posts and build log milestones.

- **Why it matters:**
  - Establishes the foundation for automated content generation via n8n
  - Creates single source of truth for each project with unified timeline
  - Respects privacy with three-gate system (status/reviewed/sensitivity)
  - Maintains separation between tutorials (/guides), daily updates (/blog), and living project docs (/projects)

- **Commits:**
  - fix(content): convert building post to proper YAML frontmatter
  - feat(lib): extend PostMeta with publishing gates and project fields
  - feat(lib): add isPublic() filtering helper with backward compatibility
  - feat(blog): filter posts using isPublic() gate
  - feat(lib): add H2 section parsing and getAllPosts helper
  - feat(lib): create projectUpdates with timeline aggregation logic
  - feat(app): create /projects/[slug] route with timeline UI
  - content(projects): add publishing-loop project hub and initial milestone

- **Artifacts:**
  - `lib/markdown.ts` - Extended types, filtering, H2 parsing
  - `lib/projectUpdates.ts` - Timeline aggregation logic
  - `app/projects/[slug]/page.tsx` - Project hub route
  - `content/projects/wk-site/` - This project's content

- **Next steps:**
  - Create sample daily overview post with project reference to test timeline
  - Test filtering with draft states
  - Document schema in CLAUDE.md for global agent awareness
  - Create `.publishing-config.json` for n8n integration

## 2025-10-16 — Production-ready publishing system and technical documentation

- **Summary:** Implemented complete preflight validation system, fixed all content schema issues across project hubs, resolved deployment script PATH issues, and rewrote README with comprehensive technical documentation. System is now fully operational for automated publishing workflow.

- **Why it matters:**
  - Preflight validation ensures content integrity before deployment
  - Fixed deployment scripts enable reliable one-command deployments
  - Professional README positions the project as working example of documentation automation
  - All project hubs now have proper schemas and can be referenced in daily overviews
  - Three-gate publishing system (status/reviewed/sensitivity) fully functional

- **Commits:**
  - `3a15a68` - feat(project/publishing-loop): add project hubs and publishing config
  - `5c2690d` - fix(ops): deployment script with PATH export and wrapper
  - `d35dbbb` - docs: comprehensive README rewrite with technical positioning

- **Artifacts:**
  - `.publishing-config.json` - Configuration for all tracked projects (publishing-loop, wk-site, taskman)
  - `content/projects/taskman/` - Complete project hub with frontmatter and build log
  - `content/projects/wk-site/` - This project's hub and build log
  - `scripts/deploy.sh` - One-command deployment wrapper (checks uncommitted, pushes, deploys)
  - `scripts/redeploy.sh` - Production deployment script with NVM PATH fix
  - `README.md` - Comprehensive technical documentation with architecture explanation
  - `content/posts/2025-10-15-overview.md` - Daily overview with professional tone

- **Technical Details:**
  - Preflight validation catches: missing frontmatter, duplicate entries, invalid schemas, missing index files
  - Deployment workflow: local commit → `./scripts/deploy.sh` → GitHub → SSH production → build → restart
  - Fixed NVM PATH issue: non-interactive SSH sessions now export `/home/docker/.nvm/versions/node/v22.18.0/bin`
  - Added `@types/unist` dependency for TypeScript build compatibility
  - README positioned as working example of git-first documentation automation

- **Next steps:**
  - Implement N8N workflow for daily commit aggregation
  - Test automated milestone detection with `!milestone` flag
  - Create field guide on publishing loop setup for others
  - Add project hub pages to site navigation

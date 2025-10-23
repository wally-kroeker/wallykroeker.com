# Repository Guidelines for AI Agents

## Build/Lint/Test Commands
- Install: `pnpm install` (uses `pnpm-lock.yaml`)
- Develop: `pnpm dev` – run Next.js locally with hot reload (port 3000)
- Lint: `pnpm lint` – ESLint with Next.js config
- Build: `pnpm build` – production build
- Start: `pnpm start` – serve built app on port 3000
- No automated test framework; validate with `pnpm dev`, `pnpm build`, and `pnpm lint`

## Code Style Guidelines
- Language: TypeScript + React + Next.js 14 App Router; Tailwind CSS
- Indentation: 2 spaces; keep imports sorted logically; avoid default exports for components
- Naming: Components `PascalCase` in `components/`; routes lowercase in `app/` (use `[param]` for dynamics); utilities `camelCase` in `lib/`
- Styling: Use Tailwind utility classes; global styles in `app/globals.css`; dark-first design with zinc color palette
- Imports: Use absolute imports with `@/` aliases; sort imports logically
- Types: Use TypeScript for all components and utilities; define types for props and return values
- Error Handling: Handle errors gracefully with try/catch blocks and user-friendly messages
- Linting: Fix all issues reported by `pnpm lint` before committing

## Commit Guidelines
- Use conventional commit format: `type: description` (e.g., `feat:`, `fix:`, `docs:`, `content:`)
- For publishing loop integration: `type(project/<slug>): subject #tags !milestone`
- Pre-merge checklist: run `pnpm lint && pnpm build`; update docs if structure changed
- Review changes with `git diff --staged` before committing

## File Conventions
- Components: PascalCase `.tsx` files in `components/`
- Pages: lowercase in `app/` with dynamic routes in `[param]` folders
- Content: Markdown files in `content/` with frontmatter metadata
- Data: Static data in `data/` as TypeScript files
- Lib: Utilities in `lib/` as TypeScript files
- Config: Root files like `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`
- Operational: `ops/` for deployment config, `scripts/` for automation scripts

## Quality Standards
- Keep console clean of warnings/errors
- Check responsive layouts on different screen sizes
- Ensure all links work correctly
- Validate content changes through local preview
- Maintain accessibility standards (semantic HTML, ARIA attributes)
- Follow performance target: <100KB page weight
- Ensure privacy-conscious design (no trackers, minimal JS)

## Architecture Overview
- Frontend: Next.js 14 (App Router) with React and Tailwind CSS
- Backend: Node.js 22.18.0
- Package Manager: pnpm
- Content: Markdown processed with `gray-matter` and `remark`/`rehype`
- Production: Deployed in Proxmox LXC container with systemd service
- Networking: Cloudflare Tunnel provides secure access without exposing server

## Deployment Workflow
1. Make changes locally and test (`pnpm dev`, `pnpm build`)
2. Commit with conventional format: `type: description`
3. Push to `main` branch: `git push origin main`
4. SSH to production and run deployment with PATH export:
   ```bash
   export PATH=/home/docker/.nvm/versions/node/v22.18.0/bin:$PATH && cd /home/docker/wallykroeker.com && git pull origin main && pnpm install && pnpm build && echo "********" | sudo -S systemctl restart wally-web
   ```

## Publishing Loop System
- Git-first automation that transforms milestone commits into portfolio documentation
- Commit format for milestones: `type(project/<slug>): subject #tags !milestone`
- Run automation with: `/home/walub/.local/bin/project-build-log-update.sh`
- Content appears publicly only when: `status: "published"`, `reviewed: true`, `sensitivity: "public"`
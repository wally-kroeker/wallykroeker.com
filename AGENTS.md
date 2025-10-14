# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages (`/`, `/blog/[slug]`, `/projects`, etc.).
- `components/`: Reusable React components (PascalCase files, `.tsx`).
- `lib/`: Utilities and config (e.g., `markdown.ts`, `siteConfig.ts`).
- `content/`: Markdown content (e.g., blog posts, guides).
- `data/`: Static data sources (e.g., `projects.ts`).
- `ops/`: Deployment/system config (systemd, Cloudflared). See `DEPLOYMENT.md`.
- `scripts/`: Operational scripts (e.g., `redeploy.sh`).
- Root config: `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.cjs`.

## Build, Test, and Development Commands
- Install: `pnpm install` (uses `pnpm-lock.yaml`).
- Develop: `pnpm dev` – run Next.js locally with hot reload.
- Lint: `pnpm lint` – ESLint with Next.js config.
- Build: `pnpm build` – production build.
- Start: `pnpm start` – serve built app on port 3000.

## Coding Style & Naming Conventions
- Language: TypeScript + React + Next.js 14 App Router; Tailwind CSS.
- Indentation: 2 spaces; keep imports sorted logically; avoid default exports for components.
- Naming: Components `PascalCase` in `components/`; routes are lowercase in `app/` (use `[param]` for dynamics); utilities `camelCase` in `lib/`.
- Styling: Use Tailwind utility classes; global styles in `app/globals.css`.
- Linting: Fix issues reported by `pnpm lint` before pushing.

## Quality & Testing
- No automated test framework is configured. Validate changes with:
  - `pnpm dev` (local run), `pnpm build` (production build), and `pnpm lint`.
  - For content changes, preview Markdown under `/content` via `/blog` routes.
  - Keep console clean of warnings/errors; check responsive layouts.

## Commit & Pull Request Guidelines
- Commits: Present-tense, concise, and scoped (e.g., `app: fix blog slug parsing`).
- PRs must include: clear description, screenshots/GIFs for UI changes, linked issue (if any), and notes on deployment/config changes.
- Pre-merge checklist: run `pnpm lint && pnpm build`; update docs if structure or config changed.

## Security & Configuration Tips
- Configure environment via `.env` (see `.env.example` for public-facing URLs like `SITE_URL`, `SUBSTACK_URL`, etc.). Do not commit secrets.
- Deployment: systemd/Cloudflared examples live in `ops/`; follow `DEPLOYMENT.md` for server setup.

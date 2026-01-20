# Daemon Integration Documentation

**Last Updated:** 2026-01-10
**Integration Status:** LIVE (Deployed)
**Maintainer:** Wally Kroeker

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Synchronization](#data-synchronization)
3. [Technical Implementation](#technical-implementation)
4. [Deployment Architecture](#deployment-architecture)
5. [Security & Privacy](#security--privacy)
6. [API Endpoints](#api-endpoints)
7. [Maintenance Procedures](#maintenance-procedures)
8. [Known Issues & Gaps](#known-issues--gaps)

---

## Architecture Overview

### Two-Project Structure

The daemon integration spans two separate repositories working in concert:

```
┌─────────────────────────────────────────────────────────────┐
│                   DAEMON PROJECT (Astro)                    │
│              github.com/danielmiessler/Daemon               │
│  Location: /home/bob/projects/daemon                        │
├─────────────────────────────────────────────────────────────┤
│  Purpose: Upstream reference implementation                 │
│  - Static Astro website showcase                            │
│  - daemon.md template file (Daniel Miessler's profile)      │
│  - MCP server reference implementation                      │
│  - Cloudflare Pages deployment example                      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ (reference/template)
                              │
┌─────────────────────────────────────────────────────────────┐
│            WALLYKROEKER.COM (Next.js)                       │
│          github.com/wally-kroeker/wallykroeker.com          │
│  Location: /home/bob/projects/wallykroeker.com              │
├─────────────────────────────────────────────────────────────┤
│  Purpose: Wally's integrated daemon implementation          │
│  - /daemon route with custom UI/UX                          │
│  - /api/daemon JSON-RPC endpoints (MCP protocol)            │
│  - Custom daemon.md with Wally's profile                    │
│  - Real-time API access for AI agents                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌──────────────────┐
│  content/        │
│  daemon.md       │ (Wally's daemon profile)
│  (markdown)      │
└────────┬─────────┘
         │
         │ fs.readFileSync()
         ▼
┌──────────────────────────────┐
│  lib/daemon.ts               │
│  - parseDaemonFile()         │
│  - getDaemonData()           │
│  - getSectionMeta()          │
│  (Parse & structure)         │
└────────┬─────────────────────┘
         │
         ├─────────────────────────────────┬──────────────────────────┐
         │                                 │                          │
         ▼                                 ▼                          ▼
    ┌─────────────────┐            ┌─────────────────┐        ┌──────────────┐
    │ /daemon         │            │ /api/daemon     │        │ /api/daemon/ │
    │ Frontend Page   │            │ GET/POST (JSON) │        │ [section]    │
    │ (React SSR)     │            │ MCP Compatible  │        │ GET (JSON)   │
    │                 │            │                 │        │              │
    │ DaemonHero      │            │ Returns:        │        │ Returns:     │
    │ DaemonCard      │            │ - all sections  │        │ - single     │
    │ Components      │            │ - metadata      │        │ - section    │
    └─────────────────┘            │ - MCP tools     │        │ - metadata   │
         │                          │ - JSON-RPC     │        │              │
         │                          │   response     │        └──────────────┘
         │ Browser                  └─────────────────┘
         │ Renders HTML                    │
         │                                 │ Network
         ▼                                 ▼
    Human-Readable                 Machine-Readable
    Website                         API (Agents, Tools)
```

### Conceptual Design

The daemon represents Wally's **public API for identity** across both human and machine consumers:

- **For Humans:** A beautifully rendered website at `/daemon` showcasing who Wally is, what he builds, and how he works
- **For AI Agents:** Queryable API endpoints that expose structured daemon data in JSON and MCP-compatible formats
- **For Systems:** A standardized way for other AI assistants to learn about and interact with Wally through his daemon

---

## Data Synchronization

### Current State: Manual Synchronization

Currently, the daemon data is **manually synchronized** between the two projects. This is by design for privacy and control but creates a maintenance burden.

#### Where Daemon Data Lives

1. **Primary Source (wallykroeker.com):**
   - Location: `/home/bob/projects/wallykroeker.com/content/daemon.md`
   - Format: Markdown with section headers `[SECTION_NAME]`
   - Sections: ABOUT, MISSION, TELOS, AI_PARTNERSHIP, PROJECTS, PREFERENCES, DAILY_ROUTINE, PREDICTIONS, FAVORITE_BOOKS, FAVORITE_PODCASTS, CURRENT_LOCATION, FAVORITE_MOVIES
   - Owner: Wally Kroeker (manually edited)
   - Last updated: 2026-01-10

2. **Upstream Template (daemon project):**
   - Location: `/home/bob/projects/daemon/public/daemon.md`
   - Format: Same markdown format with section headers
   - Content: Daniel Miessler's original profile (not synced)
   - Purpose: Reference implementation for the Daemon pattern
   - Note: **Deliberately not synced** - each daemon owner maintains their own content

### Sync Architecture

```
wallykroeker.com/content/daemon.md
        │
        ├─ Committed to git (tracked)
        │
        ├─ Read by lib/daemon.ts at runtime
        │  │
        │  ├─ parseDaemonFile() → sections[]
        │  │
        │  └─ getDaemonData() → {raw, sections}
        │
        └─ Consumed by:
           ├─ /daemon page (React)
           ├─ /api/daemon endpoint (JSON)
           └─ /api/daemon/[section] endpoint (JSON)
```

### Manual Sync Workflow

To update daemon content:

1. **Edit daemon.md:**
   ```bash
   vim /home/bob/projects/wallykroeker.com/content/daemon.md
   ```

2. **Update section content** using `[SECTION_NAME]` markers

3. **Commit and push:**
   ```bash
   git add content/daemon.md
   git commit -m "update: refresh daemon content"
   git push origin main
   ```

4. **Deploy to production** via `/scripts/redeploy.sh`

5. **Verify changes:**
   - Frontend: Visit `https://wallykroeker.com/daemon`
   - API: Query `https://wallykroeker.com/api/daemon`

### Why Manual Sync?

- **Privacy:** Wally controls what information appears in his daemon
- **Customization:** The daemon.md format is flexible; different daemons may extend it differently
- **Decentralization:** Each person owns their daemon; there's no shared "source of truth"
- **Version Control:** All changes are tracked in git for audit trail

### Sync Gaps & Opportunities

**Current Gap:** If Wally updates content in the daemon project's `public/daemon.md`, changes won't appear in wallykroeker.com.

**Future Opportunities:**
- Implement automated sync via git submodules or webhook
- Create a CLI tool to validate section format across both projects
- Add linting to ensure daemon.md conforms to schema

---

## Technical Implementation

### File Structure

#### wallykroeker.com Integration Files

```
/home/bob/projects/wallykroeker.com/
├── content/
│   ├── daemon.md                          # Primary daemon data
│   └── guides/
│       └── daemon-api.md                  # API documentation
├── lib/
│   └── daemon.ts                          # Core parser & utilities
├── app/
│   ├── daemon/
│   │   ├── page.tsx                       # Main /daemon page
│   │   └── components/
│   │       ├── DaemonHero.tsx             # Hero section component
│   │       └── DaemonCard.tsx             # Info card component
│   └── api/
│       └── daemon/
│           ├── route.ts                   # GET/POST /api/daemon
│           └── [section]/
│               └── route.ts               # GET /api/daemon/[section]
└── docs/
    └── DAEMON_INTEGRATION.md              # This document
```

### Core Parser: `lib/daemon.ts`

The parser transforms raw markdown into structured data:

**Interface Definitions:**
```typescript
interface DaemonSection {
  name: string                             // 'ABOUT', 'MISSION', etc.
  content: string                          // Raw markdown content
  html: string                             // Rendered HTML
  items: string[]                          // Parsed bullet-point items
}

interface DaemonData {
  raw: string                              // Full file content
  sections: DaemonSection[]                // Parsed sections
}
```

**Core Functions:**

| Function | Purpose |
|----------|---------|
| `parseDaemonFile(content: string)` | Parse markdown content into sections |
| `getDaemonData()` | Load and parse daemon.md from disk |
| `getDaemonSection(name: string)` | Get specific section by name |
| `getSectionMeta(name: string)` | Get display metadata (icon, title, description) |

**Parsing Strategy:**
```
1. Split content by regex: /\[([A-Z_]+)\]/g
2. Extract section name and content pairs
3. For each section:
   a. Parse markdown → HTML (using unified/remark)
   b. Extract bullet-point items (lines starting with -)
4. Return structured DaemonSection[]
```

### Frontend: `/daemon` Page

**Route:** `/daemon` (SSR)

**Technology:** Next.js App Router + React Server Components

**Components:**

1. **page.tsx** (Server Component)
   - Fetches daemon data at request time
   - Groups sections into logical areas
   - Renders layout with primary/secondary/media cards

2. **DaemonHero.tsx**
   - Status badge (Daemon Active)
   - Title and subtitle
   - About section content
   - Quick metadata (Format, Protocol, Upstream)

3. **DaemonCard.tsx**
   - Displays individual section
   - Shows icon, title, description
   - Renders content as HTML or bullet list
   - Size options: default (compact) or large (expanded)
   - Truncates long lists (+N more indicator)

**Section Organization:**
```
Hero Section
├─ Status badge
├─ Title: /daemon
├─ Subtitle
└─ About content

Core Section (2-column grid)
├─ MISSION (large)
├─ AI_PARTNERSHIP (large)
├─ PROJECTS (large)
└─ TELOS (large)

Preferences & Patterns (4-column responsive)
├─ PREFERENCES
├─ DAILY_ROUTINE
├─ PREDICTIONS
└─ CURRENT_LOCATION

Favorites (3-column grid)
├─ FAVORITE_BOOKS
├─ FAVORITE_MOVIES
└─ FAVORITE_PODCASTS

What is a Daemon? (Info section)
├─ Description text
└─ Example API call
```

### API Endpoints

#### 1. GET `/api/daemon` - List All Sections

**Query Parameters:**
- `format=simple` (default) - Structured JSON with all sections
- `format=mcp` - MCP-compatible tools/list response

**Response (simple):**
```json
{
  "name": "Wally Kroeker",
  "endpoint": "https://wallykroeker.com/api/daemon",
  "updated": "2026-01-10T14:43:22.000Z",
  "sections": {
    "ABOUT": {
      "title": "About",
      "icon": "👤",
      "description": "Who I am",
      "content": "My name is Wally Kroeker...",
      "items": []
    },
    "MISSION": { ... }
  },
  "available_sections": ["ABOUT", "CURRENT_LOCATION", "MISSION", ...]
}
```

**Response (mcp format):**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "get_about",
        "description": "About: Who I am",
        "inputSchema": {"type": "object", "properties": {}, "required": []}
      },
      ...
      {
        "name": "get_all",
        "description": "Get all daemon sections at once",
        "inputSchema": {"type": "object", "properties": {}, "required": []}
      }
    ]
  },
  "id": null
}
```

**Implementation:**
- Location: `app/api/daemon/route.ts`
- Methods: GET, POST, OPTIONS
- Cache: 5-10 minutes (public, s-maxage=600)

#### 2. GET `/api/daemon/[section]` - Get Specific Section

**Path Parameters:**
- `section` - Case-insensitive section name (e.g., `about`, `mission`, `favorite_books`)

**Valid Sections (Whitelist):**
```
about, current_location, mission, telos, ai_partnership, projects,
favorite_books, favorite_movies, favorite_podcasts, daily_routine,
preferences, predictions
```

**Response:**
```json
{
  "section": "MISSION",
  "title": "Mission",
  "icon": "🎯",
  "description": "What I aim to achieve",
  "content": "Help technical teams adopt AI safely and effectively...",
  "items": [],
  "html": "<p>Help technical teams adopt AI safely...</p>"
}
```

**Implementation:**
- Location: `app/api/daemon/[section]/route.ts`
- Methods: GET, OPTIONS
- Security: Section whitelist validation (prevents path traversal)

#### 3. POST `/api/daemon` - MCP JSON-RPC Interface

**Protocol:** JSON-RPC 2.0

**Supported Methods:**

**Method: `tools/list`**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

Returns list of available tools (same as GET format=mcp)

**Method: `tools/call`**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_mission",
    "arguments": {}
  },
  "id": 2
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Help technical teams adopt AI safely and effectively..."
      }
    ]
  },
  "id": 2
}
```

**Error Response:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found: invalid_method"
  },
  "id": 1
}
```

**Error Codes:**
- `-32600`: Invalid Request (malformed JSON-RPC)
- `-32602`: Invalid params (missing tool name)
- `-32601`: Method not found (unknown method or tool)
- `-32603`: Internal error (server exception)

**Implementation:**
- Location: `app/api/daemon/route.ts` (POST handler)
- MCP Spec Version: 2.0 compatible

### Security Headers

All API responses include:
```
Content-Type: application/json
X-Content-Type-Options: nosniff
Cache-Control: public, max-age=300, s-maxage=600
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Deployment Architecture

### Production Environment

**Host:** Proxmox LXC Container on FabLab infrastructure
**Process Manager:** systemd (`wally-web.service`)
**Frontend Framework:** Next.js 14
**Networking:** Cloudflare Tunnel (no exposed ports)

### Deployment Flow

```
┌─ Developer (laptop) ─────────────────────────────────────┐
│                                                            │
│  1. Edit content/daemon.md                               │
│  2. git commit -m "update: daemon content"               │
│  3. git push origin main                                 │
│                                                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │   GitHub       │
            │   (remote)     │
            └────────┬───────┘
                     │
                     ▼
┌─ Production Server (Proxmox LXC) ────────────────────────┐
│                                                            │
│  1. SSH to production                                    │
│  2. cd /path/to/wallykroeker.com                         │
│  3. ./scripts/redeploy.sh                                │
│     a. git pull origin main                              │
│     b. pnpm install                                      │
│     c. pnpm build                                        │
│     d. sudo systemctl restart wally-web.service          │
│                                                            │
│  Result: Next.js app restarts with new content           │
│                                                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Cloudflare Tunnel     │
        │  (secure reverse proxy)│
        └────────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  wallykroeker.com    │
          │  (publicly accessible)
          └──────────────────────┘
```

### Build & Cache Strategy

**Build Time:**
- `lib/daemon.ts` reads `content/daemon.md` at **request time** (not build time)
- Enables hot updates without rebuilding (for API endpoints)
- Frontend page uses dynamic data fetching (SSR)

**Cache Strategy:**
- API responses: 5-10 minute cache (public, s-maxage=600)
- Cloudflare edge cache for fast global delivery
- Browser cache: respects max-age=300 (5 minutes)

**Fresh Deployment Timeline:**
1. Push to GitHub
2. SSH to production, run redeploy.sh (2-3 minutes)
3. systemd service restarts (immediate)
4. API cache expires within 10 minutes
5. Fully propagated in 15 minutes globally

### Cloudflare Tunnel Integration

**Purpose:** Expose the private Proxmox LXC container to the public internet securely

**Architecture:**
```
Public Internet
      │
      ▼
Cloudflare Edge Network
      │
      ├─ HTTPS termination
      ├─ DDoS protection
      ├─ Cache layer
      └─ Edge routing
      │
      ▼
Cloudflare Tunnel (cloudflared daemon)
      │
      └─ Encrypted tunnel back to origin
      │
      ▼
Private Proxmox LXC Container
      │
      └─ Next.js app (port 3000)
```

**Configuration:** `ops/cloudflared/config.yml`
**Daemon:** Running in LXC container
**DNS:** CNAME record points to Cloudflare Tunnel endpoint

---

## Security & Privacy

### Data Classification

| Section | Visibility | Type | Sensitivity |
|---------|-----------|------|-------------|
| ABOUT | Public | Profile | Low |
| MISSION | Public | Strategic | Low |
| TELOS | Public | Strategic | Low |
| AI_PARTNERSHIP | Public | Operational | Low |
| PROJECTS | Public | Operational | Low |
| PREFERENCES | Public | Preferences | Low |
| DAILY_ROUTINE | Public | Patterns | Low |
| PREDICTIONS | Public | Opinions | Low |
| FAVORITE_BOOKS | Public | Interests | Low |
| FAVORITE_MOVIES | Public | Interests | Low |
| FAVORITE_PODCASTS | Public | Interests | Low |
| CURRENT_LOCATION | Public | Location | Low |

**Note:** Only public-facing sections are included in the daemon. Sensitive information (email, phone, internal projects, financial data) is **NOT** in daemon.md.

### API Security

**Whitelist Validation:**
- All section names validated against hardcoded VALID_SECTIONS array
- Prevents path traversal attacks (e.g., `/api/daemon/../../../etc/passwd`)
- Case-insensitive matching (safely normalizes to uppercase)

**CORS Policy:**
- `Access-Control-Allow-Origin: *` - Fully public
- Intentional: daemon is meant to be queried from anywhere
- Signed requests not required (public data)

**JSON-RPC Security:**
- Validates jsonrpc version (must be "2.0")
- Requires method and params fields
- Returns structured error responses (no stack traces)

**No Authentication Required:**
- Daemon is public by design
- All data is intended for public consumption
- Rate limiting handled by Cloudflare (edge)

### Information Disclosure

**What IS exposed:**
- Profile information (bio, location, mission)
- Work style and preferences
- Books, movies, podcasts
- Daily routine patterns
- Strategic directions (TELOS)

**What is NOT exposed:**
- Email address (not in daemon.md)
- Phone number (not in daemon.md)
- Private keys or credentials (never)
- Financial information (never)
- Unreleased projects (not included)
- Personal health information (not included)

### Content Validation

**No validation currently implemented.** Considerations:

- HTML content is server-rendered (safe from injection)
- Markdown parsed via unified/remark (sanitized output)
- No user uploads or dynamic input to daemon.md
- Content manually reviewed before commits

---

## API Endpoints

### Complete Endpoint Reference

| Endpoint | Method | Format | Purpose |
|----------|--------|--------|---------|
| `/daemon` | GET | HTML | Human-readable daemon page |
| `/api/daemon?format=simple` | GET | JSON | All sections (default) |
| `/api/daemon?format=mcp` | GET | JSON | MCP tools/list format |
| `/api/daemon` | POST | JSON-RPC | MCP-compatible interface |
| `/api/daemon/[section]` | GET | JSON | Single section |
| `/api/daemon/*` | OPTIONS | - | CORS preflight |

### Example Queries

**cURL: Get all sections (simple)**
```bash
curl https://wallykroeker.com/api/daemon
```

**cURL: Get specific section**
```bash
curl https://wallykroeker.com/api/daemon/mission
```

**cURL: List MCP tools**
```bash
curl -X POST https://wallykroeker.com/api/daemon \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

**cURL: Call MCP tool**
```bash
curl -X POST https://wallykroeker.com/api/daemon \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"tools/call",
    "params":{"name":"get_mission"},
    "id":2
  }'
```

**JavaScript: Fetch all data**
```javascript
const daemon = await fetch('https://wallykroeker.com/api/daemon').then(r => r.json());
console.log(daemon.sections.MISSION.content);
```

**JavaScript: Call specific section**
```javascript
const mission = await fetch('https://wallykroeker.com/api/daemon/mission').then(r => r.json());
console.log(mission.content);
```

---

## Maintenance Procedures

### Updating Daemon Content

**Step 1: Edit daemon.md**
```bash
cd /home/bob/projects/wallykroeker.com
vim content/daemon.md
```

**Step 2: Validate format**
- Ensure sections use `[SECTION_NAME]` format
- Check section names against VALID_SECTIONS
- Verify markdown syntax

**Step 3: Test locally**
```bash
pnpm dev
# Visit http://localhost:3000/daemon
# Check API: http://localhost:3000/api/daemon
```

**Step 4: Commit**
```bash
git add content/daemon.md
git commit -m "update: refresh daemon content - [describe changes]"
git push origin main
```

**Step 5: Deploy**
```bash
# SSH to production
ssh user@production-server
cd /home/bob/projects/wallykroeker.com
./scripts/redeploy.sh
```

**Step 6: Verify**
```bash
# Check frontend
curl https://wallykroeker.com/daemon

# Check API
curl https://wallykroeker.com/api/daemon | jq .sections

# Check specific section
curl https://wallykroeker.com/api/daemon/mission | jq .content
```

### Adding New Sections

**To add a new daemon section:**

1. **Edit daemon.md:**
   ```markdown
   [NEW_SECTION_NAME]
   Content goes here...
   ```

2. **Update `lib/daemon.ts`:**
   ```typescript
   export function getSectionMeta(sectionName: string): ... {
     const meta: Record<string, ...> = {
       // ... existing entries
       NEW_SECTION_NAME: {
         icon: '🎯',  // Choose appropriate emoji
         title: 'Display Title',
         description: 'Short description',
       },
     }
   ```

3. **Update `app/api/daemon/route.ts`:**
   ```typescript
   const VALID_SECTIONS = [
     // ... existing
     'NEW_SECTION_NAME',
   ] as const
   ```

4. **Update `app/api/daemon/[section]/route.ts`:**
   ```typescript
   const VALID_SECTIONS = [
     // ... existing
     'new_section_name', // lowercase
   ] as const
   ```

5. **Update `app/daemon/page.tsx`:**
   ```typescript
   // Add to appropriate section grouping (primary, secondary, or media)
   const primarySections = ['MISSION', 'NEW_SECTION_NAME', ...]
   ```

6. **Update `content/guides/daemon-api.md`:**
   - Add to available sections table
   - Add to tools table
   - Update examples if needed

7. **Test and commit as above**

### Monitoring & Health Checks

**Health Check Endpoints:**
```bash
# Frontend renders
curl -I https://wallykroeker.com/daemon

# API responds
curl -I https://wallykroeker.com/api/daemon

# Section endpoint
curl -I https://wallykroeker.com/api/daemon/mission

# MCP endpoint
curl -X POST -I https://wallykroeker.com/api/daemon
```

**Expected Responses:** HTTP 200, Content-Type: application/json (API) or text/html (frontend)

**Logs:**
- Application: systemd journalctl `journalctl -u wally-web.service -f`
- Cloudflare: Dashboard at cloudflare.com

### Troubleshooting

| Issue | Symptom | Solution |
|-------|---------|----------|
| Daemon.md not updating | Changes don't appear on site | Run `redeploy.sh`, check git pull succeeded |
| API returns 500 | Server error | Check logs: `journalctl -u wally-web.service`, verify daemon.md format |
| Section returns 404 | Section not found | Verify section name in VALID_SECTIONS whitelist |
| Slow API response | Delays on queries | Check Cloudflare cache status, might need cache purge |
| MCP tools not listing | JSON-RPC returns error | Verify request format, check jsonrpc version = "2.0" |

---

## Known Issues & Gaps

### Gaps in Current Implementation

1. **No Real-Time Sync Between Projects**
   - daemon project and wallykroeker.com maintain separate daemon.md files
   - Manual updates required if content needs to sync
   - No webhook or automated sync mechanism

2. **No Input Validation Schema**
   - daemon.md format is loose; no JSON Schema or type validation
   - Could add `.daemon.schema.json` for validation
   - Current validation is only section name whitelist

3. **No Version Control on Daemon Data**
   - API doesn't expose version/last-modified metadata
   - Could add ETag or Last-Modified headers for caching
   - Currently relies on wall-clock time from server

4. **Limited MCP Compliance**
   - Implements basic MCP protocol (tools/list, tools/call)
   - Missing advanced features like tool result streaming
   - No resource management or connection pooling

5. **No Private Sections Support**
   - All sections are public (by design)
   - No authentication/authorization on API
   - Could extend format to support `[PRIVATE_SECTION]` markers

6. **Cache Invalidation**
   - Manual cache purge required for edge (Cloudflare)
   - No automatic cache invalidation on deploy
   - Could add cache-busting headers or purge API calls

### Future Enhancement Opportunities

**High Priority:**
- Add HTTP caching headers (ETag, Last-Modified)
- Implement section schema validation
- Add daemon.md linting tool (cli)
- Document MCP compliance level

**Medium Priority:**
- Add support for daemon discovery/federation
- Implement daemon-to-daemon querying
- Add metrics/observability (query counts, cache hit rates)
- Build admin dashboard for daemon management

**Lower Priority:**
- Support markdown includes/partials
- Add daemon versioning API
- Implement daemon signing (cryptographic verification)
- Support for private sections (auth-protected)

### Known Limitations

1. **Static Content Model**
   - daemon.md is read from disk at request time
   - Changes require server restart or cache invalidation
   - No real-time updates from API calls

2. **Section Name Constraints**
   - Limited to uppercase letters and underscores
   - Regex: `[A-Z_]+`
   - 12 hard-coded sections (not dynamic)

3. **No Search Functionality**
   - API doesn't support full-text search
   - Frontend doesn't have search UI
   - Could be added as future enhancement

4. **Browser Compatibility**
   - Relies on modern CSS (Grid, Flexbox)
   - Emoji support (system fonts)
   - Edge: Last 2 major versions (handled by Next.js)

---

## Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Visit `/daemon` - page loads
- [ ] Hero section displays ABOUT content
- [ ] All section cards render
- [ ] Icons/emojis display correctly
- [ ] Responsive layout works on mobile
- [ ] "What is a Daemon?" section visible
- [ ] Links to daemon project work

**API - GET /api/daemon:**
- [ ] Returns 200 status
- [ ] Contains all expected sections
- [ ] format=simple returns structured data
- [ ] format=mcp returns tools list
- [ ] Content-Type header correct
- [ ] CORS headers present

**API - GET /api/daemon/[section]:**
- [ ] Valid section (e.g., /mission) returns 200
- [ ] Returns correct section content
- [ ] Case-insensitive matching works
- [ ] Invalid section (e.g., /invalid) returns 404
- [ ] HTML field populated correctly
- [ ] Items array populated for lists

**API - POST /api/daemon (MCP):**
- [ ] tools/list method works
- [ ] tools/call method works
- [ ] get_<section> tools executable
- [ ] get_all tool returns all sections
- [ ] Invalid method returns proper error
- [ ] JSON-RPC error format correct

### Load Testing Notes

- API endpoints cache-friendly (5-10 min TTL)
- Cloudflare edge handles global requests
- No database queries (all file-based)
- Suitable for thousands of requests/second at edge

---

## References

### Source Files
- Parser: `/home/bob/projects/wallykroeker.com/lib/daemon.ts`
- Frontend: `/home/bob/projects/wallykroeker.com/app/daemon/page.tsx`
- API: `/home/bob/projects/wallykroeker.com/app/api/daemon/route.ts`
- Data: `/home/bob/projects/wallykroeker.com/content/daemon.md`
- Docs: `/home/bob/projects/wallykroeker.com/content/guides/daemon-api.md`

### Upstream Projects
- Daemon Spec: https://github.com/danielmiessler/Daemon
- Human 3.0: https://danielmiessler.com/blog/human-3-creator-revolution
- MCP Protocol: https://modelcontextprotocol.io
- The Real IoT: https://danielmiessler.com/blog/real-internet-of-things

### Related Documentation
- `/home/bob/projects/wallykroeker.com/CLAUDE_README.md` - Project overview
- `/home/bob/projects/daemon/README.md` - Daemon upstream documentation
- Git commits: `9a4bb04`, `9d81aae` - Daemon integration history

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2026-01-10 | Initial comprehensive documentation | Bill (Architect Clone) |

---

**Status:** COMPLETE
**Last Verified:** 2026-01-10
**Architect:** Bill (ID: 4)

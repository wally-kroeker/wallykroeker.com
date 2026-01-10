---
title: "Daemon API Documentation"
date: 2026-01-10
tags: [api, daemon, mcp]
description: "API documentation for querying Wally Kroeker's personal daemon"
status: "published"
reviewed: true
sensitivity: "public"
---

# Daemon API

The Daemon API provides programmatic access to structured information about Wally Kroeker. It's designed for AI agents and other systems to learn about and interact with humans through standardized interfaces.

## Base URL

```
https://wallykroeker.com/api/daemon
```

## Endpoints

### GET /api/daemon

Returns all daemon sections with metadata.

**Query Parameters:**
- `format=simple` (default) - Structured JSON with all sections
- `format=mcp` - MCP-compatible tools/list response

**Example Request:**
```bash
curl https://wallykroeker.com/api/daemon
```

**Example Response (simple):**
```json
{
  "name": "Wally Kroeker",
  "endpoint": "https://wallykroeker.com/api/daemon",
  "updated": "2026-01-10T06:00:00.000Z",
  "sections": {
    "ABOUT": {
      "title": "About",
      "icon": "👤",
      "description": "Who I am",
      "content": "My name is Wally Kroeker...",
      "items": []
    },
    "MISSION": {
      "title": "Mission",
      "icon": "🎯",
      "description": "What I aim to achieve",
      "content": "Help technical teams adopt AI safely...",
      "items": []
    }
  },
  "available_sections": ["ABOUT", "MISSION", "TELOS", ...]
}
```

### GET /api/daemon/[section]

Returns a specific section by name (case-insensitive).

**Available Sections:**
- `about` - Bio and background
- `mission` - Purpose and goals
- `telos` - Strategic framework (Problems, Missions, Goals)
- `ai_partnership` - How I work with Bob
- `projects` - What I'm building
- `preferences` - Tools and styles
- `daily_routine` - How I structure days
- `predictions` - Views on the future
- `favorite_books` - Reading recommendations
- `favorite_podcasts` - Listening recommendations
- `current_location` - Where I'm based

**Example Request:**
```bash
curl https://wallykroeker.com/api/daemon/mission
```

**Example Response:**
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

### POST /api/daemon (MCP JSON-RPC)

MCP-compatible endpoint supporting JSON-RPC 2.0.

**Supported Methods:**
- `tools/list` - List available tools
- `tools/call` - Execute a tool

**Example: List Tools**
```bash
curl -X POST https://wallykroeker.com/api/daemon \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

**Response:**
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
      {
        "name": "get_mission",
        "description": "Mission: What I aim to achieve",
        "inputSchema": {"type": "object", "properties": {}, "required": []}
      },
      {
        "name": "get_all",
        "description": "Get all daemon sections at once",
        "inputSchema": {"type": "object", "properties": {}, "required": []}
      }
    ]
  },
  "id": 1
}
```

**Example: Call Tool**
```bash
curl -X POST https://wallykroeker.com/api/daemon \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_mission","arguments":{}},"id":2}'
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

## Available Tools (MCP)

| Tool | Description |
|------|-------------|
| `get_about` | Bio and background information |
| `get_mission` | Purpose and goals |
| `get_telos` | Strategic framework (Problems, Missions, Goals) |
| `get_ai_partnership` | How I work with my AI assistant Bob |
| `get_projects` | Current projects and initiatives |
| `get_preferences` | Tools, technologies, and working style |
| `get_daily_routine` | How I structure my days |
| `get_predictions` | Views on the future of AI and tech |
| `get_favorite_books` | Book recommendations |
| `get_favorite_podcasts` | Podcast recommendations |
| `get_current_location` | Where I'm based |
| `get_all` | All sections at once |

## CORS

The API supports CORS and can be called from any origin:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`

## Caching

Responses are cached for 5-10 minutes:
- `Cache-Control: public, max-age=300, s-maxage=600`

## Error Handling

**HTTP Errors:**
```json
{
  "error": "Invalid section",
  "message": "Section \"invalid\" not found. Valid sections: about, mission, ...",
  "status": 404
}
```

**JSON-RPC Errors:**
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

## Use Cases

**For AI Agents:**
- Learn about a person before interaction
- Find common ground (shared interests, values)
- Understand communication preferences

**For Automation:**
- Build contact profiles
- Match people with similar interests
- Route requests to appropriate contacts

**For Other Daemons:**
- Daemon-to-daemon discovery
- Automated introductions
- Interest matching

## Related

- [Daemon Philosophy](https://danielmiessler.com/blog/real-internet-of-things) - The vision behind personal APIs
- [Human 3.0](https://danielmiessler.com/blog/human-3-creator-revolution) - Technology serving human connection
- [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol specification

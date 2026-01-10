import { NextRequest, NextResponse } from 'next/server'
import { getDaemonData, getSectionMeta } from '@/lib/daemon'

// Valid section names - whitelist for security
const VALID_SECTIONS = [
  'ABOUT',
  'CURRENT_LOCATION',
  'MISSION',
  'TELOS',
  'AI_PARTNERSHIP',
  'PROJECTS',
  'FAVORITE_BOOKS',
  'FAVORITE_MOVIES',
  'FAVORITE_PODCASTS',
  'DAILY_ROUTINE',
  'PREFERENCES',
  'PREDICTIONS',
] as const

type ValidSection = typeof VALID_SECTIONS[number]

// Security headers for all responses
function securityHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5-10 min
    'Access-Control-Allow-Origin': '*', // Public API
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

// Standard error response
function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message, status },
    { status, headers: securityHeaders() }
  )
}

/**
 * GET /api/daemon
 *
 * Returns all daemon sections with metadata.
 * This is the main endpoint for agents to query.
 *
 * Query params:
 * - format=mcp : Return MCP-compatible tools/list response
 * - format=simple : Return simplified key-value pairs (default)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'simple'

    const data = await getDaemonData()

    if (format === 'mcp') {
      // MCP-compatible tools/list response
      const tools = VALID_SECTIONS.map(section => {
        const meta = getSectionMeta(section)
        return {
          name: `get_${section.toLowerCase()}`,
          description: `${meta.title}: ${meta.description}`,
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        }
      })

      // Add get_all tool
      tools.push({
        name: 'get_all',
        description: 'Get all daemon sections at once',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      })

      return NextResponse.json(
        {
          jsonrpc: '2.0',
          result: { tools },
          id: null,
        },
        { headers: securityHeaders() }
      )
    }

    // Simple format - structured data for easy consumption
    const sections: Record<string, {
      title: string
      icon: string
      description: string
      content: string
      items: string[]
    }> = {}

    for (const section of data.sections) {
      const meta = getSectionMeta(section.name)
      sections[section.name] = {
        title: meta.title,
        icon: meta.icon,
        description: meta.description,
        content: section.content,
        items: section.items,
      }
    }

    return NextResponse.json(
      {
        name: 'Wally Kroeker',
        endpoint: 'https://wallykroeker.com/api/daemon',
        updated: new Date().toISOString(),
        sections,
        available_sections: VALID_SECTIONS,
      },
      { headers: securityHeaders() }
    )
  } catch (error) {
    // Don't expose internal errors
    console.error('Daemon API error:', error)
    return errorResponse('Internal server error', 500)
  }
}

/**
 * POST /api/daemon
 *
 * MCP-compatible JSON-RPC endpoint.
 * Supports tools/list and tools/call methods.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate JSON-RPC structure
    if (body.jsonrpc !== '2.0') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          error: { code: -32600, message: 'Invalid Request: must be JSON-RPC 2.0' },
          id: body.id || null,
        },
        { status: 400, headers: securityHeaders() }
      )
    }

    const { method, params, id } = body

    // Handle tools/list
    if (method === 'tools/list') {
      const tools = VALID_SECTIONS.map(section => {
        const meta = getSectionMeta(section)
        return {
          name: `get_${section.toLowerCase()}`,
          description: `${meta.title}: ${meta.description}`,
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        }
      })

      tools.push({
        name: 'get_all',
        description: 'Get all daemon sections at once',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      })

      return NextResponse.json(
        { jsonrpc: '2.0', result: { tools }, id },
        { headers: securityHeaders() }
      )
    }

    // Handle tools/call
    if (method === 'tools/call') {
      const toolName = params?.name

      if (!toolName) {
        return NextResponse.json(
          {
            jsonrpc: '2.0',
            error: { code: -32602, message: 'Invalid params: missing tool name' },
            id,
          },
          { status: 400, headers: securityHeaders() }
        )
      }

      const data = await getDaemonData()

      // Handle get_all
      if (toolName === 'get_all') {
        const allData: Record<string, string> = {}
        for (const section of data.sections) {
          allData[section.name] = section.content
        }

        return NextResponse.json(
          {
            jsonrpc: '2.0',
            result: {
              content: [{ type: 'text', text: JSON.stringify(allData, null, 2) }],
            },
            id,
          },
          { headers: securityHeaders() }
        )
      }

      // Handle get_<section>
      if (toolName.startsWith('get_')) {
        const sectionName = toolName.replace('get_', '').toUpperCase()

        // Validate section name against whitelist
        if (!VALID_SECTIONS.includes(sectionName as ValidSection)) {
          return NextResponse.json(
            {
              jsonrpc: '2.0',
              error: { code: -32602, message: `Invalid section: ${sectionName}` },
              id,
            },
            { status: 400, headers: securityHeaders() }
          )
        }

        const section = data.sections.find(s => s.name === sectionName)

        if (!section) {
          return NextResponse.json(
            {
              jsonrpc: '2.0',
              result: {
                content: [{ type: 'text', text: `Section ${sectionName} not found` }],
              },
              id,
            },
            { headers: securityHeaders() }
          )
        }

        return NextResponse.json(
          {
            jsonrpc: '2.0',
            result: {
              content: [{ type: 'text', text: section.content }],
            },
            id,
          },
          { headers: securityHeaders() }
        )
      }

      // Unknown tool
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${toolName}` },
          id,
        },
        { status: 404, headers: securityHeaders() }
      )
    }

    // Unknown method
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32601, message: `Method not found: ${method}` },
        id,
      },
      { status: 404, headers: securityHeaders() }
    )
  } catch (error) {
    console.error('Daemon API error:', error)
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal error' },
        id: null,
      },
      { status: 500, headers: securityHeaders() }
    )
  }
}

/**
 * OPTIONS /api/daemon
 *
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: securityHeaders(),
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getDaemonSection, getSectionMeta } from '@/lib/daemon'

// Valid section names - whitelist for security
const VALID_SECTIONS = [
  'about',
  'current_location',
  'mission',
  'telos',
  'ai_partnership',
  'projects',
  'favorite_books',
  'favorite_movies',
  'favorite_podcasts',
  'daily_routine',
  'preferences',
  'predictions',
] as const

type ValidSection = typeof VALID_SECTIONS[number]

// Security headers
function securityHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=300, s-maxage=600',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

/**
 * GET /api/daemon/[section]
 *
 * Get a specific daemon section by name.
 * Section names are case-insensitive.
 *
 * Examples:
 * - GET /api/daemon/about
 * - GET /api/daemon/mission
 * - GET /api/daemon/favorite_books
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params
    const sectionLower = section.toLowerCase()

    // Validate against whitelist
    if (!VALID_SECTIONS.includes(sectionLower as ValidSection)) {
      return NextResponse.json(
        {
          error: 'Invalid section',
          message: `Section "${section}" not found. Valid sections: ${VALID_SECTIONS.join(', ')}`,
          status: 404,
        },
        { status: 404, headers: securityHeaders() }
      )
    }

    // Convert to uppercase for lookup (matches daemon.md format)
    const sectionUpper = sectionLower.toUpperCase()
    const data = await getDaemonSection(sectionUpper)

    if (!data) {
      return NextResponse.json(
        {
          error: 'Section not found',
          message: `Section "${section}" exists but has no content`,
          status: 404,
        },
        { status: 404, headers: securityHeaders() }
      )
    }

    const meta = getSectionMeta(sectionUpper)

    return NextResponse.json(
      {
        section: sectionUpper,
        title: meta.title,
        icon: meta.icon,
        description: meta.description,
        content: data.content,
        items: data.items,
        html: data.html,
      },
      { headers: securityHeaders() }
    )
  } catch (error) {
    console.error('Daemon section API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', status: 500 },
      { status: 500, headers: securityHeaders() }
    )
  }
}

/**
 * OPTIONS /api/daemon/[section]
 *
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: securityHeaders(),
  })
}

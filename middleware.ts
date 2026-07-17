import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'mf_session'
const GATE_PATH = '/private/oneness/gate'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let the gate itself through
  if (pathname.startsWith(GATE_PATH)) {
    return NextResponse.next()
  }

  const passphrase = process.env.MANIFESTO_PASSPHRASE
  const cookie = request.cookies.get(COOKIE_NAME)

  if (!passphrase || cookie?.value !== passphrase) {
    const url = request.nextUrl.clone()
    url.pathname = GATE_PATH
    // Preserve the original path as a redirect-back hint
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/private/oneness/:path*',
    '/api/manifesto-audio/:path*',
  ],
}

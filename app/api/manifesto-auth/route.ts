import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'mf_session'

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json()
  const expected = process.env.MANIFESTO_PASSPHRASE

  if (!expected) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  if (!passphrase || passphrase !== expected) {
    return NextResponse.json({ error: 'Incorrect passphrase' }, { status: 401 })
  }

  const next = request.nextUrl.searchParams.get('next') || '/private/oneness'
  const response = NextResponse.json({ ok: true, redirect: next })

  response.cookies.set(COOKIE_NAME, passphrase, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // 30-day session
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}

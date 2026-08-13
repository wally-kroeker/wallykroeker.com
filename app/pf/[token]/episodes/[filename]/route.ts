import { NextRequest, NextResponse } from 'next/server'
import { open } from 'fs/promises'
import path from 'path'

// Private podcast episode audio — served from disk per request so new episodes
// work without a rebuild (Next.js public/ manifest is fixed at build time).

const EPISODES_BASE = path.join(process.cwd(), 'public', 'pf')
const PRIVATE_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
} as const

function bad(status: 400 | 404, msg: string): NextResponse {
  return NextResponse.json({ error: msg }, { status, headers: PRIVATE_HEADERS })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string; filename: string } }
) {
  const { token, filename } = params

  // ── Path traversal guard ──────────────────────────────────────────────────
  // Reject anything that contains a separator or dotdot sequence — the
  // segments come from user-controlled URL parts and will be joined onto disk.
  const SAFE_SEGMENT = /^[a-zA-Z0-9._-]+$/
  if (!SAFE_SEGMENT.test(token) || !SAFE_SEGMENT.test(filename)) {
    return bad(400, 'invalid path')
  }
  // Belt-and-suspenders: resolve the final path and confirm it is inside the
  // expected subtree before opening the file descriptor.
  const resolved = path.resolve(EPISODES_BASE, token, 'episodes', filename)
  const expectedPrefix = path.resolve(EPISODES_BASE) + path.sep
  if (!resolved.startsWith(expectedPrefix)) {
    return bad(400, 'invalid path')
  }

  // ── Open file ─────────────────────────────────────────────────────────────
  let fd: import('fs/promises').FileHandle
  let fileSize: number
  try {
    fd = await open(resolved, 'r')
    const stat = await fd.stat()
    fileSize = stat.size
  } catch {
    return bad(404, 'episode not found')
  }

  try {
    const range = request.headers.get('range')

    if (range) {
      // ── Range request (206 Partial Content) ────────────────────────────
      // RFC 7233: "bytes=<start>-[<end>]"
      const match = range.match(/^bytes=(\d+)-(\d*)$/)
      if (!match) {
        await fd.close()
        return NextResponse.json(
          { error: 'invalid range' },
          { status: 416, headers: { 'Content-Range': `bytes */${fileSize}` } }
        )
      }
      const start = parseInt(match[1], 10)
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1

      if (start > end || end >= fileSize) {
        await fd.close()
        return NextResponse.json(
          { error: 'range not satisfiable' },
          { status: 416, headers: { 'Content-Range': `bytes */${fileSize}` } }
        )
      }

      const chunkSize = end - start + 1
      const buf = Buffer.allocUnsafe(chunkSize)
      await fd.read(buf, 0, chunkSize, start)
      await fd.close()

      return new NextResponse(buf, {
        status: 206,
        headers: {
          ...PRIVATE_HEADERS,
          'Content-Type': 'audio/mpeg',
          'Content-Length': chunkSize.toString(),
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
        },
      })
    }

    // ── Full file (200) ──────────────────────────────────────────────────────
    const buf = Buffer.allocUnsafe(fileSize)
    await fd.read(buf, 0, fileSize, 0)
    await fd.close()

    return new NextResponse(buf, {
      status: 200,
      headers: {
        ...PRIVATE_HEADERS,
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (err) {
    try { await fd.close() } catch { /* ignore */ }
    console.error('[pf] episode serve error', err)
    return bad(404, 'episode not found')
  }
}

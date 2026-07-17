import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// Middleware already guards this route — only valid sessions reach here.
// This route streams the mp3 from private-assets/ (outside public/).
export async function GET(request: NextRequest) {
  const audioPath = path.join(process.cwd(), 'private-assets', 'manifesto', 'oneness-foundation-reading.mp3')

  let buffer: Buffer
  try {
    buffer = await readFile(audioPath)
  } catch {
    return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
  }

  // Support range requests so the HTML5 audio player can seek
  const range = request.headers.get('range')
  const fileSize = buffer.byteLength

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = end - start + 1
    const chunk = buffer.slice(start, end + 1)

    return new NextResponse(chunk, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  }

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': fileSize.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    },
  })
}

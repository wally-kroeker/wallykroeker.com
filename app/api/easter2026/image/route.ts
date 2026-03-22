import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.env.HOME || '/home/docker', 'easter2026-uploads')

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
}

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get('f')

  if (!filename || /[\/\\]/.test(filename)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const contentType = MIME_TYPES[ext]
  if (!contentType) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  try {
    const filePath = path.join(UPLOAD_DIR, filename)
    const data = await readFile(filePath)
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

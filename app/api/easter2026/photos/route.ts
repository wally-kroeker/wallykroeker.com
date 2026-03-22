import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'easter2026')

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const files = await readdir(UPLOAD_DIR)
    const photos = files
      .filter(f => /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(f))
      .sort()
      .reverse() // newest first

    return NextResponse.json({ photos })
  } catch {
    return NextResponse.json({ photos: [] })
  }
}

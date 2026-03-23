import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.env.HOME || '/home/docker', 'easter2026-uploads')
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
}
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

// Magic bytes for validating actual file content
const MAGIC_BYTES: Record<string, number[][]> = {
  jpg: [[0xFF, 0xD8, 0xFF]],
  png: [[0x89, 0x50, 0x4E, 0x47]],
  webp: [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  heic: [[0x00, 0x00, 0x00], [0x66, 0x74, 0x79, 0x70]], // ftyp at offset 4
  heif: [[0x00, 0x00, 0x00], [0x66, 0x74, 0x79, 0x70]],
}

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  const signatures = MAGIC_BYTES[ext]
  if (!signatures) return false

  if (ext === 'heic' || ext === 'heif') {
    // HEIC/HEIF: "ftyp" appears at byte offset 4
    if (buffer.length < 8) return false
    return buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70
  }

  const sig = signatures[0]
  if (buffer.length < sig.length) return false
  return sig.every((byte, i) => buffer[i] === byte)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('photo') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: JPG, PNG, WebP, HEIC' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (!validateMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { error: 'File content does not match its type. Please upload a real image.' },
        { status: 400 }
      )
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const timestamp = Date.now()
    const safeName = `${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = path.join(UPLOAD_DIR, safeName)

    await writeFile(filePath, buffer)

    return NextResponse.json({ filename: safeName })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

// Requests for /print (The FabLab: 3D printing and design, plus tech help). Stored PRIVATELY in the service user's home dir,
// outside public/ and with no GET route, so nothing here is ever web-fetchable.
// Wally is pinged via his self-hosted ntfy on the internal address (the public
// hostname sits behind Cloudflare Access and silently 302s a plain POST).

const HOME = process.env.HOME || '/home/docker'
const STORE_DIR = process.env.PRINT_REQUESTS_DIR || path.join(HOME, 'print-requests')
const ENV_FILE = path.join(HOME, '.config', 'wallykroeker', 'print.env')

const NEEDS = ['part', 'design', 'custom', 'tech', 'other'] as const
const NEED_LABELS: Record<string, string> = {
  part: 'Fix a part',
  design: 'Design or 3D print',
  custom: 'Custom name or gift',
  tech: 'Tech problem',
  other: 'Something else',
}

const MAX_PHOTOS = 3
const MAX_PHOTO_SIZE = 12 * 1024 * 1024 // 12MB; the form shrinks most phone photos first

// Rate limit: in-memory, single process. Good enough for a garage-sale QR code.
const PER_IP_LIMIT = 10 // rural carriers share one IP across many phones
const GLOBAL_LIMIT = 40
const WINDOW_MS = 60 * 60 * 1000
const hits = new Map<string, number[]>()
let globalHits: number[] = []

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  globalHits = globalHits.filter((t) => now - t < WINDOW_MS)
  if (recent.length >= PER_IP_LIMIT || globalHits.length >= GLOBAL_LIMIT) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  globalHits.push(now)
  hits.set(ip, recent)
  return false
}

// Detect the real image type from its bytes; phones mislabel HEIC or send no type at all.
function sniffImage(buf: Buffer): string | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png'
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buf.toString('ascii', 8, 12)
    if (['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis'].includes(brand)) return 'heic'
    if (['mif1', 'msf1', 'avif'].includes(brand)) return 'heif'
  }
  return null
}

function clean(v: FormDataEntryValue | null, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

type NtfyConfig = { url: string; topic: string; user: string; password: string; dryRun: boolean }

// Credentials come from the environment, or from a private env file in the service
// user's home (the systemd unit does not carry them).
async function ntfyConfig(): Promise<NtfyConfig> {
  const env: Record<string, string | undefined> = { ...process.env }
  if (!env.PRINT_NTFY_USER) {
    try {
      const text = await readFile(ENV_FILE, 'utf8')
      for (const line of text.split('\n')) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
        if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
      }
    } catch {
      // no env file; falls through to dry run
    }
  }
  const user = env.PRINT_NTFY_USER || ''
  const password = env.PRINT_NTFY_PASSWORD || ''
  return {
    url: (env.PRINT_NTFY_URL || 'http://10.10.40.22:8080').replace(/\/$/, ''),
    topic: env.PRINT_NTFY_TOPIC || 'wally-inbox',
    user,
    password,
    dryRun: env.PRINT_NTFY_DRYRUN === '1' || !user || !password,
  }
}

type Saved = {
  id: string
  name: string
  phone: string
  email: string
  need: string
  printName: string
  description: string
  photos: string[]
}

async function notify(req: Saved, dir: string, photoPaths: string[]): Promise<string> {
  const cfg = await ntfyConfig()
  const lines = [
    `From: ${req.name}`,
    req.phone ? `Phone: ${req.phone}` : null,
    req.email ? `Email: ${req.email}` : null,
    `Wants: ${NEED_LABELS[req.need] || req.need}`,
    req.printName ? `Name to print: ${req.printName}` : null,
    '',
    // ntfy caps a message at 4KB; the full text is always in request.json
    req.description.length > 2500 ? req.description.slice(0, 2500) + '… (cut off, full text saved)' : req.description,
    '',
    req.photos.length ? `${req.photos.length} photo(s) attached below.` : 'No photos.',
    `Saved: ${dir}`,
  ].filter((l): l is string => l !== null)

  const actions: Array<Record<string, string>> = []
  const digits = req.phone.replace(/[^\d+]/g, '')
  if (digits) {
    actions.push({ action: 'view', label: 'Text back', url: `sms:${digits}` })
    actions.push({ action: 'view', label: 'Call', url: `tel:${digits}` })
  }
  if (req.email) actions.push({ action: 'view', label: 'Email', url: `mailto:${req.email}` })

  const message = {
    topic: cfg.topic,
    title: `FabLab request: ${NEED_LABELS[req.need] || req.need} from ${req.name}`,
    message: lines.join('\n'),
    tags: ['hammer_and_wrench'],
    priority: 4,
    actions,
  }

  if (cfg.dryRun) {
    const log = JSON.stringify({ dryRun: true, ...message, photos: photoPaths }, null, 2)
    console.log('[print-request] ntfy DRY RUN\n' + log)
    await writeFile(path.join(dir, 'notify-dryrun.json'), log, { mode: 0o600 })
    return 'dry-run'
  }

  const auth = 'Basic ' + Buffer.from(`${cfg.user}:${cfg.password}`).toString('base64')
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
    redirect: 'manual', // a 302 means it was swallowed; never follow it and call it sent
  })
  if (res.status !== 200) throw new Error(`ntfy HTTP ${res.status}`)

  // Photos go as ntfy attachments so Wally can see them on his phone. Best effort:
  // the request text above is the part that must land.
  for (let i = 0; i < photoPaths.length; i++) {
    try {
      const body = await readFile(photoPaths[i])
      const r = await fetch(`${cfg.url}/${cfg.topic}`, {
        method: 'PUT',
        headers: {
          Authorization: auth,
          Filename: path.basename(photoPaths[i]),
          Title: `Photo ${i + 1}/${photoPaths.length} for request ${req.id}`,
          Tags: 'camera',
        },
        body,
        redirect: 'manual',
      })
      if (r.status !== 200) console.error(`[print-request] photo ${i + 1} ntfy HTTP ${r.status}`)
    } catch (e) {
      console.error('[print-request] photo attach failed', e)
    }
  }
  return 'sent'
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Something went wrong reading the form. Please try again.' }, { status: 400 })
  }

  // Honeypot: real people never see this field. Pretend it worked so bots move on.
  if (clean(form.get('website'), 200)) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(form.get('name'), 100)
  const phone = clean(form.get('phone'), 40)
  const email = clean(form.get('email'), 200)
  const need = clean(form.get('need'), 20)
  const printName = clean(form.get('printName'), 80)
  const description = clean(form.get('description'), 4000)

  if (!name) return NextResponse.json({ error: 'Please add your name.' }, { status: 400 })
  if (!phone && !email) {
    return NextResponse.json({ error: 'Please add a phone number or an email so I can reply.' }, { status: 400 })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 })
  }
  if (phone && phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ error: 'That phone number looks too short.' }, { status: 400 })
  }
  if (!(NEEDS as readonly string[]).includes(need)) {
    return NextResponse.json({ error: 'Please pick what you need.' }, { status: 400 })
  }
  if (!description && !printName) {
    return NextResponse.json({ error: 'Please tell me a little about what you need.' }, { status: 400 })
  }

  const files = form.getAll('photos').filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f && f.size > 0)
  if (files.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `Up to ${MAX_PHOTOS} photos, please.` }, { status: 400 })
  }

  const photos: Array<{ buf: Buffer; ext: string }> = []
  for (const f of files) {
    if (f.size > MAX_PHOTO_SIZE) {
      return NextResponse.json({ error: 'One of the photos is too big. Try a smaller one, or text it to me.' }, { status: 400 })
    }
    const buf = Buffer.from(await f.arrayBuffer())
    const ext = sniffImage(buf)
    if (!ext) {
      return NextResponse.json({ error: 'One of the files is not a photo I can read (JPG, PNG, HEIC or WebP).' }, { status: 400 })
    }
    photos.push({ buf, ext })
  }

  // Counted only once a request is valid, so fixing a typo doesn't use up the allowance.
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Lots of requests from here in the last hour. Please text 204-799-8082 instead.' },
      { status: 429 }
    )
  }

  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-')
  const id = `${stamp}-${Math.random().toString(36).slice(2, 7)}`
  const dir = path.join(STORE_DIR, id)

  try {
    await mkdir(dir, { recursive: true, mode: 0o700 })
    const photoNames: string[] = []
    const photoPaths: string[] = []
    for (let i = 0; i < photos.length; i++) {
      const fname = `photo-${i + 1}.${photos[i].ext}`
      await writeFile(path.join(dir, fname), photos[i].buf, { mode: 0o600 })
      photoNames.push(fname)
      photoPaths.push(path.join(dir, fname))
    }

    const saved: Saved = { id, name, phone, email, need, printName, description, photos: photoNames }
    await writeFile(
      path.join(dir, 'request.json'),
      JSON.stringify({ ...saved, receivedAt: new Date().toISOString(), userAgent: request.headers.get('user-agent') || '' }, null, 2),
      { mode: 0o600 }
    )

    try {
      const status = await notify(saved, dir, photoPaths)
      await writeFile(path.join(dir, 'notified'), status + '\n', { mode: 0o600 })
    } catch (e) {
      // The request is safely on disk; log loudly so a missed ping is findable.
      console.error(`[print-request] NOTIFY FAILED for ${id}`, e)
      await writeFile(path.join(dir, 'NOTIFY-FAILED'), String(e) + '\n', { mode: 0o600 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[print-request] save failed', e)
    return NextResponse.json(
      { error: 'Sorry, that did not go through on my end. Please text 204-799-8082 or email wallyk@gmail.com.' },
      { status: 500 }
    )
  }
}

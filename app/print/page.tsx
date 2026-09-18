import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RequestForm from './RequestForm'

// QR landing page for The FabLab: local 3D printing and design, with one line
// pointing at the wider tech help. Every flyer, sign and printed business card points
// here, so the path is fixed. Deliberately not in the main nav. Copy is first person (Wally is one person, not a team) and plain:
// the audience is neighbours at a garage sale, reading on a phone.

export const dynamic = 'force-static'

const PHONE_DISPLAY = '204-799-8082'
const PHONE = '+12047998082'
const EMAIL = 'wallyk@gmail.com'
// Pre-filled text for the sms: links. `?&body=` works on both iOS (&body) and Android (?body).
const SMS_BODY = "Hi Wally, I saw your FabLab table at the garage sale. Here's a photo of what I need: "
const SMS_HREF = `sms:${PHONE}?&body=${encodeURIComponent(SMS_BODY)}`

export const metadata: Metadata = {
  title: 'The FabLab: local 3D printing and design',
  description:
    'Your local digital blacksmith in Manitoba. Bring the broken part or the idea on the back of an envelope, and I design it and 3D print it. Help with tech problems too.',
  alternates: { canonical: 'https://wallykroeker.com/print' },
  openGraph: {
    title: 'The FabLab: your local digital blacksmith',
    description:
      'Broken part? Idea on the back of an envelope? Custom gifts and favours? I design it and 3D print it, locally. Tech help too.',
    url: 'https://wallykroeker.com/print',
    type: 'website',
    images: [{ url: '/images/print/fablab-printer.jpg', width: 1000, height: 750 }],
  },
  // Without this the site-wide twitter card from the root layout leaks through
  twitter: {
    card: 'summary_large_image',
    title: 'The FabLab: local 3D printing and design',
    description:
      'Your local digital blacksmith in Manitoba. Bring the broken part or the idea on the back of an envelope, and I design it and 3D print it. Help with tech problems too.',
    images: ['/images/print/fablab-printer.jpg'],
  },
}

// half: shown square, two to a row (used for the coin front and back)
type Photo = { src: string; alt: string; caption: string; width: number; height: number; half?: boolean }

// Real photos of Wally's own work only. To add one: drop the file in
// public/images/print/ (strip EXIF first, phones embed GPS) and add a line here.
// An offering with no photos simply shows none.
const OFFERINGS: Array<{ id: string; title: string; lead: string; body: string[]; photos: Photo[] }> = [
  {
    id: 'fix',
    title: 'Fix it',
    lead: 'Broken or discontinued parts',
    body: [
      'A snapped knob, a broken clip, a cracked bracket, a lost cap or cover. If they don’t make it anymore, I can often measure the old one, model it, and print you a new one.',
    ],
    photos: [],
  },
  {
    id: 'design',
    title: 'Design it',
    lead: 'From your idea or sketch',
    body: [
      'Got something you need that nobody sells? Bring the idea, even if it’s just a sketch on the back of an envelope. Let’s talk it through, and I’ll turn it into something you can hold.',
      'I designed the StillPoint coin from scratch.',
    ],
    photos: [
      {
        src: '/images/print/stillpoint-coin-front.jpg',
        alt: 'A black 3D printed StillPoint coin on a wooden table, with rippled rings circling out from a red touchstone in the centre',
        caption: 'The StillPoint coin: a touchstone for your thumb, with ripples circling out from it.',
        width: 800,
        height: 800,
        half: true,
      },
      {
        src: '/images/print/stillpoint-coin-back.jpg',
        alt: 'The back of the StillPoint coin, with the words FIND A THIRD WAY and STILLPOINTPROJECT.ORG around the rim',
        caption: 'The back reads: Find a third way.',
        width: 800,
        height: 800,
        half: true,
      },
      {
        src: '/images/print/coin-washer-mid-print.jpg',
        alt: 'A half-printed green coin on the 3D printer bed with a steel washer set inside it, print heads above',
        caption: 'Paused mid-print to drop in a steel washer, so it has real weight in your hand.',
        width: 1000,
        height: 625,
      },
    ],
  },
  {
    id: 'custom',
    title: 'Make it yours',
    lead: 'Names, gifts, toys',
    body: [
      'Custom name keychains, gifts, toys and fidgets, and favours for weddings, showers and reunions, in the colours you pick.',
      'Custom 3D-printed business cards, with your logo and a QR code that really scans.',
    ],
    photos: [],
  },
]

const STEPS = [
  { title: 'Tell me what you need', body: 'Use the form, or text me a photo.' },
  { title: 'I reply with a quote', body: 'Usually within a day or two.' },
  { title: 'I print it here', body: 'Locally, in Manitoba.' },
  { title: 'You pick it up', body: 'Or I drop it off, if you’re close by.' },
]

export default function PrintPage() {
  return (
    <div className="print-page bg-[#0b0d10] text-zinc-100">
      <div className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3 text-sm">
          <Link href="/" className="font-semibold tracking-tight text-zinc-100">
            Wally Kroeker
          </Link>
          <a href={`tel:${PHONE}`} className="font-mono text-amber-400">
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 sm:pt-14">
        {/* Hero */}
        <header>
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" aria-hidden="true" />
            The FabLab &middot; 3D printing &amp; design
          </p>
          <h1 className="mt-5 text-[2.5rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Your local digital blacksmith.
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-zinc-200">
            Bring me the broken part or the idea on the back of an envelope. I&rsquo;ll design it and 3D print
            it, right here in Manitoba.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            My dad grew up watching the Elm Creek blacksmith turn a farmer&rsquo;s problem into the tool that
            fixed it. I do the same work, but with digital tools instead of an anvil, using my 20+ years of IT
            experience to solve local problems.
          </p>
          <p className="mt-5 border-l-2 border-amber-500 pl-4 text-xl font-semibold leading-snug text-white">
            When I can, you keep the tool we build.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a
              href="#request"
              className="rounded-xl bg-amber-500 px-5 py-4 text-center text-lg font-semibold text-zinc-950 hover:bg-amber-400"
            >
              Tell me what you need
            </a>
            <a
              href={SMS_HREF}
              className="rounded-xl border border-zinc-600 px-5 py-4 text-center text-lg font-semibold text-white hover:border-amber-500"
            >
              Text me a photo
            </a>
          </div>
          <p className="mt-3 text-center text-sm text-zinc-400 sm:text-left">Free quotes. Local, in Manitoba.</p>
        </header>

        {/* The shop */}
        <figure className="mt-10">
          <Image
            src="/images/print/fablab-printer.jpg"
            alt="A 3D printer labelled The FabLab on a workbench, with spools of filament"
            width={1000}
            height={750}
            priority
            sizes="(max-width: 672px) 90vw, 672px"
            className="w-full rounded-xl"
          />
          <figcaption className="mt-1.5 text-sm text-zinc-400">The FabLab: where your part gets made.</figcaption>
        </figure>

        {/* Offerings */}
        <section className="mt-16 space-y-12" aria-label="What I can make">
          {OFFERINGS.map((o, i) => (
            <article key={o.id} id={o.id} className="border-l-2 border-amber-500/60 pl-5">
              <p className="font-mono text-sm text-amber-400">0{i + 1}</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{o.title}</h2>
              <p className="mt-1 text-lg text-zinc-400">{o.lead}</p>
              <div className="mt-4 space-y-3 text-lg leading-relaxed text-zinc-200">
                {o.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {o.photos.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4">
                  {o.photos.map((ph) => (
                    <figure key={ph.src} className={ph.half ? undefined : 'col-span-2'}>
                      <Image
                        src={ph.src}
                        alt={ph.alt}
                        width={ph.width}
                        height={ph.height}
                        sizes={ph.half ? '(max-width: 672px) 45vw, 300px' : '(max-width: 672px) 90vw, 620px'}
                        className={`${ph.half ? 'aspect-square' : 'aspect-[16/10]'} w-full rounded-xl object-cover`}
                      />
                      <figcaption className="mt-1.5 text-sm text-zinc-400">{ph.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              {o.id === 'custom' && (
                <p className="mt-4 inline-block rounded-lg bg-zinc-900 px-3 py-2 text-base text-zinc-200">
                  Custom name keychains from <strong className="text-white">$6</strong>
                </p>
              )}
            </article>
          ))}
        </section>

        {/* How it works */}
        <section className="mt-16" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold tracking-tight text-white">
            How it works
          </h2>
          <ol className="mt-5 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/60 font-mono text-amber-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">{s.title}</p>
                  <p className="text-base text-zinc-400">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-base text-zinc-300">
            Prices: custom name keychains from $6. Everything else is quoted per job.
          </p>
        </section>

        {/* The one door to the wider tech work; the full story moves to /fablab later */}
        <p className="mt-12 rounded-2xl border border-zinc-800 px-5 py-4 text-lg leading-relaxed text-zinc-200">
          3D printing is one tool in the shop. I also solve tech problems: computers, Wi-Fi, scams, custom
          sensors and alarms. Just ask.
        </p>

        {/* Form */}
        <section id="request" className="mt-16 scroll-mt-6 rounded-2xl border border-zinc-800 bg-[#14171c] p-5 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Tell me what you need</h2>
          <p className="mt-2 mb-6 text-base text-zinc-400">Takes about a minute. I&rsquo;ll get back to you with a quote.</p>
          <RequestForm />
        </section>

        {/* Contact */}
        <section className="mt-12" aria-labelledby="contact">
          <h2 id="contact" className="text-2xl font-bold tracking-tight text-white">
            Rather just talk?
          </h2>
          <p className="mt-2 text-base text-zinc-400">I&rsquo;m Wally. Text, call, or email, whatever is easiest.</p>
          <div className="mt-5 grid gap-3">
            <a href={SMS_HREF} className="flex items-center justify-between rounded-xl border border-zinc-700 px-5 py-4 hover:border-amber-500">
              <span className="text-lg text-white">Text a photo</span>
              <span className="font-mono text-amber-400">{PHONE_DISPLAY}</span>
            </a>
            <a href={`tel:${PHONE}`} className="flex items-center justify-between rounded-xl border border-zinc-700 px-5 py-4 hover:border-amber-500">
              <span className="text-lg text-white">Call</span>
              <span className="font-mono text-amber-400">{PHONE_DISPLAY}</span>
            </a>
            <a href={`mailto:${EMAIL}?subject=FabLab%20request`} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-700 px-5 py-4 hover:border-amber-500">
              <span className="text-lg text-white">Email</span>
              <span className="truncate font-mono text-amber-400">{EMAIL}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

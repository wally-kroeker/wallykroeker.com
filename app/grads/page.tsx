import type { Metadata } from 'next'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Class of 2026 — wallykroeker.com',
  description: 'Celebrating the graduates of 2026.',
}

export default function Grads2026Page() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Container className="py-16 md:py-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-amber-400 mb-4 font-medium">
            Class of 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Congratulations,<br />
            <span className="text-amber-400">Zoe.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Twelve years. Countless early mornings, late nights, hard days, and big ones.
            You made it — and then some.
          </p>
        </div>

        {/* Photo placeholder */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="aspect-[4/3] rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
            <div className="text-center text-zinc-600 px-8">
              <div className="text-5xl mb-3">📷</div>
              <p className="text-sm">Photo goes here</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-10">
            <p className="text-zinc-300 text-lg leading-relaxed mb-4">
              I&apos;ve watched you grow up stubborn and curious and kind — in that order, depending on the day. You&apos;ve figured out things about yourself that most people take decades to learn, and you did it while keeping your head down and doing the work.
            </p>
            <p className="text-zinc-300 text-lg leading-relaxed mb-4">
              Grade 12 is over. Whatever comes next is yours to define, and I have every confidence you&apos;ll define it on your own terms.
            </p>
            <p className="text-zinc-300 text-lg leading-relaxed">
              I&apos;m proud of you. Not because of the diploma — because of the person you&apos;ve become.
            </p>
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm">— Dad</p>
            </div>
          </div>
        </div>

        {/* Milestones row */}
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 mb-16">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-white font-bold text-lg">Grade 12</div>
            <div className="text-zinc-500 text-sm">Complete</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">✨</div>
            <div className="text-white font-bold text-lg">2026</div>
            <div className="text-zinc-500 text-sm">Your year</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-white font-bold text-lg">What&apos;s next</div>
            <div className="text-zinc-500 text-sm">Up to you</div>
          </div>
        </div>

        {/* Quote */}
        <div className="max-w-xl mx-auto text-center">
          <blockquote className="text-zinc-400 text-lg italic leading-relaxed">
            &ldquo;The beginning is always today.&rdquo;
          </blockquote>
          <cite className="text-zinc-600 text-sm mt-2 block not-italic">— Mary Shelley</cite>
        </div>

      </Container>
    </div>
  )
}

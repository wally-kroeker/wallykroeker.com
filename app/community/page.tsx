import Container from '@/components/Container'
import { site } from '@/lib/siteConfig'

export default function CommunityPage() {
  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h1 className="text-xl font-semibold">Community</h1>
            <p className="mt-2 text-zinc-300 max-w-3xl">
              "The Search for Ultimate Reality"—a Discord for curious builders and philosophers. Share ideas, ask better questions, and make small things together.
            </p>
            <div className="mt-4">
              <a href={site.discord} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">
                Join the Server
              </a>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-sm font-medium text-zinc-300">Signature Lines</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>Useful beats perfect.</li>
                <li>Build small, ship openly.</li>
                <li>Make it easy for the next person.</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

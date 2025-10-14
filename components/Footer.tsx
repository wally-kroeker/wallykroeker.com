import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-zinc-900 text-sm text-zinc-400">
      <Container>
        <div className="py-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Wally Kroeker • No trackers. Fast, accessible, open.</div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white">Privacy</a>
            <a href="/rss" className="hover:text-white">RSS</a>
            <a href="/colophon" className="hover:text-white">Colophon</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

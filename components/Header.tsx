import Link from 'next/link'
import Container from './Container'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-zinc-800">
      <Container>
        <div className="py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <Link href="/" className="font-semibold tracking-tight text-zinc-100">
            Wally Kroeker
          </Link>
          <nav className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-sm w-full md:w-auto">
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <Link href="/loop" className="hover:text-white">Cognitive Loop</Link>
            <Link href="/blog" className="hover:text-white">Tech Blog</Link>
            <Link href="/community" className="hover:text-white">Community</Link>
            <Link href="/work" className="hover:text-white">Work With Me</Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}

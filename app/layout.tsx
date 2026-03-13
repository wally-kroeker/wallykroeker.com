import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://wallykroeker.com'),
  title: {
    default: 'Wally Kroeker — Build open, useful systems',
    template: '%s | Wally Kroeker',
  },
  description: 'Security and AI consulting for businesses that value privacy, pragmatism, and transparent build logs over marketing promises.',
  openGraph: {
    title: 'Wally Kroeker — Build open, useful systems',
    description: 'Security and AI consulting for businesses that value privacy, pragmatism, and transparent build logs over marketing promises.',
    url: 'https://wallykroeker.com',
    siteName: 'Wally Kroeker',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary',
    title: 'Wally Kroeker — Build open, useful systems',
    description: 'Security and AI consulting for businesses that value privacy, pragmatism, and transparent build logs over marketing promises.',
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://wallykroeker.com/rss',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#121212] text-zinc-100 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <script
          data-goatcounter="https://wallykroeker.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
      </body>
    </html>
  )
}

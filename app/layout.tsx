import type { Metadata } from 'next'
import Script from 'next/script'
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
        <Script
          async
          src="https://umami.apps.kroeker.fun/u"
          data-website-id="932da4a5-0e9b-4b3f-91dd-263d33110948"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}

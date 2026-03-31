import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ASCII Art Generator',
  description: 'Generate ASCII art from text prompts with multiple font styles. Type, generate, and browse your gallery.',
}

export default function AsciiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

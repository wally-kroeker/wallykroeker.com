import clsx from 'clsx'
import React from 'react'

export default function Prose({ children, className, html }: { children?: React.ReactNode, className?: string, html?: string }) {
  if (html) {
    return <article className={clsx("prose prose-invert max-w-none prose-zinc prose-headings:font-semibold prose-a:text-zinc-100", className)} dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className={clsx(`
      prose prose-invert prose-zinc
      prose-headings:font-semibold
      prose-h1:text-4xl prose-h1:mb-4
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-zinc-300 prose-p:leading-relaxed
      prose-a:text-zinc-100 prose-a:underline prose-a:decoration-zinc-700
      hover:prose-a:decoration-zinc-500
      prose-strong:text-zinc-100 prose-strong:font-semibold
      prose-code:text-zinc-300 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
      prose-ul:text-zinc-300 prose-ol:text-zinc-300
      prose-li:marker:text-zinc-500
      max-w-none
    `, className)}>
      {children}
    </div>
  )
}

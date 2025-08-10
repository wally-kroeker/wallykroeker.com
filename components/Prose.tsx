export default function Prose({ html }: { html: string }) {
  return <article className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

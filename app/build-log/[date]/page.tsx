import Container from '@/components/Container'
import Prose from '@/components/Prose'
import { getAllBuildLogs, getBuildLogByDate } from '@/lib/markdown'

export async function generateStaticParams() {
  const logs = await getAllBuildLogs()
  return logs.map((log) => ({ date: log.date }))
}

export default async function BuildLogPage({ params }: { params: { date: string } }) {
  const log = await getBuildLogByDate(params.date)

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <div className="mb-4">
            <a
              href="/build-log"
              className="text-sm text-zinc-400 hover:text-zinc-300"
            >
              ← Back to Build Log
            </a>
          </div>

          <div className="text-sm text-zinc-400">
            {new Date(log.meta.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1 className="text-2xl font-semibold">{log.meta.title}</h1>

          {log.meta.author && (
            <div className="mt-2 text-sm text-zinc-400">Written by {log.meta.author}</div>
          )}

          {log.meta.session_count && (
            <div className="mt-1 text-sm text-zinc-500">
              {log.meta.session_count} session{log.meta.session_count > 1 ? 's' : ''} documented
            </div>
          )}

          {log.meta.projects_touched && log.meta.projects_touched.length > 0 && (
            <div className="mt-3 flex gap-2">
              {log.meta.projects_touched.map((project) => (
                <span
                  key={project}
                  className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300"
                >
                  {project}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Prose html={log.html} />
          </div>
        </div>
      </Container>
    </section>
  )
}

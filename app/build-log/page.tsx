import Container from '@/components/Container'
import { getAllBuildLogs } from '@/lib/markdown'

export const dynamic = 'force-static'

export default async function BuildLogIndex() {
  const logs = await getAllBuildLogs()

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Build Log</h1>
          <p className="mt-2 text-zinc-300 max-w-3xl">
            Daily work journal from Bob's perspective. What we built together, day by day.
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Written by Bob (AI) • Client work redacted • Personal projects detailed
          </p>

          <ul className="mt-6 space-y-4">
            {logs.map((log) => (
              <li key={log.date}>
                <a
                  className="block rounded-2xl border border-zinc-800 p-4 hover:border-zinc-600"
                  href={`/build-log/${log.date}`}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm text-zinc-400">
                      {new Date(log.meta.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    {log.meta.session_count && (
                      <div className="text-xs text-zinc-500">
                        {log.meta.session_count} session{log.meta.session_count > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="text-lg mt-1">{log.meta.title}</div>
                  {log.meta.description && (
                    <p className="text-sm text-zinc-300 mt-1">{log.meta.description}</p>
                  )}
                  {log.meta.projects_touched && log.meta.projects_touched.length > 0 && (
                    <div className="mt-2 flex gap-2">
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
                </a>
              </li>
            ))}
          </ul>

          {logs.length === 0 && (
            <div className="mt-6 text-zinc-400">No build log entries yet.</div>
          )}
        </div>
      </Container>
    </section>
  )
}

import type { Metadata } from 'next'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Meeting #7 Pre-Work — GrayBeard AI Collective',
  description: 'Get set up before the Aug 26 session: free Gemini key, pi install, bootstrap prompt. Ten minutes and you are ready.',
  alternates: { canonical: 'https://wallykroeker.com/community/meeting-7' },
}

export default function Meeting7Page() {
  return (
    <div className="pt-12 pb-20 md:pt-24 md:pb-32">
      <Container>
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-zinc-500 text-sm mb-3">
              <a href="/community" className="hover:text-zinc-300 transition">GrayBeard AI Collective</a>
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              Meeting #7 Pre-Work
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed mb-2">
              Your first agent from three text files
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Wednesday Aug 26, 7pm Central, Discord Meetups voice channel.{' '}
              <a
                href="https://discord.gg/qH9rAuj4nM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline hover:text-white transition"
              >
                Join the Discord
              </a>
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10 mb-10">
            <p className="text-zinc-300 leading-relaxed mb-2">
              Do this before the meeting. About ten minutes. No paid subscription needed.
            </p>
            <p className="text-zinc-400 leading-relaxed text-sm">
              The stack: a free Google AI Studio key + <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi</code> (an open-source terminal coding agent) + three markdown files you create with one prompt. The agent writes the files itself. The second time you open it, it remembers.
            </p>
          </div>

          {/* A1 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Step 1. Get a free Gemini API key</h2>
            <ol className="space-y-3 text-zinc-300 list-decimal list-inside">
              <li>Go to <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-zinc-200 underline hover:text-white transition">aistudio.google.com</a> and sign in with any Google account.</li>
              <li>Click <strong className="text-zinc-100">Get API key</strong> (left sidebar), then <strong className="text-zinc-100">Create API key</strong>. Pick "Create in new project" if asked.</li>
              <li>Copy the key (starts with <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">AIza...</code>).</li>
            </ol>
            <div className="bg-zinc-900/30 border border-zinc-700 rounded-xl p-4 mt-4 space-y-2">
              <p className="text-zinc-400 text-sm">
                <strong className="text-zinc-300">Security:</strong> Your API key is a password. Do not paste it into chat, share it in screenshots, or commit it to git.
              </p>
              <p className="text-zinc-400 text-sm">
                <strong className="text-zinc-300">Privacy:</strong> The free tier may be used by Google to improve their products. Do not paste anything confidential into tonight's session.
              </p>
              <p className="text-zinc-400 text-sm">
                No credit card required. Free tier is rate-limited (roughly 10 requests per minute, 250 per day on Flash models) which is plenty for the session.
              </p>
            </div>
          </div>

          {/* A2 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Step 2. Install Node.js, then pi</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi</code> installs with npm, which comes bundled with Node.js.
            </p>

            <div className="space-y-6">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Windows (PowerShell)</h3>
                <ol className="space-y-2 text-zinc-400 list-decimal list-inside text-sm">
                  <li>Install Node.js LTS from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline hover:text-white transition">nodejs.org</a> (the installer, defaults are fine). Close and reopen PowerShell.</li>
                  <li>
                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">npm install -g --ignore-scripts @earendil-works/pi-coding-agent</code>
                  </li>
                  <li><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi --version</code> should print a version number.</li>
                </ol>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Mac (Terminal)</h3>
                <ol className="space-y-2 text-zinc-400 list-decimal list-inside text-sm">
                  <li>Install Node.js LTS from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline hover:text-white transition">nodejs.org</a> (or <code className="bg-zinc-800 px-1 rounded text-zinc-200 text-xs">brew install node</code> if you have Homebrew).</li>
                  <li><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">npm install -g --ignore-scripts @earendil-works/pi-coding-agent</code></li>
                  <li><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi --version</code></li>
                </ol>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Linux (terminal)</h3>
                <ol className="space-y-2 text-zinc-400 list-decimal list-inside text-sm">
                  <li>Node.js 20+ from your package manager, or <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline hover:text-white transition">nvm</a>, or nodejs.org.</li>
                  <li><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">npm install -g --ignore-scripts @earendil-works/pi-coding-agent</code></li>
                  <li><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi --version</code></li>
                </ol>
              </div>
            </div>

            <p className="text-zinc-500 text-sm mt-4">
              If <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 text-xs">npm install -g</code> complains about permissions on Mac or Linux, use nvm instead of the system Node. Do not sudo it.
            </p>
          </div>

          {/* A3 */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Step 3. Give pi your key</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              pi reads the key from an environment variable named <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">GEMINI_API_KEY</code>.
            </p>

            <div className="space-y-6">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Windows (PowerShell), permanent</h3>
                <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 text-sm overflow-x-auto"><code>{`setx GEMINI_API_KEY "AIza...your key..."`}</code></pre>
                <p className="text-zinc-500 text-xs mt-2">Close and reopen PowerShell after running setx. It only affects new windows.</p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Mac (zsh)</h3>
                <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 text-sm overflow-x-auto"><code>{`echo 'export GEMINI_API_KEY="AIza...your key..."' >> ~/.zshrc && source ~/.zshrc`}</code></pre>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Linux (bash)</h3>
                <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 text-sm overflow-x-auto"><code>{`echo 'export GEMINI_API_KEY="AIza...your key..."' >> ~/.bashrc && source ~/.bashrc`}</code></pre>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-3">Test it (all platforms)</h3>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 text-sm overflow-x-auto"><code>{`pi --model google/gemini-flash-latest -p "Reply with the single word: ready"`}</code></pre>
              <p className="text-zinc-400 text-sm mt-3">
                You should see <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">ready</code>. If you see 401 or 403, the key is not set in this terminal window. If you see a model error, try <code className="bg-zinc-800 px-1 rounded text-zinc-200 text-xs">google/gemini-2.5-flash</code> or <code className="bg-zinc-800 px-1 rounded text-zinc-200 text-xs">google/gemini-3.5-flash</code> instead.
              </p>
            </div>
          </div>

          {/* Bootstrap prompt */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">The bootstrap prompt</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              At the meeting, make a folder, open pi in it, and paste this. It creates the three files that become your agent's memory.
            </p>
            <div className="relative">
              <pre className="bg-zinc-950 border border-zinc-700 rounded-2xl p-6 text-zinc-200 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">{`You are setting up a personal assistant that lives in this folder and remembers things between sessions. Do the setup now by creating three files in the current directory. Do not ask questions first; use sensible placeholders in [brackets] where you need information from me, and I will fill them in after.

1. AGENTS.md: your standing instructions. Include these sections: "Who I am" (name, role, one-sentence context, all placeholders), "What you help me with" (3 placeholder bullets), "How I like to work" (be direct, say when you don't know, one question at a time), and "Start of every session" with exactly these steps: read memory.md and mention anything relevant, read tasks.md and flag anything urgent, then ask what I want to work on.

2. memory.md: a file you keep for yourself. Sections: "Always know" (3 placeholder lines about me) and "Notes" (empty, with a one-line comment that you add dated entries here at the end of useful sessions).

3. tasks.md: sections "Active" and "Done", each with one placeholder checkbox item using "- [ ]" syntax.

Keep every file under 40 lines, plain markdown, no emoji. When the files are written, print a short list of what you created and the 3 placeholders I most need to fill in, then stop.`}</pre>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Troubleshooting</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-400 font-semibold pb-3 pr-4 min-w-[180px]">Symptom</th>
                    <th className="text-left text-zinc-400 font-semibold pb-3 pr-4 min-w-[160px]">Cause</th>
                    <th className="text-left text-zinc-400 font-semibold pb-3 min-w-[200px]">Fix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top"><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">pi: command not found</code></td>
                    <td className="py-3 pr-4 text-zinc-400 align-top">npm global bin not on PATH, or terminal opened before install</td>
                    <td className="py-3 text-zinc-400 align-top">Reopen terminal; on Windows reopen PowerShell after Node install</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top"><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">401 / 403 / "API key not valid"</code></td>
                    <td className="py-3 pr-4 text-zinc-400 align-top"><code className="bg-zinc-800 px-1 rounded text-xs">GEMINI_API_KEY</code> not set in this window</td>
                    <td className="py-3 text-zinc-400 align-top">Windows: reopen PowerShell after <code className="bg-zinc-800 px-1 rounded text-xs">setx</code>. Mac/Linux: <code className="bg-zinc-800 px-1 rounded text-xs">echo $GEMINI_API_KEY</code> should print the key</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top">Model "not found" / 404</td>
                    <td className="py-3 pr-4 text-zinc-400 align-top">Model id retired or not on their account</td>
                    <td className="py-3 text-zinc-400 align-top">Use <code className="bg-zinc-800 px-1 rounded text-xs">google/gemini-flash-latest</code>; pi accepts ids it doesn't list (prints a warning, still works)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top">429 / rate limited</td>
                    <td className="py-3 pr-4 text-zinc-400 align-top">Free tier: ~10 req/min</td>
                    <td className="py-3 text-zinc-400 align-top">Wait a minute. Don't spam-retry</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top">Bootstrap "hangs"</td>
                    <td className="py-3 pr-4 text-zinc-400 align-top">First call on Flash can take 30-60s with thinking on</td>
                    <td className="py-3 text-zinc-400 align-top">Wait. If nothing after 2 min, Ctrl+C and paste again</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top">Files not created</td>
                    <td className="py-3 pr-4 text-zinc-400 align-top">pi started in a different folder</td>
                    <td className="py-3 text-zinc-400 align-top"><code className="bg-zinc-800 px-1 rounded text-xs">cd my-agent</code> first; pi writes in the current directory</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-zinc-300 align-top">Second session doesn't remember</td>
                    <td className="py-3 pr-4 text-zinc-400 align-top">pi started outside the folder</td>
                    <td className="py-3 text-zinc-400 align-top">AGENTS.md is loaded from the current directory and its parents only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-12 text-center">
            <a
              href="https://discord.gg/qH9rAuj4nM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors text-lg mb-6"
            >
              Join the Discord
            </a>
            <p className="text-zinc-500 text-sm">
              Questions before the meeting? Drop them in #general.
            </p>
            <p className="mt-6">
              <a href="/community" className="text-zinc-500 hover:text-zinc-300 transition text-sm">
                Back to GrayBeard AI Collective
              </a>
            </p>
          </div>

        </div>
      </Container>
    </div>
  )
}

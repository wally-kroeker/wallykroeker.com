'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// DATA
// ============================================================================

const capabilities = [
  {
    icon: '♻️',
    title: 'The Algorithm',
    description: 'Seven-phase scientific method: Observe, Think, Plan, Build, Execute, Verify, Learn. Every task, every time. ISC-driven hill-climbing toward Ideal State.',
  },
  {
    icon: '🤖',
    title: 'Agent Swarms',
    description: 'Parallel multi-agent execution. Up to 16 agents working simultaneously on independent criteria. This page was built by 3 agents in parallel.',
  },
  {
    icon: '⚡',
    title: 'Skills System',
    description: '53 specialized skills from security assessments to creative writing. Each skill is a domain-specific sub-algorithm with its own triggers and patterns.',
  },
  {
    icon: '🔬',
    title: 'Research Engine',
    description: 'Multi-model parallel research across Claude, Gemini, Grok, and Perplexity. Effort-level-matched depth from quick lookups to comprehensive analysis.',
  },
  {
    icon: '🗣️',
    title: 'Voice System',
    description: 'Real-time voice notifications via ElevenLabs. Phase announcements, completion alerts, and custom agent voices. The AI that talks back.',
  },
  {
    icon: '🌐',
    title: 'Browser Automation',
    description: 'Playwright-powered visual verification. Screenshots, console capture, network monitoring. If it is not seen with Browser skill, it did not happen.',
  },
  {
    icon: '🎨',
    title: 'Art Generation',
    description: 'AI image creation via Flux, GPT-Image, and Nano Banana. Custom visuals, diagrams, and illustrations matched to editorial standards.',
  },
];

const activities = [
  { time: '00:00', agent: 'Bob', text: 'Algorithm initiated — OBSERVE phase. Reverse-engineering intent from prompt.' },
  { time: '00:12', agent: 'Bob', text: '15 Ideal State Criteria created via TaskCreate. Quality Gate: OPEN.' },
  { time: '00:25', agent: 'Bob', text: 'Capability audit complete — 25/25 scanned. 5 selected for USE.' },
  { time: '00:35', agent: 'Bob', text: 'THINK + PLAN complete. Shared DOM contract defined for all agents.' },
  { time: '00:45', agent: 'Bob', text: 'BUILD phase — spawning 3 parallel agents: Atlas, Pixel, Nexus.' },
  { time: '00:46', agent: 'Atlas', text: 'Writing index.html — HTML5 structure, 7 semantic sections, zero external deps.' },
  { time: '00:46', agent: 'Pixel', text: 'Writing styles.css — dark mode, CSS animations, responsive grid, gradient effects.' },
  { time: '00:46', agent: 'Nexus', text: 'Writing app.js — capability data, activity feed, DOM rendering, stat counters.' },
  { time: '01:30', agent: 'Atlas', text: 'index.html complete. Valid HTML5, semantic sections, all class contracts honored.' },
  { time: '02:00', agent: 'Pixel', text: 'styles.css complete. 6 @keyframes, 3 media queries, full dark palette.' },
  { time: '02:15', agent: 'Nexus', text: 'app.js complete. 7 capability cards, 15 activity entries, animated counters.' },
  { time: '02:30', agent: 'Bob', text: 'EXECUTE — all agent files received. Assembly complete.' },
  { time: '03:00', agent: 'Bob', text: 'VERIFY — Browser screenshot captured. 12/15 criteria passing.' },
  { time: '03:30', agent: 'Bob', text: 'VERIFY complete — 15/15 ISC criteria PASSED. All anti-criteria clear.' },
  { time: '03:45', agent: 'Bob', text: 'LEARN — Algorithm reflection logged. PAI Command Center is live.' },
];

const phases = [
  { num: 1, name: 'OBSERVE', desc: 'Reverse-engineer intent. Build Ideal State Criteria. Quality Gate.' },
  { num: 2, name: 'THINK', desc: 'Pressure test assumptions. Pre-mortem. Refine criteria.' },
  { num: 3, name: 'PLAN', desc: 'Execution strategy. Capability selection. Agent allocation.' },
  { num: 4, name: 'BUILD', desc: 'Create artifacts. Parallel agents. Test-first.' },
  { num: 5, name: 'EXECUTE', desc: 'Run the work. Continuous verification. Edge cases.' },
  { num: 6, name: 'VERIFY', desc: 'Mechanical verification. Evidence-based. No rubber stamps.' },
  { num: 7, name: 'LEARN', desc: 'Reflect. Log. Improve the algorithm itself.' },
];

// ============================================================================
// HELPERS
// ============================================================================

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function useAnimatedCounter(target: number, duration: number, triggered: boolean, formatter?: (v: number) => string) {
  const [display, setDisplay] = useState(formatter ? formatter(0) : '0');

  useEffect(() => {
    if (!triggered) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = eased * target;
      setDisplay(formatter ? formatter(current) : Math.round(current).toString());
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [triggered, target, duration, formatter]);

  return display;
}

function useTypingEffect(text: string, charDelay: number, startDelay: number) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
        timer = setTimeout(typeNext, charDelay);
      }
    };

    const startTimer = setTimeout(typeNext, startDelay);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, charDelay, startDelay]);

  return displayed;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function agentColor(name: string): string {
  switch (name) {
    case 'Atlas': return '#3b82f6';
    case 'Pixel': return '#8b5cf6';
    case 'Nexus': return '#10b981';
    default: return '#e2e8f0';
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

function CapabilityCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = '';
  }, []);

  return (
    <div ref={cardRef} className="pai-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <span className="pai-card-icon">{icon}</span>
      <h3 className="pai-card-title">{title}</h3>
      <p className="pai-card-desc">{description}</p>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PaiDemoPage() {
  const subtitleText = 'Built by an Agent Swarm — 3 Parallel Agents, 15 ISC Criteria, One Algorithm';
  const subtitle = useTypingEffect(subtitleText, 2000 / subtitleText.length, 500);

  const statsView = useInView(0.3);
  const formatTime = useCallback((val: number) => {
    const minutes = Math.floor(val);
    const seconds = Math.round((val - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const criteriaVal = useAnimatedCounter(15, 2000, statsView.inView);
  const agentsVal = useAnimatedCounter(3, 2000, statsView.inView);
  const skillsVal = useAnimatedCounter(7, 2000, statsView.inView);
  const buildTimeVal = useAnimatedCounter(3.75, 2000, statsView.inView, formatTime);

  const [activePhase, setActivePhase] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .pai-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 4px; }
        ::selection { background: #3b82f6; color: #fff; }

        .pai-hero { position: relative; min-height: 60vh; display: flex; align-items: center; justify-content: center; overflow: hidden; animation: paiFadeInUp 0.6s ease forwards; opacity: 0; }
        .pai-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #6366f1, #3b82f6); background-size: 200% 200%; animation: paiGradientShift 8s ease infinite; opacity: 0.15; z-index: 0; }
        .pai-hero-bg::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px); pointer-events: none; }
        .pai-hero-content { position: relative; z-index: 1; text-align: center; padding: 2rem 0; }
        .pai-badge { display: inline-block; background: #12121a; border: 1px solid rgba(255,255,255,0.1); padding: 0.35rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 1.5rem; }
        .pai-hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; margin: 0 0 1rem 0; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .pai-hero-subtitle { color: #64748b; max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem; line-height: 1.7; min-height: 1.7em; }
        .pai-hero-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
        .pai-tag { display: inline-block; border: 1px solid rgba(59,130,246,0.3); background: transparent; color: #64748b; font-size: 0.8rem; padding: 0.25rem 0.75rem; border-radius: 999px; transition: border-color 0.3s ease, color 0.3s ease; }
        .pai-tag:hover { border-color: #3b82f6; color: #e2e8f0; }

        .pai-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; background: #12121a; border-radius: 16px; padding: 2rem; border: 1px solid rgba(255,255,255,0.05); margin-top: -2rem; position: relative; z-index: 2; animation: paiFadeInUp 0.6s ease forwards; opacity: 0; animation-delay: 0.1s; }
        .pai-stat { text-align: center; }
        .pai-stat-value { font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.2; }
        .pai-stat-label { color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }

        .pai-section-title { font-size: 2rem; font-weight: 700; text-align: center; margin: 0 0 0.5rem 0; color: #e2e8f0; }
        .pai-section-subtitle { color: #64748b; text-align: center; margin: 0 0 2.5rem 0; font-size: 1rem; }

        .pai-how { padding: 4rem 0; animation: paiFadeInUp 0.6s ease forwards; opacity: 0; animation-delay: 0.2s; }
        .pai-timeline { display: flex; flex-direction: column; gap: 0; }
        .pai-phase { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; border-radius: 12px; transition: all 0.3s ease; position: relative; cursor: pointer; }
        .pai-phase::before { content: ''; position: absolute; left: 29px; top: 0; bottom: 0; width: 2px; background: rgba(59,130,246,0.2); }
        .pai-phase:first-child::before { top: 50%; }
        .pai-phase:last-child::before { bottom: 50%; }
        .pai-phase:hover, .pai-phase.active { background: #12121a; }
        .pai-phase-num { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; position: relative; z-index: 1; color: #fff; }
        .pai-phase-name { font-size: 1.1rem; font-weight: 600; margin: 0 0 0.25rem 0; color: #e2e8f0; }
        .pai-phase-desc { color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0; }

        .pai-capabilities { padding: 4rem 0; animation: paiFadeInUp 0.6s ease forwards; opacity: 0; animation-delay: 0.3s; }
        .pai-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .pai-card { background: #1a1a2e; border-radius: 16px; padding: 2rem; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .pai-card:hover { box-shadow: 0 8px 30px rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.3); }
        .pai-card-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
        .pai-card-title { font-size: 1.15rem; font-weight: 600; margin: 0 0 0.5rem 0; color: #e2e8f0; }
        .pai-card-desc { color: #64748b; font-size: 0.9rem; line-height: 1.6; margin: 0; }

        .pai-feed { padding: 4rem 0; animation: paiFadeInUp 0.6s ease forwards; opacity: 0; animation-delay: 0.4s; }
        .pai-feed-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .pai-activity { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: #12121a; border-radius: 10px; border-left: 3px solid #3b82f6; transition: all 0.2s ease; animation: paiSlideIn 0.4s ease forwards; opacity: 0; }
        .pai-activity:hover { transform: translateX(4px); }
        .pai-activity-time { font-family: 'SF Mono', SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 0.8rem; color: #64748b; white-space: nowrap; min-width: 70px; }
        .pai-activity-agent { font-weight: 600; font-size: 0.85rem; min-width: 80px; }
        .pai-activity-text { font-size: 0.9rem; color: #64748b; }

        .pai-footer { padding: 3rem 0; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 4rem; }
        .pai-footer-brand { font-weight: 600; font-size: 1.1rem; margin: 0 0 0.5rem 0; color: #e2e8f0; }
        .pai-footer-meta { color: #64748b; font-size: 0.85rem; margin: 0; }
        .pai-footer-link { color: #64748b; font-size: 0.8rem; margin-top: 0.5rem; }

        @keyframes paiGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes paiFadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes paiSlideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

        @media (max-width: 768px) {
          .pai-stats { grid-template-columns: repeat(2, 1fr); padding: 1.5rem; gap: 1rem; }
          .pai-hero-title { font-size: 2rem; }
          .pai-grid { grid-template-columns: 1fr; }
          .pai-phase { padding: 1rem; gap: 1rem; }
          .pai-section-title { font-size: 1.5rem; }
          .pai-container { padding: 0 1rem; }
          .pai-activity { flex-wrap: wrap; gap: 0.5rem; }
          .pai-activity-time, .pai-activity-agent { min-width: auto; }
        }
        @media (max-width: 480px) {
          .pai-stats { grid-template-columns: 1fr; padding: 1rem; }
          .pai-stat-value { font-size: 2rem; }
          .pai-hero { min-height: 50vh; }
          .pai-hero-title { font-size: 1.75rem; }
          .pai-card { padding: 1.5rem; }
          .pai-phase { padding: 0.75rem; gap: 0.75rem; }
          .pai-phase-num { width: 32px; height: 32px; font-size: 0.8rem; }
          .pai-phase::before { left: 23px; }
          .pai-how, .pai-capabilities, .pai-feed { padding: 2.5rem 0; }
          .pai-footer { padding: 2rem 0; margin-top: 2rem; }
        }
      `}</style>

      <div className="pai-container">
        <section className="pai-hero">
          <div className="pai-hero-bg" />
          <div className="pai-hero-content">
            <div className="pai-badge">PAI v3.0</div>
            <h1 className="pai-hero-title">PAI Command Center</h1>
            <p className="pai-hero-subtitle">{subtitle}</p>
            <div className="pai-hero-tags">
              <span className="pai-tag">Claude Opus 4.6</span>
              <span className="pai-tag">Multi-Agent</span>
              <span className="pai-tag">Real-Time ISC</span>
            </div>
          </div>
        </section>

        <section className="pai-stats" ref={statsView.ref as React.RefObject<HTMLElement>}>
          <div className="pai-stat">
            <div className="pai-stat-value">{criteriaVal}</div>
            <div className="pai-stat-label">ISC Criteria</div>
          </div>
          <div className="pai-stat">
            <div className="pai-stat-value">{agentsVal}</div>
            <div className="pai-stat-label">Agents Spawned</div>
          </div>
          <div className="pai-stat">
            <div className="pai-stat-value">{skillsVal}</div>
            <div className="pai-stat-label">Capabilities Used</div>
          </div>
          <div className="pai-stat">
            <div className="pai-stat-value">{buildTimeVal}</div>
            <div className="pai-stat-label">Build Time</div>
          </div>
        </section>

        <section className="pai-how">
          <h2 className="pai-section-title">How The Algorithm Works</h2>
          <p className="pai-section-subtitle">Seven phases, every time. The only variable is depth.</p>
          <div className="pai-timeline">
            {phases.map((p) => (
              <div
                key={p.num}
                className={`pai-phase${activePhase === p.num ? ' active' : ''}`}
                onClick={() => setActivePhase(activePhase === p.num ? null : p.num)}
              >
                <div className="pai-phase-num">{p.num}</div>
                <div>
                  <h3 className="pai-phase-name">{p.name}</h3>
                  <p className="pai-phase-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pai-capabilities">
          <h2 className="pai-section-title">Capability Showcase</h2>
          <p className="pai-section-subtitle">25 capabilities scanned every run. Here are the highlights.</p>
          <div className="pai-grid">
            {capabilities.map((cap) => (
              <CapabilityCard key={cap.title} {...cap} />
            ))}
          </div>
        </section>

        <section className="pai-feed">
          <h2 className="pai-section-title">Agent Activity Feed</h2>
          <p className="pai-section-subtitle">Real-time log of how this page was built.</p>
          <div className="pai-feed-list">
            {activities.map((a, i) => (
              <div key={i} className="pai-activity" style={{ animationDelay: `${0.5 + i * 0.05}s` }}>
                <span className="pai-activity-time">{a.time}</span>
                <span className="pai-activity-agent" style={{ color: agentColor(a.agent) }}>{a.agent}</span>
                <span className="pai-activity-text">{a.text}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="pai-footer">
          <p className="pai-footer-brand">PAI Command Center</p>
          <p className="pai-footer-meta">Built with PAI v3.0 · Powered by Claude Opus 4.6 · 3 Parallel Agents · 15 ISC Criteria</p>
          <p className="pai-footer-link">github.com/danielmiessler/PAI</p>
        </footer>
      </div>
    </>
  );
}

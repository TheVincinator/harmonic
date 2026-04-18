import { useEffect, useState } from 'react';
import TaskInput from './components/TaskInput';
import FocusPlayer from './components/FocusPlayer';
import PomodoroTimer from './components/PomodoroTimer';
import { analyzeTask } from './lib/claude';
import { getAraRecommendation } from './lib/ara';
import './App.css';

const MODES = [
  {
    name: 'Deep work',
    copy: 'Sparse and low-lyric. Better for technical blocks that need sustained attention.',
  },
  {
    name: 'Creative flow',
    copy: 'Warmer and more cinematic. Better for writing, ideation, and nonlinear work.',
  },
  {
    name: 'Soft reset',
    copy: 'Lighter sets that keep your attention intact without forcing the pace.',
  },
];

export default function App() {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [araContext, setAraContext] = useState(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSubmit = async (description) => {
    setLoading(true);
    setError(null);
    setAraContext(null);

    const [claudeResult, araResult] = await Promise.allSettled([
      analyzeTask(description),
      getAraRecommendation(),
    ]);

    setLoading(false);

    if (claudeResult.status === 'rejected') {
      setError('Something went wrong. Try again.');
      return;
    }

    setTask(description);
    setSession(claudeResult.value);

    if (araResult.status === 'fulfilled') {
      setAraContext(araResult.value.calendar_context ?? araResult.value.phase ?? null);
    }
  };

  const handleReset = () => {
    setTask('');
    setError(null);
    setSession(null);
    setAraContext(null);
  };

  return (
    <div className={`app ${entered ? 'is-entered' : ''} ${session ? 'has-session' : ''}`}>
      <div className="app__orb app__orb--a" aria-hidden="true" />
      <div className="app__orb app__orb--b" aria-hidden="true" />

      {!session && (
        <section className="hero">
          <div className="hero__inner">
            <p className="hero__eyebrow">Focus Companion</p>
            <h1 className="hero__title">Harmonic</h1>
            <p className="hero__sub">A quieter place to start a focused block.</p>
            <p className="hero__body">
              Write down the task in front of you. The app simply responds with a soundtrack
              and a timer.
            </p>
            <a className="hero__cue" href="#start">
              Scroll to begin ↓
            </a>
          </div>
        </section>
      )}

      <main className="main" id="start">
        {!session ? (
          <div className="layout layout--launch">
            <section className="panel panel--primary">
              <TaskInput onSubmit={handleSubmit} loading={loading} error={error} />
            </section>

            <aside className="sidebar">
              <section className="panel panel--ghost">
                <div className="panel__icon">🎧</div>
                <h2 className="panel__heading">A focused surface</h2>
                <p className="panel__body">
                  Start with the single thing you need to finish. Harmonic picks a lane, sets
                  the mood, and leaves the rest of the screen quiet.
                </p>
                <ol className="step-list">
                  <li>Describe the task in plain language, not keywords.</li>
                  <li>Use the session output as your single working context.</li>
                  <li>Let the supporting UI stay quiet until it is needed.</li>
                </ol>
              </section>

              <section className="panel panel--ghost panel--inset">
                <div className="panel__icon">⏱</div>
                <h2 className="panel__heading">Different work, different pressure</h2>
                <div className="modes">
                  {MODES.map((mode, index) => (
                    <div className="mode" key={mode.name} style={{ '--i': index }}>
                      <span className="mode__name">
                        <span className="mode__icon">✦</span>
                        {mode.name}
                      </span>
                      <span className="mode__copy">{mode.copy}</span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        ) : (
          <div className="layout layout--session">
            <section className="panel panel--primary">
              {araContext && (
                <div className="ara">
                  <span className="ara__pip" />
                  <span className="ara__text">{araContext}</span>
                </div>
              )}
              <FocusPlayer session={session} task={task} />
            </section>

            <aside className="sidebar">
              <section className="panel panel--ghost">
                <PomodoroTimer />
              </section>

              <section className="panel panel--ghost panel--inset">
                <div className="session-meta">
                  <div className="meta-field">
                    <span className="meta-label">Task</span>
                    <span className="meta-value">{task}</span>
                  </div>
                  <div className="meta-field">
                    <span className="meta-label">Mode</span>
                    <span className="meta-value">{session.label}</span>
                  </div>
                </div>

                <p className="panel__body panel__body--sm">
                  Stay inside this block. When it&apos;s done, start the next one.
                </p>

                <button className="reset-btn" onClick={handleReset}>
                  New focus block
                </button>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

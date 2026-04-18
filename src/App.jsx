import { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import FocusPlayer from './components/FocusPlayer';
import PomodoroTimer from './components/PomodoroTimer';
import { analyzeTask } from './lib/claude';
import { getAraRecommendation } from './lib/ara';
import './App.css';

export default function App() {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  const [araSession, setAraSession] = useState(null);
  const [araLoading, setAraLoading] = useState(true);

  useEffect(() => {
    getAraRecommendation()
      .then(setAraSession)
      .catch(() => setAraSession(null))
      .finally(() => setAraLoading(false));
  }, []);

  const handleSubmit = async (description) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeTask(description);
      setTask(description);
      setSession(result);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSession(null);
    setTask('');
    setError(null);
  };

  const activeSession = session ?? araSession;
  const activeTask = session ? task : araSession ? `Auto-detected: ${araSession.phase}` : '';

  return (
    <div className="app">
      <header className="header">
        <div className="logo">harmonic</div>
        <div className="tagline">music that matches your mind</div>
      </header>

      <main className="main">
        {araLoading && (
          <p className="araStatus">
            <span className="araDot" />
            Ara is reading your context…
          </p>
        )}

        {activeSession && (
          <>
            {!session && araSession && (
              <div className="araTag">⚡ Auto-detected by Ara</div>
            )}
            {session && (
              <div className="araTag">✎ Your override</div>
            )}
            <FocusPlayer session={activeSession} task={activeTask} />
            <PomodoroTimer />
            {session && (
              <button className="resetBtn" onClick={handleReset}>
                ← Back to Ara suggestion
              </button>
            )}
          </>
        )}

        <div className={activeSession ? 'overrideSection' : ''}>
          <TaskInput
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            compact={!!activeSession}
          />
        </div>
      </main>
    </div>
  );
}

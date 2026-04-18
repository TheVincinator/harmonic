import { useState } from 'react';
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
  const [araContext, setAraContext] = useState(null);

  const handleSubmit = async (description) => {
    setLoading(true);
    setError(null);

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
    setSession(null);
    setTask('');
    setError(null);
    setAraContext(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">harmonic</div>
        <div className="tagline">music that matches your mind</div>
      </header>

      <main className="main">
        {!session ? (
          <TaskInput onSubmit={handleSubmit} loading={loading} error={error} />
        ) : (
          <>
            {araContext && (
              <div className="araTag">
                <span className="araDot" />
                Ara: {araContext}
              </div>
            )}
            <FocusPlayer session={session} task={task} />
            <PomodoroTimer />
            <button className="resetBtn" onClick={handleReset}>
              ← Change task
            </button>
          </>
        )}
      </main>
    </div>
  );
}

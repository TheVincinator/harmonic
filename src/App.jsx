import { useState } from 'react';
import TaskInput from './components/TaskInput';
import FocusPlayer from './components/FocusPlayer';
import PomodoroTimer from './components/PomodoroTimer';
import { analyzeTask } from './lib/claude';
import './App.css';

export default function App() {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

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

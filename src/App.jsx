import { useState, useEffect } from 'react';
import FocusPlayer from './components/FocusPlayer';
import PomodoroTimer from './components/PomodoroTimer';
import { getAraRecommendation } from './lib/ara';
import './App.css';

function getLocalVibe() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10)  return { vibe: 'calm',       label: 'Morning Startup',     tip: 'Ease into your day with gentle sounds.' };
  if (hour >= 10 && hour < 13) return { vibe: 'deep focus', label: 'Deep Work Mode',       tip: 'Peak cognitive hours — minimal distractions.' };
  if (hour >= 13 && hour < 15) return { vibe: 'calm',       label: 'Post-Lunch Recovery',  tip: 'Fight the afternoon slump with calm sounds.' };
  if (hour >= 15 && hour < 18) return { vibe: 'energetic',  label: 'Second Wind',          tip: 'Re-engage and power through the afternoon.' };
  if (hour >= 18 && hour < 22) return { vibe: 'creative',   label: 'Evening Work',         tip: 'Looser, more creative thinking after hours.' };
  return { vibe: 'deep focus', label: 'Late Night Mode', tip: 'Minimal distractions for late-night focus.' };
}

export default function App() {
  const [session, setSession] = useState(getLocalVibe());
  const [araContext, setAraContext] = useState(null);
  const [araLoading, setAraLoading] = useState(true);

  useEffect(() => {
    getAraRecommendation()
      .then(result => {
        setSession({
          vibe: result.vibe,
          label: result.label,
          tip: result.tip,
        });
        setAraContext(result.calendar_context ?? null);
      })
      .catch(() => {
        setAraContext('Could not reach calendar — using time of day.');
      })
      .finally(() => setAraLoading(false));
  }, []);

  const handleRefresh = () => {
    setSession(getLocalVibe());
    setAraContext(null);
    setAraLoading(true);
    getAraRecommendation()
      .then(result => {
        setSession({ vibe: result.vibe, label: result.label, tip: result.tip });
        setAraContext(result.calendar_context ?? null);
      })
      .catch(() => setAraContext('Could not reach calendar — using time of day.'))
      .finally(() => setAraLoading(false));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">harmonic</div>
        <div className="tagline">music that matches your mind</div>
      </header>

      <main className="main">
        <div className="araStatus">
          {araLoading ? (
            <>
              <span className="araDot" />
              Ara is reading your calendar…
            </>
          ) : (
            <>
              <span className="araCheck">⚡</span>
              {araContext}
            </>
          )}
        </div>

        <FocusPlayer session={session} task={null} />
        <PomodoroTimer />

        <button className="resetBtn" onClick={handleRefresh}>
          ↺ Refresh
        </button>
      </main>
    </div>
  );
}

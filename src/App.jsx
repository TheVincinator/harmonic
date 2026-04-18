import { useState, useEffect } from 'react';
import FocusPlayer from './components/FocusPlayer';
import PomodoroTimer from './components/PomodoroTimer';
import { getAraRecommendation } from './lib/ara';
import './App.css';

function getLocalVibe() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10)  return { vibe: 'calm',       label: 'Morning Startup',    tip: 'Ease into your day with gentle sounds.' };
  if (hour >= 10 && hour < 13) return { vibe: 'deep focus', label: 'Deep Work Mode',      tip: 'Peak cognitive hours — minimal distractions.' };
  if (hour >= 13 && hour < 15) return { vibe: 'calm',       label: 'Post-Lunch Recovery', tip: 'Fight the afternoon slump with calm sounds.' };
  if (hour >= 15 && hour < 18) return { vibe: 'energetic',  label: 'Second Wind',         tip: 'Re-engage and power through the afternoon.' };
  if (hour >= 18 && hour < 22) return { vibe: 'creative',   label: 'Evening Work',        tip: 'Looser, more creative thinking after hours.' };
  return { vibe: 'deep focus', label: 'Late Night Mode', tip: 'Minimal distractions for late-night focus.' };
}

const LOADING_STEPS = [
  'Reading your context…',
  'Analyzing your focus state…',
  'Selecting the perfect sound…',
];

export default function App() {
  const [session, setSession] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(i => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 1200);

    getAraRecommendation()
      .then(result => {
        clearInterval(interval);
        setSession({ vibe: result.vibe, label: result.label, tip: result.tip });
      })
      .catch(() => {
        clearInterval(interval);
        setSession(getLocalVibe());
      });

    return () => clearInterval(interval);
  }, []);

  if (!session) {
    return (
      <div className="app">
        <header className="header">
          <div className="logo">harmonic</div>
          <div className="tagline">music that matches your mind</div>
        </header>
        <div className="loading">
          <div className="loadingStep">{LOADING_STEPS[stepIndex]}</div>
          <div className="loadingBar">
            <div className="loadingFill" />
          </div>
          <div className="loadingPowered">⚡ Ara is thinking</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">harmonic</div>
        <div className="tagline">music that matches your mind</div>
      </header>
      <main className="main">
        <FocusPlayer session={session} task={null} />
        <PomodoroTimer />
      </main>
    </div>
  );
}

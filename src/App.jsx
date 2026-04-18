import { useState } from 'react';
import ArtistInput from './components/ArtistInput';
import TasteProfile from './components/TasteProfile';
import Recommendations from './components/Recommendations';
import MusicEssay from './components/MusicEssay';
import VibeSearch from './components/VibeSearch';
import ShareCard from './components/ShareCard';
import { analyzeTaste, getVibeRecs } from './lib/claude';
import './App.css';

const TABS = ['Profile', 'Discover', 'Essay', 'Vibe'];

export default function App() {
  const [artists, setArtists] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const addArtist = (name) => setArtists(prev => [...prev, name]);
  const removeArtist = (name) => setArtists(prev => prev.filter(a => a !== name));

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setShowShare(false);
    try {
      const result = await analyzeTaste(artists);
      setData(result);
      setTab(0);
    } catch (err) {
      setError('Something went wrong. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Music Brain</div>
        <div className="tagline">your taste, understood</div>
      </header>

      <main className="main">
        <ArtistInput artists={artists} onAdd={addArtist} onRemove={removeArtist} />

        <button
          className="analyzeBtn"
          onClick={handleAnalyze}
          disabled={artists.length < 2 || loading}
        >
          {loading ? (
            <span className="loadingDots">
              <span /><span /><span />
              Analyzing your taste
            </span>
          ) : data ? 'Re-analyze →' : 'Build my music brain →'}
        </button>

        {error && <p className="error">{error}</p>}

        {data && (
          <>
            <div className="tabs">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  className={`tabBtn ${tab === i ? 'active' : ''}`}
                  onClick={() => setTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="panel">
              {tab === 0 && <TasteProfile profile={data.profile} />}
              {tab === 1 && <Recommendations recommendations={data.recommendations} />}
              {tab === 2 && <MusicEssay essay={data.essay} />}
              {tab === 3 && (
                <VibeSearch
                  artists={artists}
                  onSearch={(vibe) => getVibeRecs(artists, vibe)}
                />
              )}
            </div>

            <div className="shareRow">
              <button className="shareBtn" onClick={() => setShowShare(v => !v)}>
                {showShare ? 'Hide share card' : '↗ Share'}
              </button>
            </div>

            {showShare && (
              <ShareCard
                artists={artists}
                profile={data.profile}
                recommendations={data.recommendations}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

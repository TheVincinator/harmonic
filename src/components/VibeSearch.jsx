import { useState } from 'react';
import styles from './VibeSearch.module.css';

export default function VibeSearch({ onSearch }) {
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!vibe.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await onSearch(vibe.trim());
      setSongs(result.songs);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Describe a vibe or moment</div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. late night drive through the city"
          value={vibe}
          onChange={e => setVibe(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button
          className={styles.searchBtn}
          onClick={handleSearch}
          disabled={!vibe.trim() || loading}
        >
          {loading ? '…' : '→'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {songs && (
        <div className={styles.results}>
          {songs.map((song, i) => (
            <div key={i} className={styles.song} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className={styles.songHeader}>
                <span className={styles.songTitle}>{song.title}</span>
                <span className={styles.songArtist}>{song.artist}</span>
              </div>
              <p className={styles.songReason}>{song.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

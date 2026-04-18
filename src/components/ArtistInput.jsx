import { useState } from 'react';
import { getTopArtists } from '../lib/lastfm';
import styles from './ArtistInput.module.css';

export default function ArtistInput({ artists, onAdd, onRemove }) {
  const [value, setValue] = useState('');
  const [lfmUser, setLfmUser] = useState('');
  const [lfmLoading, setLfmLoading] = useState(false);
  const [lfmError, setLfmError] = useState(null);

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed || artists.includes(trimmed)) return;
    onAdd(trimmed);
    setValue('');
  };

  const handleImport = async () => {
    if (!lfmUser.trim()) return;
    setLfmLoading(true);
    setLfmError(null);
    try {
      const names = await getTopArtists(lfmUser.trim());
      names.forEach(name => {
        if (!artists.includes(name)) onAdd(name);
      });
      setLfmUser('');
    } catch (err) {
      setLfmError(err.message.includes('User not found') ? 'User not found.' : 'Import failed.');
    } finally {
      setLfmLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Artists you love</div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Masayoshi Takanaka"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className={styles.addBtn} onClick={handleAdd} aria-label="Add artist">
          +
        </button>
      </div>

      <div className={styles.divider}>
        <span>or import from Last.fm</span>
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Last.fm username"
          value={lfmUser}
          onChange={e => setLfmUser(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleImport()}
        />
        <button
          className={styles.importBtn}
          onClick={handleImport}
          disabled={!lfmUser.trim() || lfmLoading}
          aria-label="Import from Last.fm"
        >
          {lfmLoading ? '…' : '↓'}
        </button>
      </div>

      {lfmError && <p className={styles.lfmError}>{lfmError}</p>}

      <div className={styles.tags}>
        {artists.length === 0 ? (
          <span className={styles.placeholder}>Add at least 2 artists to begin...</span>
        ) : (
          artists.map(a => (
            <span key={a} className={styles.tag}>
              {a}
              <button
                className={styles.removeBtn}
                onClick={() => onRemove(a)}
                aria-label={`Remove ${a}`}
              >
                ✕
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}

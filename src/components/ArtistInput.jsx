import { useState } from 'react';
import styles from './ArtistInput.module.css';

export default function ArtistInput({ artists, onAdd, onRemove }) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed || artists.includes(trimmed)) return;
    onAdd(trimmed);
    setValue('');
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

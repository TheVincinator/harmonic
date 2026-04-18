import { useState } from 'react';
import styles from './TaskInput.module.css';

export default function TaskInput({ onSubmit, loading, error, compact }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className={styles.container}>
      <label className={compact ? styles.labelCompact : styles.label}>
        {compact ? 'Override — what are you working on?' : 'What are you working on?'}
      </label>
      <div className={styles.inputRow}>
        <textarea
          className={styles.textarea}
          placeholder="e.g. training an ML model, writing my thesis, debugging a React app..."
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          rows={compact ? 2 : 3}
        />
      </div>
      <button
        className={styles.btn}
        onClick={handleSubmit}
        disabled={!value.trim() || loading}
      >
        {loading ? (
          <span className={styles.loadingDots}>
            <span /><span /><span />
            Finding your sound
          </span>
        ) : compact ? 'Override →' : 'Start focus session →'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

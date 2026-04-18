import { useState } from 'react';
import styles from './TaskInput.module.css';

export default function TaskInput({ onSubmit, loading, error }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>What are you working on?</label>
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
          rows={3}
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
        ) : 'Start focus session →'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

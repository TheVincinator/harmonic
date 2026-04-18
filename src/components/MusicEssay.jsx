import styles from './MusicEssay.module.css';

export default function MusicEssay({ essay }) {
  if (!essay) return null;

  const sentences = essay.split(/(?<=[.!?])\s+/);
  const body = sentences.slice(0, -1).join(' ');
  const lastLine = sentences[sentences.length - 1];

  return (
    <div className={styles.container}>
      <div className={styles.rule} />
      <p className={styles.body}>{body}</p>
      <p className={styles.closer}>{lastLine}</p>
    </div>
  );
}

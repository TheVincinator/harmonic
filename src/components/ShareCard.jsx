import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import styles from './ShareCard.module.css';

export default function ShareCard({ artists, profile, recommendations }) {
  const cardRef = useRef(null);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!cardRef.current) return;
    setCopying(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111118',
        scale: 2,
        useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          const url = canvas.toDataURL();
          const a = document.createElement('a');
          a.href = url;
          a.download = 'music-brain.png';
          a.click();
        }
      });
    } catch (e) {
      console.error('Share card capture failed:', e);
    } finally {
      setCopying(false);
    }
  };

  const topRecs = recommendations?.slice(0, 3) ?? [];

  return (
    <div className={styles.wrapper}>
      <div ref={cardRef} className={styles.card}>
        <div className={styles.cardLogo}>Music Brain</div>
        <div className={styles.artists}>
          {artists.map(a => (
            <span key={a} className={styles.artistTag}>{a}</span>
          ))}
        </div>
        {profile && (
          <div className={styles.headline}>{profile.headline}</div>
        )}
        {topRecs.length > 0 && (
          <div className={styles.recs}>
            <div className={styles.recsLabel}>You might love</div>
            {topRecs.map(r => (
              <div key={r.name} className={styles.rec}>
                <span className={styles.recName}>{r.name}</span>
                <span className={styles.recFam}>{r.familiarity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className={styles.copyBtn} onClick={handleCopy} disabled={copying}>
        {copied ? 'Copied!' : copying ? 'Capturing…' : 'Copy image'}
      </button>
    </div>
  );
}

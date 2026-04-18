import styles from './TasteProfile.module.css';

const TRAIT_ICONS = {
  era: '◷',
  mood: '◈',
  texture: '◬',
  rhythm: '◉',
  theme: '◆',
};

export default function TasteProfile({ profile }) {
  if (!profile) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.headline}>{profile.headline}</h2>
      <p className={styles.why}>{profile.why}</p>

      <div className={styles.traitGrid}>
        {Object.entries(profile.traits).map(([key, value]) => (
          <div key={key} className={styles.trait}>
            <span className={styles.traitIcon}>{TRAIT_ICONS[key] ?? '◇'}</span>
            <div>
              <div className={styles.traitLabel}>{key}</div>
              <div className={styles.traitValue}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

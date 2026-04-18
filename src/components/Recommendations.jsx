import styles from './Recommendations.module.css';

const FAMILIARITY_COLOR = {
  'well known': 'blue',
  'deep cut': 'amber',
  'obscure': 'coral',
};

export default function Recommendations({ recommendations }) {
  if (!recommendations) return null;

  return (
    <div className={styles.container}>
      {recommendations.map((rec, i) => (
        <div key={rec.name} className={styles.card} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className={styles.header}>
            <span className={styles.name}>{rec.name}</span>
            <span
              className={styles.badge}
              data-color={FAMILIARITY_COLOR[rec.familiarity] ?? 'gray'}
            >
              {rec.familiarity}
            </span>
          </div>
          <p className={styles.reason}>{rec.reason}</p>
        </div>
      ))}
    </div>
  );
}

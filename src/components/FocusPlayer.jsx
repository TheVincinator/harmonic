import styles from './FocusPlayer.module.css';

const PLAYLISTS = {
  'deep focus': { id: '37i9dQZF1DWZeKCadgRdKQ', tags: 'lofi · minimal · no vocals' },
  'creative':   { id: '37i9dQZF1DX9sIqqvKsjEK', tags: 'instrumental · cinematic' },
  'energetic':  { id: '37i9dQZF1DX0SM0LYsmbMT', tags: 'electronic · driving' },
  'calm':       { id: '37i9dQZF1DX4sWSpwq3LiO', tags: 'piano · gentle · serene' },
  'writing':    { id: '37i9dQZF1DWXLeA8Omikj7', tags: 'ambient · brain food' },
};

export default function FocusPlayer({ session, task }) {
  const playlist = PLAYLISTS[session.vibe] ?? PLAYLISTS['deep focus'];
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`;

  return (
    <div className={styles.container}>
      <div className={styles.context}>
        <div className={styles.header}>
          <div className={styles.vibeLabel}>{session.label}</div>
          <span className={styles.araBadge}>⚡ Ara</span>
        </div>
        <div className={styles.vibeTags}>{playlist.tags}</div>
        <p className={styles.tip}>{session.tip}</p>
        {task && <div className={styles.taskLabel}>{task}</div>}
      </div>

      <iframe
        className={styles.player}
        src={embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Focus playlist"
      />
      <a
        className={styles.spotifyLink}
        href={`https://open.spotify.com/playlist/${playlist.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Spotify ↗
      </a>
    </div>
  );
}

import styles from './FocusPlayer.module.css';

const FALLBACK_PLAYLISTS = {
  'deep focus': {
    id: '37i9dQZF1DWZeKCadgRdKQ',
    tags: 'lofi, minimal, no vocals',
  },
  creative: {
    id: '37i9dQZF1DX9sIqqvKsjEK',
    tags: 'instrumental, cinematic',
  },
  energetic: {
    id: '37i9dQZF1DX0SM0LYsmbMT',
    tags: 'electronic, driving',
  },
  calm: {
    id: '37i9dQZF1DX4sWSpwq3LiO',
    tags: 'piano, gentle, serene',
  },
  writing: {
    id: '37i9dQZF1DWXLeA8Omikj7',
    tags: 'ambient, brain food',
  },
};

export default function FocusPlayer({ session, task }) {
  const fallback = FALLBACK_PLAYLISTS[session.vibe] ?? FALLBACK_PLAYLISTS['deep focus'];
  const playlistId = session.playlist_id ?? fallback.id;
  const tags = session.tags ?? fallback.tags;
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

  return (
    <div className={styles.container}>
      <div className={styles.context}>
        <h2 className={styles.task}>{task || session.label}</h2>
        <p className={styles.meta}>
          {session.label} with {tags}
        </p>
        <p className={styles.tip}>{session.tip}</p>
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
        href={`https://open.spotify.com/playlist/${playlistId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Spotify ↗
      </a>
    </div>
  );
}

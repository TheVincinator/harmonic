const API_KEY = process.env.REACT_APP_LASTFM_KEY;
const BASE = 'https://ws.audioscrobbler.com/2.0';

export async function getTopArtists(username, limit = 10) {
  const url = `${BASE}/?method=user.gettopartists&user=${encodeURIComponent(username)}&api_key=${API_KEY}&format=json&period=overall&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.message);

  return data.topartists.artist.map(a => a.name);
}

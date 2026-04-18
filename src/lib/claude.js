const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.REACT_APP_ANTHROPIC_KEY;

const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
};

async function callClaude(body) {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ model: 'claude-sonnet-4-6', ...body }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

export async function analyzeTaste(artists) {
  const artistList = artists.join(', ');
  return callClaude({
    max_tokens: 1000,
    system: `You are a music intelligence engine with deep knowledge of genres, subcultures, and sonic DNA. Analyze taste and return ONLY valid JSON — no markdown, no backticks, no preamble whatsoever.`,
    messages: [{
      role: 'user',
      content: `Artists I love: ${artistList}

Return this exact JSON:
{
  "profile": {
    "headline": "one evocative 10-15 word sentence capturing their taste identity",
    "traits": {
      "era": "primary musical era(s)",
      "mood": "dominant emotional quality",
      "texture": "sonic texture descriptor",
      "rhythm": "rhythmic character",
      "theme": "lyrical or thematic focus"
    },
    "why": "2-3 sentences on what these artists share beneath the surface — be specific and insightful"
  },
  "recommendations": [
    { "name": "Artist Name", "familiarity": "deep cut", "reason": "1-2 sentences connecting to the user's taste with specific references" },
    { "name": "Artist Name", "familiarity": "well known", "reason": "..." },
    { "name": "Artist Name", "familiarity": "deep cut", "reason": "..." },
    { "name": "Artist Name", "familiarity": "obscure", "reason": "..." },
    { "name": "Artist Name", "familiarity": "well known", "reason": "..." }
  ],
  "essay": "A 180-word personal music essay written in second person ('You are drawn to music that...') — Pitchfork-level prose, insightful, specific, a little poetic. Reference the actual artists by name. End with one memorable line."
}`,
    }],
  });
}

export async function getVibeRecs(artists, vibe) {
  const artistList = artists.join(', ');
  return callClaude({
    max_tokens: 800,
    system: `You are a music curator who knows this listener's taste deeply. Return ONLY valid JSON — no markdown, no backticks, no preamble.`,
    messages: [{
      role: 'user',
      content: `My favorite artists: ${artistList}
Vibe/scenario: ${vibe}

Return 5 song recommendations that match this vibe AND my taste as JSON:
{
  "songs": [
    { "title": "Song Title", "artist": "Artist Name", "reason": "1-2 sentences on why this fits the vibe and their taste" },
    { "title": "...", "artist": "...", "reason": "..." },
    { "title": "...", "artist": "...", "reason": "..." },
    { "title": "...", "artist": "...", "reason": "..." },
    { "title": "...", "artist": "...", "reason": "..." }
  ]
}`,
    }],
  });
}

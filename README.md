# Music Brain 🎵

> Your taste, understood.

An AI-powered music taste profiler built with React + Claude API.

## Quick Start

```bash
npm install
npm start
```

## Deploy to Vercel (for the hackathon)

```bash
npm install -g vercel
vercel
```

That's it — Vercel auto-detects Create React App.

## Project Structure

```
src/
  components/
    ArtistInput.jsx       # Artist tag input with add/remove
    ArtistInput.module.css
    TasteProfile.jsx      # Profile headline + trait grid
    TasteProfile.module.css
    Recommendations.jsx   # 5 artist recs with familiarity badges
    Recommendations.module.css
    MusicEssay.jsx        # Pitchfork-style personal essay
    MusicEssay.module.css
  lib/
    claude.js             # Claude API call + JSON parsing
  App.jsx                 # Main app with tab state
  App.css
  index.css               # Design tokens + global styles
```

## Features

- **Taste Profile** — headline + 5 sonic trait cards + insight paragraph
- **Discover** — 5 artist recs with deep cut / well known / obscure badges
- **Essay** — a personal music essay written in your voice

## Ideas to extend before demo

- Add a "vibe search" — type a mood, get songs matching your profile
- Persist taste profile to localStorage so it survives refresh
- Add a share card generator (screenshot-ready summary)
- Pull real artist images from Last.fm API

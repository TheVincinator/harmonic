# Harmonic

> An AI focus companion that gets out of your way.

You describe what you're working on. Harmonic picks the right music, starts a timer, and checks your calendar — all at once. No decisions. No tab-switching. One sentence and you're in flow.

## How it works

1. Type your task in plain English
2. Claude analyzes it and picks one of five focus modes: deep focus, creative, energetic, calm, or writing
3. A curated Spotify playlist loads instantly, matched to your mental state
4. A Pomodoro timer gives your block a clear end
5. An Ara agent reads your Google Calendar and surfaces what's coming up — automatically

## Quick Start

```bash
npm install
npm start
```

### Environment variables

Create a `.env` file in the root:

```
REACT_APP_ANTHROPIC_KEY=your_claude_api_key
REACT_APP_ARA_APP_ID=your_ara_app_id
REACT_APP_ARA_KEY=your_ara_api_key
```

### Deploy the Ara agent

```bash
ara auth login
# Connect Google Calendar at app.ara.so/connect
ara deploy app.py
```

## Tech Stack

- **React** — frontend
- **Claude Sonnet (Anthropic)** — task analysis and vibe classification
- **Ara SDK** — autonomous calendar agent
- **Spotify Embed** — in-page music playback
- **Google Calendar** — session context via Ara

## Project Structure

```
app.py                        # Ara autonomous agent
src/
  components/
    TaskInput.jsx             # Task description input
    FocusPlayer.jsx           # Spotify embed + session label
    PomodoroTimer.jsx         # Focus timer
    VibeSearch.jsx            # Mood-based search
    ShareCard.jsx             # Shareable session card
  lib/
    claude.js                 # Claude API call + vibe classification
    ara.js                    # Ara agent runner
    lastfm.js                 # Last.fm integration
  App.jsx                     # Main app and session state
```

## Deploy

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Create React App.

import ara_sdk as ara

# HOW TO SET UP:
# 1) ara auth login
# 2) Connect Google Calendar at app.ara.so/connect
# 3) ara deploy app.py
# 4) ara run app.py

@ara.tool
def get_focus_playlist(vibe: str) -> dict:
    """Return the Spotify playlist ID and metadata for a given focus vibe."""
    playlists = {
        "deep focus": {"id": "37i9dQZF1DWZeKCadgRdKQ", "tags": "lofi · minimal · no vocals"},
        "creative":   {"id": "37i9dQZF1DX9sIqqvKsjEK", "tags": "instrumental · cinematic"},
        "energetic":  {"id": "37i9dQZF1DX0SM0LYsmbMT", "tags": "electronic · driving"},
        "calm":       {"id": "37i9dQZF1DX4sWSpwq3LiO", "tags": "piano · gentle · serene"},
        "writing":    {"id": "37i9dQZF1DWXLeA8Omikj7", "tags": "ambient · brain food"},
    }
    p = playlists.get(vibe, playlists["deep focus"])
    return {
        "vibe": vibe,
        "tags": p["tags"],
        "playlist_id": p["id"],
        "spotify_url": f"https://open.spotify.com/playlist/{p['id']}",
    }

ara.Automation(
    "harmonic-focus-agent",
    system_instructions=(
        "You are Harmonic, an autonomous focus music assistant. "
        "Each time you run:\n"
        "1. Use google_calendar_list_events to get the user's upcoming events for the next 3 hours.\n"
        "2. Read the event titles and descriptions to understand what kind of work is coming up.\n"
        "3. Pick the best focus vibe from: deep focus, creative, energetic, calm, writing.\n"
        "4. Call get_focus_playlist with that vibe.\n"
        "5. Take the playlist_id and tags EXACTLY from get_focus_playlist's return value — do not invent your own.\n"
        "6. Respond with ONLY a JSON object — no prose, no markdown:\n"
        '{"vibe":"...","label":"...","tip":"...","playlist_id":"...","tags":"...","calendar_context":"..."}\n'
        "\n"
        "label = short mode name e.g. 'Deep Work Mode'.\n"
        "tip = one sentence on why this music fits the upcoming work.\n"
        "calendar_context = e.g. 'You have ML Research in 20 min' or 'No events — using time of day'.\n"
        "playlist_id and tags must come directly from get_focus_playlist output, not made up.\n"
        "\n"
        "If Google Calendar is unavailable or has no events, fall back to time-of-day context."
    ),
    tools=[get_focus_playlist],
)

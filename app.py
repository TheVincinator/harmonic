import ara_sdk as ara

@ara.tool
def get_time_context() -> dict:
    """Return the current UTC time and the likely work phase based on the hour."""
    from datetime import datetime, timezone
    hour = datetime.now(timezone.utc).hour

    if 6 <= hour < 10:
        phase, vibe = "morning startup", "calm"
    elif 10 <= hour < 13:
        phase, vibe = "deep work", "deep focus"
    elif 13 <= hour < 15:
        phase, vibe = "post-lunch recovery", "calm"
    elif 15 <= hour < 18:
        phase, vibe = "second wind", "energetic"
    elif 18 <= hour < 22:
        phase, vibe = "evening work", "creative"
    else:
        phase, vibe = "late night", "deep focus"

    return {
        "time": datetime.now(timezone.utc).strftime("%H:%M UTC"),
        "phase": phase,
        "suggested_vibe": vibe,
    }

@ara.tool
def get_focus_playlist(vibe: str) -> dict:
    """Return the Spotify playlist for a given focus vibe."""
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
        "spotify_url": f"https://open.spotify.com/playlist/{p['id']}",
    }

ara.Automation(
    "harmonic-focus-agent",
    system_instructions=(
        "You are Harmonic, an autonomous focus music assistant that runs on a schedule. "
        "Each time you run:\n"
        "1. Call get_time_context to detect the current work phase.\n"
        "2. Call get_focus_playlist with the suggested vibe.\n"
        "3. Output a short friendly message — the phase, why this vibe fits, and the Spotify URL. "
        "Under 3 sentences. Be warm and specific."
    ),
    tools=[get_time_context, get_focus_playlist],
)

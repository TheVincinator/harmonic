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

@ara.tool
def get_dnd_apps(task_description: str) -> list:
    """Suggest apps to put in Do Not Disturb based on the task."""
    # Simple logic - in a real implementation, this could be more sophisticated
    apps = []
    if "coding" in task_description.lower() or "programming" in task_description.lower():
        apps = ["Slack", "Discord", "Email"]
    elif "writing" in task_description.lower():
        apps = ["Social Media", "News Apps"]
    elif "meeting" in task_description.lower():
        apps = ["Notifications"]
    else:
        apps = ["Social Media", "Email", "Messaging Apps"]
    return apps

ara.Automation(
    "harmonic-focus-agent",
    system_instructions=(
        "You are Harmonic, an autonomous focus music assistant. "
        "Each time you run:\n"
        "1. If a task description is provided in input, use that. Otherwise, use google_calendar_list_events to get upcoming events.\n"
        "2. Also use google_calendar_list_events to get today's events (from start of day to end of day).\n"
        "3. Analyze the task/event to pick the best focus vibe from: deep focus, creative, energetic, calm, writing.\n"
        "4. Call get_focus_playlist with that vibe.\n"
        "5. Call get_dnd_apps with the task/event description.\n"
        "6. If an event starts within the next 30 minutes AND sms_send_message is available, send SMS with:\n"
        "'🎧 {label}\n{spotify_url}\nDND: {dnd_apps joined by commas}'\n"
        "7. Respond with ONLY a JSON object:\n"
        '{"vibe":"...","label":"...","tip":"...","playlist_id":"...","tags":"...","dnd_apps":[...],"calendar_context":"...","today_events":[...]}\n'
        "\n"
        "today_events = array of today's events, each with title, start_time, end_time.\n"
        "calendar_context = event info or 'Task input mode'.\n"
        "Use exact values from tools."
    ),
    tools=[get_focus_playlist, get_dnd_apps],
)

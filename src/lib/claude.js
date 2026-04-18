const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.REACT_APP_ANTHROPIC_KEY;

export async function analyzeTask(task) {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: 'You are a focus music curator. Analyze what someone is working on and pick the perfect music vibe for deep work. Return ONLY valid JSON — no markdown, no backticks.',
      messages: [{
        role: 'user',
        content: `I'm working on: ${task}

Return JSON:
{
  "vibe": "deep focus" | "creative" | "energetic" | "calm" | "writing",
  "label": "short mode label e.g. 'Deep Work Mode'",
  "tip": "one sentence on why this music helps for this specific kind of work — be specific"
}`,
      }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

const APP_ID = process.env.REACT_APP_ARA_APP_ID;
const ARA_KEY = process.env.REACT_APP_ARA_KEY;

export async function getAraRecommendation() {
  const response = await fetch(`https://api.ara.so/v1/apps/${APP_ID}/run`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ARA_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error(`Ara error: ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.result.output_text);
}

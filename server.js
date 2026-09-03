const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, openaiConfigured: Boolean(OPENAI_API_KEY) });
});

app.post('/api/analyze-food', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    }

    const { image } = req.body || {};
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'No food image was provided.' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [{
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Analyze the food in this image for calorie tracking. Identify the dish, approximate portion, estimated calories, protein, carbs, fat, confidence 0-100, and individual items if there are multiple foods. Do not claim the estimate is exact. Infer portion size visually and make reasonable nutritional assumptions. For Indian food, identify the likely dish. Return ONLY valid JSON using exactly this structure:\n{"foodName":"Chicken Biryani","portion":"350 g","calories":620,"protein":28,"carbs":72,"fat":24,"confidence":82,"items":[{"name":"Chicken","portion":"100 g","calories":165}]}`
            },
            { type: 'input_image', image_url: image }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'OpenAI request failed.'
      });
    }

    return res.json({ output_text: extractResponseText(data) });
  } catch (error) {
    console.error('Analyze food error:', error);
    return res.status(500).json({ error: 'Unable to analyze the food image.' });
  }
});

function extractResponseText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  if (Array.isArray(data.output)) {
    return data.output
      .flatMap(item => Array.isArray(item.content) ? item.content : [])
      .map(content => typeof content.text === 'string' ? content.text : '')
      .join('');
  }
  return '';
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CalorieTap running on port ${PORT}`);
});

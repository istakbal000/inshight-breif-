const Groq = require('groq-sdk');

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey && apiKey.trim() && !apiKey.includes('your_')) {
    return new Groq({ apiKey: apiKey.trim() });
  }
  return null;
};

const normalizeInsightResponse = (parsed, userInterests = []) => {
  return {
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
    impact: typeof parsed.impact === 'string' ? parsed.impact : (parsed.impact ? JSON.stringify(parsed.impact) : 'No market impact analysis available.'),
    timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
    contrarian: {
      bullish: parsed.contrarian?.bullish || 'Bullish perspective unavailable.',
      bearish: parsed.contrarian?.bearish || 'Bearish perspective unavailable.',
      neutral: parsed.contrarian?.neutral || 'Neutral perspective unavailable.'
    },
    winners: Array.isArray(parsed.winners) ? parsed.winners : [],
    losers: Array.isArray(parsed.losers) ? parsed.losers : [],
    prediction: parsed.prediction || 'AI forecast pending.',
    personalRelevance: parsed.personalRelevance || (userInterests.length > 0 ? `Relevant to your interest in ${userInterests.join(', ')}.` : 'General business relevance.')
  };
};

const summarizeArticles = async (articles, userInterests = []) => {
  const groq = getGroqClient();
  if (!groq) {
    throw new Error('Groq API key is missing or not configured. Please add GROQ_API_KEY to your backend/.env file (get one for free at https://console.groq.com/keys).');
  }

  const articleContent = articles.map((a, i) => `Article ${i+1} (${a.title}):\n${a.content}`).join('\n\n');
  const interestsContext = userInterests.length > 0 
    ? `The user is interested in: ${userInterests.join(', ')}. Highlight relevance to these topics.` 
    : "";

  const prompt = `
Analyze the following articles and provide a structured JSON response. 
${interestsContext}
Strictly output a valid JSON object matching the required schema below. Do not wrap in markdown or backticks.

Required format:
{
  "highlights": ["highlight 1", "highlight 2", ...],
  "impact": "Short paragraph analyzing the market impact",
  "timeline": [
    {"date": "YYYY-MM-DD or timeframe", "event": "Event description"}
  ],
  "contrarian": {
    "bullish": "Bullish perspective",
    "bearish": "Bearish perspective",
    "neutral": "Neutral perspective"
  },
  "winners": [
    {"entity": "Company/Industry Name", "reason": "Why they win"}
  ],
  "losers": [
    {"entity": "Company/Industry Name", "reason": "Why they lose"}
  ],
  "prediction": "AI-driven forecast or trend prediction based on this news",
  "personalRelevance": "Explanation of why this news matters specifically for the user's interests (${userInterests.join(', ') || 'general business context'})"
}

Articles:
${articleContent}
  `;

  try {
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    console.log(`[aiService] Calling Groq API (${model}) for article summarization...`);

    const completion = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an elite financial and intelligence news analyst. Output strictly valid JSON conforming exactly to the requested schema.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    let rawContent = completion.choices[0]?.message?.content?.trim();
    if (!rawContent) {
      throw new Error('Groq returned empty response content');
    }

    rawContent = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(rawContent);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Groq returned a non-object JSON response');
    }
    console.log('[aiService] Successfully generated insights via Groq API.');
    return normalizeInsightResponse(parsed, userInterests);
  } catch (error) {
    console.error('[aiService] Groq generation error:', error.message);
    throw new Error('Failed to generate insights: ' + error.message);
  }
};

module.exports = {
  summarizeArticles
};



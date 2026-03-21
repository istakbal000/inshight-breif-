const { Ollama } = require('ollama');

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });

const summarizeArticles = async (articles, userInterests = []) => {
  const articleContent = articles.map((a, i) => `Article ${i+1} (${a.title}):\n${a.content}`).join('\n\n');
  const interestsContext = userInterests.length > 0 
    ? `The user is interested in: ${userInterests.join(', ')}. ` 
    : "";

  const prompt = `
    Analyze the following articles and provide a structured JSON response. 
    ${interestsContext}
    Strictly output raw JSON, no markdown formatting (\`\`\`json) or extra text.

    Format required:
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
    const response = await ollama.generate({
      model: process.env.OLLAMA_MODEL || 'llama3',
      prompt: prompt,
      options: {
        temperature: 0.2,
        num_predict: 4096,
      },
      format: 'json',
    });

    let rawContent = response.response.trim();

    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    rawContent = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    try {
      return JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse JSON from Ollama:", parseError.message);
      console.log("Raw content was:", rawContent);
      throw new Error('AI response was not in valid JSON format. Details logged on server.');
    }
  } catch (error) {
    console.error("Error in AI summarization:", error);
    throw new Error('Failed to generate insights from Ollama: ' + error.message);
  }
};

module.exports = {
  summarizeArticles
};

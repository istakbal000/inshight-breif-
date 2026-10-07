const Groq = require('groq-sdk');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey && apiKey.trim() && !apiKey.includes('your_')) {
    return new Groq({ apiKey: apiKey.trim() });
  }
  return null;
};

let articlesStore = [];

const processArticlesForRAG = async (articles) => {
  console.log(`Starting RAG indexing for ${articles.length} articles...`);
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    articlesStore = [];
    
    for (const article of articles) {
      const splitDocs = await textSplitter.createDocuments(
        [article.content],
        [{ title: article.title, url: article.url }]
      );
      
      splitDocs.forEach(doc => {
        articlesStore.push({
          content: doc.pageContent,
          title: doc.metadata.title,
          url: doc.metadata.url
        });
      });
    }

    console.log(`Indexed ${articlesStore.length} chunks into memory store.`);
    return articlesStore.length;
  } catch (error) {
    console.error("Error processing articles for RAG:", error);
    throw error;
  }
};

const askQuestion = async (question) => {
  if (articlesStore.length === 0) {
    throw new Error("No briefing data available. Please generate a briefing first by searching for a topic, then you can ask follow-up questions.");
  }

  const groq = getGroqClient();
  if (!groq) {
    throw new Error("Groq API key is missing or not configured. Please add GROQ_API_KEY to your backend/.env file (get one for free at https://console.groq.com/keys).");
  }

  try {
    // Simple keyword-based search for relevant content
    const questionWords = question.toLowerCase().split(' ').filter(w => w.length > 2);
    
    const scoredArticles = articlesStore.map(article => {
      const content = (article.title + ' ' + article.content).toLowerCase();
      let score = 0;
      
      questionWords.forEach(word => {
        if (content.includes(word)) {
          score += 1;
        }
      });
      
      return { ...article, score };
    });
    
    // Get top 3 most relevant articles
    const topArticles = scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(a => a.score > 0);
    
    if (topArticles.length === 0) {
      return {
        answer: "I don't have enough information to answer that based on the current briefing sources.",
        sources: []
      };
    }

    // Construct context
    const context = topArticles.map(r => `Source: ${r.title}\nContent:\n${r.content}`).join('\n\n');
    const sources = topArticles.map(r => ({ title: r.title, url: r.url }));
    // Deduplicate sources based on URL or title
    const uniqueSources = Array.from(new Set(sources.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));

    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    console.log(`[ragService] Answering question via Groq API (${model})...`);

    const completion = await groq.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: "Answer the user question based ONLY on the provided context. If the answer cannot be found in the context, say 'I don't have enough information to answer that based on the current briefing sources.'"
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion:\n${question}`
        }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });

    const answerContent = completion.choices[0]?.message?.content?.trim() || "";
    return {
      answer: answerContent,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Error during RAG question answering:", error.message);
    throw new Error('Failed to generate answer from Groq: ' + error.message);
  }
};

module.exports = {
  processArticlesForRAG,
  askQuestion
};


const Groq = require('groq-sdk');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey && apiKey.trim() && !apiKey.includes('your_')) {
    return new Groq({ apiKey: apiKey.trim() });
  }
  return null;
};

let vectorStore;

const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "embedding-001",
  });
};

const processArticlesForRAG = async (articles) => {
  console.log(`Starting RAG indexing for ${articles.length} articles...`);
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = [];
    for (const article of articles) {
      const splitDocs = await textSplitter.createDocuments(
        [article.content],
        [{ title: article.title, url: article.url }]
      );
      docs.push(...splitDocs);
    }

    // Connect to local ChromaDB instance
    try {
      vectorStore = await Chroma.fromDocuments(docs, getEmbeddings(), {
        collectionName: "insightbrief_collection",
        url: process.env.CHROMA_DB_URL || "http://localhost:8000"
      });
      console.log(`Indexed ${docs.length} chunks into Chroma.`);
    } catch (chromaError) {
      console.warn("ChromaDB connection failed, falling back to MemoryVectorStore:", chromaError.message);
      vectorStore = await MemoryVectorStore.fromDocuments(docs, getEmbeddings());
      console.log(`Indexed ${docs.length} chunks into MemoryVectorStore.`);
    }

    return docs.length;
  } catch (error) {
    console.error("Error processing articles for RAG:", error);
    throw error;
  }
};

const askQuestion = async (question) => {
  if (!vectorStore) {
    throw new Error("No briefing data available. Please generate a briefing first by searching for a topic, then you can ask follow-up questions.");
  }

  try {
    const results = await vectorStore.similaritySearch(question, 3);
    
    // Construct context
    const context = results.map(r => `Source: ${r.metadata.title}\nContent:\n${r.pageContent}`).join('\n\n');
    const sources = results.map(r => ({ title: r.metadata.title, url: r.metadata.url }));

    // Let aiService or direct model invocation do the heavy lifting here
    const prompt = `
      Answer the following question based ONLY on the provided context. If the answer cannot be found in the context, say "I don't have enough information to answer that based on the current briefing sources."

      Context:
      ${context}

      Question:
      ${question}
    `;

    const groq = getGroqClient();
    if (!groq) {
      throw new Error("GROQ_API_KEY is not configured.");
    }

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: "Answer the following question based ONLY on the provided context. If the answer cannot be found in the context, say 'I don't have enough information to answer that based on the current briefing sources.'"
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion:\n${question}`
        }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });
    
    const answerContent = response.choices[0]?.message?.content?.trim() || "";

    // Deduplicate sources based on URL or title
    const uniqueSources = Array.from(new Set(sources.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));

    return {
      answer: answerContent,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Error during RAG question answering:", error);
    throw error;
  }
};

module.exports = {
  processArticlesForRAG,
  askQuestion
};

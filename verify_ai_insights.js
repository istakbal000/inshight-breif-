const { summarizeArticles } = require('./backend/services/aiService');
require('dotenv').config({ path: './backend/.env' });

async function verifyAIInsights() {
  const mockArticles = [
    {
      title: "NVIDIA Announces New Blackwell AI Chips",
      content: "NVIDIA has unveiled its next-generation Blackwell AI architecture, promising significant performance leaps for large language models and generative AI tasks. The new chips are expected to be available later this year."
    },
    {
      title: "Tech Giants Race for AI Supremacy",
      content: "Google, Microsoft, and Meta are increasing their capital expenditure to build out AI data centers, primarily using NVIDIA's latest hardware to stay competitive in the rapidly evolving AI landscape."
    }
  ];

  const userInterests = ["NVIDIA", "Quantum Computing"];

  try {
    console.log("Generating insights with user interests:", userInterests);
    const insights = await summarizeArticles(mockArticles, userInterests);
    
    console.log("\n--- AI Insights ---");
    console.log("Prediction:", insights.prediction);
    console.log("Personal Relevance:", insights.personalRelevance);
    
    if (insights.prediction && insights.personalRelevance) {
      console.log("\nSUCCESS: Both prediction and personalRelevance fields are present.");
    } else {
      console.error("\nFAILURE: Missing one or more new fields.");
    }
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

verifyAIInsights();

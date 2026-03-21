// Controllers for InsightBrief

const User = require('../models/User');
const Briefing = require('../models/Briefing');
const { fetchNewsArticles } = require('../services/newsService');
const { summarizeArticles } = require('../services/aiService');
const { processArticlesForRAG } = require('../services/ragService');

const generateBriefing = async (req, res) => {
  try {
    const { topic } = req.query;
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }
    
    // 1. Fetch News
    const articles = await fetchNewsArticles(topic);
    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: 'No articles found for the topic.' });
    }

    // 2. Generate Summarization with User Interests
    // Fetch the user to get their latest interests from the database
    const user = await User.findById(req.user._id);
    const userInterests = user?.interests || []; // Summarize with user interests
    const aiInsights = await summarizeArticles(articles, userInterests);

    // 3. Process into VectorDB RAG (Awaiting ensures follow-up questions work immediately)
    try {
      await processArticlesForRAG(articles);
    } catch (ragErr) {
      console.warn('[RAG ERROR] Indexing failed:', ragErr.message);
      // We don't fail the whole briefing if RAG fails, but we log it
    }

    // 4. Save to MongoDB
    const newBriefing = new Briefing({
      topic,
      ...aiInsights,
      prediction: aiInsights.prediction,
      personalRelevance: aiInsights.personalRelevance,
      sources: articles.map(a => ({ title: a.title, url: a.url })),
      user: req.user?._id
    });
    
    const savedBriefing = await newBriefing.save();

    res.json({ message: 'Briefing generated successfully', briefing: savedBriefing });
  } catch (error) {
    console.error('[generateBriefing ERROR]', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

const { askQuestion } = require('../services/ragService');

const askFollowUp = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    // Process RAG retrieval
    const result = await askQuestion(question);
    
    res.json({ answer: result.answer, sources: result.sources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: Ensure articles are processed first.' });
  }
};

const getInterests = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[getInterests] Fetching for user ID: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[getInterests] User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`[getInterests] Found interests: ${user.interests?.length || 0}`);
    res.json({ interests: user.interests || [] });
  } catch (error) {
    console.error('[getInterests ERROR]', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    const userId = req.user._id;
    console.log(`[updateInterests] Updating for user ID: ${userId}, new interests:`, interests);

    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array' });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { interests } },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.warn(`[updateInterests] User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('[updateInterests] Successfully updated interests via findOneAndUpdate');
    res.json({ message: 'Interests updated successfully', interests: user.interests });
  } catch (error) {
    console.error('[updateInterests ERROR]', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message || String(error),
      details: error.name
    });
  }
};



const getDailyBrief = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find briefings for this user that are marked as daily
    const briefings = await Briefing.find({ user: userId, isDaily: true })
      .sort({ createdAt: -1 }); // Latest first

    res.json({ briefings });
  } catch (error) {
    console.error('[getDailyBrief ERROR]', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const triggerDailyBriefManual = async (req, res) => {
  try {
    const { generateDailyBriefs } = require('../services/dailyBriefService');
    console.log('Manual trigger: Starting daily brief generation...');
    // We don't await this if we want it to be "fire and forget" but for testing it's better to wait
    await generateDailyBriefs(req.user._id);
    res.json({ message: 'Daily brief generation triggered and completed.' });
  } catch (error) {
    console.error('[triggerDailyBriefManual ERROR]', error);
    res.status(500).json({ message: 'Failed to trigger daily brief generation', error: error.message });
  }
};


module.exports = {
  generateBriefing,
  askFollowUp,
  updateInterests,
  getInterests,
  getDailyBrief,
  triggerDailyBriefManual
};

const cron = require('node-cron');
const User = require('../models/User');
const Briefing = require('../models/Briefing');
const { fetchNewsArticles } = require('./newsService');
const { summarizeArticles } = require('./aiService');

const generateDailyBriefs = async (userId = null) => {
  console.log(`Running daily brief generation... ${userId ? 'for user ' + userId : 'for all users'}`);
  try {
    const users = userId ? await User.find({ _id: userId }) : await User.find({});
    
    for (const user of users) {
      if (user.interests && user.interests.length > 0) {
        for (const topic of user.interests) {
          try {
            console.log(`Generating daily brief for ${user.email} on ${topic}...`);
            
            // 1. Fetch News Articles for this topic
            const articles = await fetchNewsArticles(topic);
            if (!articles || articles.length === 0) {
              console.warn(`No articles found for ${topic}, skipping.`);
              continue;
            }

            // 2. Summarize with user interests for personalization
            const aiInsights = await summarizeArticles(articles, user.interests || []);
            
            // Save Briefing
            const newBriefing = new Briefing({
              topic,
              highlights: aiInsights.highlights,
              impact: aiInsights.impact,
              timeline: aiInsights.timeline,
              contrarian: aiInsights.contrarian,
              winners: aiInsights.winners,
              losers: aiInsights.losers,
              prediction: aiInsights.prediction,
              personalRelevance: aiInsights.personalRelevance,
              sources: articles.map(a => ({ title: a.title, url: a.url })),
              isDaily: true,
              user: user._id
            });
            
            await newBriefing.save();
            console.log(`Successfully generated brief for ${user.email} on topic: ${topic}`);
          } catch (topicError) {
            console.error(`Error generating brief for ${user.email} on ${topic}:`, topicError.message);
            // Continue to next topic
          }
        }
      }
    }
    console.log('Daily briefs generated successfully.');
  } catch (error) {
    console.error('Error generating daily briefs:', error);
  }
};

const initCronJob = () => {
  // Run every day at 8:00 AM server time
  cron.schedule('0 8 * * *', () => {
    generateDailyBriefs();
  });
  console.log('Initialized daily brief cron job.');
};

module.exports = {
  initCronJob,
  generateDailyBriefs
};

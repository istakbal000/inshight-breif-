const axios = require('axios');

const fetchNewsArticles = async (topic) => {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;

  if (!NEWS_API_KEY) {
    console.warn('NEWS_API_KEY not set. Falling back to mock data.');
    return getMockArticles(topic);
  }

  // Detect provider (NewsData.io vs NewsAPI.org)
  const isNewsData = NEWS_API_KEY.startsWith('pub_');
  
  let url;
  if (isNewsData) {
    url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(topic)}&language=en`;
  } else {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${NEWS_API_KEY}`;
  }

  try {
    console.log(`Fetching real news for topic: ${topic} from ${isNewsData ? 'NewsData.io' : 'NewsAPI.org'}...`);
    const response = await axios.get(url);
    
    let articles = [];
    if (isNewsData) {
      // NewsData.io response format
      articles = (response.data.results || []).map(article => ({
        title: article.title,
        url: article.link,
        content: article.description || article.content || article.title,
        publishedAt: article.pubDate,
        source: article.source_id
      }));
    } else {
      // NewsAPI.org response format
      articles = (response.data.articles || []).map(article => ({
        title: article.title,
        url: article.url,
        content: article.description || article.content || article.title,
        publishedAt: article.publishedAt,
        source: article.source ? article.source.name : 'Unknown'
      }));
    }

    if (articles.length === 0) {
      console.warn(`No real articles found for ${topic}. Falling back to mock data.`);
      return getMockArticles(topic);
    }

    return articles.slice(0, 5); // Return top 5 articles
  } catch (error) {
    console.error('Error fetching real news:', error.response ? error.response.data : error.message);
    console.warn('Falling back to mock data due to API error.');
    return getMockArticles(topic);
  }
};

const getMockArticles = (topic) => {
  return [
    {
      title: `${topic} sees massive adoption in latest quarter`,
      url: `https://news.example.com/${topic}-adoption`,
      content: `${topic} has seen a 40% increase in enterprise adoption across tech and finance sectors. Experts suggest this is driving long-term efficiency.`
    },
    {
      title: `Regulatory challenges loom for ${topic} companies`,
      url: `https://news.example.com/${topic}-regulation`,
      content: `Governments are beginning to draft legislation that could slow down the rapid deployment of new ${topic} features. Some startups fear compliance costs.`
    },
    {
      title: `Major breakthrough in ${topic} algorithms efficiency`,
      url: `https://news.example.com/${topic}-breakthrough`,
      content: `A new research paper details how ${topic} training costs can be cut by half, making it accessible to smaller companies.`
    }
  ];
};

module.exports = {
  fetchNewsArticles
};

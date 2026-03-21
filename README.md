# InsightBrief - AI News Briefing Platform

InsightBrief is an AI-powered news aggregation and briefing platform that generates personalized news briefings with AI insights, contrarian viewpoints, market impact analysis, and more.

## 🌟 Core Features

### 📊 Personalized News Briefings
- **AI-Curated Content**: Fetches real news from multiple sources based on your interests
- **Smart Filtering**: Articles are selected based on your personalized interests
- **Topic-Based Generation**: Generate briefings on any topic (startups, stock market, tech, etc.)

### 🤖 AI-Powered Insights
- **Llama 3 Integration**: Local AI model via Ollama for privacy and no rate limits
- **Market Analysis**: AI generates impact analysis and market implications
- **Contrarian Viewpoints**: Bullish, bearish, and neutral perspectives on news
- **Predictive Analytics**: AI-driven forecasts and trend predictions
- **Personal Relevance**: Tailored insights based on your specific interests

### 💬 Interactive Q&A (RAG)
- **Follow-up Questions**: Ask any question about the briefing content
- **Context-Aware Answers**: AI responds based on the actual news articles
- **Source Attribution**: Every answer includes source citations
- **Keyword-Based Search**: Efficient content retrieval without external dependencies

### 🔐 User Management
- **JWT Authentication**: Secure token-based authentication
- **Interest Management**: Save and update your interests for personalized briefings
- **Profile System**: Track your briefing history and preferences

### ⏰ Automated Features
- **Daily Briefs**: Scheduled daily news briefings on your topics
- **Cron Jobs**: Automated news fetching and processing
- **Historical Tracking**: Store and retrieve past briefings

## 🏗️ Architecture Overview

### System Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Services   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Ollama)      │
│                 │    │                 │    │                 │
│ • UI Components │    │ • REST API      │    │ • Llama 3       │
│ • Auth Context  │    │ • JWT Auth      │    │ • Local Model   │
│ • API Client    │    │ • Business Logic│    │ • No Rate Limits│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Session  │    │   MongoDB       │    │   News APIs     │
│   (LocalStorage)│    │   Database      │    │   (External)    │
│                 │    │                 │    │                 │
│ • JWT Tokens    │    │ • Users         │    │ • NewsData.io   │
│ • User Data     │    │ • Briefings     │    │ • NewsAPI.org   │
│ • Preferences   │    │ • History       │    │ • Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **News Fetching**: Backend fetches articles from News APIs
2. **AI Processing**: Llama 3 analyzes and generates insights
3. **Content Indexing**: Articles are chunked and indexed for search
4. **User Interaction**: Frontend displays briefings and handles Q&A
5. **Storage**: MongoDB stores user data and briefing history

## 🚀 Tech Stack

### Frontend Technologies
- **React 19** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Node-cron** - Task scheduling

### AI & ML Stack
- **Ollama** - Local AI model server
- **Llama 3** - Meta's open-source LLM
- **LangChain** - AI framework components
- **Custom RAG** - Retrieval-Augmented Generation

### External Services
- **NewsData.io** - News aggregation API
- **NewsAPI.org** - Alternative news source

## 📁 Project Structure

```
ai-news-brifer/
├── 📂 backend/
│   ├── 📂 config/              # Database configurations
│   │   └── db.js              # MongoDB connection setup
│   ├── 📂 controllers/         # Request handlers
│   │   ├── authController.js  # Authentication logic
│   │   └── briefingController.js # Briefing generation
│   ├── 📂 middleware/          # Express middleware
│   │   └── auth.js            # JWT verification
│   ├── 📂 models/             # Data models
│   │   ├── User.js            # User schema
│   │   └── Briefing.js        # Briefing schema
│   ├── 📂 routes/             # API routes
│   │   ├── auth.js            # Auth endpoints
│   │   └── index.js           # Main router
│   ├── 📂 services/           # Business logic
│   │   ├── aiService.js       # Llama 3 integration
│   │   ├── ragService.js      # Q&A and search
│   │   ├── newsService.js     # News fetching
│   │   └── dailyBriefService.js # Scheduled tasks
│   ├── .env.example           # Environment template
│   ├── package.json           # Dependencies
│   └── server.js              # Server entry point
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 api/            # API client
│   │   │   └── apiClient.js   # Axios configuration
│   │   ├── 📂 components/     # React components
│   │   │   ├── AskAIBox.jsx   # Q&A interface
│   │   │   ├── BriefingCard.jsx # Briefing display
│   │   │   └── ...           # Other UI components
│   │   ├── 📂 context/        # React context
│   │   │   └── AuthContext.jsx # Auth state
│   │   ├── 📂 pages/          # Page components
│   │   │   ├── LandingPage.jsx # Home page
│   │   │   ├── BriefingPage.jsx # Briefing view
│   │   │   ├── ProfilePage.jsx # User profile
│   │   │   └── DailyBriefPage.jsx # Daily briefs
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
└── 📄 README.md               # This file
```

## 🔧 Additional Features

### Security Features
- **JWT Token Expiration**: Configurable token lifetimes
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Sensitive data protection

### Performance Optimizations
- **Lazy Loading**: Components load on demand
- **Caching Strategy**: News API responses cached
- **Efficient Search**: Keyword-based content matching
- **Chunked Processing**: Large articles split for analysis

### Error Handling
- **Graceful Fallbacks**: Mock data when APIs fail
- **User-Friendly Messages**: Clear error communication
- **Logging System**: Comprehensive error tracking
- **Retry Logic**: Automatic retry for failed requests

### Development Features
- **Hot Reload**: Instant development feedback
- **Environment Config**: Easy setup across environments
- **Modular Architecture**: Clean, maintainable code
- **Type Safety**: JSDoc documentation

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **MongoDB** - Database (local or Atlas)
- **Ollama** - Local AI server: https://ollama.com

### Installation & Setup

1. **Clone Repository**
```bash
git clone <repo-url>
cd ai-news-brifer
```

2. **Backend Setup**
```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Ollama Setup**
```bash
# Install Ollama (follow guide at ollama.com)
ollama pull llama3
ollama serve
```

5. **Start Application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### Briefing Endpoints
- `GET /api/briefing?topic=<topic>` - Generate news briefing
- `POST /api/briefing/ask` - Ask follow-up question
- `GET /api/briefing/interests` - Get user interests
- `POST /api/briefing/interests` - Update interests
- `GET /api/briefing/daily` - Get daily briefs
- `POST /api/briefing/daily/trigger` - Manual daily brief generation

## 🔒 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | 5000 | No |
| `MONGO_URI` | MongoDB connection string | mongodb://127.0.0.1:27017/insightbrief | Yes |
| `OLLAMA_HOST` | Ollama server URL | http://localhost:11434 | No |
| `OLLAMA_MODEL` | AI model name | llama3 | No |
| `NEWS_API_KEY` | News API key | - | Optional |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | Token lifetime | 7d | No |
| `CLIENT_URL` | Frontend URL | http://localhost:5173 | No |

## 🐛 Troubleshooting

### Common Issues

**Ollama Connection Failed**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if not running
ollama serve

# Verify model is available
ollama list
```

**MongoDB Connection Error**
- Ensure MongoDB service is running
- Check connection string in `.env`
- Consider using MongoDB Atlas for cloud hosting

**Frontend Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Backend 500 Errors**
- Check environment variables
- Review terminal logs for specific errors
- Verify all required services are running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Meta AI** for Llama 3 model
- **Ollama** for local AI infrastructure
- **NewsData.io & NewsAPI.org** for news data
- **LangChain** for AI framework components

---

Built with ❤️ using modern web technologies and local AI infrastructure.

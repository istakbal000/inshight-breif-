# InsightBrief - AI News Briefing Platform

InsightBrief is an AI-powered news aggregation and briefing platform that generates personalized news briefings with AI insights, contrarian viewpoints, market impact analysis, and more.

## Features

- **Personalized News Briefings**: Get AI-curated news based on your interests
- **AI-Powered Insights**: Llama 3 via Ollama generates market analysis, predictions, and contrarian viewpoints
- **RAG-Based Q&A**: Ask follow-up questions about briefing content with semantic search
- **User Authentication**: JWT-based secure authentication
- **Daily Briefs**: Automated daily news briefings on your topics

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Ollama (Llama 3) for AI
- ChromaDB for vector store
- JWT authentication

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Ollama installed: https://ollama.com

### 1. Clone & Install

```bash
git clone <repo-url>
cd ai-news-brifer

# Install backend dependencies
cd backend
npm install --legacy-peer-deps

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/insightbrief

# Ollama (Local AI)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3

# News API (optional, for real news)
NEWS_API_KEY=your_newsapi_key

# JWT Secret (generate a random string)
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d

# ChromaDB (for RAG)
CHROMA_DB_URL=http://localhost:8000

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### 3. Setup Ollama

Pull the Llama 3 model:

```bash
ollama pull llama3
```

Start Ollama server:

```bash
ollama serve
```

### 4. Start the Application

**Terminal 1 - Ollama** (keep running):
```bash
ollama serve
```

**Terminal 2 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend**:
```bash
cd frontend
npm run dev
```

### 5. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Briefings
- `GET /api/briefing?topic=<topic>` - Generate news briefing
- `POST /api/briefing/ask` - Ask follow-up question (RAG)
- `GET /api/briefing/interests` - Get user interests
- `POST /api/briefing/interests` - Update interests

## Project Structure

```
ai-news-brifer/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   ├── aiService.js      # Ollama/Llama 3 integration
│   │   ├── ragService.js     # RAG + embeddings
│   │   ├── newsService.js    # News API
│   │   └── dailyBriefService.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # React components
    │   ├── context/     # Auth context
    │   ├── pages/       # Page components
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 5000 |
| `MONGO_URI` | MongoDB connection string | mongodb://127.0.0.1:27017/insightbrief |
| `OLLAMA_HOST` | Ollama server URL | http://localhost:11434 |
| `OLLAMA_MODEL` | Model name | llama3 |
| `NEWS_API_KEY` | NewsData.io or NewsAPI.org key | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `CHROMA_DB_URL` | ChromaDB server URL | http://localhost:8000 |

## Troubleshooting

### Ollama connection failed
- Make sure Ollama is running: `ollama serve`
- Verify model is pulled: `ollama list`
- Check port 11434 is available

### MongoDB connection error
- Ensure MongoDB is running locally
- Or update `MONGO_URI` to use MongoDB Atlas

### 500 errors
- Check backend terminal logs
- Verify all environment variables are set
- Ensure Ollama is responding: `curl http://localhost:11434/api/tags`

## License

MIT

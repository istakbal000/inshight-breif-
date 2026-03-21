const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('InsightBrief API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/index');

app.use('/api/auth', authRoutes);
app.use('/api', routes);

const { initCronJob } = require('./services/dailyBriefService');
initCronJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

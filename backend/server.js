// Express API Gateway - connects frontend to AI service + MongoDB
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
const PYTHON_SERVICE_URL = `http://localhost:${process.env.PYTHON_SERVICE_PORT || 8000}`;

// Middleware - CORS must be first!
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// MongoDB Schema for Content
const ContentSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: String,
  extractedText: String,
  summary: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.model('Content', ContentSchema);

// MongoDB Schema for Query History
const QuerySchema = new mongoose.Schema({
  url: String,
  timestamp: { type: Date, default: Date.now },
  recommendations: Array,
});

const Query = mongoose.model('Query', QuerySchema);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Analyze a new URL
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`📝 Analyzing URL: ${url}`);

    // Check if URL was already analyzed
    let content = await Content.findOne({ url });

    if (content) {
      console.log('✅ URL found in database (cached)');
      return res.json({
        cached: true,
        data: content,
      });
    }

    // Send to Python AI service for processing
    console.log('🚀 Sending to AI service for processing...');
    const response = await axios.post(`${PYTHON_SERVICE_URL}/extract`, {
      url,
    });

    // Save to MongoDB
    content = new Content({
      url,
      title: response.data.title,
      extractedText: response.data.text,
      summary: response.data.summary,
      category: response.data.category,
    });

    await content.save();
    console.log('✅ Content saved to database');

    res.json({
      cached: false,
      data: content,
    });
  } catch (error) {
    console.error('❌ Error analyzing URL:', error.message);
    res.status(500).json({
      error: 'Failed to analyze URL',
      details: error.message,
    });
  }
});

// Get recommendations
app.post('/api/recommend', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`🔍 Finding recommendations for: ${url}`);

    // Send to Python AI service
    const response = await axios.post(`${PYTHON_SERVICE_URL}/recommend`, {
      url,
    });

    // Save query to history
    const query = new Query({
      url,
      recommendations: response.data.recommendations,
    });
    await query.save();

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error getting recommendations:', error.message);
    res.status(500).json({
      error: 'Failed to get recommendations',
      details: error.message,
    });
  }
});

// Get all analyzed content
app.get('/api/content', async (req, res) => {
  try {
    const content = await Content.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(content);
  } catch (error) {
    console.error('❌ Error fetching content:', error.message);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get query history
app.get('/api/history', async (req, res) => {
  try {
    const history = await Query.find()
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    console.error('❌ Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🔗 Python AI service expected at ${PYTHON_SERVICE_URL}`);
});

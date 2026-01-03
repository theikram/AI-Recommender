# 🚀 AI Recommender System

> Paste any URL and discover AI-powered content recommendations using vector embeddings, FAISS, and Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ What It Does

Paste any URL → Get AI-powered analysis → Discover related content.

**Smart Recommendations:**
- 📺 **YouTube URL?** → Get similar videos
- 📰 **Article URL?** → Get similar articles

---

## 📸 Screenshots

### Landing Page - Hero Section
![Hero Section](Screenshots/1.png)
*Modern dark-themed landing page with neon lime accents, floating emoji animations, and glassmorphism effects*

### Core Technology & How It Works
![Features Section](Screenshots/2.png)
*Feature cards showcasing Gemini AI, FAISS vectors, DuckDuckGo search, and 4-step workflow diagram*

### Stats & Tech Stack
![Stats Section](Screenshots/3.png)
*Performance metrics (6+ results, 3 services, 768D vectors) and technology badges*

### YouTube Video Recommendations
![YouTube Results](Screenshots/4.png)
*Smart video detection with AI analysis, category tagging, and 6 related video thumbnails*

### Article Recommendations
![Article Results](Screenshots/5.png)
*DuckDuckGo-powered article search with AI-generated summaries and 6 related article cards*

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🔗 **URL Analysis** | Extract & analyze content from any webpage |
| 🧠 **AI Summary** | Gemini-powered content summarization |
| 📊 **FAISS Vectors** | Fast similarity search with Facebook AI |
| 📺 **Smart YouTube** | Detects videos, finds related content |
| 📰 **Article Search** | DuckDuckGo-powered article recommendations |
| ✨ **Beautiful UI** | Neon dark theme with glassmorphism |

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js 14    │  Modern React UI
│   Frontend      │  (Port 3000)
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│    Express.js   │◄────►│   MongoDB    │
│    Backend      │      │   Atlas      │
│   (Port 5000)   │      └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Python Flask  │─────►│  Gemini AI   │
│   AI Service    │      │  (OpenRouter)│
│   (Port 8000)   │      └──────────────┘
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│ FAISS │ │DuckDuckGo │
│Vectors│ │  Search   │
└───────┘ └───────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **MongoDB** Atlas account
- **Conda** (recommended)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/theikram/AI-Recommender.git
cd AI-Recommender
```

### 2️⃣ Setup Python AI Service

```bash
cd ai-service
conda create -n ai-rec python=3.10 -y
conda activate ai-rec
pip install -r requirements.txt
pip install duckduckgo_search
python app.py
```
> 🟢 Running on http://localhost:8000

### 3️⃣ Setup Node.js Backend

```bash
cd backend
npm install
# Edit ../.env with your MongoDB URI
npm run dev
```
> 🟢 Running on http://localhost:5000

### 4️⃣ Setup Next.js Frontend

```bash
cd frontend
npm install
npm run dev
```
> 🟢 Running on http://localhost:3000

### 5️⃣ Open Browser

Visit `http://localhost:3000` 🎉

---

## 📁 Project Structure

```
📦 AI Recommender System
│
├── 📂 frontend/                 # Next.js 14 App
│   ├── 📂 app/
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Neon dark theme
│   │   ├── layout.tsx          # Root layout
│   │   └── 📂 app/
│   │       └── page.tsx        # URL analyzer page
│   └── package.json
│
├── 📂 backend/                  # Express.js API Gateway
│   ├── server.js               # REST API + MongoDB
│   └── package.json
│
├── 📂 ai-service/               # Python AI Microservice
│   ├── app.py                  # Main Flask app + Gemini
│   ├── text_extractor.py       # Web content extraction
│   ├── vector_store.py         # FAISS vector database
│   ├── embeddings.py           # Embedding generation
│   └── requirements.txt
│
├── 📂 Screenshots/              # UI Screenshots
│   ├── 1.png                   # Hero section
│   ├── 2.png                   # Features & How It Works
│   ├── 3.png                   # Stats & Tech Stack
│   ├── 4.png                   # YouTube results
│   └── 5.png                   # Article results
│
├── .env.example                 # Environment template
└── README.md
```

---

## 🔄 How It Works

### Flow Diagram

```
User pastes URL
       │
       ▼
┌──────────────────┐
│ Detect URL Type  │
│ (YouTube/Article)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Extract Content │
│  (BeautifulSoup) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Gemini AI      │
│ Analyze + Classify│
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│YouTube│ │DuckDuckGo │
│Search │ │  Search   │
└───┬───┘ └─────┬─────┘
    │           │
    └─────┬─────┘
          ▼
   📺 6 Videos OR 📰 6 Articles
```

### Step-by-Step:

1. **🔗 URL Input** - User pastes any URL
2. **🔍 Type Detection** - YouTube or Article?
3. **📥 Content Extraction** - BeautifulSoup scrapes text
4. **🤖 AI Analysis** - Gemini generates title, summary, category, keywords
5. **🔎 Smart Search** - YouTube videos OR DuckDuckGo articles
6. **📊 Vector Storage** - FAISS stores embeddings for similarity
7. **✨ Display Results** - Beautiful cards with recommendations

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Custom CSS** | Neon glow effects |

### Backend
| Tech | Purpose |
|------|---------|
| **Express.js** | REST API server |
| **MongoDB** | Content & history storage |
| **Mongoose** | MongoDB ODM |
| **Axios** | HTTP client |

### AI Service
| Tech | Purpose |
|------|---------|
| **Flask** | Python web framework |
| **Gemini AI** | Content analysis (via OpenRouter) |
| **FAISS** | Vector similarity search |
| **BeautifulSoup** | Web scraping |
| **DuckDuckGo** | Article search |

---

## ⚙️ Environment Variables

Create `.env` in root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# Ports
BACKEND_PORT=5000
PYTHON_SERVICE_PORT=8000

# AI (set in ai-service/app.py)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

---

## 🧠 Data Science Concepts

| Concept | Implementation |
|---------|----------------|
| **Vector Embeddings** | Hash-based 768D vectors |
| **Similarity Search** | FAISS IndexFlatL2 |
| **NLP** | Gemini content analysis |
| **Web Scraping** | BeautifulSoup + requests |
| **API Integration** | OpenRouter → Gemini |

---

## 📡 API Endpoints

### Backend (Express)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze URL, cache in MongoDB |
| POST | `/api/recommend` | Get recommendations |
| GET | `/api/content` | List analyzed content |
| GET | `/api/history` | Query history |

### AI Service (Flask)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/extract` | Extract, analyze, recommend |
| GET | `/health` | Service health check |

---

## 🧪 Testing

1. **Wikipedia Article:**
   ```
   https://en.wikipedia.org/wiki/Artificial_intelligence
   ```
   → Returns 6 related AI/technology articles

2. **Tech News:**
   ```
   https://techcrunch.com/
   ```
   → Returns 6 related tech news articles

3. **YouTube Tutorial:**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
   → Returns 6 related music videos

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check `.env` URI, whitelist IP in Atlas |
| AI analysis fails | Verify OpenRouter API key has credits |
| No recommendations | Try more specific URLs |
| Port already in use | Kill existing processes or change ports |
| Paywall error | Some sites block scrapers - try different URL |

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Content extraction | ~2-5s |
| AI analysis | ~3-8s |
| Recommendation search | ~1-3s |
| FAISS similarity | <100ms |

---

## 🎓 Learning Outcomes

This project demonstrates:

✅ Full-stack development (Next.js + Express + Python)  
✅ Microservices architecture  
✅ AI/ML integration (embeddings, vector search)  
✅ Modern UI design (glassmorphism, animations)  
✅ Database management (MongoDB)  
✅ API integration (OpenRouter, DuckDuckGo)  
✅ Web scraping (BeautifulSoup)

---

## 📄 License

MIT License - Free to use in portfolios and projects.

---

## ⭐ Star This Repo

If this helped you understand AI recommendation systems, give it a star! 🌟

---

<p align="center">
  Built with ❤️ using Gemini AI, FAISS & Next.js
</p>

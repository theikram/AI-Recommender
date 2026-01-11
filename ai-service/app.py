# AI Recommender Service - FastAPI + Gemini AI + FAISS
import os
import re
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import numpy as np
from urllib.parse import quote_plus, urlparse
import uvicorn

from text_extractor import extract_text_from_url
from vector_store import VectorStore

# Load environment variables from parent directory's .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# API Keys - supports both Google AI direct and OpenRouter
GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Configure Google Gemini AI if key is available
if GOOGLE_AI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GOOGLE_AI_API_KEY)
        print("✅ Google AI API configured")
    except ImportError:
        print("⚠️ google-generativeai not installed, using OpenRouter")
        GOOGLE_AI_API_KEY = ""

# FastAPI app initialization
app = FastAPI(
    title="AI Recommender Service",
    description="AI-powered content analysis and recommendation system using Gemini AI and FAISS",
    version="2.0.0"
)

# CORS configuration - allows all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response validation
class ExtractRequest(BaseModel):
    url: str


class HealthResponse(BaseModel):
    status: str


class RecommendationItem(BaseModel):
    title: str
    url: str
    type: str
    snippet: Optional[str] = None
    videoId: Optional[str] = None
    thumbnail: Optional[str] = None


class Recommendations(BaseModel):
    articles: list[RecommendationItem]
    youtube: list[RecommendationItem]


class ExtractResponse(BaseModel):
    title: str
    summary: str
    category: str
    keywords: str
    contentType: str
    recommendations: Recommendations


class RecommendResponse(BaseModel):
    message: str


async def call_gemini(prompt: str) -> str:
    """Call Gemini AI - tries Google AI first, falls back to OpenRouter"""
    
    # Try Google AI first
    if GOOGLE_AI_API_KEY:
        try:
            import google.generativeai as genai
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"⚠️ Google AI error: {e}, trying OpenRouter...")
    
    # Fallback to OpenRouter
    if OPENROUTER_API_KEY:
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [{"role": "user", "content": prompt}]
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, headers=headers, json=data)
                result = response.json()
            
            if 'choices' in result:
                return result['choices'][0]['message']['content']
            elif 'error' in result:
                raise Exception(result['error'].get('message', str(result['error'])))
        except Exception as e:
            print(f"❌ OpenRouter error: {e}")
            raise
    
    raise Exception("No AI API key configured. Set GOOGLE_AI_API_KEY or OPENROUTER_API_KEY in .env")


# YouTube URL detection
def is_youtube_url(url: str) -> bool:
    parsed = urlparse(url)
    return any(h in parsed.netloc for h in ['youtube.com', 'youtu.be'])


async def get_youtube_video_title(url: str) -> Optional[str]:
    """Extract actual video title from YouTube (async)"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)
        
        # Try multiple patterns to find the title
        patterns = [
            r'<title>([^<]+)</title>',
            r'"title":"([^"]+)"',
            r'<meta name="title" content="([^"]+)"',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, response.text)
            if match:
                title = match.group(1)
                # Clean up the title
                title = title.replace(' - YouTube', '').strip()
                if title and len(title) > 5:
                    return title
        
        return None
    except:
        return None


# DuckDuckGo article search
def search_web(query: str, num_results: int = 6) -> list[dict]:
    try:
        from duckduckgo_search import DDGS
        
        print(f'🔍 Searching web for: {query}')
        
        # List of domains to exclude (spam, cheat, non-English sites)
        excluded_domains = ['artificialaiming', 'aimbot', 'cheat', 'hack', 'csdn.net', 'zhihu.com', 'baidu.com', 'justwatch', 'moviepilot']
        
        results = []
        with DDGS() as ddgs:
            # Simple search - let DuckDuckGo choose the best results
            for r in ddgs.text(query, max_results=num_results + 12):
                url = r.get('href', '').lower()
                title = r.get('title', '')
                
                # Filter out excluded domains  
                is_excluded = any(domain in url for domain in excluded_domains)
                
                if url and title and len(title) > 10 and not is_excluded:
                    results.append({
                        'title': r.get('title', ''),
                        'url': r.get('href', ''),
                        'snippet': r.get('body', '')[:200],
                        'type': 'article'
                    })
                
                if len(results) >= num_results:
                    break
        
        print(f'✅ Found {len(results)} web results')
        return results
    except Exception as e:
        print(f'❌ Web search error: {e}')
        return []


# YouTube video search (async)
async def search_youtube(query: str, num_results: int = 6) -> list[dict]:
    try:
        search_url = f"https://www.youtube.com/results?search_query={quote_plus(query)}"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(search_url, headers=headers)
        
        results = []
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', response.text)
        titles = re.findall(r'"title":\{"runs":\[\{"text":"([^"]+)"\}', response.text)
        
        seen = set()
        for i, vid in enumerate(video_ids[:30]):
            if vid not in seen and len(results) < num_results:
                seen.add(vid)
                title = titles[i] if i < len(titles) else "Video"
                results.append({
                    'title': title,
                    'url': f'https://www.youtube.com/watch?v={vid}',
                    'type': 'youtube',
                    'videoId': vid,
                    'thumbnail': f'https://img.youtube.com/vi/{vid}/mqdefault.jpg'
                })
        
        return results
    except Exception as e:
        print(f'❌ YouTube search error: {e}')
        return []


# Generate 768D vector embedding
def generate_embedding(text: str) -> np.ndarray:
    words = text.lower().split()[:500]
    embedding = np.zeros(768, dtype='float32')
    for word in words:
        idx = hash(word) % 768
        embedding[idx] += 1
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm
    return embedding


# Initialize FAISS vector store
vector_store = VectorStore(dimension=768)
content_database = {}


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return {"status": "ok"}


# Main API endpoint
@app.post("/extract", response_model=ExtractResponse)
async def extract(request: ExtractRequest):
    """Extract content from URL and get AI-powered recommendations"""
    try:
        url = request.url
        
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        print(f'📥 Analyzing: {url}')
        
        # Check if it's a YouTube video
        is_youtube = is_youtube_url(url)
        youtube_title = None
        
        if is_youtube:
            print('📺 Detected YouTube video')
            youtube_title = await get_youtube_video_title(url)
            print(f'📺 Video title: {youtube_title}')
        
        # STEP 1: Extract content using BeautifulSoup web scraper
        extracted = extract_text_from_url(url)
        
        # For YouTube, use the video title as primary content
        if is_youtube and youtube_title:
            content_for_analysis = f"YouTube Video: {youtube_title}"
            search_query = youtube_title
        else:
            content_for_analysis = extracted['text'][:3000] if extracted['text'] else extracted['title']
            search_query = None
        
        if not content_for_analysis or len(content_for_analysis) < 10:
            raise HTTPException(status_code=400, detail="Could not extract content from URL")
        
        # STEP 2: Call Gemini AI for analysis & keyword extraction
        print('🤖 Generating analysis...')
        
        if is_youtube and youtube_title:
            prompt = f"""This is a YouTube video titled: "{youtube_title}"

Analyze what this video is about and provide:
TITLE: [the video title, cleaned up, max 80 chars]
SUMMARY: [brief description of what this video is likely about, max 150 chars]
CATEGORY: [one of: Music, Dance, Gaming, Education, Entertainment, News, Sports, Technology, Comedy, Other]
KEYWORDS: [5 specific search terms to find similar videos - focus on the main topic, artist, or content type]"""
        else:
            prompt = f"""Analyze this content:

{content_for_analysis}

Provide EXACTLY in this format:
TITLE: [short descriptive title, max 80 chars]
SUMMARY: [brief summary, max 150 chars]
CATEGORY: [one of: Technology, News, Entertainment, Education, Science, Business, Health, Sports, Music, Other]
KEYWORDS: [Write a single specific search query (3-6 words) to find similar articles. Be very specific - include the main topic. For example: "machine learning neural networks tutorial" or "climate change effects research". Do NOT use generic words like "article" or "information".]"""
        
        ai_response = await call_gemini(prompt)
        
        title = youtube_title or extracted['title']
        summary = 'Content analyzed'
        category = 'General'
        keywords = ''
        
        for line in ai_response.split('\n'):
            if 'TITLE:' in line:
                title = line.split('TITLE:')[1].strip().strip('*').strip('"')
            elif 'SUMMARY:' in line:
                summary = line.split('SUMMARY:')[1].strip().strip('*').strip('"')
            elif 'CATEGORY:' in line:
                category = line.split('CATEGORY:')[1].strip().strip('*').strip('"')
            elif 'KEYWORDS:' in line:
                keywords = line.split('KEYWORDS:')[1].strip().strip('*').strip('"')
        
        print(f'🏷️ Keywords from AI: {keywords}')
        print(f'📂 Category: {category}')
        
        # Build better search query - use keywords + category for context
        if not search_query:
            # For articles: use keywords with category context
            if keywords and len(keywords) > 5:
                # Clean up keywords - remove brackets, extra punctuation
                clean_keywords = keywords.replace('[', '').replace(']', '').replace('"', '').strip()
                search_query = f"{clean_keywords}"
            else:
                # Fallback to title + category
                search_query = f"{title[:50]} {category}"
        else:
            # For YouTube, enhance with AI keywords
            if keywords and len(keywords) > 5:
                clean_keywords = keywords.replace('[', '').replace(']', '').replace('"', '').strip()
                search_query = clean_keywords
            else:
                search_query = youtube_title
        
        print(f'🔍 Final search query: {search_query}')
        
        # STEP 3: Search for related content (DuckDuckGo or YouTube)
        if is_youtube:
            # For YouTube videos, only search for similar videos
            youtube_results = await search_youtube(search_query, num_results=6)
            web_results = []
            print(f'📺 Found {len(youtube_results)} similar videos')
        else:
            # For articles, only search for similar articles
            web_results = search_web(search_query, num_results=6)
            youtube_results = []
            print(f'📰 Found {len(web_results)} similar articles')
        
        # STEP 4: Generate embedding & store in FAISS vector database
        embedding = generate_embedding(content_for_analysis)
        content_id = vector_store.add(embedding, url)
        content_database[url] = {
            'id': content_id,
            'title': title,
            'summary': summary,
            'category': category,
            'keywords': keywords,
            'is_youtube': is_youtube
        }
        
        return {
            'title': title,
            'summary': summary,
            'category': category,
            'keywords': keywords,
            'contentType': 'youtube' if is_youtube else 'article',
            'recommendations': {
                'articles': web_results,
                'youtube': youtube_results
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommend", response_model=RecommendResponse)
async def recommend():
    """Redirect to /extract endpoint"""
    return {"message": "Use /extract endpoint"}


if __name__ == '__main__':
    print('🚀 AI Service starting on port 8000')
    print('📺 YouTube: Smart video detection')
    print('📰 Articles: DuckDuckGo search')
    print('⚡ Powered by FastAPI')
    uvicorn.run(app, host='0.0.0.0', port=8000)

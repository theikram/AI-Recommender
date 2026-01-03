# BeautifulSoup web scraper - extracts text from URLs
import requests
from bs4 import BeautifulSoup
import re

def clean_text(text):
    """
    Clean and preprocess extracted text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?;:()\-\'\"]+', '', text)
    # Strip leading/trailing whitespace
    text = text.strip()
    return text

def extract_text_from_url(url):
    """
    Extract main content text from a URL
    Handles paywalled sites by extracting what's available
    """
    try:
        print(f'🌐 Fetching URL: {url}')
        
        # Better headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        # Fetch the page
        response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Get title first (before removing elements)
        title = soup.find('title')
        title_text = title.get_text().strip() if title else 'No title'
        
        # Also try og:title or article title
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            title_text = og_title.get('content').strip()
        
        # Get meta description as backup content
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        og_desc = soup.find('meta', property='og:description')
        meta_content = ''
        if og_desc and og_desc.get('content'):
            meta_content = og_desc.get('content')
        elif meta_desc and meta_desc.get('content'):
            meta_content = meta_desc.get('content')
        
        # Remove non-content elements
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'noscript', 'iframe']):
            tag.decompose()
        
        text_parts = []
        
        # Try multiple content selectors
        content_selectors = [
            'article',
            'main',
            '[role="main"]',
            '.article-body',
            '.story-body',
            '.post-content',
            '.entry-content',
            '#article-body',
            '.content',
        ]
        
        main_content = None
        for selector in content_selectors:
            try:
                main_content = soup.select_one(selector)
                if main_content:
                    break
            except:
                continue
        
        # Fallback to body
        if not main_content:
            main_content = soup.find('body')
        
        if main_content:
            # Get all text-bearing elements
            for element in main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'li', 'span', 'div']):
                # Skip if it has many children (likely a container)
                if len(element.find_all()) > 5:
                    continue
                text = element.get_text().strip()
                if len(text) > 30:  # Only substantial text
                    text_parts.append(text)
        
        # Join and clean
        full_text = ' '.join(text_parts)
        cleaned_text = clean_text(full_text)
        
        # If very little content, use title + meta description
        if len(cleaned_text) < 100:
            print(f'⚠️ Limited content extracted, using metadata')
            cleaned_text = f"{title_text}. {meta_content}"
            cleaned_text = clean_text(cleaned_text)
        
        # Minimum content check - use title at minimum
        if len(cleaned_text) < 20:
            cleaned_text = title_text
        
        print(f'✅ Extracted {len(cleaned_text)} characters')
        
        return {
            'text': cleaned_text,
            'title': title_text,
            'url': url
        }
        
    except requests.exceptions.HTTPError as e:
        print(f'❌ HTTP Error: {str(e)}')
        # Try to get title from URL for paywalled content
        return {
            'text': f'Article from {url}',
            'title': url.split('/')[-1].replace('-', ' ').title(),
            'url': url,
            'error': str(e)
        }
    except Exception as e:
        print(f'❌ Error extracting text: {str(e)}')
        return {
            'text': '',
            'title': 'Error',
            'url': url,
            'error': str(e)
        }

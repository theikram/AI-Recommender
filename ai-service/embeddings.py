# embeddings.py
# Generate embeddings using Google Gemini API
import google.generativeai as genai
import numpy as np

def generate_embedding(text, model=None):
    """
    Generate embedding vector for text using Gemini
    
    Process:
    1. Truncate text if too long (Gemini has limits)
    2. Call Gemini embedding API
    3. Return normalized vector
    
    Returns:
        numpy array of shape (768,) - embedding vector
    """
    try:
        # Truncate text to avoid token limits (roughly 5000 chars = ~1250 tokens)
        max_chars = 5000
        if len(text) > max_chars:
            text = text[:max_chars]
        
        # Generate embedding using Gemini
        # Note: Using text-embedding-004 model
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        
        # Convert to numpy array
        embedding = np.array(result['embedding'], dtype='float32')
        
        # Normalize (L2 normalization for cosine similarity)
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return embedding
        
    except Exception as e:
        print(f'❌ Error generating embedding: {str(e)}')
        # Return zero vector as fallback
        return np.zeros(768, dtype='float32')

def generate_query_embedding(text):
    """
    Generate embedding for query text
    Uses retrieval_query task type for better similarity matching
    """
    try:
        max_chars = 5000
        if len(text) > max_chars:
            text = text[:max_chars]
        
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_query"
        )
        
        embedding = np.array(result['embedding'], dtype='float32')
        
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return embedding
        
    except Exception as e:
        print(f'❌ Error generating query embedding: {str(e)}')
        return np.zeros(768, dtype='float32')

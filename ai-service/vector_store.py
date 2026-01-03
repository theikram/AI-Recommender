# FAISS vector store for similarity search
import faiss
import numpy as np

class VectorStore:
    """FAISS-based vector database for k-NN similarity search"""
    
    def __init__(self, dimension=768):
        """Initialize FAISS index with given dimension"""
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.next_id = 0
        print(f'📊 FAISS index initialized (dimension={dimension})')
    
    def add(self, embedding, metadata=None):
        """Add a vector to the index, returns vector ID"""
        if embedding.ndim == 1:
            embedding = embedding.reshape(1, -1)
        
        self.index.add(embedding)
        current_id = self.next_id
        self.next_id += 1
        
        print(f'➕ Added vector (ID={current_id}, total={self.index.ntotal})')
        return current_id
    
    def search(self, query_embedding, k=5):
        """Find k most similar vectors using L2 distance"""
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)
        
        k = min(k, self.index.ntotal)
        
        if k == 0:
            return np.array([[]]), np.array([[]])
        
        distances, indices = self.index.search(query_embedding, k)
        
        print(f'🔍 Found {k} similar vectors')
        return indices, distances
    
    def size(self):
        """Get number of vectors in index"""
        return self.index.ntotal
    
    def save(self, filepath):
        """Save index to disk"""
        faiss.write_index(self.index, filepath)
        print(f'💾 Index saved to {filepath}')
    
    def load(self, filepath):
        """Load index from disk"""
        self.index = faiss.read_index(filepath)
        self.next_id = self.index.ntotal
        print(f'📂 Index loaded from {filepath} ({self.next_id} vectors)')

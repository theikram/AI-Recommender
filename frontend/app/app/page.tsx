// URL Analyzer page - calls AI service, displays recommendations
'use client';
import { useState } from 'react';
import Link from 'next/link';

// AI service endpoint (FastAPI Python)
const API_URL = 'http://localhost:8000';

export default function AppPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [analysis, setAnalysis] = useState<any>(null);

    const analyze = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            const res = await fetch(`${API_URL}/extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to analyze');
            }

            const data = await res.json();
            setAnalysis(data);
        } catch (e: any) {
            setError(e.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const hasArticles = analysis?.recommendations?.articles?.length > 0;
    const hasVideos = analysis?.recommendations?.youtube?.length > 0;

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-[#08080a]">
            {/* Floating Icons Background */}
            <div className="floating-icons">
                <span className="floating-icon">🧠</span>
                <span className="floating-icon">⚡</span>
                <span className="floating-icon">✨</span>
                <span className="floating-icon">🔗</span>
                <span className="floating-icon">📊</span>
                <span className="floating-icon">🎯</span>
                <span className="floating-icon">💡</span>
                <span className="floating-icon">🚀</span>
                <span className="floating-icon">📺</span>
                <span className="floating-icon">📰</span>
            </div>

            {/* Background glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(173,255,47,0.12), transparent)' }}
            />

            {/* Transparent Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
                    <Link href="/" className="text-lg font-bold flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        <span className="neon-text">AI Recommender</span>
                    </Link>
                    <Link href="/" className="px-4 py-2 rounded-full text-sm font-medium border border-white/15 text-white/50 hover:text-[#ADFF2F] hover:border-[#ADFF2F]/40 transition-all">
                        ← Back
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-28 pb-20 px-6 max-w-5xl mx-auto relative z-10">
                {/* Hero */}
                <div className="text-center mb-10 fade-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        <span className="neon-text">Analyze</span> any URL
                    </h1>
                    <p className="text-white/50">Get AI analysis + related articles & YouTube videos</p>
                </div>

                {/* Input */}
                <div className="fade-up delay-1 glass p-2 flex gap-2 mb-8 max-w-2xl mx-auto">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && analyze()}
                        placeholder="Paste any URL (article, YouTube video, etc.)"
                        className="flex-1 bg-transparent px-5 py-3 text-white placeholder-white/30 focus:outline-none"
                        disabled={loading}
                    />
                    <button onClick={analyze} disabled={loading} className="btn-neon text-sm whitespace-nowrap">
                        {loading ? '⏳ Analyzing...' : '✨ ANALYZE'}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center text-sm max-w-2xl mx-auto">
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block w-10 h-10 border-2 border-[#ADFF2F] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white/50 mt-4">Analyzing content & finding recommendations...</p>
                    </div>
                )}

                {/* Results */}
                {analysis && !loading && (
                    <div className="fade-up space-y-8">
                        {/* Analysis Card */}
                        <div className="glow-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-[#ADFF2F]/10 flex items-center justify-center text-2xl flex-shrink-0">
                                    {analysis.contentType === 'youtube' ? '📺' : '📄'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs uppercase tracking-wider text-[#ADFF2F] font-semibold">{analysis.category}</span>
                                    <h2 className="text-xl font-bold mt-1 mb-2 break-words">{analysis.title}</h2>
                                    <p className="text-white/60 text-sm">{analysis.summary}</p>
                                    {analysis.keywords && (
                                        <p className="text-white/40 text-xs mt-3">🔑 {analysis.keywords}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Related Articles */}
                        {hasArticles && (
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    📰 Related Articles
                                    <span className="text-xs text-white/40 font-normal">({analysis.recommendations.articles.length} found)</span>
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {analysis.recommendations.articles.map((item: any, i: number) => (
                                        <a
                                            key={i}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glow-card p-4 block hover:border-[#ADFF2F]/40 transition-all"
                                        >
                                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h4>
                                            <p className="text-white/50 text-xs line-clamp-2">{item.snippet}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Videos */}
                        {hasVideos && (
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    📺 Related Videos
                                    <span className="text-xs text-white/40 font-normal">({analysis.recommendations.youtube.length} found)</span>
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {analysis.recommendations.youtube.map((video: any, i: number) => (
                                        <a
                                            key={i}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glow-card overflow-hidden block hover:border-[#ADFF2F]/40 transition-all group"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-semibold text-sm line-clamp-2">{video.title}</h4>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No recommendations */}
                        {!hasArticles && !hasVideos && (
                            <div className="text-center py-8 text-white/40">
                                <p>No recommendations found. Try a different URL.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

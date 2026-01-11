// Landing page - Hero, Features, Stats, Tech Stack
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#08080a]">
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

            {/* Gradient Glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(173,255,47,0.15), transparent)',
                }}
            />

            {/* Non-sticky Nav - scrolls with page */}
            <nav className="absolute top-0 left-0 right-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
                    <span className="text-lg font-bold">⚡ <span className="neon-text">AI Recommender</span></span>
                    <Link href="/app">
                        <button className="btn-neon text-sm">Launch App</button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center justify-center px-8 relative z-10">
                <div className="text-center max-w-4xl">
                    <p className="fade-up text-xs uppercase tracking-[0.4em] text-white/40 mb-8">
                        Discover Content Like Never Before
                    </p>

                    <h1 className="fade-up delay-1 text-5xl md:text-7xl font-extrabold leading-tight mb-8">
                        AI-Powered Content<br />
                        <span className="neon-text">Recommender</span>
                    </h1>

                    <p className="fade-up delay-2 text-lg text-white/50 max-w-xl mx-auto mb-12">
                        Paste any URL and get smart recommendations. Similar YouTube videos or related articles powered by FAISS vector search, Gemini AI analysis, and DuckDuckGo.
                    </p>

                    <div className="fade-up delay-3 flex gap-4 justify-center flex-wrap">
                        <Link href="/app">
                            <button className="btn-neon">Start Free</button>
                        </Link>
                        <a
                            href="https://github.com/theikram/AI-Recommender"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="btn-ghost">Documentation →</button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Core Features - 6 Cards */}
            <section className="py-20 px-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">
                        <span className="neon-text">Core</span> Technology
                    </h2>
                    <p className="text-center text-white/40 mb-12 max-w-lg mx-auto">
                        Built with modern AI and data science technologies
                    </p>

                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { icon: '🧠', title: 'Gemini AI', desc: 'Google\'s latest LLM for content analysis, summarization, and keyword extraction' },
                            { icon: '📊', title: 'FAISS Vectors', desc: 'Facebook AI similarity search with 768-dimensional embeddings for fast matching' },
                            { icon: '🔍', title: 'DuckDuckGo', desc: 'Privacy-focused web search to find related articles without tracking' },
                            { icon: '📺', title: 'YouTube Search', desc: 'Smart video detection and recommendation engine for video content' },
                            { icon: '🌐', title: 'BeautifulSoup', desc: 'Advanced web scraping to extract content from any webpage' },
                            { icon: '💾', title: 'MongoDB Atlas', desc: 'Cloud database storage for analyzed content and query history' },
                        ].map((f, i) => (
                            <div key={i} className="glow-card p-6">
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <h3 className="font-bold mb-2 neon-text">{f.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-12">
                        How It <span className="neon-text">Works</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Paste URL', desc: 'Any article or YouTube video' },
                            { step: '2', title: 'AI Analysis', desc: 'Gemini extracts & summarizes' },
                            { step: '3', title: 'Smart Search', desc: 'Find related content' },
                            { step: '4', title: 'Get Results', desc: '6+ recommendations' },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 rounded-full bg-[#ADFF2F]/10 border border-[#ADFF2F]/30 flex items-center justify-center mx-auto mb-3">
                                    <span className="neon-text font-bold">{s.step}</span>
                                </div>
                                <h4 className="font-semibold mb-1">{s.title}</h4>
                                <p className="text-white/40 text-xs">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats - Fixed alignment */}
            <section className="py-16 px-8 relative z-10">
                <div className="max-w-4xl mx-auto glass p-8 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { num: '6+', label: 'Results' },
                            { num: '3', label: 'Services' },
                            { num: '768', label: 'Dimensions' },
                            { num: '∞', label: 'URLs' },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold neon-text mb-1">{s.num}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-xl font-bold mb-6">
                        <span className="neon-text">Tech</span> Stack
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Express.js', 'MongoDB', 'Python', 'FastAPI', 'FAISS', 'Gemini AI', 'OpenRouter'].map((tech, i) => (
                            <span key={i} className="px-4 py-2 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/60">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-center text-white/25 text-xs relative z-10">
                Built with Gemini AI, FAISS & Next.js
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-transparent border border-white/20 flex items-center justify-center z-50 hover:border-white/40 transition-all opacity-50 hover:opacity-80"
                    aria-label="Scroll to top"
                >
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}

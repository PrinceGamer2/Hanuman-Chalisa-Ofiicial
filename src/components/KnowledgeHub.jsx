import { useState, useEffect } from 'react'
import { articles as staticArticles } from '../data/articles'

// Load CMS articles from localStorage
function loadCMSArticles() {
    try {
        const stored = localStorage.getItem('hc_cms_articles')
        if (stored) {
            const parsed = JSON.parse(stored)
            // Filter only published articles
            return parsed.filter(a => a.published !== false)
        }
    } catch (e) {
        console.error('Error loading CMS articles:', e)
    }
    return []
}

// Format content with markdown-style bold
function formatContent(content) {
    if (!content) return ''
    return content.split('\n').map((line, i) => {
        // Check for bold text **text**
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
    })
}

export default function KnowledgeHub() {
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [allArticles, setAllArticles] = useState([])

    useEffect(() => {
        // Combine static and CMS articles
        const cmsArticles = loadCMSArticles()
        // Convert CMS format to match static format
        const formattedCMSArticles = cmsArticles.map(a => ({
            id: a.id,
            emoji: a.emoji,
            category: a.category,
            title: a.title,
            summary: a.summary,
            readTime: a.readTime,
            content: formatContent(a.content),
            isCMS: true
        }))
        
        // Combine both - CMS articles first, then static
        setAllArticles([...formattedCMSArticles, ...staticArticles])
    }, [])

    // Refresh articles when modal closes (in case CMS was updated)
    const handleCloseModal = () => {
        setSelectedArticle(null)
        const cmsArticles = loadCMSArticles()
        const formattedCMSArticles = cmsArticles.map(a => ({
            id: a.id,
            emoji: a.emoji,
            category: a.category,
            title: a.title,
            summary: a.summary,
            readTime: a.readTime,
            content: formatContent(a.content),
            isCMS: true
        }))
        setAllArticles([...formattedCMSArticles, ...staticArticles])
    }

    return (
        <section className="section" id="knowledge">
            <div className="container">
                <div className="section-label">📚 Knowledge Hub</div>
                <h2 className="section-title">Ancient Wisdom, Modern Life</h2>
                <p className="section-subtitle">
                    Deep-dive articles connecting Hanuman's teachings to your career,
                    mental health, exams, and everyday life.
                </p>

                <div className="knowledge__grid">
                    {allArticles.map(article => (
                        <div
                            key={article.id}
                            className="glass-card knowledge-card"
                            onClick={() => setSelectedArticle(article)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="knowledge-card__emoji">{article.emoji}</div>
                            <div className="knowledge-card__category">{article.category}</div>
                            <h3 className="knowledge-card__title">{article.title}</h3>
                            <p className="knowledge-card__summary">{article.summary}</p>
                            <div className="knowledge-card__meta">
                                <span className="knowledge-card__read-time">⏱ {article.readTime}</span>
                                <button className="knowledge-card__read-btn">Read →</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Admin Link */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem'
                }}>
                    <a 
                        href="#admin" 
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'underline'
                        }}
                    >
                        Admin Access
                    </a>
                </div>
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="article-modal" onClick={handleCloseModal}>
                    <div
                        className="article-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="article-modal__close"
                            onClick={handleCloseModal}
                        >
                            ✕
                        </button>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--color-saffron-light)',
                            marginBottom: 'var(--space-sm)'
                        }}>
                            {selectedArticle.emoji} {selectedArticle.category} · {selectedArticle.readTime}
                        </div>
                        <h2 className="article-modal__title">{selectedArticle.title}</h2>
                        <div className="article-modal__body">{selectedArticle.content}</div>
                    </div>
                </div>
            )}
        </section>
    )
}
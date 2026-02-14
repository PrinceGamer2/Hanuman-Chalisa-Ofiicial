import { useState } from 'react'
import { articles } from '../data/articles'

export default function KnowledgeHub() {
    const [selectedArticle, setSelectedArticle] = useState(null)

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
                    {articles.map(article => (
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
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="article-modal" onClick={() => setSelectedArticle(null)}>
                    <div
                        className="article-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="article-modal__close"
                            onClick={() => setSelectedArticle(null)}
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

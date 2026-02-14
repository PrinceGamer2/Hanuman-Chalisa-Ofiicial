import { useState, useEffect, useCallback } from 'react'
import { verses } from '../data/verses'

export default function VerseExplorer() {
    const [expandedId, setExpandedId] = useState(null)
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hc_bookmarks') || '[]')
        } catch { return [] }
    })
    const [filter, setFilter] = useState('all')
    const [copiedId, setCopiedId] = useState(null)

    useEffect(() => {
        localStorage.setItem('hc_bookmarks', JSON.stringify(bookmarks))
    }, [bookmarks])

    // Clear copied status after 2 seconds
    useEffect(() => {
        if (copiedId) {
            const timer = setTimeout(() => setCopiedId(null), 2000)
            return () => clearTimeout(timer)
        }
    }, [copiedId])

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id)
    }

    const toggleBookmark = useCallback((e, id) => {
        e.stopPropagation()
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(20)
        
        setBookmarks(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        )
    }, [])

    const copyVerse = useCallback((e, verse) => {
        e.stopPropagation()
        const text = `${verse.hindi}\n\n${verse.transliteration}\n\n${verse.meaning}`
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(verse.id)
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate([30, 50, 30])
        })
    }, [])

    const filtered = filter === 'all'
        ? verses
        : filter === 'bookmarked'
            ? verses.filter(v => bookmarks.includes(v.id))
            : verses.filter(v => v.type === filter)

    return (
        <section className="section" id="chalisa">
            <div className="container">
                <div className="section-label">📖 Verse Explorer</div>
                <h2 className="section-title">The Hanuman Chalisa</h2>
                <p className="section-subtitle">
                    Every verse explained — Hindi text, transliteration, meaning,
                    and a modern lesson for your life today.
                </p>

                <div className="verse-filter">
                    {[
                        { key: 'all', label: 'All Verses' },
                        { key: 'doha', label: 'Dohas' },
                        { key: 'chaupai', label: 'Chaupais' },
                        { key: 'bookmarked', label: `★ Saved (${bookmarks.length})` },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`verse-filter__btn ${filter === f.key ? 'active' : ''}`}
                            onClick={() => setFilter(f.key)}
                            aria-pressed={filter === f.key}
                            style={{
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="verse-explorer__list">
                    {filtered.map(verse => (
                        <div
                            key={verse.id}
                            className="glass-card verse-card"
                            onClick={() => toggleExpand(verse.id)}
                            style={{
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            <div className="verse-card__header">
                                <div className="verse-card__number">{verse.id}</div>
                                <div className="verse-card__hindi hindi">{verse.hindi}</div>
                                <div className="verse-card__actions">
                                    <button
                                        className={`verse-card__action-btn ${bookmarks.includes(verse.id) ? 'bookmarked' : ''}`}
                                        onClick={(e) => toggleBookmark(e, verse.id)}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        title={bookmarks.includes(verse.id) ? 'Remove bookmark' : 'Bookmark this verse'}
                                        aria-label={bookmarks.includes(verse.id) ? 'Remove bookmark' : 'Bookmark this verse'}
                                        aria-pressed={bookmarks.includes(verse.id)}
                                        style={{
                                            touchAction: 'manipulation',
                                            WebkitTapHighlightColor: 'transparent'
                                        }}
                                    >
                                        {bookmarks.includes(verse.id) ? '★' : '☆'}
                                    </button>
                                    <button
                                        className="verse-card__action-btn"
                                        onClick={(e) => copyVerse(e, verse)}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        title="Copy verse"
                                        aria-label="Copy verse to clipboard"
                                        style={{
                                            touchAction: 'manipulation',
                                            WebkitTapHighlightColor: 'transparent',
                                            position: 'relative'
                                        }}
                                    >
                                        {copiedId === verse.id ? '✓' : '📋'}
                                        {copiedId === verse.id && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '100%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: 'var(--color-saffron)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                whiteSpace: 'nowrap',
                                                marginBottom: '4px',
                                                animation: 'fadeIn 0.2s ease'
                                            }}>
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <div 
                                    className={`verse-card__expand ${expandedId === verse.id ? 'open' : ''}`}
                                    aria-hidden="true"
                                >
                                    ▼
                                </div>
                            </div>

                            {expandedId === verse.id && (
                                <div className="verse-card__details">
                                    <div className="verse-card__transliteration">
                                        {verse.transliteration}
                                    </div>
                                    <div className="verse-card__meaning">
                                        <strong>Meaning:</strong> {verse.meaning}
                                    </div>
                                    <div className="verse-card__modern">
                                        <div className="verse-card__modern-label">💡 Modern Lesson</div>
                                        {verse.modernLesson}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div style={{ 
                        textAlign: 'center', 
                        color: 'var(--color-text-muted)', 
                        marginTop: '2rem',
                        padding: '2rem'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                        <p>
                            {filter === 'bookmarked'
                                ? 'No verses bookmarked yet. Tap the ☆ icon on any verse to save it.'
                                : 'No verses found.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
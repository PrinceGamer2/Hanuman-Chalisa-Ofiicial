import { useState, useEffect } from 'react'
import { articles as staticArticles } from '../data/articles'

// Admin password - you should change this!
const ADMIN_PASSWORD = 'hanuman123'

// Storage keys
const STORAGE_KEY_ARTICLES = 'hc_cms_articles'
const STORAGE_KEY_SESSION = 'hc_cms_session'

// Default/initial articles structure
const initialArticles = [
    {
        id: '1',
        title: '5 Leadership Lessons from Hanuman',
        category: 'Leadership',
        emoji: '👑',
        summary: 'Discover how Hanuman\'s devotion and service exemplify the qualities of a true leader.',
        content: `Hanuman's life offers profound lessons in leadership that apply to modern professionals:

**1. Selfless Service (Seva)**
Hanuman never sought recognition for his deeds. He served Lord Rama with complete devotion, asking for nothing in return. Modern leaders should focus on serving their team and mission rather than personal glory.

**2. Courage in Adversity**
When faced with the ocean to cross or the mountain to lift, Hanuman never hesitated. Great leaders confront challenges head-on, inspiring their teams to push beyond perceived limits.

**3. Humility Despite Power**
Despite his immense strength and abilities, Hanuman remained humble. True leaders recognize that their position doesn't make them superior to their team members.

**4. Clear Communication**
Hanuman was Rama's perfect messenger, delivering messages with clarity and context. Effective leaders ensure their vision and expectations are communicated clearly.

**5. Unwavering Focus**
Hanuman's single-minded devotion to his purpose allowed him to achieve the impossible. Leaders must maintain focus on core objectives despite distractions.`,
        author: 'Admin',
        readTime: '5 min',
        date: new Date().toISOString(),
        published: true
    },
    {
        id: '2',
        title: 'How Hanuman Chalisa Builds Mental Resilience',
        category: 'Mental Health',
        emoji: '🧠',
        summary: 'Scientific and spiritual perspectives on how regular chanting develops psychological strength.',
        content: `The Hanuman Chalisa is more than a religious text—it's a tool for building mental resilience:

**Neuroplasticity and Mantras**
Research shows that repetitive chanting creates new neural pathways, strengthening focus and reducing anxiety. The 40 verses provide a structured pattern that calms the mind.

**Breathing Regulation**
Chanting naturally regulates breathing, activating the parasympathetic nervous system. This reduces cortisol levels and promotes a state of calm alertness.

**Meaning and Purpose**
Each verse carries deep meaning about overcoming obstacles. When internalized, these teachings provide a mental framework for facing life's challenges.

**Community Connection**
Chanting in groups creates social bonds and shared purpose, crucial elements for mental well-being in our isolated modern world.

**Daily Discipline**
The practice of daily chanting builds willpower and consistency—foundational skills for mental resilience.`,
        author: 'Admin',
        readTime: '4 min',
        date: new Date(Date.now() - 86400000).toISOString(),
        published: true
    }
]

// Convert static article format to CMS format
function convertStaticToCMS(staticArticle) {
    return {
        id: `static-${staticArticle.id}`,
        title: staticArticle.title,
        category: staticArticle.category,
        emoji: staticArticle.emoji,
        summary: staticArticle.summary,
        content: staticArticle.content,
        author: 'Admin',
        readTime: staticArticle.readTime,
        date: new Date().toISOString(),
        published: true,
        isStatic: true // Mark as originally static
    }
}

// Load articles - combine static and CMS
function loadArticles() {
    try {
        // Get static articles converted to CMS format
        const convertedStatic = staticArticles.map(convertStaticToCMS)
        
        // Get CMS articles from localStorage
        const stored = localStorage.getItem(STORAGE_KEY_ARTICLES)
        let cmsArticles = []
        if (stored) {
            cmsArticles = JSON.parse(stored)
        } else {
            // Use initial articles if nothing stored
            cmsArticles = initialArticles
        }
        
        // Combine: CMS articles first, then static
        return [...cmsArticles, ...convertedStatic]
    } catch (e) {
        console.error('Error loading articles:', e)
        return initialArticles
    }
}

// Save articles to localStorage
function saveArticles(articles) {
    try {
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles))
        return true
    } catch (e) {
        console.error('Error saving articles:', e)
        return false
    }
}

// Check if admin is logged in
function isAdminLoggedIn() {
    try {
        const session = localStorage.getItem(STORAGE_KEY_SESSION)
        if (session) {
            const data = JSON.parse(session)
            // Session expires after 24 hours
            if (data.timestamp && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                return true
            }
            localStorage.removeItem(STORAGE_KEY_SESSION)
        }
    } catch (e) {
        console.error('Error checking session:', e)
    }
    return false
}

// Login admin
function loginAdmin(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
            timestamp: Date.now()
        }))
        return true
    }
    return false
}

// Logout admin
function logoutAdmin() {
    localStorage.removeItem(STORAGE_KEY_SESSION)
}

export default function ArticleCMS() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const [articles, setArticles] = useState([])
    const [editingArticle, setEditingArticle] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
    const [saveMessage, setSaveMessage] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        emoji: '📰',
        summary: '',
        content: '',
        author: 'Admin',
        readTime: '',
        published: true
    })

    useEffect(() => {
        // Check login status
        if (isAdminLoggedIn()) {
            setIsLoggedIn(true)
        }
        // Load articles
        setArticles(loadArticles())
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        if (loginAdmin(password)) {
            setIsLoggedIn(true)
            setLoginError('')
        } else {
            setLoginError('Incorrect password')
        }
    }

    const handleLogout = () => {
        logoutAdmin()
        setIsLoggedIn(false)
        setPassword('')
    }

    const handleCreateNew = () => {
        setFormData({
            title: '',
            category: '',
            emoji: '📰',
            summary: '',
            content: '',
            author: 'Admin',
            readTime: '',
            published: true
        })
        setEditingArticle(null)
        setIsCreating(true)
    }

    const handleEdit = (article) => {
        setFormData({
            title: article.title,
            category: article.category,
            emoji: article.emoji,
            summary: article.summary,
            content: article.content,
            author: article.author,
            readTime: article.readTime,
            published: article.published
        })
        setEditingArticle(article)
        setIsCreating(true)
    }

    const handleSave = (e) => {
        e.preventDefault()
        
        const now = new Date().toISOString()
        let newArticles
        
        if (editingArticle) {
            // Check if editing a static article
            if (editingArticle.isStatic) {
                // Convert to CMS article by creating new with new ID
                const newArticle = {
                    id: Date.now().toString(),
                    ...formData,
                    date: now,
                    isStatic: false
                }
                // Add to beginning of articles list
                newArticles = [newArticle, ...articles.filter(a => a.id !== editingArticle.id)]
            } else {
                // Update existing CMS article
                newArticles = articles.map(a => 
                    a.id === editingArticle.id 
                        ? { ...a, ...formData, date: now }
                        : a
                )
            }
        } else {
            // Create new
            const newArticle = {
                id: Date.now().toString(),
                ...formData,
                date: now
            }
            newArticles = [newArticle, ...articles]
        }
        
        // Save only CMS articles (filter out static)
        const cmsArticlesOnly = newArticles.filter(a => !a.isStatic)
        if (saveArticles(cmsArticlesOnly)) {
            setArticles(newArticles)
            setIsCreating(false)
            setEditingArticle(null)
            setSaveMessage(editingArticle ? 'Article updated!' : 'Article created!')
            setTimeout(() => setSaveMessage(''), 3000)
        }
    }

    const handleDelete = (articleId) => {
        const newArticles = articles.filter(a => a.id !== articleId)
        // Save only CMS articles (filter out static)
        const cmsArticlesOnly = newArticles.filter(a => !a.isStatic)
        if (saveArticles(cmsArticlesOnly)) {
            setArticles(newArticles)
            setShowDeleteConfirm(null)
            setSaveMessage('Article deleted!')
            setTimeout(() => setSaveMessage(''), 3000)
        }
    }

    const handleTogglePublish = (article) => {
        // Can't toggle publish on static articles
        if (article.isStatic) return
        
        const newArticles = articles.map(a =>
            a.id === article.id ? { ...a, published: !a.published } : a
        )
        // Save only CMS articles
        const cmsArticlesOnly = newArticles.filter(a => !a.isStatic)
        if (saveArticles(cmsArticlesOnly)) {
            setArticles(newArticles)
        }
    }

    const calculateReadTime = (content) => {
        const words = content.trim().split(/\s+/).length
        const minutes = Math.ceil(words / 200)
        return `${minutes} min`
    }

    const handleContentChange = (e) => {
        const content = e.target.value
        setFormData(prev => ({
            ...prev,
            content,
            readTime: calculateReadTime(content)
        }))
    }

    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-primary)',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '400px',
                    width: '100%',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            Article CMS
                        </h1>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.9rem'
                        }}>
                            Hanuman Chalisa Official
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                color: 'var(--color-text-secondary)',
                                marginBottom: '0.5rem'
                            }}>
                                Admin Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'var(--color-bg-card)',
                                    border: `1px solid ${loginError ? '#ff4444' : 'var(--color-border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter password"
                                autoFocus
                            />
                            {loginError && (
                                <p style={{
                                    color: '#ff4444',
                                    fontSize: '0.8rem',
                                    marginTop: '0.5rem'
                                }}>
                                    {loginError}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn--primary"
                            style={{ width: '100%' }}
                        >
                            Login
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '1.5rem',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        Default password: hanuman123
                    </p>
                </div>
            </div>
        )
    }

    if (isCreating) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--color-bg-primary)',
                padding: '2rem 1rem'
            }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)'
                        }}>
                            {editingArticle ? '✏️ Edit Article' : '✨ Create New Article'}
                        </h1>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="btn btn--outline"
                        >
                            ← Back to List
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSave}>
                        <div style={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            {/* Title */}
                            <div>
                                <label style={styles.label}>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    style={styles.input}
                                    placeholder="Enter article title"
                                    required
                                />
                            </div>

                            {/* Category & Emoji */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: '1rem'
                            }}>
                                <div>
                                    <label style={styles.label}>Category *</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        style={styles.input}
                                        placeholder="e.g., Leadership, Spirituality"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Emoji</label>
                                    <input
                                        type="text"
                                        value={formData.emoji}
                                        onChange={(e) => setFormData({...formData, emoji: e.target.value})}
                                        style={{
                                            ...styles.input,
                                            textAlign: 'center',
                                            fontSize: '1.5rem'
                                        }}
                                        placeholder="📰"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <label style={styles.label}>Summary *</label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                                    style={{
                                        ...styles.input,
                                        minHeight: '80px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Brief summary of the article..."
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label style={styles.label}>
                                    Content * 
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                        (Supports **bold** and line breaks)
                                    </span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    style={{
                                        ...styles.input,
                                        minHeight: '300px',
                                        resize: 'vertical',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.6
                                    }}
                                    placeholder={`Write your article content here...

Use **double asterisks** for bold text.

Press Enter twice for new paragraphs.`}
                                    required
                                />
                            </div>

                            {/* Author & Read Time */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem'
                            }}>
                                <div>
                                    <label style={styles.label}>Author</label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                                        style={styles.input}
                                        placeholder="Admin"
                                    />
                                </div>
                                <div>
                                    <label style={styles.label}>Read Time (auto)</label>
                                    <input
                                        type="text"
                                        value={formData.readTime}
                                        readOnly
                                        style={{
                                            ...styles.input,
                                            background: 'var(--color-bg-card)',
                                            color: 'var(--color-text-muted)'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Published Toggle */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                background: 'var(--color-bg-card)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        accentColor: 'var(--color-saffron)'
                                    }}
                                />
                                <label 
                                    htmlFor="published"
                                    style={{
                                        color: 'var(--color-text-primary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Publish immediately
                                </label>
                            </div>

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                marginTop: '1rem'
                            }}>
                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    style={{ flex: 1, minWidth: '150px' }}
                                >
                                    {editingArticle ? '💾 Update Article' : '✨ Create Article'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="btn btn--outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
            padding: '2rem 1rem'
        }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            marginBottom: '0.25rem'
                        }}>
                            📝 Article CMS
                        </h1>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Manage your knowledge hub articles
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <a 
                            href="/" 
                            className="btn btn--ghost"
                            style={{ fontSize: '0.85rem' }}
                        >
                            🏠 View Site
                        </a>
                        <button
                            onClick={handleCreateNew}
                            className="btn btn--primary"
                            style={{ fontSize: '0.9rem' }}
                        >
                            ✨ New Article
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn btn--outline"
                            style={{ fontSize: '0.85rem' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Success Message */}
                {saveMessage && (
                    <div style={{
                        background: 'rgba(0, 200, 0, 0.1)',
                        border: '1px solid rgba(0, 200, 0, 0.3)',
                        color: '#00cc00',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        ✅ {saveMessage}
                    </div>
                )}

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>{articles.length}</div>
                        <div style={styles.statLabel}>Total Articles</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>
                            {articles.filter(a => a.published).length}
                        </div>
                        <div style={styles.statLabel}>Published</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statNumber}>
                            {articles.filter(a => !a.published).length}
                        </div>
                        <div style={styles.statLabel}>Drafts</div>
                    </div>
                </div>

                {/* Articles List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {articles.map(article => (
                        <div
                            key={article.id}
                            style={{
                                background: 'var(--color-bg-secondary)',
                                border: `1px solid ${article.isStatic ? 'rgba(68, 136, 255, 0.3)' : (article.published ? 'var(--color-border)' : 'rgba(255, 153, 51, 0.3)')}`,
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.25rem',
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto',
                                gap: '1rem',
                                alignItems: 'center'
                            }}
                        >
                            {/* Emoji */}
                            <div style={{ fontSize: '2rem' }}>
                                {article.emoji}
                            </div>

                            {/* Content */}
                            <div style={{ minWidth: 0 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.25rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-saffron-light)',
                                        background: 'var(--color-saffron-subtle)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)'
                                    }}>
                                        {article.category}
                                    </span>
                                    {article.isStatic && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#4488ff',
                                            background: 'rgba(68, 136, 255, 0.15)',
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-full)'
                                        }}>
                                            Built-in
                                        </span>
                                    )}
                                    {!article.published && !article.isStatic && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#ffaa00',
                                            background: 'rgba(255, 170, 0, 0.15)',
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-full)'
                                        }}>
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '0.25rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {article.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {new Date(article.date).toLocaleDateString()} • {article.readTime} read
                                </p>
                            </div>

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    onClick={() => handleTogglePublish(article)}
                                    disabled={article.isStatic}
                                    style={{
                                        ...styles.actionBtn,
                                        background: article.published ? 'rgba(0, 200, 0, 0.1)' : 'var(--color-saffron-subtle)',
                                        color: article.published ? '#00cc00' : 'var(--color-saffron)',
                                        opacity: article.isStatic ? 0.3 : 1,
                                        cursor: article.isStatic ? 'not-allowed' : 'pointer'
                                    }}
                                    title={article.isStatic ? 'Built-in articles cannot be unpublished' : (article.published ? 'Unpublish' : 'Publish')}
                                >
                                    {article.published ? '👁' : '🚫'}
                                </button>
                                <button
                                    onClick={() => handleEdit(article)}
                                    style={styles.actionBtn}
                                    title={article.isStatic ? 'Edit (will create copy)' : 'Edit'}
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => !article.isStatic && setShowDeleteConfirm(article.id)}
                                    disabled={article.isStatic}
                                    style={{
                                        ...styles.actionBtn,
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        color: '#ff4444',
                                        opacity: article.isStatic ? 0.3 : 1,
                                        cursor: article.isStatic ? 'not-allowed' : 'pointer'
                                    }}
                                    title={article.isStatic ? 'Built-in articles cannot be deleted' : 'Delete'}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}

                    {articles.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <p>No articles yet. Create your first article!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            Delete Article?
                        </h3>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: '1.5rem'
                        }}>
                            This action cannot be undone. The article will be permanently deleted.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="btn btn--primary"
                                style={{
                                    background: '#ff4444',
                                    boxShadow: '0 4px 20px rgba(255, 68, 68, 0.3)'
                                }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="btn btn--outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    label: {
        display: 'block',
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        marginBottom: '0.5rem',
        fontWeight: 500
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-primary)',
        fontSize: '1rem',
        transition: 'border-color 0.2s ease',
        outline: 'none'
    },
    statCard: {
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        textAlign: 'center'
    },
    statNumber: {
        fontSize: '2rem',
        fontWeight: 800,
        color: 'var(--color-saffron-light)',
        lineHeight: 1
    },
    statLabel: {
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        marginTop: '0.25rem'
    },
    actionBtn: {
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: 'var(--color-bg-card)',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    }
}
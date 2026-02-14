import { useState, useEffect, useCallback, useRef } from 'react'

const MILESTONES = [
    { days: 7, icon: '🌱', label: 'Seedling' },
    { days: 21, icon: '🔥', label: 'On Fire' },
    { days: 40, icon: '⚡', label: 'Unstoppable' },
    { days: 108, icon: '🏆', label: 'Legend' },
]

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getStreakData() {
    try {
        return JSON.parse(localStorage.getItem('hc_streak') || '{}')
    } catch { return {} }
}

function getTodayKey() {
    return new Date().toISOString().slice(0, 10)
}

function calculateStreak(data) {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        if (data[key]) {
            streak++
        } else if (i > 0) {
            break
        }
    }
    return streak
}

function getBestStreak(data) {
    const dates = Object.keys(data).sort()
    let best = 0, current = 0
    for (let i = 0; i < dates.length; i++) {
        if (i === 0) {
            current = 1
        } else {
            const prev = new Date(dates[i - 1])
            const curr = new Date(dates[i])
            const diff = (curr - prev) / (1000 * 60 * 60 * 24)
            current = diff === 1 ? current + 1 : 1
        }
        best = Math.max(best, current)
    }
    return best
}

function getLast28Days() {
    const days = []
    const today = new Date()
    // Align to start of week
    const startOffset = today.getDay()
    const start = new Date(today)
    start.setDate(start.getDate() - 27 - startOffset)

    for (let i = 0; i < 35; i++) {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        if (d > today) break
        days.push(d.toISOString().slice(0, 10))
    }
    return days
}

export default function ChantingTool() {
    const [tab, setTab] = useState('mala')
    const [count, setCount] = useState(0)
    const [streakData, setStreakData] = useState(getStreakData)
    const [isPressed, setIsPressed] = useState(false)
    const tapButtonRef = useRef(null)

    // Mala counter with enhanced feedback
    const handleTap = useCallback(() => {
        if (count >= 108) return
        const newCount = count + 1
        setCount(newCount)

        // Enhanced haptic feedback
        if (navigator.vibrate) {
            // Pattern: short for regular, longer for milestones
            if (newCount === 108) {
                navigator.vibrate([50, 100, 50, 100, 200])
            } else if (newCount % 27 === 0) {
                navigator.vibrate([50, 50, 100])
            } else {
                navigator.vibrate(25)
            }
        }

        // Save to streak when completing 108
        if (newCount === 108) {
            const todayKey = getTodayKey()
            const updated = { ...streakData, [todayKey]: (streakData[todayKey] || 0) + 1 }
            setStreakData(updated)
            localStorage.setItem('hc_streak', JSON.stringify(updated))
        }
    }, [count, streakData])

    // Handle keyboard support (spacebar to count)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (tab !== 'mala') return
            if (e.code === 'Space' && !e.repeat && count < 108) {
                e.preventDefault()
                handleTap()
                setIsPressed(true)
            }
        }

        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                setIsPressed(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [tab, count, handleTap])

    // Handle touch events for better mobile experience
    const handleTouchStart = (e) => {
        e.preventDefault()
        setIsPressed(true)
        handleTap()
    }

    const handleTouchEnd = () => {
        setIsPressed(false)
    }

    const resetMala = () => {
        if (confirm('Reset your mala counter?')) {
            setCount(0)
        }
    }

    const circumference = 2 * Math.PI * 108
    const offset = circumference - (count / 108) * circumference

    const currentStreak = calculateStreak(streakData)
    const bestStreak = getBestStreak(streakData)
    const calendarDays = getLast28Days()
    const todayKey = getTodayKey()

    // Calculate progress percentage
    const progressPercent = Math.round((count / 108) * 100)

    return (
        <section className="section chanting" id="practice">
            <div className="container">
                <div className="section-label">🧘 Spiritual Practice</div>
                <h2 className="section-title">Your Daily Practice</h2>
                <p className="section-subtitle" style={{ margin: '0 auto' }}>
                    Track your chanting with the digital Mala counter and build an unbreakable streak.
                </p>

                <div className="chanting__tabs">
                    <button
                        className={`chanting__tab ${tab === 'mala' ? 'active' : ''}`}
                        onClick={() => setTab('mala')}
                        aria-pressed={tab === 'mala'}
                    >
                        🧿 Mala Counter
                    </button>
                    <button
                        className={`chanting__tab ${tab === 'streak' ? 'active' : ''}`}
                        onClick={() => setTab('streak')}
                        aria-pressed={tab === 'streak'}
                    >
                        🔥 Streak Tracker
                    </button>
                </div>

                {tab === 'mala' && (
                    <div className="mala">
                        <div className="mala__ring">
                            <svg viewBox="0 0 240 240">
                                <defs>
                                    <linearGradient id="malaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FF6B00" />
                                        <stop offset="100%" stopColor="#FFD700" />
                                    </linearGradient>
                                </defs>
                                <circle className="mala__ring-bg" cx="120" cy="120" r="108" />
                                <circle
                                    className="mala__ring-progress"
                                    cx="120" cy="120" r="108"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    style={{
                                        filter: count === 108 ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' : 'none'
                                    }}
                                />
                            </svg>
                            <div className="mala__count">
                                <div className="mala__count-number">{count}</div>
                                <div className="mala__count-label">of 108</div>
                                <div className="mala__count-percent" style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                    marginTop: '4px'
                                }}>
                                    {progressPercent}%
                                </div>
                            </div>
                        </div>

                        {/* Progress milestones */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            marginBottom: 'var(--space-lg)',
                            flexWrap: 'wrap'
                        }}>
                            {[27, 54, 81, 108].map(milestone => (
                                <div
                                    key={milestone}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        background: count >= milestone 
                                            ? 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-light))' 
                                            : 'var(--color-bg-card)',
                                        color: count >= milestone ? 'white' : 'var(--color-text-muted)',
                                        border: `1px solid ${count >= milestone ? 'transparent' : 'var(--color-border)'}`,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {milestone === 108 ? '🏆 Complete' : `${milestone} beads`}
                                </div>
                            ))}
                        </div>

                        <button
                            ref={tapButtonRef}
                            className={`mala__tap-btn ${count >= 108 ? 'complete' : ''} ${isPressed ? 'pressed' : ''}`}
                            onClick={handleTap}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            disabled={count >= 108}
                            aria-label={count >= 108 ? 'Complete' : `Tap to count. Current count: ${count} of 108`}
                            style={{
                                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent',
                                userSelect: 'none',
                                WebkitUserSelect: 'none'
                            }}
                        >
                            {count >= 108 ? (
                                <>
                                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>🙏</span>
                                    Complete! Jai Hanuman!
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: '4px' }}>🙏</span>
                                    Tap to Count
                                    <span style={{ 
                                        display: 'block', 
                                        fontSize: '0.75rem', 
                                        opacity: 0.8,
                                        marginTop: '4px',
                                        fontWeight: 400
                                    }}>
                                        (or press Space)
                                    </span>
                                </>
                            )}
                        </button>

                        <button 
                            className="mala__reset" 
                            onClick={resetMala}
                            style={{
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        >
                            ↻ Reset Counter
                        </button>
                    </div>
                )}

                {tab === 'streak' && (
                    <div className="streak">
                        <div className="streak__header">
                            <div className="streak__current">
                                <div className="streak__current-number">{currentStreak}</div>
                                <div className="streak__current-label">Day Streak 🔥</div>
                            </div>
                            <div className="streak__best">
                                Best: <strong>{bestStreak} days</strong>
                            </div>
                        </div>

                        <div className="streak__calendar">
                            {DAY_LABELS.map((label, i) => (
                                <div key={i} className="streak__day-label">{label}</div>
                            ))}
                            {calendarDays.map(day => (
                                <div
                                    key={day}
                                    className={`streak__day ${streakData[day] ? 'active' : ''} ${day === todayKey ? 'today' : ''}`}
                                    title={`${day}${streakData[day] ? ` — ${streakData[day]} recitation(s)` : ''}`}
                                    style={{
                                        touchAction: 'manipulation',
                                        WebkitTapHighlightColor: 'transparent'
                                    }}
                                >
                                    {new Date(day).getDate()}
                                </div>
                            ))}
                        </div>

                        <div className="streak__milestones">
                            {MILESTONES.map(m => (
                                <div
                                    key={m.days}
                                    className={`streak__milestone ${currentStreak >= m.days ? 'achieved' : ''}`}
                                    style={{
                                        opacity: currentStreak >= m.days ? 1 : 0.5,
                                        transform: currentStreak >= m.days ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="streak__milestone-icon">{m.icon}</div>
                                    <div className="streak__milestone-days">{m.days} Days</div>
                                    <div className="streak__milestone-label">{m.label}</div>
                                </div>
                            ))}
                        </div>

                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--space-lg)',
                            textAlign: 'center',
                            lineHeight: 1.6
                        }}>
                            Complete 108 counts on the Mala Counter to mark today's streak ✨
                            <br />
                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                Every day you chant builds your inner strength
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
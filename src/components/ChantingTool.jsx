import { useState, useEffect, useCallback } from 'react'

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
        if (d > today) break // Removed the condition to stop before today
        days.push(d.toISOString().slice(0, 10))
    }
    return days
}

export default function ChantingTool() {
    const [tab, setTab] = useState('mala')
    const [count, setCount] = useState(0)
    const [streakData, setStreakData] = useState(getStreakData)

    // Mala counter
    const handleTap = useCallback(() => {
        if (count >= 108) return
        const newCount = count + 1
        setCount(newCount)

        // Vibrate on mobile
        if (navigator.vibrate) navigator.vibrate(30)

        // Save to streak when completing 108
        if (newCount === 108) {
            const todayKey = getTodayKey()
            const updated = { ...streakData, [todayKey]: (streakData[todayKey] || 0) + 1 }
            setStreakData(updated)
            localStorage.setItem('hc_streak', JSON.stringify(updated))
        }
    }, [count, streakData])

    const resetMala = () => setCount(0)

    const circumference = 2 * Math.PI * 108
    const offset = circumference - (count / 108) * circumference

    const currentStreak = calculateStreak(streakData)
    const bestStreak = getBestStreak(streakData)
    const calendarDays = getLast28Days()
    const todayKey = getTodayKey()

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
                    >
                        🧿 Mala Counter
                    </button>
                    <button
                        className={`chanting__tab ${tab === 'streak' ? 'active' : ''}`}
                        onClick={() => setTab('streak')}
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
                                />
                            </svg>
                            <div className="mala__count">
                                <div className="mala__count-number">{count}</div>
                                <div className="mala__count-label">of 108</div>
                            </div>
                        </div>

                        <button
                            className={`mala__tap-btn ${count >= 108 ? 'complete' : ''}`}
                            onClick={handleTap}
                            disabled={count >= 108}
                        >
                            {count >= 108 ? '🙏 Complete! Jai Hanuman!' : '🙏 Tap to Count'}
                        </button>

                        <button className="mala__reset" onClick={resetMala}>
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
                            textAlign: 'center'
                        }}>
                            Complete 108 counts on the Mala Counter to mark today's streak ✨
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

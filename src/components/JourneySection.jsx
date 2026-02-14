import { useState, useEffect } from 'react'

const PLAYLIST_ID = 'PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5'
const TOTAL_DAYS = 108

export default function JourneySection() {
    const [completedDays, setCompletedDays] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hc_journey_completed') || '[]')
        } catch { return [] }
    })
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        localStorage.setItem('hc_journey_completed', JSON.stringify(completedDays))
    }, [completedDays])

    const toggleDay = (day) => {
        setCompletedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const progress = (completedDays.length / TOTAL_DAYS) * 100
    const daysToShow = showAll ? TOTAL_DAYS : 12

    return (
        <section className="section" id="journey">
            <div className="container">
                <div className="section-label">🎬 108-Day Journey</div>
                <h2 className="section-title">The 108-Day Chalisa Challenge</h2>
                <p className="section-subtitle">
                    Watch and follow along with 108 consecutive days of Hanuman Chalisa recitation.
                    Mark your progress as you go.
                </p>

                {/* Featured video embed - playlist */}
                <div className="journey__featured">
                    <iframe
                        src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`}
                        title="108-Day Hanuman Chalisa Series"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Progress bar */}
                <div className="journey__progress">
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        Your Progress: <strong style={{ color: 'var(--color-saffron-light)' }}>
                            {completedDays.length} / {TOTAL_DAYS}
                        </strong> days completed
                    </p>
                    <div className="journey__progress-bar">
                        <div className="journey__progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Day cards */}
                <div className="journey__grid">
                    {Array.from({ length: daysToShow }, (_, i) => i + 1).map(day => (
                        <div
                            key={day}
                            className="glass-card journey__card"
                            onClick={() => toggleDay(day)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`journey__card-day ${completedDays.includes(day) ? 'completed' : ''}`}>
                                {completedDays.includes(day) ? '✓' : day}
                            </div>
                            <div className="journey__card-info">
                                <h4>Day {day}</h4>
                                <p>{completedDays.includes(day) ? 'Completed ✨' : 'Tap to mark complete'}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="journey__show-more">
                    <button
                        className="btn btn--outline"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less' : `Show All ${TOTAL_DAYS} Days`}
                    </button>
                </div>
            </div>
        </section>
    )
}

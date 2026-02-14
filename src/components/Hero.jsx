export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero__bg"></div>
            <div className="hero__content">
                <div className="hero__om">🙏</div>

                <div className="hero__badge">
                    🔥 108-Day Hanuman Chalisa Challenge — Watch on YouTube
                </div>

                <h1 className="hero__title">
                    Unleash Your <br />
                    <span>Inner Strength</span>
                </h1>

                <p className="hero__subtitle">
                    Discover the timeless power of Hanuman Chalisa — verse-by-verse wisdom,
                    daily chanting tools, and life lessons for the modern seeker.
                    Your spiritual superpower starts here.
                </p>

                <div className="hero__actions">
                    <a href="#chalisa" className="btn btn--primary">
                        📖 Explore the Chalisa
                    </a>
                    <a
                        href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline"
                    >
                        ▶ Watch 108-Day Series
                    </a>
                </div>

                <div className="hero__stats">
                    <div className="hero__stat">
                        <div className="hero__stat-number">108</div>
                        <div className="hero__stat-label">Days of Chanting</div>
                    </div>
                    <div className="hero__stat">
                        <div className="hero__stat-number">40</div>
                        <div className="hero__stat-label">Sacred Verses</div>
                    </div>
                    <div className="hero__stat">
                        <div className="hero__stat-number">∞</div>
                        <div className="hero__stat-label">Inner Strength</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

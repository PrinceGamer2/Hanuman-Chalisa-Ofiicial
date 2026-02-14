const PLAYLIST_ID = 'PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5'

export default function AboutChannel() {
    return (
        <section className="section" id="about">
            <div className="container">
                <div className="section-label">🎯 Our Mission</div>
                <h2 className="section-title">About Hanuman Chalisa Official</h2>

                <div className="about__layout">
                    <div className="about__text">
                        <p>
                            <strong style={{ color: 'var(--color-saffron-light)' }}>Hanuman Chalisa Official</strong> is
                            more than a YouTube channel — it's a movement to bring the timeless power of
                            Hanuman Chalisa to a new generation of seekers, students, and professionals.
                        </p>

                        <p>
                            We completed the <strong style={{ color: 'var(--color-gold)' }}>108-Day Hanuman Chalisa Challenge</strong> — uploading
                            a recitation every single day for 108 consecutive days. This wasn't just content creation.
                            It was devotion, discipline, and a commitment to help you learn and chant the Chalisa on your own.
                        </p>

                        <p>
                            Our mission is simple: make ancient wisdom accessible, relatable, and
                            <em> powerful</em> for modern life. Whether you're preparing for exams, navigating
                            your career, or seeking inner peace — Hanuman's teachings have answers.
                        </p>

                        <div className="about__highlight">
                            <div className="about__highlight-item">
                                <div className="about__highlight-number">108</div>
                                <div className="about__highlight-label">Videos Uploaded</div>
                            </div>
                            <div className="about__highlight-item">
                                <div className="about__highlight-number">108</div>
                                <div className="about__highlight-label">Consecutive Days</div>
                            </div>
                            <div className="about__highlight-item">
                                <div className="about__highlight-number">40</div>
                                <div className="about__highlight-label">Verses Explained</div>
                            </div>
                            <div className="about__highlight-item">
                                <div className="about__highlight-number">1</div>
                                <div className="about__highlight-label">Powerful Mission</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                            <a
                                href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--primary"
                            >
                                ▶ Watch the Full Series
                            </a>
                            <a
                                href="https://www.youtube.com/@HanumanChalisaOfficial"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--outline"
                            >
                                🔔 Subscribe on YouTube
                            </a>
                        </div>
                    </div>

                    <div className="about__embed">
                        <iframe
                            src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`}
                            title="Hanuman Chalisa Official — 108 Day Series"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}

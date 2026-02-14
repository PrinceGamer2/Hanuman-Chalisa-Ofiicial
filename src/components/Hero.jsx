import { useEffect, useState } from 'react'

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after mount
        setIsVisible(true)
    }, [])

    const scrollToSection = (e, sectionId) => {
        e.preventDefault()
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="hero" id="home">
            <div className="hero__bg"></div>
            <div className={`hero__content ${isVisible ? 'animate-in' : ''}`}>
                {/* Channel Profile Image */}
                <div style={{
                    animationDelay: '0.1s',
                    marginBottom: '1.5rem'
                }}>
                    <img 
                        src="https://yt3.googleusercontent.com/ONfGFRFCKU_GRz_E9JcRsD_1dME2pFDafdb2OgKisVkN-TMtpwUWgJ6mCTwCzbxqCIJY4rtZiQ=s160-c-k-c0x00ffffff-no-rj"
                        alt="Hanuman Chalisa Official Channel"
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '4px solid var(--color-saffron)',
                            boxShadow: '0 0 30px rgba(255, 107, 0, 0.4)',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <div className="hero__badge" style={{
                    animationDelay: '0.2s'
                }}>
                    🔥 108-Day Hanuman Chalisa Challenge
                </div>

                <h1 className="hero__title" style={{
                    animationDelay: '0.3s'
                }}>
                    Unleash Your <br />
                    <span>Inner Strength</span>
                </h1>

                <p className="hero__subtitle" style={{
                    animationDelay: '0.4s'
                }}>
                    Discover the timeless power of Hanuman Chalisa — verse-by-verse wisdom,
                    daily chanting tools, and life lessons for the modern seeker.
                    Your spiritual superpower starts here.
                </p>

                <div className="hero__actions" style={{
                    animationDelay: '0.5s'
                }}>
                    <a 
                        href="#chalisa" 
                        className="btn btn--primary"
                        onClick={(e) => scrollToSection(e, 'chalisa')}
                        style={{
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        📖 Explore the Chalisa
                    </a>
                    <a
                        href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline"
                        style={{
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        ▶ Watch 108-Day Series
                    </a>
                </div>

                <div className="hero__stats" style={{
                    animationDelay: '0.6s'
                }}>
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
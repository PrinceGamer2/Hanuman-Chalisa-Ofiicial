import { useState, useEffect, useCallback } from 'react'

const NAV_ITEMS = [
    { label: 'Home', href: '#home' },
    { label: 'Journey', href: '#journey' },
    { label: 'Chalisa', href: '#chalisa' },
    { label: 'Wisdom', href: '#wisdom' },
    { label: 'Practice', href: '#practice' },
    { label: 'Knowledge', href: '#knowledge' },
    { label: 'About', href: '#about' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('#home')
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    // Minimum swipe distance to close menu
    const minSwipeDistance = 50

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)

            const sections = NAV_ITEMS.map(item => item.href.slice(1))
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i])
                if (el && el.getBoundingClientRect().top <= 120) {
                    setActiveSection(`#${sections[i]}`)
                    break
                }
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.touchAction = 'none'
        } else {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
    }, [mobileOpen])

    // Handle escape key to close menu
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && mobileOpen) {
                setMobileOpen(false)
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [mobileOpen])

    const handleClick = (href) => {
        setMobileOpen(false)
        setActiveSection(href)
    }

    // Touch handlers for swipe to close
    const onTouchStart = useCallback((e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }, [])

    const onTouchMove = useCallback((e) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }, [])

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        // Swipe left to close menu
        if (isLeftSwipe && mobileOpen) {
            setMobileOpen(false)
        }
    }, [touchStart, touchEnd, mobileOpen])

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className="container navbar__inner">
                    <a href="#home" className="navbar__logo" onClick={() => handleClick('#home')}>
                        <div className="navbar__logo-icon">🙏</div>
                        <span>Hanuman Chalisa</span>
                    </a>

                    <ul className="navbar__links">
                        {NAV_ITEMS.map(item => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className={activeSection === item.href ? 'active' : ''}
                                    onClick={() => handleClick(item.href)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary navbar__cta"
                        style={{ display: 'inline-flex' }}
                    >
                        ▶ Watch Series
                    </a>

                    <button 
                        className={`navbar__hamburger ${mobileOpen ? 'active' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {mobileOpen && (
                <div 
                    className="navbar__overlay" 
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 998,
                        animation: 'fadeIn 0.2s ease'
                    }}
                />
            )}

            {/* Mobile menu */}
            <div 
                className={`navbar__mobile ${mobileOpen ? 'open' : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease'
                }}
            >
                {NAV_ITEMS.map(item => (
                    <a 
                        key={item.href} 
                        href={item.href} 
                        onClick={() => handleClick(item.href)}
                        style={{
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    >
                        {item.label}
                    </a>
                ))}
                <a
                    href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                    style={{
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent'
                    }}
                >
                    ▶ Watch Full Series
                </a>
            </div>
        </>
    )
}
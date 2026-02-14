import { useState, useEffect } from 'react'

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

    const handleClick = (href) => {
        setMobileOpen(false)
        setActiveSection(href)
    }

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

                    <button className="navbar__hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`navbar__mobile ${mobileOpen ? 'open' : ''}`}>
                <button className="navbar__mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
                {NAV_ITEMS.map(item => (
                    <a key={item.href} href={item.href} onClick={() => handleClick(item.href)}>
                        {item.label}
                    </a>
                ))}
                <a
                    href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                >
                    ▶ Watch Full Series
                </a>
            </div>
        </>
    )
}

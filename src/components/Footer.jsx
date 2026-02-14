export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__brand">
                        <img 
                            src="/logo.png" 
                            alt="Logo"
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                        <span>Hanuman Chalisa Official</span>
                    </div>

                    <ul className="footer__links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#chalisa">Chalisa</a></li>
                        <li><a href="#practice">Practice</a></li>
                        <li><a href="#knowledge">Knowledge</a></li>
                        <li>
                            <a
                                href="https://youtube.com/playlist?list=PLKHpyVweu179rTyMX1yWy8ZSUzJ-YfMJ5"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer__copyright">
                    <p>
                        © {new Date().getFullYear()} Hanuman Chalisa Official. Built with 🙏 and devotion.
                    </p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        || जय श्री राम || जय हनुमान ||
                    </p>
                </div>
            </div>
        </footer>
    )
}

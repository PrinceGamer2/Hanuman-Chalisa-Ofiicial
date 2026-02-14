import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import JourneySection from './components/JourneySection'
import VerseExplorer from './components/VerseExplorer'
import DailyWisdom from './components/DailyWisdom'
import ChantingTool from './components/ChantingTool'
import KnowledgeHub from './components/KnowledgeHub'
import AboutChannel from './components/AboutChannel'
import Footer from './components/Footer'
import ArticleCMS from './components/ArticleCMS'

function App() {
    // Simple hash-based routing
    const [currentPath, setCurrentPath] = useState(window.location.hash)

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash)
        }
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    // Check if we're on admin route
    const isAdminRoute = currentPath === '#admin' || window.location.pathname.includes('admin')

    // If on admin route, show CMS only
    if (isAdminRoute) {
        return <ArticleCMS />
    }

    // Main website
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <JourneySection />
                <VerseExplorer />
                <DailyWisdom />
                <ChantingTool />
                <KnowledgeHub />
                <AboutChannel />
            </main>
            <Footer />
        </>
    )
}

export default App
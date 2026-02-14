import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import JourneySection from './components/JourneySection'
import VerseExplorer from './components/VerseExplorer'
import DailyWisdom from './components/DailyWisdom'
import ChantingTool from './components/ChantingTool'
import KnowledgeHub from './components/KnowledgeHub'
import AboutChannel from './components/AboutChannel'
import Footer from './components/Footer'

function App() {
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

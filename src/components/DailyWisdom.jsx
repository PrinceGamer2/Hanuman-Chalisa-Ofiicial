import { getDailyVerse } from '../data/verses'

export default function DailyWisdom() {
    const verse = getDailyVerse()

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const shareText = `🙏 Daily Wisdom from Hanuman Chalisa\n\n${verse.hindi}\n\n${verse.meaning}\n\n💡 ${verse.modernLesson}\n\n— Hanuman Chalisa Official`

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Daily Wisdom — Hanuman Chalisa', text: shareText })
            } catch (e) { /* user cancelled */ }
        } else {
            navigator.clipboard.writeText(shareText)
            alert('Wisdom copied to clipboard! Share it with others 🙏')
        }
    }

    return (
        <section className="section daily-wisdom" id="wisdom">
            <div className="container">
                <div className="section-label">💡 Daily Wisdom</div>
                <h2 className="section-title">Today's Verse</h2>
                <p className="section-subtitle" style={{ margin: '0 auto' }}>
                    A fresh teaching from Hanuman Chalisa every day — wisdom that applies to your modern life.
                </p>

                <div className="glass-card daily-wisdom__card">
                    <div className="daily-wisdom__date">{today}</div>

                    <div className="daily-wisdom__hindi hindi">{verse.hindi}</div>

                    <div className="daily-wisdom__meaning">
                        <em>{verse.transliteration}</em>
                    </div>

                    <div className="daily-wisdom__meaning">
                        {verse.meaning}
                    </div>

                    <div className="daily-wisdom__modern">
                        <div className="daily-wisdom__modern-title">💡 Apply This Today</div>
                        {verse.modernLesson}
                    </div>

                    <div className="daily-wisdom__share">
                        <button className="btn btn--outline" onClick={handleShare}>
                            📤 Share This Wisdom
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

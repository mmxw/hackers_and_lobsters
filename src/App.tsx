import React, { useState, useEffect } from 'react';
import { NewsAggregator } from './components/NewsAggregator';
import './App.css';

const App: React.FC = () => {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        // Apply theme class to document body
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Save theme preference to localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="App">
            <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {isDarkTheme ? '☀️ Day Edition' : '🌙 Night Edition'}
            </button>

            <header className="newspaper-header">
                <div className="newspaper-date">{currentDate}</div>
                <h1>Hackers and Lobsters</h1>
                <div className="newspaper-subtitle">
                    Your Daily Tech News Digest • Price: Free • Volume 1
                </div>
            </header>

            <main id="articles">
                <NewsAggregator />
            </main>
        </div>
    );
};

export default App;

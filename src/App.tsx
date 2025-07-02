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

    return (
        <div className="App">
            <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {isDarkTheme ? '☀️' : '🌙'}
            </button>

            <header className="header">
                <h1>Hackers and Lobsters</h1>
                <p className="subtitle">Your daily tech news digest</p>
            </header>

            <main id="articles">
                <NewsAggregator />
            </main>
        </div>
    );
};

export default App;

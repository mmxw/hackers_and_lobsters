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
                {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
            </button>
            <h1>Hackers and Lobsters</h1>
            <div id="articles">
                <NewsAggregator />
            </div>
        </div>
    );
};

export default App;

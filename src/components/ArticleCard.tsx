import React, { useState, useEffect } from 'react';
import { Article } from '../types';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const [isVisited, setIsVisited] = useState(false);

    useEffect(() => {
        // Check if article has been visited
        const visitedArticles = JSON.parse(localStorage.getItem('visitedArticles') || '[]');
        const isVisited = visitedArticles.includes(article.url);
        setIsVisited(isVisited);
    }, [article.url]);

    const handleLinkClick = () => {
        // Mark article as visited
        const visitedArticles = JSON.parse(localStorage.getItem('visitedArticles') || '[]');
        if (!visitedArticles.includes(article.url)) {
            visitedArticles.push(article.url);
            localStorage.setItem('visitedArticles', JSON.stringify(visitedArticles));
            setIsVisited(true);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <article className={`article ${isVisited ? 'visited' : ''}`}>
            <header className="article-header">
                <h3>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                    >
                        {article.title}
                    </a>
                </h3>
                <div className="article-meta">
                    <time className="article-date" dateTime={article.timestamp.toISOString()}>
                        {formatDate(article.timestamp)}
                    </time>
                </div>
            </header>
            <footer className="article-footer">
                <a href={article.commentsUrl} target="_blank" rel="noopener noreferrer" className="comments-link">
                    Discussion & Comments →
                </a>
            </footer>
        </article>
    );
};

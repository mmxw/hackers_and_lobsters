import React, { useState, useEffect } from 'react';
import { Article } from '../types';

interface ArticleCardProps {
    article: Article;
    index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
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
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    };

    const getDomainName = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return '';
        }
    };

    return (
        <article className={`article ${isVisited ? 'visited' : ''}`}>
            <div>
                <span className="article-number">{index}.</span>
                {' '}
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                >
                    {article.title}
                </a>
                {' '}
                <span className="domain">({getDomainName(article.url)})</span>
            </div>
            <div className="article-meta">
                <span className="article-date">{formatDate(article.timestamp)}</span>
                {' | '}
                <a href={article.commentsUrl} target="_blank" rel="noopener noreferrer" className="comments-link">
                    comments
                </a>
            </div>
        </article>
    );
};

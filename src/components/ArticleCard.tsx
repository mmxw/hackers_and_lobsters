import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
        <article className="article">
            <header className="article-header">
                <h3>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
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

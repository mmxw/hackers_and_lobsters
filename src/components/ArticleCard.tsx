import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <div className="article">
            <h3>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                </a>
            </h3>
            <p>
                <em>{article.timestamp.toLocaleString()}</em>
            </p>
            <a href={article.commentsUrl} target="_blank" rel="noopener noreferrer">
                Read Comments
            </a>
        </div>
    );
};

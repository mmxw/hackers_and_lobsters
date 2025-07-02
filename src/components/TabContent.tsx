import React from 'react';
import { Source, Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface TabContentProps {
    articles: Article[];
    activeTab: Source;
    hackerNewsCount: number;
    lobstersCount: number;
    onTabSwitch: (tab: Source) => void;
    children?: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({
    articles,
    activeTab,
    hackerNewsCount,
    lobstersCount,
    onTabSwitch,
    children
}) => {
    const getSourceIcon = (source: Source) => {
        return source === 'hackernews' ? 'Y' : '🦞';
    };

    return (
        <div className="tabs">
            <div className="tab-headers">
                <button
                    className={`tab-btn ${activeTab === 'hackernews' ? 'active' : ''}`}
                    onClick={() => onTabSwitch('hackernews')}
                >
                    <span className="tab-icon">{getSourceIcon('hackernews')}</span>
                    <span className="tab-title">Hacker News</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'lobsters' ? 'active' : ''}`}
                    onClick={() => onTabSwitch('lobsters')}
                >
                    <span className="tab-icon">{getSourceIcon('lobsters')}</span>
                    <span className="tab-title">Lobsters</span>
                </button>
            </div>
            <div className="tab-content">
                <div className="articles-grid">
                    {articles.length > 0 ? (
                        articles.map((article, index) => (
                            <ArticleCard key={`${article.source}-${index}`} article={article} index={index + 1} />
                        ))
                    ) : (
                        <p className="no-articles">Loading the latest stories from our correspondents...</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

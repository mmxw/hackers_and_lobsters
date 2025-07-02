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
    const getSourceName = (source: Source) => {
        return source === 'hackernews' ? 'Hacker News' : 'Lobste.rs';
    };

    const getSourceIcon = (source: Source) => {
        return source === 'hackernews' ? '🔶' : '🦞';
    };

    return (
        <div className="tabs">
            <div className="tab-headers">
                <button
                    className={`tab-btn ${activeTab === 'hackernews' ? 'active' : ''}`}
                    onClick={() => onTabSwitch('hackernews')}
                >
                    <span className="tab-icon">{getSourceIcon('hackernews')}</span>
                    <span className="tab-title">Hackers Section</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'lobsters' ? 'active' : ''}`}
                    onClick={() => onTabSwitch('lobsters')}
                >
                    <span className="tab-icon">{getSourceIcon('lobsters')}</span>
                    <span className="tab-title">Lobsters Section</span>
                </button>
            </div>
            <div className="tab-content">
                <div className="section-header">
                    <h2 className="section-title">
                        {getSourceIcon(activeTab)} {getSourceName(activeTab)} - Latest Stories
                    </h2>
                    <div className="section-line"></div>
                </div>
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

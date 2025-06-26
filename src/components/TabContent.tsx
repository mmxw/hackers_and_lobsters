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
    return (
        <div className="tabs">
            <div className="tab-headers">
                <button
                    className={`tab-btn ${activeTab === 'hackernews' ? 'active' : ''}`}
                    onClick={() => onTabSwitch('hackernews')}
                >
                    🔶 Hacker News (recent {hackerNewsCount})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'lobsters' ? 'active' : ''}`}
                    onClick={() => onTabSwitch('lobsters')}
                >
                    🦞 Lobste.rs (recent {lobstersCount})
                </button>
            </div>
            <div className="tab-content">
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        <ArticleCard key={`${article.source}-${index}`} article={article} />
                    ))
                ) : (
                    <p className="no-articles">Loading articles...</p>
                )}
                {children}
            </div>
        </div>
    );
};

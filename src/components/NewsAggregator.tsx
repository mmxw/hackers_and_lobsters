import React from 'react';
import { useNewsAggregator } from '../hooks/useNewsAggregator';
import { TabContent } from './TabContent';

export const NewsAggregator: React.FC = () => {
    const {
        hackerNewsArticles,
        lobstersArticles,
        activeTab,
        isLoading,
        error,
        switchTab,
        getAllArticles
    } = useNewsAggregator();

    const { articles } = getAllArticles();

    if (error) {
        return (
            <div className="error">
                <h2>⚠️ Error Loading Articles</h2>
                <p><strong>Error:</strong> {error}</p>
                <button onClick={() => window.location.reload()}>🔄 Retry</button>
            </div>
        );
    }

    if (isLoading && hackerNewsArticles.length === 0 && lobstersArticles.length === 0) {
        return (
            <div className="loading">
                <p>Fetching articles from multiple sources...</p>
            </div>
        );
    }

    return (
        <TabContent
            articles={articles}
            activeTab={activeTab}
            hackerNewsCount={hackerNewsArticles.length}
            lobstersCount={lobstersArticles.length}
            onTabSwitch={switchTab}
        />
    );
};

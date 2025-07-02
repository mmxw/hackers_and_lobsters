import { Article } from '../types';

export const fetchHackerNews = async (
    onArticleAdded: (article: Article) => void
): Promise<void> => {
    try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const storyIds = await response.json();

        // Process stories individually and add them as they complete
        const storyPromises = storyIds.slice(0, 50).map(async (id: number) => {
            try {
                const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (!storyResponse.ok) {
                    throw new Error(`Failed to fetch story ${id}`);
                }

                const story = await storyResponse.json();

                const article: Article = {
                    title: story.title || 'Untitled',
                    url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                    timestamp: new Date(story.time * 1000),
                    source: 'Hacker News',
                    commentsUrl: `https://news.ycombinator.com/item?id=${story.id}`
                };

                onArticleAdded(article);

            } catch (error) {
                onArticleAdded({
                    title: `Error loading story ${id}`,
                    url: `https://news.ycombinator.com/item?id=${id}`,
                    timestamp: new Date(),
                    source: 'Hacker News',
                    commentsUrl: `https://news.ycombinator.com/item?id=${id}`
                });
            }
        });

        await Promise.all(storyPromises);

    } catch (error) {
        console.error('Hacker News fetch failed:', error);
        onArticleAdded({
            title: 'Failed to load Hacker News',
            url: 'https://news.ycombinator.com',
            timestamp: new Date(),
            source: 'Hacker News',
            commentsUrl: 'https://news.ycombinator.com'
        });
    }
};

export const fetchLobsters = async (
    onArticleAdded: (article: Article) => void
): Promise<void> => {
    try {
        const response = await fetch('https://corsproxy.io/?https://lobste.rs/newest.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const stories = await response.json();

        if (!Array.isArray(stories) || stories.length === 0) {
            throw new Error('No stories found in response');
        }

        // Process all stories from the newest endpoint
        for (const story of stories) {
            const article: Article = {
                title: story.title || 'Untitled',
                url: story.url || story.short_id_url,
                timestamp: story.created_at ? new Date(story.created_at) : new Date(),
                source: 'Lobste.rs',
                commentsUrl: story.comments_url || story.short_id_url
            };

            onArticleAdded(article);
        }

    } catch (error) {
        console.error('Lobste.rs fetch failed:', error);
        onArticleAdded({
            title: 'Failed to load Lobste.rs',
            url: 'https://lobste.rs',
            timestamp: new Date(),
            source: 'Lobste.rs',
            commentsUrl: 'https://lobste.rs'
        });
    }
};

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
        const rssUrl = 'https://lobste.rs/rss';
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(rssUrl)}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        const xml = new DOMParser().parseFromString(text, 'text/xml');
        const items = Array.from(xml.querySelectorAll('item'));

        if (items.length === 0) {
            throw new Error('No items found in RSS feed');
        }

        // Process all available stories (RSS feeds are typically limited to ~25 items)
        const storyPromises = items.map(async (item, index) => {
            try {
                const guid = item.querySelector('guid')?.textContent;
                if (!guid) {
                    throw new Error('No GUID found for story');
                }

                const title = item.querySelector('title')?.textContent || 'Untitled';
                const url = item.querySelector('link')?.textContent || guid;
                const pubDate = item.querySelector('pubDate')?.textContent;
                const commentsUrl = item.querySelector('comments')?.textContent || url;

                const article: Article = {
                    title,
                    url,
                    timestamp: pubDate ? new Date(pubDate) : new Date(),
                    source: 'Lobste.rs',
                    commentsUrl
                };

                onArticleAdded(article);

            } catch (error) {
                onArticleAdded({
                    title: `Error loading Lobste.rs story ${index + 1}`,
                    url: 'https://lobste.rs',
                    timestamp: new Date(),
                    source: 'Lobste.rs',
                    commentsUrl: 'https://lobste.rs'
                });
            }
        });

        await Promise.all(storyPromises);

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

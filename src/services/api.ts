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
    // Try multiple CORS proxies in order of preference (fastest first)
    const proxies = [
        'https://corsproxy.io/?',
        '',  // Direct attempt (will fail in browser but works in some environments)
        'https://api.allorigins.win/raw?url='
    ];

    for (const proxy of proxies) {
        try {
            // Fetch both hottest and newest endpoints concurrently
            const hottestUrl = `${proxy}https://lobste.rs/hottest.json`;
            const newestUrl = `${proxy}https://lobste.rs/newest.json`;
            
            console.log(`Trying Lobste.rs with: ${proxy || 'direct'}`);
            
            // Add 10 second timeout for each request
            const timeoutMs = 10000;
            const fetchWithTimeout = (url: string) => 
                Promise.race([
                    fetch(url),
                    new Promise<Response>((_, reject) => 
                        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
                    )
                ]);

            const [hottestResponse, newestResponse] = await Promise.all([
                fetchWithTimeout(hottestUrl),
                fetchWithTimeout(newestUrl)
            ]);

            if (!hottestResponse.ok || !newestResponse.ok) {
                throw new Error('HTTP error fetching stories');
            }

            const [hottestStories, newestStories] = await Promise.all([
                hottestResponse.json(),
                newestResponse.json()
            ]);

            if (!Array.isArray(hottestStories) || !Array.isArray(newestStories)) {
                throw new Error('Invalid response format');
            }

            // Combine and deduplicate by short_id
            const allStories = [...hottestStories, ...newestStories];
            const seenIds = new Set<string>();
            const uniqueStories = allStories.filter(story => {
                if (seenIds.has(story.short_id)) {
                    return false;
                }
                seenIds.add(story.short_id);
                return true;
            });

            console.log(`Successfully fetched ${hottestStories.length} hottest + ${newestStories.length} newest = ${allStories.length} total stories from Lobste.rs`);
            console.log(`After deduplication: ${uniqueStories.length} unique articles`);

            // Process all unique stories
            for (const story of uniqueStories) {
                const article: Article = {
                    title: story.title || 'Untitled',
                    url: story.url || story.short_id_url,
                    timestamp: story.created_at ? new Date(story.created_at) : new Date(),
                    source: 'Lobste.rs',
                    commentsUrl: story.comments_url || story.short_id_url
                };

                onArticleAdded(article);
            }

            return; // Success, exit the function

        } catch (error) {
            console.warn(`Lobste.rs fetch failed with ${proxy || 'direct'}:`, error);
            // Continue to next proxy
        }
    }

    // All proxies failed
    console.error('All Lobste.rs fetch attempts failed');
    onArticleAdded({
        title: 'Failed to load Lobste.rs - CORS proxy unavailable',
        url: 'https://lobste.rs',
        timestamp: new Date(),
        source: 'Lobste.rs',
        commentsUrl: 'https://lobste.rs'
    });
};

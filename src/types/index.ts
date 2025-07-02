export interface Article {
    title: string;
    url: string;
    timestamp: Date;
    source: 'Hacker News' | 'Lobste.rs';
    commentsUrl: string;
    author?: string;
}

export type Source = 'hackernews' | 'lobsters';

export interface AppState {
    hackerNewsArticles: Article[];
    lobstersArticles: Article[];
    activeTab: Source;
    isLoading: boolean;
    error: string | null;
}

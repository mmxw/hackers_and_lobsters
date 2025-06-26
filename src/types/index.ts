export interface Article {
    title: string;
    url: string;
    timestamp: Date;
    source: 'Hacker News' | 'Lobste.rs';
    commentsUrl: string;
}

export type Source = 'hackernews' | 'lobsters';

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    articlesPerPage: number;
}

export interface AppState {
    hackerNewsArticles: Article[];
    lobstersArticles: Article[];
    activeTab: Source;
    hackerNewsPage: number;
    lobstersPage: number;
    isLoading: boolean;
    error: string | null;
}

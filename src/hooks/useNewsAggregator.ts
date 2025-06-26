import { useState, useEffect, useCallback, useRef } from 'react';
import { Article, Source, AppState } from '../types';
import { fetchHackerNews, fetchLobsters } from '../services/api';

const ARTICLES_PER_PAGE = 10;

export const useNewsAggregator = () => {
    const [state, setState] = useState<AppState>({
        hackerNewsArticles: [],
        lobstersArticles: [],
        activeTab: 'hackernews',
        hackerNewsPage: 1,
        lobstersPage: 1,
        isLoading: true,
        error: null
    });

    const hasLoadedRef = useRef(false);

    const addArticle = useCallback((article: Article) => {
        setState((prevState: AppState) => {
            const existingArticles = article.source === 'Hacker News'
                ? prevState.hackerNewsArticles
                : prevState.lobstersArticles;

            // Check if article already exists to prevent duplicates
            const articleExists = existingArticles.some(
                existing => existing.title === article.title && existing.url === article.url
            );

            if (articleExists) {
                return prevState; // Don't add duplicate
            }

            const newState = { ...prevState };

            if (article.source === 'Hacker News') {
                newState.hackerNewsArticles = [...prevState.hackerNewsArticles, article];
            } else if (article.source === 'Lobste.rs') {
                newState.lobstersArticles = [...prevState.lobstersArticles, article];
            }

            return newState;
        });
    }, []);

    const switchTab = useCallback((tab: Source) => {
        setState((prevState: AppState) => ({
            ...prevState,
            activeTab: tab
        }));
    }, []);

    const changePage = useCallback((source: Source, page: number) => {
        setState((prevState: AppState) => ({
            ...prevState,
            [source === 'hackernews' ? 'hackerNewsPage' : 'lobstersPage']: page
        }));
    }, []);

    const getActiveArticles = useCallback(() => {
        const articles = state.activeTab === 'hackernews'
            ? state.hackerNewsArticles
            : state.lobstersArticles;

        return [...articles].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [state.activeTab, state.hackerNewsArticles, state.lobstersArticles]);

    const getPaginatedArticles = useCallback(() => {
        const sortedArticles = getActiveArticles();
        const currentPage = state.activeTab === 'hackernews'
            ? state.hackerNewsPage
            : state.lobstersPage;

        const start = (currentPage - 1) * ARTICLES_PER_PAGE;
        const end = start + ARTICLES_PER_PAGE;

        return {
            articles: sortedArticles.slice(start, end),
            pagination: {
                currentPage,
                totalPages: Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE),
                totalArticles: sortedArticles.length,
                articlesPerPage: ARTICLES_PER_PAGE
            }
        };
    }, [getActiveArticles, state.activeTab, state.hackerNewsPage, state.lobstersPage]);

    // Load articles on mount
    useEffect(() => {
        // Prevent double loading
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        const loadArticles = async () => {
            try {
                setState((prevState: AppState) => ({ ...prevState, isLoading: true, error: null }));

                // Start both fetchers concurrently
                const fetchPromises = [
                    fetchHackerNews(addArticle).catch(() => {
                        // Hacker News failed, but continue with other sources
                    }),
                    fetchLobsters(addArticle).catch(() => {
                        // Lobste.rs failed, but continue with other sources
                    })
                ];

                await Promise.all(fetchPromises);

            } catch (error) {
                setState((prevState: AppState) => ({
                    ...prevState,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                }));
            } finally {
                setState((prevState: AppState) => ({ ...prevState, isLoading: false }));
            }
        };

        loadArticles();
    }, [addArticle]);

    return {
        ...state,
        switchTab,
        changePage,
        getPaginatedArticles,
        articlesPerPage: ARTICLES_PER_PAGE
    };
};

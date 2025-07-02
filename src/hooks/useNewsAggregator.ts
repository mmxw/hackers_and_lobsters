import { useState, useEffect, useCallback, useRef } from 'react';
import { Article, Source, AppState } from '../types';
import { fetchHackerNews, fetchLobsters } from '../services/api';

export const useNewsAggregator = () => {
    const [state, setState] = useState<AppState>({
        hackerNewsArticles: [],
        lobstersArticles: [],
        activeTab: 'hackernews',
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

    const getActiveArticles = useCallback(() => {
        const articles = state.activeTab === 'hackernews'
            ? state.hackerNewsArticles
            : state.lobstersArticles;

        return [...articles].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [state.activeTab, state.hackerNewsArticles, state.lobstersArticles]);

    const getAllArticles = useCallback(() => {
        const sortedArticles = getActiveArticles();

        return {
            articles: sortedArticles
        };
    }, [getActiveArticles]);

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
        getAllArticles
    };
};

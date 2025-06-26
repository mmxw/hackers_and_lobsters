import React from 'react';
import { Source, PaginationInfo } from '../types';

interface PaginationProps {
    source: Source;
    pagination: PaginationInfo;
    onPageChange: (source: Source, page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    source,
    pagination,
    onPageChange
}) => {
    const { currentPage, totalPages, totalArticles, articlesPerPage } = pagination;

    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(source, page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-btn ${i === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const startItem = (currentPage - 1) * articlesPerPage + 1;
    const endItem = Math.min(currentPage * articlesPerPage, totalArticles);

    return (
        <div className="pagination">
            <div className="pagination-info">
                <small>
                    Showing {startItem}-{endItem} of {totalArticles} articles
                </small>
            </div>
            <div className="pagination-controls">
                <button
                    className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    ‹ Prev
                </button>
                {renderPageNumbers()}
                <button
                    className={`page-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next ›
                </button>
            </div>
        </div>
    );
};

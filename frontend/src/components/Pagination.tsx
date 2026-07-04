import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "./Button";


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}: PaginationProps) => {

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);
        
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages - 1);
        }
        
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(2, totalPages - 4);
        }
        
        if (startPage > 2) {
            pages.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        if (endPage < totalPages - 1) {
            pages.push('...');
        }
   
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <CaretLeftIcon size={24} />
            </Button>
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span 
                                key={`ellipsis-${index}`} 
                                className="px-2 text-gray-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            disabled={isActive}
                            className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'border-[#D1AC2B] bg-[#D1AC2B] text-white disabled:opacity-100'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                            } disabled:cursor-default`}
                        >
                            {pageNum}
                        </Button>
                    );
                })}
            </div>
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <CaretRightIcon size={24} />
            </Button>
        </div>
    );
}
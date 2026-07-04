import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "./Button";


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    onNextPage,
    onPrevPage 
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
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                onClick={onPrevPage}
                disabled={currentPage === 1}
            >
                <CaretLeftIcon size={24} />
            </Button>
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span 
                                key={`ellipsis-${index}`} 
                                className="px-3 py-2 text-gray-400"
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
                        >
                            {pageNum}
                        </Button>
                    );
                })}
            </div>
            <Button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
            >
                <CaretRightIcon size={24} />
            </Button>
        </div>
    );
}
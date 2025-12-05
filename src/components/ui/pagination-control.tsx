'use client';

import React, { useRef, useCallback, useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

type TPaginationControlProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: TPaginationControlProps) {
  const lastClickTimeRef = useRef(0);
  const THROTTLE_DELAY = 1000;

  const throttledPageChange = useCallback(
    (page: number) => {
      if (page === currentPage) return;

      const now = Date.now();
      if (now - lastClickTimeRef.current >= THROTTLE_DELAY) {
        lastClickTimeRef.current = now;
        onPageChange(page);
      }
    },
    [currentPage, onPageChange]
  );

  // Generate visible page numbers and ellipsis positions
  const pages = useMemo(() => {
    const visiblePages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    // Case 1: total pages are small — show all pages
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      // Determine if left/right ellipses are needed
      const showLeftEllipsis = currentPage > 3;
      const showRightEllipsis = currentPage < totalPages - 2;

      if (!showLeftEllipsis) {
        // Near the beginning: show first few pages + right ellipsis
        for (let i = 1; i <= 4; i++) visiblePages.push(i);
        visiblePages.push('ellipsis');
        visiblePages.push(totalPages);
      } else if (!showRightEllipsis) {
        // Near the end: show left ellipsis + last few pages
        visiblePages.push(1);
        visiblePages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) visiblePages.push(i);
      } else {
        // In the middle: show both ellipses + current range
        visiblePages.push(1);
        visiblePages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          visiblePages.push(i);
        visiblePages.push('ellipsis');
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => throttledPageChange(Math.max(1, currentPage - 1))}
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={`page-${index}-${page}`}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => throttledPageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              throttledPageChange(Math.min(totalPages, currentPage + 1))
            }
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/**
 * 페이지네이션 컴포넌트
 * 이전/다음·페이지 번호 클릭으로 페이지 변경. 디자인: design/design_component/이전 다음 페이지 전환.svg
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Pagination props */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 페이지네이션. 현재 페이지 주변·첫·끝 번호 노출.
 * @param props.currentPage - 현재 페이지 (1 기준)
 * @param props.totalPages - 전체 페이지 수
 * @param props.onPageChange - 페이지 클릭 시 콜백
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-3 py-2 rounded-md border border-gray-300
          text-body text-gray-700
          hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-base
        "
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* 페이지 번호 */}
      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-400">...</span>}
            
            <button
              onClick={() => onPageChange(page)}
              className={`
                min-w-[40px] px-3 py-2 rounded-md
                text-body font-medium
                transition-base
                ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {page}
            </button>
          </div>
        );
      })}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-3 py-2 rounded-md border border-gray-300
          text-body text-gray-700
          hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-base
        "
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

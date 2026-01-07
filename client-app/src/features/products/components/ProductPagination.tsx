interface ProductPaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}

export default function ProductPagination({
    currentPage,
    totalPages,
    totalCount,
    onPageChange
}: ProductPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between gap-4 flex-wrap pt-4">
            <div className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages} · {totalCount} sản phẩm
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-50"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Trước
                </button>
                <button
                    type="button"
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold disabled:opacity-50"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}

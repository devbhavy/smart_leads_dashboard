interface Props {
    page: number;
    totalPages: number;
    onPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPage }: Props) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center gap-2 justify-end">
            <button
                disabled={page === 1}
                onClick={() => onPage(page - 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
                Previous
            </button>
            <span className="text-sm text-gray-500">
                {page} of {totalPages}
            </span>
            <button
                disabled={page === totalPages}
                onClick={() => onPage(page + 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
                Next
            </button>
        </div>
    );
}
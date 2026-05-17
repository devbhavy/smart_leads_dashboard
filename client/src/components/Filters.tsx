interface Props {
    search: string;
    status: string;
    source: string;
    sort: string;
    onSearch: (v: string) => void;
    onStatus: (v: string) => void;
    onSource: (v: string) => void;
    onSort: (v: string) => void;
}

export default function Filters({ search, status, source, sort, onSearch, onStatus, onSource, onSort }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            <input
                type="text"
                placeholder="Search name or email..."
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 w-56"
                value={search}
                onChange={e => onSearch(e.target.value)}
            />
            <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                value={status}
                onChange={e => onStatus(e.target.value)}
            >
                <option value="">All Status</option>
                {["New", "Contacted", "Qualified", "Lost"].map(s => (
                    <option key={s}>{s}</option>
                ))}
            </select>
            <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                value={source}
                onChange={e => onSource(e.target.value)}
            >
                <option value="">All Sources</option>
                {["Website", "Instagram", "Referral"].map(s => (
                    <option key={s}>{s}</option>
                ))}
            </select>
            <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                value={sort}
                onChange={e => onSort(e.target.value)}
            >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
            </select>
        </div>
    );
}
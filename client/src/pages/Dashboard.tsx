import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Lead,Meta } from "../types/types";
import LeadForm from "./LeadForm";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";

const statusColors: Record<string, string> = {
    New: "bg-blue-50 text-blue-700",
    Contacted: "bg-yellow-50 text-yellow-700",
    Qualified: "bg-green-50 text-green-700",
    Lost: "bg-red-50 text-red-700",
};

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Lead | null>(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("");
    const [sort, setSort] = useState("latest");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(search);

    const [role, setRole] = useState("");
    useEffect(() => {
        api.get("/user/me").then(res => setRole(res.data.role));
    }, []);

    async function fetchLeads() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/lead", {
                params: { search: debouncedSearch, status, source, sort, page, limit: 10 }
            });
            setLeads(res.data.data);
            setMeta(res.data.meta);
        } catch {
            setError("Failed to load leads");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchLeads(); }, [debouncedSearch, status, source, sort, page]);

    async function handleCreate(data: Partial<Lead>) {
        await api.post("/lead", data);
        fetchLeads();
    }

    async function handleUpdate(data: Partial<Lead>) {
        await api.put(`/lead/${editing!._id}`, data);
        fetchLeads();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this lead?")) return;
        await api.delete(`/lead/${id}`);
        fetchLeads();
    }

    async function handleExport() {
        const res = await api.get("/lead/export", { responseType: "blob" });
        const url = URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "leads.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
                        <p className="text-sm text-gray-500">{meta.total} total leads</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-3 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                        >
                            Add Lead
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-4">
                    <Filters
                        search={search} status={status} source={source} sort={sort}
                        onSearch={v => { setSearch(v); setPage(1); }}
                        onStatus={v => { setStatus(v); setPage(1); }}
                        onSource={v => { setSource(v); setPage(1); }}
                        onSort={v => { setSort(v); setPage(1); }}
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="py-20 text-center text-sm text-gray-400">Loading...</div>
                    ) : error ? (
                        <div className="py-20 text-center text-sm text-red-500">{error}</div>
                    ) : leads.length === 0 ? (
                        <div className="py-20 text-center text-sm text-gray-400">No leads found</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-100">
                                <tr className="text-left text-gray-500">
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Source</th>
                                    <th className="px-4 py-3 font-medium">Created</th>
                                    <th className="px-4 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leads.map(lead => (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{lead.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{lead.source}</td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => setEditing(lead)}
                                                    className="text-gray-400 hover:text-gray-700 text-xs"
                                                >
                                                    Edit
                                                </button>
                                                {role === "admin" && (
                                                    <button
                                                        onClick={() => handleDelete(lead._id)}
                                                        className="text-red-400 hover:text-red-600 text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination page={page} totalPages={meta.totalPages} onPage={setPage} />
                </div>
            </div>

            {/* Modals */}
            {showForm && <LeadForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
            {editing && <LeadForm initial={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} />}
        </div>
    );
}
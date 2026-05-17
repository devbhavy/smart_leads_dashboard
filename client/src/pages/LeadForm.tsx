import { useState } from "react";
import type { Lead } from "../types/types";

interface Props {
    initial?: Partial<Lead>;
    onSubmit: (data: Partial<Lead>) => Promise<void>;
    onClose: () => void;
}

export default function LeadForm({ initial, onSubmit, onClose }: Props) {
    const [form, setForm] = useState({
        name: initial?.name || "",
        email: initial?.email || "",
        status: initial?.status || "New",
        source: initial?.source || "Website",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onSubmit(form);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.msg || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    {initial ? "Edit Lead" : "New Lead"}
                </h2>

                {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Name</label>
                        <input
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Status</label>
                        <select
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value as Lead["status"] })}
                        >
                            {["New", "Contacted", "Qualified", "Lost"].map(s => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Source</label>
                        <select
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.source}
                            onChange={e => setForm({ ...form, source: e.target.value as Lead["source"] })}
                        >
                            {["Website", "Instagram", "Referral"].map(s => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
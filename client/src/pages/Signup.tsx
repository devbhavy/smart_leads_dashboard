import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "", role: "sales" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/user/signup", form);
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Signup failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Create account</h1>
                <p className="text-sm text-gray-500 mb-6">Fill in your details to get started</p>

                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
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
                        <label className="text-sm text-gray-600 block mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create account"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-gray-900 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
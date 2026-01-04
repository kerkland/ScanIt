"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scan, Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                setError("Invalid password");
            }
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <Scan className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                    <p className="text-gray-400 mt-2">Enter admin password to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="card">
                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">
                            <Lock className="w-4 h-4 inline mr-1" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password..."
                            required
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm mb-4">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Default password: <code className="text-emerald-400">admin123</code>
                </p>
            </div>
        </div>
    );
}

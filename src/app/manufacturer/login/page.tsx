"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Scan,
    Building2,
    Mail,
    Lock,
    Loader2,
    ArrowRight,
} from "lucide-react";

export default function ManufacturerLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/manufacturer/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/manufacturer/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">ScanIt</span>
                    </Link>
                    <Link href="/manufacturer/register" className="text-emerald-400 hover:text-emerald-300 text-sm">
                        Create an account
                    </Link>
                </div>
            </header>

            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Manufacturer Login
                    </h1>
                    <p className="text-gray-400">
                        Sign in to manage your products
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="company@example.com"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Your password"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/manufacturer/register" className="text-emerald-400 hover:text-emerald-300">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

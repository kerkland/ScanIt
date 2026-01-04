"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewBrandPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        website: "",
        isOfficialPartner: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/brands", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/admin/brands");
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.error || "Failed to create brand");
            }
        } catch {
            setError("Failed to create brand");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/brands" className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Add Brand</h1>
                    <p className="text-gray-400 mt-1">Create a new brand entry</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card">
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Brand Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Coca-Cola"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://example.com"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isOfficialPartner}
                                    onChange={(e) => setFormData({ ...formData, isOfficialPartner: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-gray-300">Official Partner</span>
                            </label>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-400">{error}</p>}

                <div className="flex gap-4">
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isLoading ? "Saving..." : "Save Brand"}
                    </button>
                    <Link href="/admin/brands" className="btn-secondary">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

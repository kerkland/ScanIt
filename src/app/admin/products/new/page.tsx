"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

type Brand = { id: string; name: string };
type Category = { id: string; name: string };

export default function NewProductPage() {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        barcode: "",
        name: "",
        description: "",
        brandId: "",
        categoryId: "",
        verificationStatus: "unknown",
        isVerified: false,
    });

    useEffect(() => {
        async function fetchData() {
            const [brandsRes, categoriesRes] = await Promise.all([
                fetch("/api/admin/brands"),
                fetch("/api/admin/categories"),
            ]);
            const brandsData = await brandsRes.json();
            const categoriesData = await categoriesRes.json();
            setBrands(brandsData.brands || []);
            setCategories(categoriesData.categories || []);
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.error || "Failed to create product");
            }
        } catch {
            setError("Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-8 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Add Product</h1>
                    <p className="text-gray-400 mt-1">Create a new product entry</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card">
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Barcode *</label>
                            <input
                                type="text"
                                value={formData.barcode}
                                onChange={(e) => updateField("barcode", e.target.value)}
                                placeholder="e.g., 5449000000996"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Product Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="e.g., Coca-Cola 50cl"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                placeholder="Product description..."
                                rows={3}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Brand</label>
                                <select
                                    value={formData.brandId}
                                    onChange={(e) => updateField("brandId", e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Select brand...</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => updateField("categoryId", e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Select category...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Verification Status</label>
                                <select
                                    value={formData.verificationStatus}
                                    onChange={(e) => updateField("verificationStatus", e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="unknown">Unknown</option>
                                    <option value="authentic">Authentic</option>
                                    <option value="suspicious">Suspicious</option>
                                    <option value="fake">Fake</option>
                                </select>
                            </div>

                            <div className="flex items-center pt-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVerified}
                                        onChange={(e) => updateField("isVerified", e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-300">Officially Verified</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400">{error}</p>
                )}

                <div className="flex gap-4">
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isLoading ? "Saving..." : "Save Product"}
                    </button>
                    <Link href="/admin/products" className="btn-secondary">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

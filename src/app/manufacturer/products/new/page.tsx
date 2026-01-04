"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Scan,
    ArrowLeft,
    Package,
    Barcode,
    FileText,
    Loader2,
    CheckCircle2,
    Upload,
} from "lucide-react";

interface Category {
    id: string;
    name: string;
}

export default function NewProductSubmissionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        barcode: "",
        name: "",
        description: "",
        categoryId: "",
        nafdacRegNo: "",
    });

    useEffect(() => {
        // Fetch categories
        fetch("/api/admin/categories")
            .then((res) => res.json())
            .then((data) => {
                if (data.categories) {
                    setCategories(data.categories);
                }
            })
            .catch(() => { });
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                if (data.url) {
                    newImages.push(data.url);
                }
            } catch {
                console.error("Upload failed");
            }
        }

        setImages((prev) => [...prev, ...newImages]);
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/manufacturer/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Submission failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="card max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Product Submitted!</h2>
                    <p className="text-gray-400 mb-6">
                        Your product is now pending admin review. We&apos;ll notify you once it&apos;s approved.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/manufacturer/dashboard" className="btn-primary">
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setFormData({
                                    barcode: "",
                                    name: "",
                                    description: "",
                                    categoryId: "",
                                    nafdacRegNo: "",
                                });
                                setImages([]);
                            }}
                            className="btn-secondary"
                        >
                            Submit Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/manufacturer/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">ScanIt</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Submit New Product</h1>
                        <p className="text-gray-400">Add a product for verification</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Product Information</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <Barcode className="w-4 h-4 inline mr-2" />
                                    Barcode Number *
                                </label>
                                <input
                                    type="text"
                                    value={formData.barcode}
                                    onChange={(e) => updateField("barcode", e.target.value)}
                                    required
                                    pattern="\d{8,14}"
                                    placeholder="8-14 digit barcode (EAN/UPC)"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <Package className="w-4 h-4 inline mr-2" />
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    required
                                    placeholder="e.g., Coca-Cola 50cl Pet Bottle"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => updateField("categoryId", e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    NAFDAC Registration Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.nafdacRegNo}
                                    onChange={(e) => updateField("nafdacRegNo", e.target.value)}
                                    placeholder="e.g., A1-2345"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    rows={3}
                                    placeholder="Detailed product description..."
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-4">Product Images</h2>
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                id="imageUpload"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="imageUpload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin mb-2" />
                                ) : (
                                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                                )}
                                <span className="text-gray-400">
                                    {uploading ? "Uploading..." : "Click to upload product images"}
                                </span>
                            </label>
                        </div>
                        {images.length > 0 && (
                            <div className="flex gap-2 mt-4 flex-wrap">
                                {images.map((url, i) => (
                                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
                                        <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
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
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Package className="w-5 h-5" />
                                Submit for Verification
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}

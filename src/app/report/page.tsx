"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
    Scan,
    ArrowLeft,
    AlertTriangle,
    Send,
    Loader2,
    CheckCircle2,
    Camera,
    X,
    Upload,
    Image as ImageIcon
} from "lucide-react";

export default function ReportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        barcode: "",
        productName: "",
        description: "",
        purchaseLocation: "",
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (images.length >= 3) {
            setError("Maximum 3 images allowed");
            return;
        }

        setUploadingImage(true);
        setError("");

        try {
            for (const file of Array.from(files)) {
                if (images.length >= 3) break;

                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setImages((prev) => [...prev, data.url]);
                } else {
                    const data = await response.json();
                    setError(data.error || "Failed to upload image");
                }
            }
        } catch {
            setError("Failed to upload image");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images,
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to submit report");
            }
        } catch {
            setError("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="card max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
                    <p className="text-gray-400 mb-6">
                        Thank you for helping keep our community safe. Your report will be reviewed shortly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/scan" className="btn-primary">
                            <Scan className="w-4 h-4" />
                            Scan Another
                        </Link>
                        <Link href="/" className="btn-secondary">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Scan className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">ScanIt</span>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4 max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Report Fake Product
                        </h1>
                        <p className="text-gray-400">
                            Help protect others from counterfeits
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card">
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Barcode Number (if known)
                                </label>
                                <input
                                    type="text"
                                    value={formData.barcode}
                                    onChange={(e) => updateField("barcode", e.target.value)}
                                    placeholder="e.g., 5449000000996"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) => updateField("productName", e.target.value)}
                                    placeholder="e.g., Coca-Cola 50cl"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Where did you buy this? *
                                </label>
                                <input
                                    type="text"
                                    value={formData.purchaseLocation}
                                    onChange={(e) => updateField("purchaseLocation", e.target.value)}
                                    placeholder="e.g., Local shop in Ikeja"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Why do you think it's fake? *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    placeholder="Describe what seems wrong - packaging, taste, spelling errors, etc."
                                    required
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="card">
                        <label className="block text-sm text-gray-400 mb-3">
                            <Camera className="w-4 h-4 inline mr-1" />
                            Photo Evidence (up to 3 images)
                        </label>

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                                        <img src={url} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        {images.length < 3 && (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-700 rounded-lg py-8 cursor-pointer hover:border-emerald-500/50 hover:bg-gray-800/50 transition ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                                            <span className="text-gray-400">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-400">
                                                {images.length === 0 ? "Add photos of the product" : "Add more photos"}
                                            </span>
                                        </>
                                    )}
                                </label>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                            <ImageIcon className="w-3 h-3 inline mr-1" />
                            JPEG, PNG, WebP or GIF. Max 5MB each.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full py-4"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Report
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Your report is anonymous. No personal data is collected.
                </p>
            </main>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Scan,
    ArrowLeft,
    MapPin,
    Star,
    AlertTriangle,
    ShieldCheck,
    Store,
    Search,
    Loader2
} from "lucide-react";

type Merchant = {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    avgRating: number;
    reviewCount: number;
    fakeReports: number;
    isVerified: boolean;
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                />
            ))}
            <span className="text-white font-medium ml-1">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function MerchantsPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    useEffect(() => {
        async function fetchMerchants() {
            try {
                const params = new URLSearchParams();
                if (verifiedOnly) params.set("verified", "true");

                const response = await fetch(`/api/merchants?${params}`);
                const data = await response.json();
                setMerchants(data.merchants || []);
            } catch (error) {
                console.error("Failed to fetch merchants:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMerchants();
    }, [verifiedOnly]);

    const filteredMerchants = merchants.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <Store className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Trusted Merchants
                        </h1>
                        <p className="text-gray-400">
                            Find sellers rated for authenticity
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="card mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search merchants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setVerifiedOnly(false)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${!verifiedOnly ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setVerifiedOnly(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${verifiedOnly ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                    >
                        <ShieldCheck className="w-4 h-4 inline mr-1" />
                        Verified Only
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="card text-center py-12">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                        <p className="text-gray-400">Loading merchants...</p>
                    </div>
                )}

                {/* Merchant List */}
                {!isLoading && (
                    <div className="space-y-4">
                        {filteredMerchants.length === 0 ? (
                            <div className="card text-center py-12">
                                <Store className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No merchants found</p>
                            </div>
                        ) : (
                            filteredMerchants.map((merchant) => (
                                <div
                                    key={merchant.id}
                                    className="card block group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition">
                                                    {merchant.name}
                                                </h3>
                                                {merchant.isVerified && (
                                                    <span className="badge badge-success text-xs">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                                                <MapPin className="w-4 h-4" />
                                                {merchant.address || "Address not provided"}{merchant.city && `, ${merchant.city}`}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <StarRating rating={merchant.avgRating} />
                                                <span className="text-gray-500 text-sm">
                                                    ({merchant.reviewCount} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            {merchant.fakeReports > 0 ? (
                                                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {merchant.fakeReports} fake reports
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-emerald-400 text-sm">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    No fake reports
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Add Merchant CTA */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-4">
                        Don't see a merchant? Help us grow the database!
                    </p>
                    <button className="btn-secondary">
                        <Store className="w-4 h-4" />
                        Add a Merchant
                    </button>
                </div>
            </main>
        </div>
    );
}
